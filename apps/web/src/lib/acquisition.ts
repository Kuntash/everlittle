import {
  analyticsPath,
  marketingAttribution,
  readMarketingAttribution,
  type MarketingAttribution,
} from "./analytics";

export const ACQUISITION_KEY = "everlittle.acquisition.v2";
const WINDOW_MS = 30 * 86400_000;
export type Touch = MarketingAttribution & { captured_at: string };
export type Acquisition = { first: Touch; last: Touch; is_test: boolean };

export function parseAcquisition(raw: string | null, now = Date.now()): Acquisition | null {
  if (!raw || raw.length > 6000) return null;
  try {
    const value = JSON.parse(raw);
    const touch = (input: Record<string, unknown>): Touch | null => {
      const fields = readMarketingAttribution(JSON.stringify(input));
      const time = Date.parse(String(input?.captured_at));
      if (!fields || !Number.isFinite(time) || time > now + 60000) return null;
      if (fields.campaign_landing_path)
        fields.campaign_landing_path = analyticsPath(fields.campaign_landing_path);
      return { ...fields, captured_at: new Date(time).toISOString() };
    };
    const first = touch(value.first),
      last = touch(value.last);
    return first && last
      ? { first, last, is_test: value.is_test === true || first.campaign_source === "qa" }
      : null;
  } catch {
    return null;
  }
}

export function updateAcquisition(
  previous: Acquisition | null,
  input: { search: string; pathname: string; referrer: string; hostname: string },
  now = Date.now(),
): Acquisition {
  let campaign = marketingAttribution(input.search);
  if (!campaign && input.referrer) {
    try {
      const host = new URL(input.referrer).hostname;
      if (host !== input.hostname && !host.endsWith("dodopayments.com")) {
        const source = /(^|\.)google\./.test(host)
          ? "google"
          : /(^|\.)bing.com$/.test(host)
            ? "bing"
            : /(^|\.)(chatgpt.com|chat.openai.com)$/.test(host)
              ? "chatgpt"
              : /(^|\.)perplexity.ai$/.test(host)
                ? "perplexity"
                : /(^|\.)(facebook.com|instagram.com|t.co)$/.test(host)
                  ? "social"
                  : "other";
        campaign = {
          campaign_source: source,
          campaign_medium: ["google", "bing"].includes(source) ? "organic" : "referral",
        };
      }
    } catch {
      /* Invalid referrer is direct/unknown. */
    }
  }
  const fresh: Touch = {
    ...(campaign ?? { campaign_source: "direct", campaign_medium: "none" }),
    campaign_landing_path: analyticsPath(input.pathname),
    captured_at: new Date(now).toISOString(),
  };
  const unexpired = previous && now - Date.parse(previous.last.captured_at) <= WINDOW_MS;
  return {
    first: previous?.first ?? fresh,
    last: campaign ? fresh : unexpired ? previous.last : fresh,
    is_test:
      previous?.is_test === true ||
      campaign?.campaign_source === "qa" ||
      /^(localhost|127\.)/.test(input.hostname),
  };
}

export function acquisitionProperties(
  value: Acquisition | null,
  now = Date.now(),
): Record<string, string | boolean | number> {
  if (!value) return { is_test: false, attribution_status: "unknown" };
  const last =
    now - Date.parse(value.last.captured_at) <= WINDOW_MS
      ? value.last
      : { campaign_source: "direct", campaign_medium: "none" };
  return {
    campaign_name: "",
    campaign_content: "",
    campaign_term: "",
    campaign_id: "",
    campaign_landing_path: "",
    ...last,
    ...Object.fromEntries(Object.entries(value.first).map(([key, v]) => [`first_${key}`, v])),
    is_test: value.is_test,
    attribution_status: "known",
    measurement_version: 2,
  };
}

export function browserAcquisition() {
  try {
    return parseAcquisition(localStorage.getItem(ACQUISITION_KEY));
  } catch {
    return null;
  }
}
export function acquisitionHeaders(): Record<string, string> {
  const value = browserAcquisition();
  return value ? { "x-everlittle-acquisition": JSON.stringify(value) } : {};
}
