export const FAMILY_PLAN = {
  key: "family",
  monthlyPriceUsd: 6,
  annualPriceUsd: 60,
  storageLimitBytes: 25 * 1024 * 1024 * 1024,
} as const;

export type BillingStatus = "active" | "canceled" | "complimentary" | "past_due" | "trialing";

export function canCreateArchiveContent(
  status: BillingStatus,
  trialEndsAt: string | null,
): boolean {
  if (status === "active") return true;
  if (status !== "trialing" || !trialEndsAt) return false;
  return new Date(trialEndsAt).valueOf() > Date.now();
}

export function canStoreMedia(status: BillingStatus, trialEndsAt: string | null): boolean {
  return canCreateArchiveContent(status, trialEndsAt);
}
