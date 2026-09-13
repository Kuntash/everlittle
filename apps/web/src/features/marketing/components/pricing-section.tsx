import posthog from "posthog-js";
import { useEffect, useRef } from "react";
import { Button, Check } from "@/components/design/shared";
export function PricingSection({
  start,
  billing,
  setBilling,
}: {
  start: (mode?: string) => void;
  billing: string;
  setBilling: (value: string) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          posthog.capture("pricing_viewed", { placement: "homepage" });
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section ref={ref} className="pricing-section section-border" id="pricing">
      <h2>
        One home for <br />
        all the little things.
      </h2>
      <div className="price-card">
        <div>
          <h3>Family archive</h3>
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
                placement: "homepage",
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
