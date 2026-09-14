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
        <a className="brand-link" href="/" aria-label="Everlittle home">
          <Brand />
        </a>
        <div className="header-actions">
          <a className="text-button" href="/sign-in">
            Sign in
          </a>
        </div>
      </header>
      <main className="landing-main">
        <section className="pricing-intro">
          <p className="eyebrow">A private family archive</p>
          <h1>One home for all the little things.</h1>
          <p className="hero-description">
            Save their photos, voices, stories and letters in a private archive. Invite the people
            who know them best.
          </p>
        </section>
        <PricingSection start={start} billing={billing} setBilling={setBilling} standalone />
        <p className="pricing-account-note">
          Create your account free. Choose a plan before adding memories.
        </p>
        <section className="pricing-family-note">
          <h2>Bring the people who love them.</h2>
          <p>
            Invite grandparents and loved ones to share photos and add their own stories. Unlimited
            invited family members are included in your family archive.
          </p>
          <a className="text-button" href="/sharing-photos-with-grandparents">
            A little closer, even from far away →
          </a>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
