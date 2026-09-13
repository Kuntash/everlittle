import type { AdvertisingPolicy } from "./advertising-policy";
import { analyticsPath } from "./analytics";
import { browserAcquisition } from "./acquisition";

export const GOOGLE_ADS_ID = "AW-18440538542";
export const ADS_CONSENT_KEY = "everlittle.ads-consent.v1";
export const GOOGLE_CONVERSION_LABELS = {
  purchase: "XHvgCOqHkPIcEK6TkdlE",
  signup: "oWqhCNeFt_IcEK6TkdlE",
  checkout: "Sx0mCNqFt_IcEK6TkdlE",
};
export type GoogleConversion = {
  name: keyof typeof GOOGLE_CONVERSION_LABELS;
  transactionId: string;
  value: number;
  currency: string;
};
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
let loading: Promise<boolean> | undefined;
// Browser-only runtime policy; never persist a regional default as consent.
let policy: AdvertisingPolicy = { mode: "opt-in", globalPrivacyControl: false };
export function configureAdsPolicy(next: AdvertisingPolicy) {
  policy = next;
}
export function adsOptOutSignal() {
  return (
    policy.globalPrivacyControl ||
    (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true
  );
}
export function adsConsent(): "granted" | "denied" | null {
  if (adsOptOutSignal()) return "denied";
  try {
    const value = localStorage.getItem(ADS_CONSENT_KEY);
    if (value === "granted" || value === "denied") return value;
  } catch {
    return null;
  }
  return policy.mode === "us-opt-out" ? "granted" : null;
}
export function setAdsConsent(value: "granted" | "denied") {
  try {
    localStorage.setItem(ADS_CONSENT_KEY, value);
  } catch {
    /* Continue without persistence. */
  }
  const effective = adsConsent() ?? "denied";
  window.gtag?.("consent", "update", {
    ad_storage: effective,
    ad_user_data: effective,
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  window.dispatchEvent(new Event("everlittle-ads-consent"));
}
export function loadGoogleAds(): Promise<boolean> {
  if (adsConsent() !== "granted" || browserAcquisition()?.is_test) return Promise.resolve(false);
  if (loading) return loading;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer!.push(arguments);
  };
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  window.gtag("consent", "update", { ad_storage: "granted", ad_user_data: "granted" });
  window.gtag("js", new Date());
  const location = new URL(analyticsPath(window.location.pathname), window.location.origin);
  // Retain only Google's click matching fields on public landing pages.
  if (!location.pathname.includes(":")) {
    const params = new URLSearchParams(window.location.search);
    for (const key of ["gclid", "gbraid", "wbraid"]) {
      const value = params.get(key);
      if (value && /^[A-Za-z0-9._~-]{1,250}$/.test(value)) location.searchParams.set(key, value);
    }
  }
  window.gtag("config", GOOGLE_ADS_ID, {
    send_page_view: false,
    allow_ad_personalization_signals: false,
    restricted_data_processing: policy.mode === "us-opt-out",
    page_location: location.toString(),
    page_referrer: "",
    page_title: "Everlittle",
  });
  loading = new Promise((resolve) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
    script.onload = () => resolve(true);
    script.onerror = () => {
      loading = undefined;
      script.remove();
      resolve(false);
    };
    document.head.appendChild(script);
  });
  return loading;
}
export async function sendGoogleConversion(event: GoogleConversion) {
  const label = GOOGLE_CONVERSION_LABELS[event.name];
  if (!label || !(await loadGoogleAds()) || adsConsent() !== "granted") return;
  const key = `everlittle.google-sent.${event.name}.${event.transactionId}`;
  try {
    if (localStorage.getItem(key)) return;
  } catch {
    /* Google also deduplicates transaction IDs. */
  }
  window.gtag?.("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${label}`,
    value: event.value,
    currency: event.currency,
    transaction_id: event.transactionId,
    page_location: `${window.location.origin}/conversion`,
    page_referrer: "",
    page_title: "Everlittle",
    event_callback: () => {
      try {
        localStorage.setItem(key, "1");
      } catch {}
    },
  });
}
