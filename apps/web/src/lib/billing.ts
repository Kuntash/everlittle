import DodoPayments from "dodopayments";

import type { RuntimeEnv } from "@/lib/runtime-env";

export type DodoEnvironment = "test_mode" | "live_mode";
export type BillingInterval = "monthly" | "yearly";
export type EverlittleBillingStatus =
  | "active"
  | "canceled"
  | "complimentary"
  | "past_due"
  | "trialing";

type BillingOwner = { id: string; name: string; email: string };

type SubscriptionWebhook = {
  data: {
    cancel_at_next_billing_date: boolean;
    customer: { customer_id: string };
    metadata: Record<string, unknown>;
    next_billing_date: string;
    product_id: string;
    subscription_id: string;
  };
  timestamp: string;
  type: string;
};

const SUBSCRIPTION_EVENTS = new Set([
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
]);

export function getBillingConfig(runtime: RuntimeEnv) {
  const environment: DodoEnvironment =
    String(runtime.DODO_PAYMENTS_ENVIRONMENT) === "live_mode" ? "live_mode" : "test_mode";
  const apiKey = runtime.DODO_PAYMENTS_API_KEY?.trim() ?? "";
  const webhookKey = runtime.DODO_PAYMENTS_WEBHOOK_KEY?.trim() ?? "";
  const monthlyProductId = runtime.DODO_PRODUCT_ID_MONTHLY?.trim() ?? "";
  const yearlyProductId = runtime.DODO_PRODUCT_ID_YEARLY?.trim() ?? "";

  return {
    apiKey,
    environment,
    monthlyProductId,
    webhookKey,
    yearlyProductId,
    checkoutConfigured: Boolean(apiKey && monthlyProductId && yearlyProductId),
    webhookConfigured: Boolean(apiKey && webhookKey && monthlyProductId && yearlyProductId),
  };
}

export async function createBillingCheckout(input: {
  archiveId: string;
  database: D1Database;
  interval: BillingInterval;
  owner: BillingOwner;
  publicAppUrl: string;
  runtime: RuntimeEnv;
}) {
  const config = getBillingConfig(input.runtime);
  if (!config.checkoutConfigured) throw new BillingConfigurationError();

  const archive = await input.database
    .prepare(
      `SELECT a.name, a.slug, s.provider_customer_id AS providerCustomerId
       FROM family_archive a
       JOIN archive_subscription s ON s.archive_id = a.id
       WHERE a.id = ?`,
    )
    .bind(input.archiveId)
    .first<{ name: string; slug: string; providerCustomerId: string | null }>();
  if (!archive) throw new Error("The family billing record could not be found.");

  const client = createDodoClient(config);
  let customerId = archive.providerCustomerId;
  if (!customerId) {
    const customer = await client.customers.create(
      {
        email: input.owner.email,
        name: input.owner.name,
        metadata: { archive_id: input.archiveId, owner_user_id: input.owner.id },
      },
      { idempotencyKey: `everlittle-customer-${input.archiveId}` },
    );
    customerId = customer.customer_id;
    await input.database
      .prepare(
        `UPDATE archive_subscription
         SET provider_customer_id = ?, updated_at = CURRENT_TIMESTAMP
         WHERE archive_id = ? AND provider_customer_id IS NULL`,
      )
      .bind(customerId, input.archiveId)
      .run();
  }

  const familyUrl = `${input.publicAppUrl}/${encodeURIComponent(archive.slug)}/settings`;
  const productId = input.interval === "monthly" ? config.monthlyProductId : config.yearlyProductId;
  const session = await client.checkoutSessions.create(
    {
      cancel_url: familyUrl,
      customer: { customer_id: customerId },
      metadata: { archive_id: input.archiveId, billing_interval: input.interval },
      product_cart: [{ product_id: productId, quantity: 1 }],
      return_url: `${familyUrl}?billing=returned`,
      show_saved_payment_methods: true,
    },
    { idempotencyKey: `everlittle-checkout-${input.archiveId}-${crypto.randomUUID()}` },
  );
  if (!session.checkout_url) throw new Error("Dodo did not return a hosted checkout URL.");

  return { url: session.checkout_url, environment: config.environment };
}

export async function createBillingPortal(input: {
  archiveId: string;
  database: D1Database;
  publicAppUrl: string;
  runtime: RuntimeEnv;
}) {
  const config = getBillingConfig(input.runtime);
  if (!config.checkoutConfigured) throw new BillingConfigurationError();
  const subscription = await input.database
    .prepare(
      `SELECT a.slug, s.provider_customer_id AS providerCustomerId,
              s.provider_subscription_id AS providerSubscriptionId
       FROM archive_subscription s
       JOIN family_archive a ON a.id = s.archive_id
       WHERE s.archive_id = ?`,
    )
    .bind(input.archiveId)
    .first<{
      slug: string;
      providerCustomerId: string | null;
      providerSubscriptionId: string | null;
    }>();
  if (!subscription?.providerCustomerId || !subscription.providerSubscriptionId) {
    throw new BillingPortalUnavailableError();
  }

  const portal = await createDodoClient(config).customers.customerPortal.create(
    subscription.providerCustomerId,
    {
      return_url: `${input.publicAppUrl}/${encodeURIComponent(subscription.slug)}/settings`,
    },
  );
  return { url: portal.link };
}

