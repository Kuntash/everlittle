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
  return (
    <section className="pricing-section section-border" id="pricing">
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
            onClick={() => setBilling(billing === "Monthly" ? "Yearly" : "Monthly")}
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
