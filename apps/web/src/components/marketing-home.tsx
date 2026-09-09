import { ClosingSection } from "@/features/marketing/components/closing-section";
import { JournalSection } from "@/features/marketing/components/journal-section";
import { MarketingFooter } from "@/features/marketing/components/marketing-footer";
import { MarketingHero } from "@/features/marketing/components/marketing-hero";
import { MemoryPath } from "@/features/marketing/components/memory-path";
import { PricingSection } from "@/features/marketing/components/pricing-section";
import { PrivacySection } from "@/features/marketing/components/privacy-section";

import { ArrowRight, Art, Brand, Button, Modal } from "@/components/design/shared";
import { useLandingMotion } from "@/features/marketing/hooks/use-landing-motion";
import { useState } from "react";
const appUrl = "/sign-in";
export const MarketingHome = () => {
  const motionRoot = useLandingMotion();
  const [menu, setMenu] = useState(false),
    [dialog, setDialog] = useState(""),
    [billing, setBilling] = useState("Monthly"),
    [preview, setPreview] = useState("Home");
  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
    setMenu(false);
  };
  const start = (mode = "Create your archive") => {
    window.location.assign(mode === "Sign in" ? "/sign-in" : "/sign-up");
  };
  return (
    <div className="apricot landing" ref={motionRoot}>
      <header className="landing-header">
        <a className="brand-link" href="#" aria-label="Everlittle home">
          <Brand />
        </a>
        <nav aria-label="Main navigation" className={menu ? "open" : ""}>
          {[
            ["How it works", "how"],
            ["Privacy", "privacy"],
            ["Journal", "journal"],
            ["Pricing", "pricing"],
          ].map(([label, id]) => (
            <button key={id} onClick={() => go(id)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button className="text-button" onClick={() => start("Sign in")}>
            Sign in
          </button>
          <Button onClick={() => start()}>
            <span className="desktop-label">Create your archive</span>
            <span className="mobile-label">Start</span>
          </Button>
          <button
            className="menu-button"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        </div>
      </header>
      <main className="landing-main">
        <MarketingHero
          start={start}
          go={go}
          setDialog={setDialog}
          preview={preview}
          setPreview={setPreview}
        />
        <MemoryPath />
        <PrivacySection setDialog={setDialog} />
        <PricingSection start={start} billing={billing} setBilling={setBilling} />
        <JournalSection />
        <ClosingSection start={start} />
      </main>
      <MarketingFooter start={start} go={go} />
      {dialog && (
        <Modal title={dialog} onClose={() => setDialog("")}>
          {dialog === "Your family, your privacy" ? (
            <>
              <p>
                Your archive is shared only with accepted family members. You choose who can add
                memories, manage the archive, or simply visit.
              </p>
              <p>
                Child sessions show only memories shared with your child. Time capsule notes stay
                unreadable until their opening date, even for the person who wrote them.
              </p>
              <p>
                A memory becomes public only if its author explicitly creates a link. That link
                lasts for 30 days and can be disabled.
              </p>
            </>
          ) : dialog === "An afternoon together" ? (
            <>
              <Art name="photo" />
              <p>
                Three generations around the table, turning pages and telling the stories behind
                every photograph.
              </p>
              <small>Kept by Sarah · September 6, 2026</small>
            </>
          ) : (
            <>
              <p>
                {dialog.includes("voice")
                  ? "Choose an audio file and keep the words, laughter, and familiar voices together."
                  : dialog.includes("Grandpa")
                    ? "One more story before sleep. A familiar voice, kept for the days ahead."
                    : "Keep a photo, story, voice, video, milestone, or letter in your family’s private archive."}
              </p>
              <a href={appUrl} target="_blank" rel="noreferrer" className="raised">
                Open your archive <ArrowRight size={18} />
              </a>
            </>
          )}
        </Modal>
      )}
    </div>
  );
};
