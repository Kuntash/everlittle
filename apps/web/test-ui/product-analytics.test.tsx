import { beforeEach, expect, it, vi } from "vitest";

const posthog = vi.hoisted(() => ({
  capture: vi.fn(),
  identify: vi.fn(),
  init: vi.fn(),
  register: vi.fn(),
  reset: vi.fn(),
}));
vi.mock("posthog-js", () => ({ default: posthog }));

beforeEach(() => {
  vi.resetModules();
  sessionStorage.clear();
  for (const fn of Object.values(posthog)) fn.mockClear();
});

async function load() {
  return import("@/lib/product-analytics");
}

it("sends calls made before PostHog loaded, after its properties, with their time", async () => {
  const { productAnalytics, startProductAnalytics } = await load();
  productAnalytics.capture("pricing_viewed", { placement: "homepage" });
  productAnalytics.identify("user-1");

  await startProductAnalytics("token", { api_host: "https://eu.i.posthog.com" }, (client) =>
    client.register({ campaign_source: "qa" }),
  );

  expect(posthog.init).toHaveBeenCalledWith("token", { api_host: "https://eu.i.posthog.com" });
  expect(posthog.register.mock.invocationCallOrder[0]).toBeLessThan(
    posthog.capture.mock.invocationCallOrder[0],
  );
  const [event, properties, options] = posthog.capture.mock.calls[0];
  expect(event).toBe("pricing_viewed");
  expect(properties).toEqual({ placement: "homepage" });
  expect(options).toMatchObject({ send_instantly: true, transport: "sendBeacon" });
  expect(options.timestamp).toBeInstanceOf(Date);
  expect(posthog.identify).toHaveBeenCalledWith("user-1");
});

it("sends a capture at once with sendBeacon once PostHog has loaded", async () => {
  const { productAnalytics, startProductAnalytics } = await load();
  await startProductAnalytics("token", {}, () => {});
  productAnalytics.capture("marketing_signup_cta_clicked", { placement: "hero" });
  expect(posthog.capture).toHaveBeenCalledWith(
    "marketing_signup_cta_clicked",
    { placement: "hero" },
    expect.objectContaining({ send_instantly: true, transport: "sendBeacon" }),
  );
});

it("carries a capture to the next page when the visitor leaves before PostHog loaded", async () => {
  const first = await load();
  first.productAnalytics.capture("marketing_signup_cta_clicked", { placement: "hero" });
  window.dispatchEvent(new Event("pagehide"));
  expect(sessionStorage.getItem("everlittle.analytics-carried.v1")).toContain(
    "marketing_signup_cta_clicked",
  );

  vi.resetModules();
  const next = await load();
  next.productAnalytics.capture("$pageview");
  await next.startProductAnalytics("token", {}, () => {});

  expect(posthog.capture.mock.calls.map(([event]) => event)).toEqual([
    "marketing_signup_cta_clicked",
    "$pageview",
  ]);
  expect(sessionStorage.getItem("everlittle.analytics-carried.v1")).toBeNull();
  // A real browser discards the first page. Here its module stays loaded, so remove its listener.
  first.disableProductAnalytics();
});

it("drops everything on an installation without analytics", async () => {
  const { disableProductAnalytics, productAnalytics } = await load();
  productAnalytics.capture("pricing_viewed");
  disableProductAnalytics();
  productAnalytics.capture("plan_selected");
  window.dispatchEvent(new Event("pagehide"));
  expect(sessionStorage.getItem("everlittle.analytics-carried.v1")).toBeNull();
  expect(posthog.capture).not.toHaveBeenCalled();
});
