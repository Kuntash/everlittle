import {
  ArrowRight,
  BookHeart,
  Camera,
  Check,
  ChevronRight,
  Heart,
  LockKeyhole,
  Mic2,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { Brand } from "@/components/brand";
import { seoLandingPages } from "@/lib/seo-pages";
import type { SeoLandingPageContent } from "@/lib/seo-pages";

export function SeoLandingPage({ page }: { page: SeoLandingPageContent }) {
  return (
    <main className="seo-story-page">
      <header className="seo-story-hero">
        <MarketingNav />
        <div className="seo-story-hero-layout">
          <div className="seo-story-hero-copy">
            <p className="seo-story-eyebrow">
              <Heart fill="currentColor" aria-hidden="true" /> {page.eyebrow}
            </p>
            <h1>{page.title}</h1>
            <p className="seo-story-introduction">{page.introduction}</p>
            <div className="seo-story-actions">
              <a className="seo-story-button seo-story-button-primary" href="/sign-up">
                Start your family archive <ArrowRight aria-hidden="true" />
              </a>
              <a className="seo-story-button seo-story-button-secondary" href="#how-it-works">
                See how to begin
              </a>
            </div>
            <p className="seo-story-promise">
              <ShieldCheck aria-hidden="true" /> {page.promise}
            </p>
          </div>

          <div className="seo-story-visual" aria-label={page.visualTitle}>
            <span className="seo-story-orbit" aria-hidden="true" />
            <figure className="seo-story-photo">
              <span className="seo-story-tape" aria-hidden="true" />
              <img
                src="/marketing/family-album.jpg"
                alt="A family keeping photographs and stories together"
                width="1536"
                height="1024"
                fetchPriority="high"
              />
            </figure>
            <article className="seo-story-memory-card">
              <small>{page.visualLabel}</small>
              <h2>{page.visualTitle}</h2>
              <p>{page.visualNote}</p>
            </article>
            <article className="seo-story-voice-card" aria-label="Voice memory">
              <span>
                <Mic2 aria-hidden="true" />
              </span>
              <p>
                <b>A voice worth keeping</b>
                <small>Recorded by someone who was there</small>
              </p>
              <i aria-hidden="true" />
              <i aria-hidden="true" />
              <i aria-hidden="true" />
              <i aria-hidden="true" />
              <i aria-hidden="true" />
            </article>
          </div>
        </div>
      </header>

      <aside className="seo-story-trust" aria-label="Everlittle principles">
        <span>
          <LockKeyhole aria-hidden="true" /> Private by default
        </span>
        <span>
          <UsersRound aria-hidden="true" /> Made together
        </span>
        <span>
          <BookHeart aria-hidden="true" /> Built for a lifetime
        </span>
      </aside>

      <section className="seo-story-problem">
        <div>
          <p className="seo-story-eyebrow">Why families need a better place</p>
          <h2>{page.problemTitle}</h2>
        </div>
        <p>{page.problemBody}</p>
      </section>

      <section className="seo-story-benefits" aria-labelledby="benefits-title">
        <header>
          <p className="seo-story-eyebrow">What Everlittle changes</p>
          <h2 id="benefits-title">Keep the memory and everything that makes it yours.</h2>
        </header>
        <div className="seo-story-benefit-grid">
          {page.benefits.map((benefit, index) => (
            <article key={benefit.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {index === 0 ? (
                <Camera aria-hidden="true" />
              ) : index === 1 ? (
                <Mic2 aria-hidden="true" />
              ) : (
                <UsersRound aria-hidden="true" />
              )}
              <h3>{benefit.title}</h3>
              <p>{benefit.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="seo-story-guide" id="how-it-works">
        <div className="seo-story-guide-intro">
          <p className="seo-story-eyebrow">{page.guideEyebrow}</p>
          <h2>{page.guideTitle}</h2>
          <p>{page.guideIntroduction}</p>
          <a href="/sign-up">
            Begin with one memory <ArrowRight aria-hidden="true" />
          </a>
        </div>
        <ol className="seo-story-guide-steps">
          {page.guideItems.map((item, index) => (
            <li key={item.title}>
              <span>{index + 1}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="seo-story-keepsake">
        <div className="seo-story-keepsake-object" aria-hidden="true">
          <span className="seo-story-keepsake-sun" />
          <img
            src="/marketing/objects/archive-stack-v2.png"
            alt=""
            width="1454"
            height="1080"
            loading="lazy"
          />
          <span className="seo-story-keepsake-label">KEEP THIS ONE ♡</span>
        </div>
        <div className="seo-story-keepsake-copy">
          <p className="seo-story-eyebrow">
            <Sparkles aria-hidden="true" /> Ideas for your archive
          </p>
          <h2>{page.keepsakeTitle}</h2>
          <p>{page.keepsakeBody}</p>
          <ul>
            {page.keepsakeIdeas.map((idea) => (
              <li key={idea}>
                <Check aria-hidden="true" /> {idea}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="seo-story-faq">
        <header>
          <p className="seo-story-eyebrow">Questions families ask</p>
          <h2>A few useful answers before you begin.</h2>
        </header>
        <div>
          {page.faq.map((item) => (
            <details key={item.question}>
              <summary>
                {item.question} <span aria-hidden="true">+</span>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="seo-story-related" aria-labelledby="related-title">
        <div>
          <p className="seo-story-eyebrow">Keep exploring</p>
          <h2 id="related-title">More ways to preserve a family story.</h2>
        </div>
        <nav aria-label="Related family memory guides">
          {page.related.map((path) => {
            const related = seoLandingPages[path];
            return (
              <a href={related.path} key={related.path}>
                <span>{related.navLabel}</span>
                <ChevronRight aria-hidden="true" />
              </a>
            );
          })}
        </nav>
      </section>

      <section className="seo-story-closing">
        <LockKeyhole aria-hidden="true" />
        <p>Private family memories, kept with care.</p>
        <h2>The story does not have to be complete before it is worth keeping.</h2>
        <a href="/sign-up">
          Start with one memory <ArrowRight aria-hidden="true" />
        </a>
        <small>Begin free · No card required · Invite the whole family</small>
      </section>

      <MarketingFooter />
    </main>
  );
}

function MarketingNav() {
  return (
    <nav className="seo-story-nav" aria-label="Main navigation">
      <a href="/" aria-label="Everlittle home">
        <Brand compact />
      </a>
      <div>
        <a href="/family-memory-app">How it works</a>
        <a href="/pricing">Pricing</a>
        <a href="/sign-in">Sign in</a>
        <a className="seo-story-nav-cta" href="/sign-up">
          Start our archive
        </a>
      </div>
    </nav>
  );
}

function MarketingFooter() {
  return (
    <footer className="seo-story-footer">
      <div>
        <a href="/" aria-label="Everlittle home">
          <Brand compact />
        </a>
        <p>Made for the people who know the whole story.</p>
      </div>
      <nav aria-label="Family memory guides">
        <strong>Explore</strong>
        {Object.values(seoLandingPages).map((page) => (
          <a href={page.path} key={page.path}>
            {page.navLabel}
          </a>
        ))}
      </nav>
      <nav aria-label="Everlittle links">
        <strong>Everlittle</strong>
        <a href="/pricing">Pricing</a>
        <a href="/sign-in">Sign in</a>
        <a href="https://github.com/Kuntash/everlittle">Open source</a>
      </nav>
    </footer>
  );
}
