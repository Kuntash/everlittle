import { env } from "cloudflare:workers";
import { describe, expect, it, vi } from "vitest";
import { acquisitionProperties, parseAcquisition, updateAcquisition } from "@/lib/acquisition";
import { flushAnalytics, projectAnalytics } from "@/lib/server-analytics";
import { handleDodoWebhook } from "@/lib/billing";
import { recordPayment, majorAmount } from "@/lib/payment-measurement";
import type { RuntimeEnv } from "@/lib/runtime-env";

const landing = {
  search: "?utm_source=google&utm_medium=cpc&utm_campaign=launch",
  pathname: "/",
  referrer: "",
  hostname: "geteverlittle.com",
};
describe("acquisition continuity", () => {
  it("preserves first touch while later campaign updates last touch, and expires last touch", () => {
    const now = Date.now();
    const first = updateAcquisition(null, landing, now);
    const second = updateAcquisition(first, { ...landing, search: "?utm_source=meta" }, now + 1000);
    expect(second.first.campaign_source).toBe("google");
    expect(second.last.campaign_source).toBe("meta");
    const direct = updateAcquisition(
      second,
      { ...landing, search: "", referrer: "https://checkout.dodopayments.com/private" },
      now + 2000,
    );
    expect(direct.last.campaign_source).toBe("meta");
    expect(acquisitionProperties(direct, now + 31 * 86400000).campaign_source).toBe("direct");
    expect(parseAcquisition(JSON.stringify(direct))?.first.campaign_source).toBe("google");
  });
  it("strips private paths, unknown fields and future timestamps", () => {
    const first = updateAcquisition(
      null,
      { ...landing, pathname: "/private-family/timeline" },
      Date.now(),
    );
    expect(first.first.campaign_landing_path).toBe("/:familySlug/timeline");
    expect(
      JSON.stringify(parseAcquisition(JSON.stringify({ ...first, email: "private@example.com" }))),
    ).not.toContain("private@example.com");
    expect(
      parseAcquisition(
        JSON.stringify({ ...first, first: { ...first.first, captured_at: "2099-01-01" } }),
      ),
    ).toBeNull();
  });
});

describe("durable payment measurement", () => {
  it("deduplicates receipts and first payment, retains a renewal, and retries delivery with stable UUID", async () => {
    const id = crypto.randomUUID();
    await env.DB.batch([
      env.DB.prepare('INSERT INTO "user" (id,name,email) VALUES(?,?,?)').bind(
        id,
        "QA",
        `${id}@example.com`,
      ),
      env.DB.prepare("INSERT INTO family_archive(id,name,slug) VALUES(?,?,?)").bind(id, "QA", id),
      env.DB.prepare(
        "INSERT INTO family_member(id,archive_id,user_id,role) VALUES(?,?,?,'owner')",
      ).bind(id, id, id),
    ]);
    const runtime = {
      ...env,
      DODO_PAYMENTS_ENVIRONMENT: "test_mode",
      POSTHOG_PROJECT_TOKEN: "test-token",
      POSTHOG_HOST: "https://eu.i.posthog.com",
    } as RuntimeEnv;
    const input = {
      paymentId: id,
      archiveId: id,
      ownerId: id,
      amount: 600,
      currency: "USD",
      timestamp: new Date().toISOString(),
      succeeded: true,
    };
    await recordPayment(runtime, input);
    await recordPayment(runtime, input);
    await recordPayment(runtime, { ...input, paymentId: id + "renewal" });
    const rows = await env.DB.prepare("SELECT * FROM analytics_outbox").all<{
      event_name: string;
      uuid: string;
      properties: string;
    }>();
    expect(rows.results.filter((r) => r.event_name === "payment_succeeded")).toHaveLength(2);
    expect(rows.results.filter((r) => r.event_name === "first_payment_succeeded")).toHaveLength(1);
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("error", { status: 503 }));
    await flushAnalytics(runtime);
    expect(
      (
        await env.DB.prepare(
          "SELECT count(*) as count FROM analytics_outbox WHERE delivered_at IS NULL",
        ).first<{ count: number }>()
      )?.count,
    ).toBe(3);
    await env.DB.prepare(
      "UPDATE analytics_outbox SET next_attempt_at=datetime('now','-1 second')",
    ).run();
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
    await flushAnalytics(runtime);
    expect(
      (
        await env.DB.prepare(
          "SELECT count(*) as count FROM analytics_outbox WHERE delivered_at IS NOT NULL",
        ).first<{ count: number }>()
      )?.count,
    ).toBe(3);
    const payload = JSON.parse(String(fetchMock.mock.calls[1][1]?.body));
    expect(payload.batch.map((e: { uuid: string }) => e.uuid).sort()).toEqual(
      rows.results.map((r) => r.uuid).sort(),
    );
    fetchMock.mockRestore();
    await projectAnalytics(runtime);
  });
  it("handles zero and three decimal currencies without assuming cents", () => {
    expect(majorAmount(600, "USD")).toBe(6);
    expect(majorAmount(600, "JPY")).toBe(600);
    expect(majorAmount(600, "KWD")).toBe(0.6);
  });
});

