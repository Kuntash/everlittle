import { SEO_PAGE_PATHS } from "@/lib/seo-page-paths";

export const MARKETING_ATTRIBUTION_STORAGE_KEY = "everlittle.marketing-attribution.v1";

export type MarketingAttribution = {
  campaign_source?: string;
  campaign_medium?: string;
  campaign_name?: string;
  campaign_content?: string;
  campaign_landing_path?: string;
};

export function analyticsPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "/";
  const publicRoutes = new Set([
    "invite",
    "onboarding",
    "pricing",
    "reset-password",
    "sign-in",
    "sign-up",
  ]);
  if (publicRoutes.has(parts[0])) return `/${parts[0]}`;
  const seoPath = `/${parts[0]}`;
  if (SEO_PAGE_PATHS.includes(seoPath as (typeof SEO_PAGE_PATHS)[number])) return seoPath;
  if (parts[0] === "share") return "/share/:token";
  const familySections = new Set(["capsules", "child", "family", "settings", "timeline"]);
  const section = familySections.has(parts[1]) ? parts[1] : "home";
  return `/:familySlug/${section}`;
}

export function marketingAttribution(search: string): MarketingAttribution | null {
  const params = new URLSearchParams(search);
  const attribution: MarketingAttribution = {};
  const fields = [
    ["utm_source", "campaign_source"],
    ["utm_medium", "campaign_medium"],
    ["utm_campaign", "campaign_name"],
    ["utm_content", "campaign_content"],
  ] as const;

  for (const [queryKey, propertyKey] of fields) {
    const value = safeCampaignValue(params.get(queryKey));
    if (value) attribution[propertyKey] = value;
  }

  return Object.keys(attribution).length > 0 ? attribution : null;
}

export function readMarketingAttribution(value: string | null): MarketingAttribution | null {
  if (!value) return null;
  try {
    const stored = JSON.parse(value) as Record<string, unknown>;
    const attribution: MarketingAttribution = {};
    const keys = [
      "campaign_source",
      "campaign_medium",
      "campaign_name",
      "campaign_content",
      "campaign_landing_path",
    ] as const;
    for (const key of keys) {
      const candidate = safeCampaignValue(typeof stored[key] === "string" ? stored[key] : null);
      if (candidate) attribution[key] = candidate;
    }
    return Object.keys(attribution).length > 0 ? attribution : null;
  } catch {
    return null;
  }
}

function safeCampaignValue(value: string | null) {
  if (!value) return null;
  const clean = value
    .replace(/\p{Cc}/gu, "")
    .trim()
    .slice(0, 100);
  return clean || null;
}
