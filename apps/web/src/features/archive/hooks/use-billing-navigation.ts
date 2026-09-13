import { acquisitionHeaders } from "@/lib/acquisition";
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
      try {
        const response = await apiFetch(
          destination === "portal"
            ? "/api/archive/billing/portal"
            : "/api/archive/billing/checkout",
          {
            method: "POST",
            headers: acquisitionHeaders(),
            body: destination === "portal" ? undefined : JSON.stringify({ interval: destination }),
          },
        );
        if (!response.ok) {
          posthog?.capture(
            destination === "portal" ? "billing_portal_failed" : "billing_checkout_failed",
            { billing_interval: destination, reason: "request_rejected" },
          );
          setBillingError(await responseError(response));
          setBillingBusy(null);
          return;
        }
        const result = (await response.json()) as { url: string };
        posthog?.capture(
          destination === "portal" ? "billing_portal_opened" : "billing_checkout_redirected",
          destination === "portal" ? undefined : { billing_interval: destination },
        );
        window.location.assign(result.url);
      } catch {
        posthog?.capture(
          destination === "portal" ? "billing_portal_failed" : "billing_checkout_failed",
          { billing_interval: destination, reason: "network_error" },
        );
        setBillingError("We couldn’t open billing. Check your connection and try again.");
        setBillingBusy(null);
      }
    },
    [posthog],
  );

  return { billingBusy, billingError, openBilling };
}
