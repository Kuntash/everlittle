import {
  ArrowRight,
  Baby,
  Boxes,
  Check,
  Cloud,
  Code2,
  Database,
  Globe2,
  KeyRound,
  LockKeyhole,
  Play,
  ServerCog,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useEffect } from "react";

import { Brand } from "@/components/brand";

const waveform = [
  12, 25, 18, 33, 21, 39, 27, 15, 34, 43, 22, 29, 41, 17, 27, 36, 21, 14, 28, 40, 24, 32, 19, 38,
  26, 15, 30, 23, 35, 18, 28, 41,
];

function Star({ className = "" }: { className?: string }) {
  return (
    <span className={`heirloom-star ${className}`} aria-hidden="true">
      ✦
    </span>
  );
}

function Waveform() {
  return (
    <div className="heirloom-wave" aria-label="Voice memory, one minute and thirty-four seconds">
      <button type="button" aria-label="Play voice memory">
        <Play size={14} fill="currentColor" />
      </button>
      <span aria-hidden="true">
        {waveform.map((height, index) => (
          <i key={`${height}-${index}`} style={{ height }} />
        ))}
      </span>
      <small>01:34</small>
    </div>
  );
}

export function PricingSection() {
  return (
    <section className="heirloom-pricing" id="pricing">
      <div className="heirloom-pricing-intro" data-motion="pricing-heading">
        <p>
          <Star /> Simple family pricing
        </p>
        <h2>One home for all the little things.</h2>
        <p>
          No advertising, no audience-building, and no charge for inviting the people your family
          trusts.
        </p>
      </div>

      <article className="heirloom-price-card" data-motion="pricing-card">
        <div className="heirloom-price-name">
          <small>EVERLITTLE</small>
          <h3>Family archive</h3>
          <p>Everything a family needs to keep a private history together.</p>
        </div>
        <div className="heirloom-price-amount" aria-label="Six US dollars per month">
          <span>$</span>
          <strong>6</strong>
          <small>
            USD
            <br />
            per month
          </small>
        </div>
        <p className="heirloom-price-annual">or $60 yearly — two months kept for you</p>
        <ul>
          <li>
            <Check /> 25 GB of photographs, voices, and video
          </li>
          <li>
            <Check /> Unlimited invited family members
          </li>
          <li>
            <Check /> Child spaces and future capsules
          </li>
          <li>
            <Check /> Private sharing and full data ownership
          </li>
          <li>
            <Check /> Managed updates and point-in-time recovery
          </li>
        </ul>
        <a href="/sign-up">
          Start your family archive <ArrowRight />
        </a>
        <p className="heirloom-founding-note">
          Create your account free. Choose a plan before adding memories.
        </p>
      </article>

      <aside className="heirloom-price-self-hosted" data-motion="pricing-self-hosted">
        <div>
          <Code2 />
          <p>
            <strong>Prefer your own infrastructure?</strong> Everlittle is free and open source.
          </p>
        </div>
        <a href="https://github.com/Kuntash/everlittle">
          Self-host Everlittle <ArrowRight />
        </a>
      </aside>
    </section>
  );
}

export function MarketingPricingPage() {
  return (
    <main className="heirloom-shell heirloom-pricing-page">
      <nav className="heirloom-nav heirloom-nav-paper" aria-label="Main navigation">
        <a href="/" aria-label="Everlittle home">
          <Brand compact />
        </a>
        <div>
          <a href="/#keeps">What you keep</a>
          <a href="/#privacy">Privacy</a>
          <a href="/#hosting">Self-host</a>
          <a href="/sign-in">Sign in</a>
          <a className="heirloom-nav-cta" href="/sign-up">
            Create your archive
          </a>
        </div>
      </nav>
      <PricingSection />
      <footer className="heirloom-footer">
        <Brand compact />
        <p>A private place for the memories they’ll grow into.</p>
        <nav aria-label="Footer navigation">
          <a href="/">Home</a>
          <i />
          <a href="/sign-in">Sign in</a>
          <i />
          <a href="/#hosting">Self-host</a>
        </nav>
      </footer>
    </main>
  );
}

