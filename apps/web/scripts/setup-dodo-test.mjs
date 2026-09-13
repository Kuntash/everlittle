import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

import DodoPayments from "dodopayments";

const WEBHOOK_URL = "https://everlittle-sandbox.kuntashtashi11.workers.dev/api/webhooks/dodo";
const WEBHOOK_EVENTS = [
  "payment.succeeded",
  "payment.failed",
  "refund.succeeded",
  "subscription.active",
  "subscription.cancelled",
  "subscription.expired",
  "subscription.failed",
  "subscription.on_hold",
  "subscription.paused",
  "subscription.plan_changed",
  "subscription.renewed",
  "subscription.unpaused",
  "subscription.updated",
];

const keyFile = process.env.DODO_TEST_API_KEY_FILE;
if (!keyFile) throw new Error("Set DODO_TEST_API_KEY_FILE to a private file containing a test-mode API key.");
const apiKey = readFileSync(keyFile, "utf8").trim();
if (!apiKey) throw new Error("The test API key file is empty.");

const client = new DodoPayments({ bearerToken: apiKey, environment: "test_mode" });
const products = [];
for await (const product of client.products.list({ recurring: true })) products.push(product);

const monthly = await ensureProduct({
  amount: 600,
  interval: "Month",
  marker: "family-monthly",
  name: "Everlittle Family — Monthly",
});
const yearly = await ensureProduct({
  amount: 6000,
  interval: "Year",
  marker: "family-yearly",
  name: "Everlittle Family — Yearly",
});

let webhook = null;
for await (const candidate of client.webhooks.list()) {
  if (candidate.url === WEBHOOK_URL) {
    webhook = candidate;
    break;
  }
}

if (webhook) {
  webhook = await client.webhooks.update(webhook.id, {
    description: "Everlittle sandbox payment and subscription lifecycle",
    disabled: false,
    filter_types: WEBHOOK_EVENTS,
    metadata: { app: "everlittle", environment: "test" },
  });
  console.log("Reused the existing Everlittle test webhook.");
} else {
  webhook = await client.webhooks.create({
    description: "Everlittle sandbox payment and subscription lifecycle",
    disabled: false,
    filter_types: WEBHOOK_EVENTS,
    idempotency_key: "everlittle-sandbox-webhook-v1",
    metadata: { app: "everlittle", environment: "test" },
    url: WEBHOOK_URL,
  });
  console.log("Created the Everlittle test webhook.");
}

const webhookSecret = await client.webhooks.retrieveSecret(webhook.id);
const cloudflareSecrets = {
  DODO_PAYMENTS_API_KEY: apiKey,
  DODO_PAYMENTS_WEBHOOK_KEY: webhookSecret.secret,
  DODO_PRODUCT_ID_MONTHLY: monthly.product_id,
  DODO_PRODUCT_ID_YEARLY: yearly.product_id,
};
const upload = spawnSync("pnpm", ["exec", "wrangler", "secret", "bulk", "--env", "sandbox"], {
  cwd: process.cwd(),
  encoding: "utf8",
  input: JSON.stringify(cloudflareSecrets),
});
if (upload.status !== 0) {
  if (upload.stdout) process.stdout.write(upload.stdout);
  if (upload.stderr) process.stderr.write(upload.stderr);
  throw new Error("Could not store the Dodo configuration in Cloudflare.");
}

console.log("Stored the Dodo test configuration in the sandbox Worker.");
console.log(`Monthly product: ${monthly.product_id}`);
console.log(`Yearly product: ${yearly.product_id}`);
console.log(`Webhook: ${webhook.id}`);

async function ensureProduct({ amount, interval, marker, name }) {
  const marked = products.find((product) => product.metadata?.everlittle_plan === marker);
  const named = products.find((product) => product.name === name);
  const existing = marked ?? named;
  if (existing) {
    assertProductConfiguration(existing, { amount, interval, name });
    console.log(`Reused ${name}.`);
    return existing;
  }

  const created = await client.products.create(
    {
      description: "25 GB of private storage for one Everlittle family archive.",
      metadata: { everlittle_plan: marker },
      name,
      price: {
        currency: "USD",
        discount: 0,
        payment_frequency_count: 1,
        payment_frequency_interval: interval,
        price: amount,
        purchasing_power_parity: false,
        subscription_period_count: 1,
        subscription_period_interval: interval,
        type: "recurring_price",
      },
      tax_category: "saas",
    },
    { idempotencyKey: `everlittle-${marker}-v1` },
  );
  products.push(created);
  console.log(`Created ${name}.`);
  return created;
}

function assertProductConfiguration(product, expected) {
  const price = product.price_detail;
  const matches =
    product.is_recurring &&
    product.currency === "USD" &&
    product.price === expected.amount &&
    price?.type === "recurring_price" &&
    price.payment_frequency_count === 1 &&
    price.payment_frequency_interval === expected.interval &&
    price.subscription_period_count === 1 &&
    price.subscription_period_interval === expected.interval;
  if (!matches) {
    throw new Error(`${expected.name} exists but does not match the expected billing schedule.`);
  }
}
