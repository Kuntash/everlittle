import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

import { analyticsPath, marketingAttribution, readMarketingAttribution } from "@/lib/analytics";
import {
  billingStatusForDodoEvent,
  getBillingConfig,
  hasManageableSubscription,
} from "@/lib/billing";
import { canCreateArchiveContent, canStoreMedia } from "@/lib/plans";
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

  it("does not mistake an abandoned checkout customer for a subscription", () => {
    expect(hasManageableSubscription(true, null)).toBe(false);
    expect(hasManageableSubscription(true, "sub_test")).toBe(true);
    expect(hasManageableSubscription(false, "sub_test")).toBe(false);
  });

  it("keeps unsubscribed hosted archives read-only", () => {
    expect(canCreateArchiveContent("active", null)).toBe(true);
    expect(canCreateArchiveContent("complimentary", null)).toBe(false);
    expect(canCreateArchiveContent("past_due", null)).toBe(false);
    expect(canCreateArchiveContent("canceled", null)).toBe(false);
    expect(canStoreMedia("complimentary", null)).toBe(false);
    expect(canCreateArchiveContent("trialing", "2099-01-01T00:00:00Z")).toBe(true);
    expect(canCreateArchiveContent("trialing", "2000-01-01T00:00:00Z")).toBe(false);
  });
});

describe("privacy-safe analytics paths", () => {
  it("removes family slugs, share tokens, queries, and unknown detail paths", () => {
    expect(analyticsPath("/the-johnson-family/timeline")).toBe("/:familySlug/timeline");
    expect(analyticsPath("/share/private-token-value")).toBe("/share/:token");
    expect(analyticsPath("/the-johnson-family/memories/private-id")).toBe("/:familySlug/home");
  });

  it("keeps public campaign landing pages distinct", () => {
    expect(analyticsPath("/digital-time-capsule-for-kids")).toBe("/digital-time-capsule-for-kids");
    expect(analyticsPath("/family-memory-app")).toBe("/family-memory-app");
  });

  it("allowlists campaign fields without retaining click identifiers or arbitrary queries", () => {
    expect(
      marketingAttribution(
        "?utm_source=meta&utm_medium=paid_social&utm_campaign=first_test&utm_content=time_capsule&fbclid=private-click-id&email=person%40example.com",
      ),
    ).toEqual({
      campaign_source: "meta",
      campaign_medium: "paid_social",
      campaign_name: "first_test",
      campaign_content: "time_capsule",
    });
    expect(marketingAttribution("?fbclid=private-click-id")).toBeNull();
  });

  it("validates stored attribution before restoring it", () => {
    expect(
      readMarketingAttribution(
        JSON.stringify({
          campaign_source: "meta",
          campaign_landing_path: "/family-memory-app",
          email: "person@example.com",
        }),
      ),
    ).toEqual({
      campaign_source: "meta",
      campaign_landing_path: "/family-memory-app",
    });
    expect(readMarketingAttribution("not-json")).toBeNull();
  });
});