describe("archive activation projection", () => {
  it("waits for media upload, attributes family activity to the owner, and emits once", async () => {
    const id = crypto.randomUUID(),
      relative = crypto.randomUUID();
    const runtime = {
      ...env,
      POSTHOG_PROJECT_TOKEN: "test-token",
      DODO_PAYMENTS_ENVIRONMENT: "test_mode",
    } as RuntimeEnv;
    await env.DB.batch([
      env.DB.prepare('INSERT INTO "user"(id,name,email) VALUES(?,?,?)').bind(
        id,
        "QA",
        id + "@example.com",
      ),
      env.DB.prepare('INSERT INTO "user"(id,name,email) VALUES(?,?,?)').bind(
        relative,
        "QA",
        relative + "@example.com",
      ),
      env.DB.prepare("INSERT INTO family_archive(id,name,slug) VALUES(?,?,?)").bind(id, "QA", id),
      env.DB.prepare(
        "INSERT INTO family_member(id,archive_id,user_id,role) VALUES(?,?,?,'owner')",
      ).bind(id, id, id),
      env.DB.prepare(
        "INSERT INTO family_member(id,archive_id,user_id,role) VALUES(?,?,?,'contributor')",
      ).bind(relative, id, relative),
      env.DB.prepare(
        "INSERT INTO child_profile(id,archive_id,display_name,birth_date) VALUES(?,?,'Fixture','2025-01-01')",
      ).bind(id, id),
      ...[1, 2, 3].map((n) =>
        env.DB.prepare(
          "INSERT INTO memory(id,archive_id,child_id,created_by_user_id,kind,title,happened_at) VALUES(?,?,?,?,'photo','Fixture',CURRENT_TIMESTAMP)",
        ).bind(id + n, id, id, relative),
      ),
    ]);
    await projectAnalytics(runtime);
    const count = async (event: string) =>
      (await env.DB.prepare(
        "SELECT count(*) AS n FROM analytics_outbox WHERE event_name=? AND json_extract(properties,'$.archive_id')=?",
      )
        .bind(event, id)
        .first<{ n: number }>())!.n;
    expect(await count("archive_first_memory")).toBe(0);
    expect(await count("archive_activated")).toBe(0);
    await env.DB.batch(
      [1, 2, 3].map((n) =>
        env.DB.prepare(
          "INSERT INTO media_asset(id,archive_id,memory_id,object_key,media_type,content_type,byte_size) VALUES(?,?,?,?,'image','image/png',10)",
        ).bind(id + n, id, id + n, "archives/" + id + "/" + n),
      ),
    );
    await projectAnalytics(runtime);
    await projectAnalytics(runtime);
    expect(await count("memory_created")).toBe(3);
    expect(await count("archive_first_memory")).toBe(1);
    expect(await count("archive_activated")).toBe(1);
    const activated = await env.DB.prepare(
      "SELECT distinct_id FROM analytics_outbox WHERE event_key=?",
    )
      .bind("activated:" + id)
      .first<{ distinct_id: string }>();
    expect(activated?.distinct_id).toBe(id);
  });
});

