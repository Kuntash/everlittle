import { beforeEach, describe, expect, it, vi } from "vitest";
import { ACQUISITION_KEY, updateAcquisition } from "@/lib/acquisition";
beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  document.head.innerHTML = "";
  delete window.gtag;
  delete window.dataLayer;
});
describe("Google advertising consent", () => {
  it("does not load Google before consent or for QA visits", async () => {
    const ads = await import("@/lib/google-ads");
    expect(await ads.loadGoogleAds()).toBe(false);
    ads.setAdsConsent("granted");
    localStorage.setItem(
      ACQUISITION_KEY,
      JSON.stringify(
        updateAcquisition(null, {
          search: "?utm_source=qa",
          pathname: "/",
          referrer: "",
          hostname: "geteverlittle.com",
        }),
      ),
    );
    expect(await ads.loadGoogleAds()).toBe(false);
    expect(document.querySelector("script")).toBeNull();
  });
  it("uses transaction deduplication and excludes private URL details", async () => {
    const ads = await import("@/lib/google-ads");
    ads.setAdsConsent("granted");
    const pending = ads.loadGoogleAds();
    const script = document.querySelector("script")!;
    expect(script.src).toContain(ads.GOOGLE_ADS_ID);
    script.dispatchEvent(new Event("load"));
    expect(await pending).toBe(true);
    const event = {
      name: "purchase" as const,
      transactionId: "first-payment:fixture",
      value: 6,
      currency: "USD",
    };
    await ads.sendGoogleConversion(event);
    const commands = window.dataLayer!.map((x) => Array.from(x as ArrayLike<unknown>));
    const conversion = commands.find((x) => x[0] === "event")!;
    expect(conversion[1]).toBe("conversion");
    const payload = conversion[2] as Record<string, any>;
    expect(payload.page_location).toBe(window.location.origin + "/conversion");
    expect(payload.value).toBe(6);
    expect(payload.transaction_id).toBe(event.transactionId);
    payload.event_callback();
    const count = window.dataLayer!.length;
    await ads.sendGoogleConversion(event);
    expect(window.dataLayer).toHaveLength(count);
    ads.setAdsConsent("denied");
    const revokedCount = window.dataLayer!.length;
    await ads.sendGoogleConversion({ ...event, transactionId: "new" });
    expect(window.dataLayer).toHaveLength(revokedCount);
  });
});

describe("Regional advertising defaults", () => {
  it("defaults US measurement on without saving an affirmative choice", async () => {
    const ads = await import("@/lib/google-ads");
    ads.configureAdsPolicy({ mode: "us-opt-out", globalPrivacyControl: false });
    expect(ads.adsConsent()).toBe("granted");
    expect(localStorage.getItem(ads.ADS_CONSENT_KEY)).toBeNull();
    const pending = ads.loadGoogleAds();
    document.querySelector("script")!.dispatchEvent(new Event("load"));
    expect(await pending).toBe(true);
    const commands = window.dataLayer!.map((x) => Array.from(x as ArrayLike<unknown>));
    expect(commands.find((x) => x[0] === "config")?.[2]).toMatchObject({
      restricted_data_processing: true,
      allow_ad_personalization_signals: false,
    });
    // Travelling to an opt-in region must not reuse the US default as consent.
    ads.configureAdsPolicy({ mode: "opt-in", globalPrivacyControl: false });
    expect(ads.adsConsent()).toBeNull();
    expect(await ads.loadGoogleAds()).toBe(false);
  });

  it("keeps a previous refusal when a visitor becomes eligible for US defaults", async () => {
    const ads = await import("@/lib/google-ads");
    ads.setAdsConsent("denied");
    ads.configureAdsPolicy({ mode: "us-opt-out", globalPrivacyControl: false });
    expect(ads.adsConsent()).toBe("denied");
    expect(await ads.loadGoogleAds()).toBe(false);
  });

  it("gives both server and browser GPC precedence over consent", async () => {
    const ads = await import("@/lib/google-ads");
    ads.setAdsConsent("granted");
    ads.configureAdsPolicy({ mode: "us-opt-out", globalPrivacyControl: true });
    expect(await ads.loadGoogleAds()).toBe(false);
    ads.configureAdsPolicy({ mode: "us-opt-out", globalPrivacyControl: false });
    Object.defineProperty(navigator, "globalPrivacyControl", { configurable: true, value: true });
    try {
      expect(ads.adsConsent()).toBe("denied");
      expect(await ads.loadGoogleAds()).toBe(false);
    } finally {
      Reflect.deleteProperty(navigator, "globalPrivacyControl");
    }
  });

  it("requires opt-in for non-US and unknown locations", async () => {
    const { advertisingPolicy } = await import("@/lib/advertising-policy");
    const ads = await import("@/lib/google-ads");
    for (const country of ["DE", "GB", "CH", "IN", "CA", null, undefined, "XX"]) {
      ads.configureAdsPolicy(advertisingPolicy(country, false));
      expect(ads.adsConsent()).toBeNull();
      expect(await ads.loadGoogleAds()).toBe(false);
    }
    expect(advertisingPolicy("US", true)).toEqual({
      mode: "us-opt-out",
      globalPrivacyControl: true,
    });
  });
});
