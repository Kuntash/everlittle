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
          One home for <br />
          all the little things.
        </h2>
      )}
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
        <Button onClick={() => start()}>Start your archive</Button>
      </div>
    </section>
  );
}
