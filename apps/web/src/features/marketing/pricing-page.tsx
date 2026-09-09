import { Brand } from "@/components/brand";
import { SlidingTabs } from "@/components/design/controls";
import { MemoryIllustration } from "@/components/design/memory-illustrations";
import { useState } from "react";
export function MarketingPricingPage() {
  const [cycle, setCycle] = useState("Monthly");
  return (
    <main className="pricing-page">
      <header className="landing-header">
        <a href="/" aria-label="Everlittle home">
          <Brand />
        </a>
        <a className="text-button" href="/sign-in">
          Sign in
        </a>
      </header>
      <section className="pricing-content">
        <MemoryIllustration kind="Keepsake" size={150} />
        <h1>One home for your family’s memories.</h1>
        <p>
          Photos, voices, stories and letters. Everyone you invite, together in one private archive.
        </p>
        <SlidingTabs
          label="Billing cycle"
          value={cycle}
          onChange={setCycle}
          items={["Monthly", "Yearly"]}
        />
        <div className="price-card">
          <h2>Family archive</h2>
          <strong className="price">
            {cycle === "Monthly" ? "$6" : "$60"}
            <small> / {cycle === "Monthly" ? "month" : "year"}</small>
          </strong>
          <p>{cycle === "Yearly" ? "Save $12 each year." : "A little at a time, each month."}</p>
          <ul>
            <li>25 GB for photos, voices and video</li>
            <li>Unlimited invited loved ones</li>
            <li>Child spaces and future capsules</li>
          </ul>
          <a className="primary-button" href="/sign-up">
            Create your archive
          </a>
          <small>Create your account free. A subscription enables new memories.</small>
        </div>
        <section className="self-host-option">
          <h2>Prefer to host it yourself?</h2>
          <p>
            Everlittle is open source. Run your own private installation with no Everlittle
            subscription. Your hosting provider’s costs apply.
          </p>
          <a className="text-button" href="https://github.com/Kuntash/everlittle">
            Explore self-hosting →
          </a>
        </section>
      </section>
    </main>
  );
}
