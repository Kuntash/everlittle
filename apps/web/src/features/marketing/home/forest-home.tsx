import posthog from "posthog-js";
import { useEffect, useRef, useState } from "react";
import { SiteFooter } from "@/features/marketing/site-footer";
import { Illustration } from "@/components/design/illustrations";
import {
  ArrowRight,
  Brand,
  Check,
  Lock,
  Play,
  ShieldCheck,
  Users,
} from "@/components/design/shared";

const start = (placement: string) => {
  posthog.capture("marketing_signup_cta_clicked", {
    source_path: "/",
    destination_path: "/sign-up",
    placement,
  });
  window.location.assign("/sign-up");
};

function useHomeMotion() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.add("hv-ready");
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("hv-in");
            reveal.unobserve(entry.target);
          }
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => reveal.observe(el));
    // Each scroll-linked element gets its own progress: 0 as it enters the viewport, 1 as it leaves.
    const linked = [...root.querySelectorAll<HTMLElement>("[data-scroll]")];
    let frame = 0;
    const measure = () => {
      frame = 0;
      root.classList.toggle("hv-scrolled", window.scrollY > 12);
      if (reduced) return;
      const vh = window.innerHeight;
      for (const el of linked) {
        const box = el.getBoundingClientRect();
        if (box.bottom < -vh || box.top > vh * 2) continue;
        const mode = el.dataset.scroll;
        const p =
          mode === "through"
            ? (vh * 0.62 - box.top) / Math.max(box.height, 1)
            : (vh - box.top) / (vh + box.height);
        el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      reveal.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return ref;
}

const waveHeights = [
  34, 58, 42, 78, 52, 90, 64, 38, 72, 48, 84, 56, 30, 68, 44, 80, 50, 36, 62, 46,
];
function Waveform({ bars = 20 }: { bars?: number }) {
  return (
    <span className="hv-wave" aria-hidden="true">
      {waveHeights.slice(0, bars).map((h, i) => (
        <i key={i} style={{ height: `${h}%`, animationDelay: `${-i * 130}ms` }} />
      ))}
    </span>
  );
}

function Cta({ placement, children }: { placement: string; children: React.ReactNode }) {
  return (
    <button className="hv-btn" type="button" onClick={() => start(placement)}>
      {children}
    </button>
  );
}

function Header() {
  return (
    <header className="hv-header">
      <div className="hv-header-inner">
        <Brand />
        <nav aria-label="Main navigation">
          <a href="#how">How it works</a>
          <a href="#privacy">Privacy</a>
          <a href="#pricing">Pricing</a>
          <a href="/journal">Journal</a>
        </nav>
        <div className="hv-header-actions">
          <a className="hv-link" href="/sign-in">
            Sign in
          </a>
          <Cta placement="header">Start free</Cta>
          <details className="hv-menu">
            <summary aria-label="Menu">
              <span />
            </summary>
            <div>
              <a href="#how">How it works</a>
              <a href="#privacy">Privacy</a>
              <a href="#pricing">Pricing</a>
              <a href="/journal">Journal</a>
              <a href="/sign-in">Sign in</a>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

/* ---------- hero and archive grid ---------- */

function Hero() {
  return (
    <>
      <section className="hv-c-hero">
        <div className="hv-c-copy">
          <p className="hv-kicker">A private family archive</p>
          <h1>The family archive your kids will inherit.</h1>
          <p className="hv-lede">
            Save photos with their stories, keep the voices, and seal letters for later. Only the
            people you invite can see any of it.
          </p>
          <div className="hv-actions">
            <Cta placement="hero">Save your first memory</Cta>
            <a className="hv-link" href="#how">
              See what’s inside <ArrowRight size={17} />
            </a>
          </div>
          <small className="hv-fine">100 MB free. No card. No expiry.</small>
        </div>
        <div className="hv-c-window" data-scroll>
          <div className="hv-c-bar">
            <Brand />
            <span className="hv-c-tabs">
              <b>Home</b>
              <span>Timeline</span>
              <span>Capsules</span>
              <span>Family</span>
            </span>
          </div>
          <div className="hv-c-body">
            <div className="hv-c-main">
              <h3>Emma’s memories</h3>
              <figure className="hv-c-photo">
                <img
                  src="/marketing/family-album-us.webp"
                  alt="Three generations looking through a family album"
                />
                <figcaption>
                  <strong>An afternoon together</strong>
                  <small>Sarah · Sep 6, 2026</small>
                </figcaption>
              </figure>
            </div>
            <div className="hv-c-side">
              <div className="hv-stage-card hv-stage-voice">
                <span className="hv-play">
                  <Play size={16} />
                </span>
                <div>
                  <strong>Grandpa’s bedtime story</strong>
                  <small>Daniel · Sep 4</small>
                  <Waveform bars={16} />
                </div>
              </div>
              <div className="hv-c-sealed">
                <Lock size={16} />
                <span>
                  <strong>For your 18th birthday</strong>
                  <small>Sealed until May 14, 2039</small>
                </span>
              </div>
              <div className="hv-c-people">
                <span className="hv-avatars">
                  <i>S</i>
                  <i>A</i>
                  <i>D</i>
                  <i>R</i>
                </span>
                <small>Four people adding memories</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hv-section hv-bento" id="how">
        <h2 data-reveal>What goes in the archive</h2>
        <div className="hv-bento-grid">
          <article className="hv-tile hv-tile-photo" data-reveal>
            <div className="hv-tile-copy">
              <h3>Photos with the story attached</h3>
              <p>Write the line you would say out loud if you were showing it to someone.</p>
            </div>
            <figure className="hv-print">
              <img
                src="/marketing/first-bike-us.webp"
                alt="A father steadying his daughter on her first bike"
              />
              <figcaption>
                I let go at the lamp post.
                <small>Kept by Dad · June 14</small>
              </figcaption>
            </figure>
          </article>
          <article className="hv-tile hv-tile-voice" data-reveal>
            <h3>Voices</h3>
            <p>The bedtime story, the made-up song, the word they get wrong.</p>
            <div className="hv-tile-wave">
              <span className="hv-play">
                <Play size={18} />
              </span>
              <Waveform />
            </div>
          </article>
          <article className="hv-tile hv-tile-letter" data-reveal>
            <h3>Letters that wait</h3>
            <p>Choose the day it opens. Until then nobody can read it, including you.</p>
            <img
              src="/marketing/objects/sealed-envelope.png"
              alt="A sealed envelope with a wax seal"
            />
          </article>
          <article className="hv-tile hv-tile-family" data-reveal>
            <h3>Family adds their part</h3>
            <p>Invite grandparents to see and add memories from their phone.</p>
            <div className="hv-tile-illus">
              <Illustration scene="family" />
            </div>
          </article>
          <article className="hv-tile hv-tile-child" data-reveal>
            <span className="hv-tile-hello">Hi, Emma.</span>
            <h3>A view made for your child</h3>
            <p>They see only what you have shared with them, behind a PIN, with no account.</p>
          </article>
        </div>
      </section>
    </>
  );
}

/* ---------- shared lower page ---------- */

function Privacy() {
  return (
    <section className="hv-section hv-privacy" id="privacy" data-reveal>
      <div className="hv-privacy-art">
        <Illustration scene="privacy" />
      </div>
      <div className="hv-privacy-copy">
        <h2>Your memories stay in the family</h2>
        <p>
          Nothing is public unless you make a link for one memory, and that link stops working after
          30 days.
        </p>
        <a className="hv-link" href="/privacy">
          Read about privacy <ArrowRight size={17} />
        </a>
      </div>
      <ul className="hv-privacy-points">
        <li>
          <ShieldCheck size={18} /> No ads, and no public profile
        </li>
        <li>
          <Users size={18} /> Only people you invite
        </li>
        <li>
          <Lock size={18} /> Letters stay sealed until their date
        </li>
      </ul>
    </section>
  );
}

function Pricing() {
  const [yearly, setYearly] = useState(false);
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
    <section className="hv-section hv-pricing" id="pricing" ref={ref} data-reveal>
      <div className="hv-pricing-head">
        <h2>Start free. Add space when you need it.</h2>
        <div className="hv-toggle" role="group" aria-label="Billing period">
          {[false, true].map((value) => (
            <button
              key={String(value)}
              type="button"
              aria-pressed={yearly === value}
              onClick={() => {
                setYearly(value);
                posthog.capture("plan_selected", {
                  billing_interval: value ? "yearly" : "monthly",
                  placement: "homepage",
                });
              }}
            >
              {value ? "Yearly" : "Monthly"}
            </button>
          ))}
          <span className="hv-toggle-thumb" data-on={yearly} aria-hidden="true" />
        </div>
      </div>
      <div className="hv-plans">
        <article className="hv-plan">
          <h3>Free</h3>
          <p className="hv-price">
            <strong>$0</strong>
          </p>
          <small>No card. No expiry.</small>
          <ul>
            {[
              "100 MB for photos, voices and video",
              "Stories, letters and time capsules",
              "Invite family to view and contribute",
            ].map((line) => (
              <li key={line}>
                <Check size={16} /> {line}
              </li>
            ))}
          </ul>
          <Cta placement="pricing_free">Save your first memory</Cta>
        </article>
        <article className="hv-plan hv-plan-paid">
          <h3>Family archive</h3>
          <p className="hv-price">
            <strong key={String(yearly)}>{yearly ? "$60" : "$6"}</strong> /{" "}
            {yearly ? "year" : "month"}
          </p>
          <small>{yearly ? "Two months free compared with monthly." : "Or $60 a year."}</small>
          <ul>
            {[
              "25 GB for photos, voices, and video",
              "Unlimited invited family members",
              "Child spaces and future capsules",
            ].map((line) => (
              <li key={line}>
                <Check size={16} /> {line}
              </li>
            ))}
          </ul>
          <button
            className="hv-btn hv-btn-quiet"
            type="button"
            onClick={() => start("pricing_paid")}
          >
            Start free, upgrade later
          </button>
        </article>
      </div>
    </section>
  );
}

function Journal() {
  return (
    <section className="hv-section hv-journal" data-reveal>
      <div className="hv-journal-head">
        <h2>Ideas for the memories you want to keep</h2>
        <a className="hv-link" href="/journal">
          Browse all guides <ArrowRight size={17} />
        </a>
      </div>
      <div className="hv-journal-grid">
        {[
          [
            "baby",
            "Baby memory journal",
            "A baby memory journal for real life",
            "/baby-memory-journal",
          ],
          [
            "letter",
            "Writing guide",
            "Letters to your future child",
            "/letters-to-your-future-child",
          ],
          [
            "family",
            "Grandparents",
            "Share photos with grandparents, privately",
            "/sharing-photos-with-grandparents",
          ],
        ].map(([scene, category, title, href]) => (
          <a className="hv-journal-card" href={href} key={href}>
            <span className="hv-journal-art">
              <Illustration scene={scene} />
            </span>
            <small>{category}</small>
            <strong>{title}</strong>
            <span className="hv-journal-more">
              Read article <ArrowRight size={15} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="hv-closing" data-reveal>
      <img
        src="/marketing/objects/archive-stack-v2.png"
        alt="A stack of letters tied with ribbon"
        data-scroll
        style={{ "--depth": "-40px" } as React.CSSProperties}
      />
      <h2>Start with one photo from this week.</h2>
      <p>Add the line about what was happening. That’s the whole first step.</p>
      <Cta placement="closing">Save your first memory</Cta>
    </section>
  );
}

export function ForestHome() {
  const root = useHomeMotion();
  return (
    <div className="hv hv-c" ref={root}>
      <Header />
      <main>
        <Hero />
        <Privacy />
        <Pricing />
        <Journal />
        <Closing />
      </main>
      <SiteFooter />
    </div>
  );
}