export async function handleDodoWebhook(request: Request, runtime: RuntimeEnv) {
  const config = getBillingConfig(runtime);
  if (!config.webhookConfigured) {
    return Response.json({ error: "Dodo webhooks are not configured." }, { status: 503 });
  }

  const rawBody = await request.text();
  let event: SubscriptionWebhook;
  try {
    event = createDodoClient(config).webhooks.unwrap(rawBody, {
      headers: Object.fromEntries(request.headers),
      key: config.webhookKey,
    }) as unknown as SubscriptionWebhook;
  } catch {
    return Response.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  const eventId = request.headers.get("webhook-id");
  if (!eventId) return Response.json({ error: "Missing webhook ID." }, { status: 400 });
  if (!SUBSCRIPTION_EVENTS.has(event.type)) return Response.json({ received: true });

  const archiveId = stringMetadata(event.data.metadata?.archive_id);
  const allowedProducts = new Set([config.monthlyProductId, config.yearlyProductId]);
  if (!archiveId || !allowedProducts.has(event.data.product_id)) {
    return Response.json(
      { error: "Webhook subscription is not mapped to this app." },
      { status: 400 },
    );
  }
  const exists = await runtime.DB.prepare("SELECT 1 FROM archive_subscription WHERE archive_id = ?")
    .bind(archiveId)
    .first();
  if (!exists) return Response.json({ error: "Unknown family archive." }, { status: 404 });

  const status = billingStatusForDodoEvent(
    event.type,
    event.data.cancel_at_next_billing_date,
    event.data.next_billing_date,
  );
  const interval: BillingInterval =
    event.data.product_id === config.monthlyProductId ? "monthly" : "yearly";
  await runtime.DB.batch([
    runtime.DB.prepare(
      `INSERT OR IGNORE INTO billing_webhook_event
         (id, event_type, provider_subscription_id, event_timestamp)
       VALUES (?, ?, ?, ?)`,
    ).bind(eventId, event.type, event.data.subscription_id, event.timestamp),
    runtime.DB.prepare(
      `UPDATE archive_subscription
       SET status = ?, provider_customer_id = ?, provider_subscription_id = ?,
           current_period_ends_at = ?, provider_event_at = ?, billing_interval = ?,
           cancel_at_period_end = ?, updated_at = CURRENT_TIMESTAMP
       WHERE archive_id = ?
         AND (provider_event_at IS NULL OR datetime(provider_event_at) <= datetime(?))
         AND EXISTS (
           SELECT 1 FROM billing_webhook_event
           WHERE id = ? AND processed_at IS NULL
         )`,
    ).bind(
      status,
      event.data.customer.customer_id,
      event.data.subscription_id,
      event.data.next_billing_date || null,
      event.timestamp,
      interval,
      event.data.cancel_at_next_billing_date ? 1 : 0,
      archiveId,
      event.timestamp,
      eventId,
    ),
    runtime.DB.prepare(
      `UPDATE billing_webhook_event SET processed_at = CURRENT_TIMESTAMP
       WHERE id = ? AND processed_at IS NULL`,
    ).bind(eventId),
  ]);

  return Response.json({ received: true });
}

export function billingStatusForDodoEvent(
  eventType: string,
  cancelAtNextBillingDate = false,
  nextBillingDate?: string,
): EverlittleBillingStatus {
  if (
    eventType === "subscription.cancelled" &&
    cancelAtNextBillingDate &&
    nextBillingDate &&
    Date.parse(nextBillingDate) > Date.now()
  ) {
    return "active";
  }
  if (eventType === "subscription.on_hold" || eventType === "subscription.paused") {
    return "past_due";
  }
  if (
    eventType === "subscription.cancelled" ||
    eventType === "subscription.expired" ||
    eventType === "subscription.failed"
  ) {
    return "canceled";
  }
  return "active";
}

export function hasManageableSubscription(
  checkoutConfigured: boolean,
  providerSubscriptionId: string | null | undefined,
) {
  return Boolean(checkoutConfigured && providerSubscriptionId);
}

function createDodoClient(config: ReturnType<typeof getBillingConfig>) {
  return new DodoPayments({
    bearerToken: config.apiKey,
    environment: config.environment,
    webhookKey: config.webhookKey || undefined,
  });
}

function stringMetadata(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export class BillingConfigurationError extends Error {}
export class BillingPortalUnavailableError extends Error {}