export function MarketingHome() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".heirloom-shell");
    if (!root) return;

    const motionTargets = [...root.querySelectorAll<HTMLElement>("[data-motion]")];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.add("is-motion-ready");

    if (reducedMotion || !("IntersectionObserver" in window)) {
      motionTargets.forEach((target) => target.classList.add("is-revealed"));
      return () => root.classList.remove("is-motion-ready");
    }

    const targetsByTrigger = new Map<Element, HTMLElement[]>();
    motionTargets.forEach((target) => {
      const trigger = target.parentElement ?? target;
      targetsByTrigger.set(trigger, [...(targetsByTrigger.get(trigger) ?? []), target]);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          targetsByTrigger
            .get(entry.target)
            ?.forEach((target) => target.classList.add("is-revealed"));
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12%", threshold: 0.14 },
    );

    targetsByTrigger.forEach((_, trigger) => observer.observe(trigger));
    return () => {
      observer.disconnect();
      root.classList.remove("is-motion-ready");
    };
  }, []);

  return (
    <main className="heirloom-shell">
      <section className="heirloom-hero">
        <img
          className="heirloom-hero-photo"
          src="/marketing/family-album.jpg"
          alt="Three generations looking through a family album"
          width="1536"
          height="1024"
          fetchPriority="high"
        />
        <div className="heirloom-hero-shade" />
        <div className="heirloom-hero-curtain" aria-hidden="true" />

        <nav className="heirloom-nav" aria-label="Main navigation">
          <a href="/" aria-label="Everlittle home">
            <Brand compact />
          </a>
          <div>
            <a href="#keeps">What you keep</a>
            <a href="#privacy">Privacy</a>
            <a href="/pricing">Pricing</a>
            <a href="#hosting">Self-host</a>
            <a href="/sign-in">Sign in</a>
            <a className="heirloom-nav-cta" href="/sign-up">
              Create your archive
            </a>
          </div>
        </nav>

        <div className="heirloom-hero-copy">
          <h1>
            <span>Keep the</span>
            <span>little things.</span>
          </h1>
          <p>Photographs, voices, stories, and letters they’ll grow into.</p>
          <div className="heirloom-hero-actions">
            <a className="heirloom-button heirloom-button-dark" href="/sign-up">
              Create your archive
            </a>
            <a className="heirloom-button heirloom-button-outline" href="#keeps">
              See what belongs here
            </a>
          </div>
          <a className="heirloom-mobile-signin" href="/sign-in">
            I already have an account
          </a>
        </div>
      </section>

      <section className="heirloom-keeps" id="keeps">
        <header className="heirloom-section-heading" data-motion="heading">
          <p>
            What you keep <Star />
          </p>
          <h2>Childhood is more than a camera roll.</h2>
          <span>
            Keep the sound of their voice, the story behind the photograph, and words meant for a
            future day.
          </span>
        </header>

        <div className="heirloom-keeps-grid">
          <figure className="heirloom-photo-memory" data-motion="keepsake-left">
            <div className="heirloom-photo-frame">
              <img
                src="/marketing/family-album.jpg"
                alt="A family photograph kept with its story"
                width="1536"
                height="1024"
                loading="lazy"
              />
              <span>IMG_0047 · TAWANG</span>
              <small>
                APR 14
                <br />
                2016
              </small>
            </div>
            <figcaption>
              <b>01</b>
              <i />A photograph, with its story
              <i />
            </figcaption>
          </figure>

          <article className="heirloom-voice-memory" data-motion="keepsake-center">
            <div className="heirloom-memory-index">
              <span>02</span>
              <i />
              <small>JUN 03, 2018</small>
            </div>
            <h3>Their voice, exactly as it was</h3>
            <Waveform />
            <div className="heirloom-letter-note">
              <span>STORY · LHASA</span>
              <p>
                You were born the morning
                <br />
                the mountains turned gold.
                <br />
                Your grandfather lit butter lamps
                <br />
                for your long life.
              </p>
              <Star />
            </div>
          </article>

          <article className="heirloom-capsule-memory" data-motion="keepsake-right">
            <div className="heirloom-memory-index">
              <span>03</span>
              <i />
              <small>JAN 01, 2035</small>
            </div>
            <h3>A letter for later</h3>
            <div className="heirloom-envelope-wrap">
              <img
                src="/marketing/objects/sealed-envelope.png"
                alt="A sealed letter to open in the future"
                width="1254"
                height="1254"
                loading="lazy"
              />
              <span>
                TO BE OPENED BY YOU
                <br />
                ON YOUR 18TH BIRTHDAY
              </span>
            </div>
          </article>
        </div>
      </section>

      <section className="heirloom-product" aria-labelledby="archive-heading">
        <aside className="heirloom-product-rail" aria-hidden="true">
          <Star />
          <p>
            These are the small moments.
            <br />
            They build the story that lasts.
          </p>
          <small>
            FILED WITH CARE
            <br />
            <Star /> FOR THE FUTURE
          </small>
        </aside>

        <div
          className="heirloom-product-stage"
          aria-label="Everlittle archive product preview"
          data-motion="archive-stage"
        >
          <div className="heirloom-app-window">
            <aside>
              <Brand compact />
              <span className="is-current">Timeline</span>
              <span>Memories</span>
              <span>Capsules</span>
              <span>Family</span>
              <small>
                The Norbu Family
                <br />6 members
              </small>
            </aside>
            <div className="heirloom-timeline">
              <h3>Timeline</h3>
              <p>All time</p>
              <article>
                <i />
                <img src="/marketing/family-album.jpg" alt="" />
                <div>
                  <small>MAY 14, 2016</small>
                  <b>A rainy afternoon together</b>
                  <span>You loved puddles, paper boats, and wearing your red boots.</span>
                </div>
              </article>
              <article>
                <i />
                <img src="/marketing/voice-memory.jpg" alt="" />
                <div>
                  <small>AUG 2, 2018</small>
                  <b>First day of school</b>
                  <span>Big backpack, bigger smile. You were ready.</span>
                </div>
              </article>
            </div>
          </div>

          <article className="heirloom-memory-window">
            <small>MAY 14, 2016 · CHILDHOOD</small>
            <h3>A rainy afternoon together</h3>
            <p>
              You found every puddle. We stayed out longer than planned and came home soaked and
              laughing.
            </p>
            <Waveform />
            <img src="/marketing/family-album.jpg" alt="A family memory shown inside Everlittle" />
          </article>

          <article className="heirloom-capsule-window">
            <LockKeyhole size={16} />
            <span className="heirloom-wax">
              <Star />
            </span>
            <h3>For your child</h3>
            <p>To be opened on May 14, 2046</p>
            <small>SEALED WITH LOVE</small>
          </article>
        </div>

        <div className="heirloom-product-copy" data-motion="archive-copy">
          <p>The archive</p>
          <h2 id="archive-heading">Every memory keeps its context.</h2>
          <Star />
          <span>Dates, voices, photographs, and the people who were there stay together.</span>
          <a href="/sign-up">
            See how Everlittle works <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <section className="heirloom-privacy" id="privacy">
        <div className="heirloom-privacy-photo" data-motion="privacy-photo">
          <img
            src="/marketing/voice-memory.jpg"
            alt="A parent recording a private voice memory beside a sleeping child"
            width="1536"
            height="1152"
            loading="lazy"
          />
        </div>
        <div className="heirloom-privacy-copy" data-motion="privacy-copy">
          <p>
            <Star /> Private by default
          </p>
          <h2>Your child is not the product.</h2>
          <span>
            Adults decide who joins, what each person can see, and when a child is ready for their
            own view.
          </span>

          <div className="heirloom-family-tree" aria-label="Owner-managed family access">
            <div className="heirloom-tree-owner">
              <i>
                <UserRound />
              </i>
              <b>Owner</b>
            </div>
            <div className="heirloom-tree-branches">
              <span>
                <i>
                  <UserRound />
                </i>
                <b>Parent</b>
              </span>
              <span>
                <i>
                  <UsersRound />
                </i>
                <b>Family</b>
              </span>
              <span>
                <i>
                  <Baby />
                </i>
                <b>Child</b>
                <small>••••••</small>
              </span>
            </div>
          </div>

          <ul className="heirloom-privacy-promises">
            <li>
              <Star /> Invitations expire
            </li>
            <li>
              <Star /> Sharing is deliberate
            </li>
            <li>
              <Star /> Access can be revoked
            </li>
          </ul>
          <a href="#hosting">
            Read our privacy promise <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <PricingSection />

      <section className="heirloom-hosting" id="hosting">
        <header data-motion="hosting-heading">
          <Star />
          <p>One application</p>
          <h2>Use our home, or run your own.</h2>
        </header>

        <div className="heirloom-hosting-halves">
          <article className="heirloom-hosted" data-motion="hosting-left">
            <h3>Hosted</h3>
            <div className="heirloom-rule">
              <i />
              <Star />
              <i />
            </div>
            <p>We handle setup, updates, and storage.</p>
            <div className="heirloom-stack-wrap">
              <img
                src="/marketing/objects/archive-stack-v2.png"
                alt="A bundle of family archive documents tied with a green ribbon"
                width="1537"
                height="1023"
                loading="lazy"
              />
              <span>
                <Star /> EVERLITTLE
                <small>
                  ARCHIVE
                  <br />
                  EST. 2026
                </small>
              </span>
            </div>
            <a href="/sign-up">
              Create your archive <Star />
            </a>
            <ul>
              <li>
                <Cloud /> No server management
              </li>
              <li>
                <ServerCog /> Automatic updates
              </li>
              <li>
                <Database /> Point-in-time recovery
              </li>
              <li>
                <ShieldCheck /> Secure by default
              </li>
            </ul>
          </article>

          <article className="heirloom-self-hosted" data-motion="hosting-right">
            <h3>Self-hosted</h3>
            <div className="heirloom-rule">
              <i />
              <Star />
              <i />
            </div>
            <p>Keep Everlittle in infrastructure you control.</p>
            <div className="heirloom-infra" aria-label="Self-hosted architecture">
              <b>
                EVERLITTLE
                <br />
                APPLICATION
              </b>
              <i />
              <strong>
                <Star /> CLOUDFLARE WORKERS
              </strong>
              <div>
                <span>
                  <Database />
                  D1<small>SQLite</small>
                </span>
                <span>
                  <Boxes />
                  R2<small>Object storage</small>
                </span>
                <span>
                  <Code2 />
                  WORKER<small>Background jobs</small>
                </span>
              </div>
            </div>
            <a href="https://github.com/Kuntash/everlittle">
              View the source <ArrowRight size={17} />
            </a>
            <ul>
              <li>
                <KeyRound /> Full data ownership
              </li>
              <li>
                <ServerCog /> Your infrastructure
              </li>
              <li>
                <Code2 /> Transparent and open
              </li>
              <li>
                <Globe2 /> Deploy anywhere
              </li>
            </ul>
          </article>
        </div>
        <p className="heirloom-same-code">
          <Star /> The same Everlittle code, in either home.
        </p>
      </section>

      <section className="heirloom-closing">
        <img
          src="/marketing/family-album.jpg"
          alt="A family holding onto their shared memories"
          width="1536"
          height="1024"
          loading="lazy"
        />
        <div data-motion="closing-copy">
          <Star />
          <h2>Begin with one memory.</h2>
          <p>The ordinary moments are often the ones they’ll want most.</p>
          <a href="/sign-up">
            Create your archive <ArrowRight />
          </a>
        </div>
      </section>

      <footer className="heirloom-footer">
        <Brand compact />
        <p>A private place for the memories they’ll grow into.</p>
        <nav aria-label="Footer navigation">
          <a href="/sign-in">Sign in</a>
          <i />
          <a href="/pricing">Pricing</a>
          <i />
          <a href="#hosting">Self-host</a>
          <i />
          <a href="#privacy">Privacy</a>
        </nav>
      </footer>
    </main>
  );
}
