import type { BillingDestination } from "@/features/archive/archive-types";
import { apiFetch, responseError } from "@/features/archive/lib/archive-utils";
import { usePostHog } from "@posthog/react";
import { useCallback, useState } from "react";

export function useBillingNavigation() {
  const posthog = usePostHog();
  const [billingBusy, setBillingBusy] = useState<BillingDestination | null>(null);
  const [billingError, setBillingError] = useState("");

  const openBilling = useCallback(
    async (destination: BillingDestination) => {
      setBillingBusy(destination);
      setBillingError("");
      const response = await apiFetch(
        destination === "portal" ? "/api/archive/billing/portal" : "/api/archive/billing/checkout",
        {
          method: "POST",
          body: destination === "portal" ? undefined : JSON.stringify({ interval: destination }),
        },
      );
      if (!response.ok) {
        setBillingError(await responseError(response));
        setBillingBusy(null);
        return;
      }
      const result = (await response.json()) as { url: string };
      posthog?.capture(
        destination === "portal" ? "billing_portal_opened" : "billing_checkout_started",
        destination === "portal" ? undefined : { billing_interval: destination },
      );
      window.location.assign(result.url);
    },
    [posthog],
  );

  return { billingBusy, billingError, openBilling };
}
