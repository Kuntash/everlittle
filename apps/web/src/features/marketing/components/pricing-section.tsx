import posthog from "posthog-js";
import { useEffect, useRef } from "react";
import { Button, Check } from "@/components/design/shared";
export function PricingSection({
  start,
  billing,
  setBilling,
  standalone = false,
}: {
  standalone?: boolean;
  start: (mode?: string) => void;
  billing: string;
  setBilling: (value: string) => void;
}) {
  const placement = standalone ? "pricing_page" : "homepage";
  const PlanHeading = standalone ? "h2" : "h3";
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          posthog.capture("pricing_viewed", { placement });
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [placement]);
  return (
    <section ref={ref} className="pricing-section section-border" id="pricing">
      {!standalone && (
        <h2>
          Start free. <br />
          Add space when you need it.
        </h2>
      )}
      <div className="pricing-plans">
        <div className="price-card free-price-card">
          <div>
            <PlanHeading>Free</PlanHeading>
            <div className="price">
              <strong>$0</strong>
            </div>
            <p>No card. No expiry.</p>
          </div>
          <ul>
            <li>
              <Check />
              100 MB for photos, voices and video
            </li>
            <li>
              <Check />
              Stories, letters and time capsules
            </li>
            <li>
              <Check />
              Invite family to view and contribute
            </li>
          </ul>
          <Button onClick={() => start()}>Save your first memory</Button>
        </div>
        <div className="price-card">
          <div>
            <PlanHeading>Family archive</PlanHeading>
            <div className="price">
              <strong key={billing}>{billing === "Monthly" ? "$6" : "$60"}</strong> /{" "}
              {billing === "Monthly" ? "month" : "year"}
            </div>
            <button
              className="text-button small"
              onClick={() => {
                const next = billing === "Monthly" ? "Yearly" : "Monthly";
                setBilling(next);
                posthog.capture("plan_selected", {
                  billing_interval: next.toLowerCase(),
                  placement,
                });
              }}
            >
              {billing === "Monthly" ? "or $60 yearly" : "or $6 monthly"} ↔
            </button>
          </div>
          <ul>
            <li>
              <Check />
              25 GB for photos, voices, and video
            </li>
            <li>
              <Check />
              Unlimited invited family members
            </li>
            <li>
              <Check />
              Child spaces and future capsules
            </li>
          </ul>
          <Button secondary onClick={() => start()}>
            Start free, upgrade later
          </Button>
        </div>
      </div>
    </section>
  );
}
