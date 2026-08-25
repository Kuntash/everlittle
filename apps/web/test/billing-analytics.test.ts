import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

import { analyticsPath } from "@/lib/analytics";
import { billingStatusForDodoEvent, getBillingConfig } from "@/lib/billing";
import type { RuntimeEnv } from "@/lib/runtime-env";

describe("Dodo billing", () => {
  it("defaults to test mode and remains unavailable without credentials", () => {
    const config = getBillingConfig(env as RuntimeEnv);
    expect(config.environment).toBe("test_mode");
    expect(config.checkoutConfigured).toBe(false);
  });

  it("maps subscription lifecycle events without ending scheduled access early", () => {
    expect(billingStatusForDodoEvent("subscription.active")).toBe("active");
    expect(billingStatusForDodoEvent("subscription.on_hold")).toBe("past_due");
    expect(billingStatusForDodoEvent("subscription.failed")).toBe("canceled");
    expect(billingStatusForDodoEvent("subscription.cancelled", true, "2099-01-01T00:00:00Z")).toBe(
      "active",
    );
  });

  it("installs the webhook idempotency table", async () => {
    const table = await env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'billing_webhook_event'",
    ).first<{ name: string }>();
    expect(table?.name).toBe("billing_webhook_event");
  });
});

describe("privacy-safe analytics paths", () => {
  it("removes family slugs, share tokens, queries, and unknown detail paths", () => {
    expect(analyticsPath("/the-johnson-family/timeline")).toBe("/:familySlug/timeline");
    expect(analyticsPath("/share/private-token-value")).toBe("/share/:token");
    expect(analyticsPath("/the-johnson-family/memories/private-id")).toBe("/:familySlug/home");
  });
});