describe("verified payment webhooks", () => {
  it("rejects unsigned receipts and deduplicates a valid signed receipt", async () => {
    const id = crypto.randomUUID();
    await env.DB.batch([
      env.DB.prepare('INSERT INTO "user"(id,name,email) VALUES(?,?,?)').bind(
        id,
        "QA",
        id + "@example.com",
      ),
      env.DB.prepare("INSERT INTO family_archive(id,name,slug) VALUES(?,?,?)").bind(id, "QA", id),
      env.DB.prepare(
        "INSERT INTO family_member(id,archive_id,user_id,role) VALUES(?,?,?,'owner')",
      ).bind(id, id, id),
    ]);
    const secretBytes = new Uint8Array(32).fill(7);
    const webhookKey = "whsec_" + btoa(String.fromCharCode(...secretBytes));
    const runtime = {
      ...env,
      DODO_PAYMENTS_API_KEY: "fixture-key",
      DODO_PAYMENTS_WEBHOOK_KEY: webhookKey,
      DODO_PRODUCT_ID_MONTHLY: "pdt_fixture",
      DODO_PRODUCT_ID_YEARLY: "pdt_yearly",
      DODO_PAYMENTS_ENVIRONMENT: "test_mode",
      POSTHOG_PROJECT_TOKEN: undefined,
    } as RuntimeEnv;
    const body = JSON.stringify({
      type: "payment.succeeded",
      timestamp: new Date().toISOString(),
      data: {
        payment_id: id,
        subscription_id: "sub_fixture",
        total_amount: 600,
        currency: "USD",
        is_update_payment_method: false,
      },
    });
    const webhookId = "msg_" + id,
      timestamp = String(Math.floor(Date.now() / 1000));
    const key = await crypto.subtle.importKey(
      "raw",
      secretBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const signature = btoa(
      String.fromCharCode(
        ...new Uint8Array(
          await crypto.subtle.sign(
            "HMAC",
            key,
            new TextEncoder().encode(webhookId + "." + timestamp + "." + body),
          ),
        ),
      ),
    );
    const request = (sig: string) =>
      new Request("https://geteverlittle.com/api/webhooks/dodo", {
        method: "POST",
        body,
        headers: {
          "content-type": "application/json",
          "webhook-id": webhookId,
          "webhook-timestamp": timestamp,
          "webhook-signature": sig,
        },
      });
    expect((await handleDodoWebhook(request("v1,invalid"), runtime)).status).toBe(400);
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(
        async () =>
          new Response(
            JSON.stringify({
              subscription_id: "sub_fixture",
              product_id: "pdt_fixture",
              metadata: { archive_id: id },
            }),
            { headers: { "content-type": "application/json" } },
          ),
      );
    try {
      expect((await handleDodoWebhook(request("v1," + signature), runtime)).status).toBe(200);
      expect((await handleDodoWebhook(request("v1," + signature), runtime)).status).toBe(200);
      const receipt = await env.DB.prepare(
        "SELECT properties FROM analytics_outbox WHERE event_key=?",
      )
        .bind("first-payment:test_mode:" + id)
        .first<{ properties: string }>();
      expect(JSON.parse(receipt!.properties)).toMatchObject({
        amount: 6,
        currency: "USD",
        is_test: true,
      });
      expect(
        (await env.DB.prepare("SELECT count(*) AS n FROM measured_payment WHERE payment_id=?")
          .bind(id)
          .first<{ n: number }>())!.n,
      ).toBe(1);
    } finally {
      fetchMock.mockRestore();
    }
  });
});
