import { SlidingTabs } from "@/components/design/controls";
import { Button, Modal } from "@/components/design/shared";
import type { ArchiveState } from "@/features/archive/archive-types";
import { useBillingNavigation } from "@/features/archive/hooks/use-billing-navigation";
import { useState } from "react";

export function SubscriptionSheet({
  billing,
  isOwner,
  onClose,
}: {
  billing: ArchiveState["billing"];
  isOwner: boolean;
  onClose: () => void;
}) {
  const { billingBusy, billingError, openBilling } = useBillingNavigation();
  const [cycle, setCycle] = useState("Monthly");
  const canCheckout = isOwner && billing.checkoutAvailable;

  function choosePlan(interval: "monthly" | "yearly") {
    if (!canCheckout) return;
    void openBilling(billing.canManage ? "portal" : interval);
  }

  return (
    <Modal title="Choose your family plan" busy={billingBusy !== null} onClose={onClose}>
      <p>A little more room for photos, voices, and the stories you’ll tell again.</p>
      <SlidingTabs
        label="Billing cycle"
        value={cycle}
        onChange={setCycle}
        items={["Monthly", "Yearly"]}
      />
      <div className="plan-selection">
        <h2>{cycle === "Yearly" ? "$60 / year" : "$6 / month"}</h2>
        <p>{cycle === "Yearly" ? "Save $12 each year." : "A little at a time, each month."}</p>
      </div>
      {!isOwner && (
        <p className="muted">Ask the family owner to start or manage the subscription.</p>
      )}
      {isOwner && !billing.checkoutAvailable && (
        <p className="muted">Secure checkout is temporarily unavailable.</p>
      )}
      {billing.environment === "test_mode" && <small>Dodo test mode · no real charge</small>}
      {billingError && (
        <p className="error" role="alert">
          {billingError}
        </p>
      )}
      <div className="form-footer">
        <Button secondary disabled={billingBusy !== null} onClick={onClose}>
          Keep as is
        </Button>
        <Button
          disabled={!canCheckout || billingBusy !== null}
          onClick={() => choosePlan(cycle === "Yearly" ? "yearly" : "monthly")}
        >
          {billingBusy
            ? "Opening…"
            : billing.canManage
              ? "Manage subscription"
              : "Start family plan"}
        </Button>
      </div>
    </Modal>
  );
}
