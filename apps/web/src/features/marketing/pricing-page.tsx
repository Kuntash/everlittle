import { Brand } from "@/components/design/shared";
import { MarketingFooter } from "@/features/marketing/components/marketing-footer";
import { PricingSection } from "@/features/marketing/components/pricing-section";
import posthog from "posthog-js";
import { useState } from "react";

export function MarketingPricingPage() {
  const [billing, setBilling] = useState("Monthly");
  const start = () => {
    posthog.capture("marketing_signup_cta_clicked", {
      source_path: "/pricing",
      destination_path: "/sign-up",
      placement: "pricing_page",
      billing_interval: billing.toLowerCase(),
    });
    window.location.assign("/sign-up");
  };

  return (
    <div className="apricot landing pricing-page">
      <header className="landing-header">
        <Brand />
        <div className="header-actions">
          <a className="text-button" href="/sign-in">
            Sign in
          </a>
        </div>
      </header>
      <main className="landing-main">
        <section className="pricing-intro">
          <p className="eyebrow">A private family archive</p>
          <h1>Start free. Grow as they do.</h1>
          <p className="hero-description">
            Photos, voices and stories, shared only with the family you invite.
          </p>
        </section>
        <PricingSection start={start} billing={billing} setBilling={setBilling} standalone />
        <p className="pricing-account-note">
          100 MB free. No card. No expiry. Upgrade when you need more space.
        </p>
        <section className="pricing-family-note">
          <h2>Bring the people who love them.</h2>
          <p>Family can view and add memories at no extra cost, on either plan.</p>
          <a className="text-button" href="/sharing-photos-with-grandparents">
            A little closer, even from far away →
          </a>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
