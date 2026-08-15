import {
  ArrowRight,
  BookOpen,
  Cloud,
  Code2,
  KeyRound,
  LockKeyhole,
  Play,
  ShieldCheck,
} from "lucide-react";

import { Brand } from "@/components/brand";

const waveform = [
  12, 24, 17, 34, 21, 42, 28, 16, 37, 49, 23, 31, 44, 18, 29, 38, 22, 14, 30, 46, 25, 35, 20, 41,
  27, 16, 32, 24,
];

function StarMark() {
  return <span aria-hidden="true">✦</span>;
}

export function MarketingHome() {
  return (
    <main className="atelier-shell">
      <nav className="atelier-nav" aria-label="Main navigation">
        <a className="atelier-home" href="/" aria-label="Everlittle home">
          <Brand compact />
        </a>
        <span className="atelier-nav-index">PRIVATE FAMILY ARCHIVE</span>
        <div className="atelier-nav-links">
          <a href="#keeps">What you keep</a>
          <a href="#privacy">Privacy</a>
          <a href="#hosting">Self-host</a>
          <a href="/sign-in">Sign in</a>
          <a className="atelier-nav-cta" href="/sign-up">
            Begin your archive
          </a>
        </div>
      </nav>

      <section className="atelier-hero">
        <img
          className="atelier-hero-image"
          src="/marketing/family-album.jpg"
          alt="A child, parent, and grandparent looking through a family album"
          width="1536"
          height="1024"
          fetchPriority="high"
        />
        <div className="atelier-hero-wash" />
        <p className="atelier-hero-index">
          <span>EST. 2026</span>
          <span>Owned by your family</span>
        </p>
        <div className="atelier-hero-copy">
          <p className="atelier-kicker">A living family archive</p>
          <h1>
            Keep the <em>little</em> things.
          </h1>
          <p className="atelier-hero-intro">
            Photographs, voices, stories, and letters they'll grow into.
          </p>
          <div className="atelier-actions">
            <a className="atelier-button" href="/sign-up">
              Create your archive <ArrowRight size={18} />
            </a>
            <a className="atelier-underlink" href="#keeps">
              See what belongs here
            </a>
          </div>
        </div>
        <p className="atelier-hero-caption">Three generations, one quiet place to remember.</p>
      </section>

      <section className="atelier-principles" aria-label="Everlittle principles">
        <span>
          <LockKeyhole size={16} />
        </span>
        <p>Private by default</p>
        <span>
          <ShieldCheck size={16} />
        </span>
        <p>Shared only by your family</p>
        <span>
          <Cloud size={16} />
        </span>
        <p>Hosted or self-hosted</p>
      </section>

      <section className="atelier-keeps" id="keeps">
        <header className="atelier-section-lead">
          <p className="atelier-kicker">What you keep</p>
          <h2>Childhood is more than a camera roll.</h2>
          <p>
            Keep the sound of their voice, the story behind the photograph, and words meant for a
            future day.
          </p>
        </header>

        <div className="atelier-artifacts">
          <figure className="atelier-photo-artifact">
            <img
              src="/marketing/family-album.jpg"
              alt="A family sharing stories over an album"
              width="1536"
              height="1024"
              loading="lazy"
            />
            <figcaption>
              <span>01</span>
              <strong>A photograph, with its story</strong>
              <small>Faces, places, dates, and the people who were there</small>
            </figcaption>
          </figure>

          <article className="atelier-voice-artifact">
            <span className="atelier-artifact-number">02</span>
            <p className="atelier-kicker">Voice memory</p>
            <h3>Their voice, exactly as it was.</h3>
            <p>Save a laugh, a bedtime song, or a message in the voices they know.</p>
            <div className="atelier-waveform" aria-label="Voice memory preview">
              <button type="button" aria-label="Play voice memory">
                <Play size={15} fill="currentColor" />
              </button>
              <div aria-hidden="true">
                {waveform.map((height, index) => (
                  <i key={`${height}-${index}`} style={{ height }} />
                ))}
              </div>
            </div>
          </article>

          <article className="atelier-letter-artifact">
            <span className="atelier-artifact-number">03</span>
            <div className="atelier-seal">
              <BookOpen size={24} />
            </div>
            <p className="atelier-kicker">Time capsule</p>
            <h3>A letter for later.</h3>
            <p>Seal words that open when the moment is right.</p>
            <small>TO BE OPENED ON THEIR 18TH BIRTHDAY</small>
          </article>
        </div>
      </section>

      <section className="atelier-product">
        <div className="atelier-product-copy">
          <p className="atelier-kicker">The archive</p>
          <h2>Every memory keeps its context.</h2>
          <p>
            Not a feed. A quiet, chronological home for the people and moments that made your
            family.
          </p>
          <a className="atelier-underlink atelier-underlink-light" href="/sign-up">
            Start with one memory <ArrowRight size={16} />
          </a>
        </div>

        <div
          className="atelier-product-stage"
          aria-label="A preview of the Everlittle family archive"
        >
          <aside className="atelier-product-sidebar">
            <Brand compact />
            <span className="is-active">Timeline</span>
            <span>Memories</span>
            <span>Capsules</span>
            <span>Family</span>
          </aside>
          <article className="atelier-product-timeline">
            <small>PEMA'S STORY · 14 MAY 2026</small>
            <h3>A rainy afternoon together</h3>
            <p>We stayed out longer than planned and came home soaked and laughing.</p>
            <div className="atelier-product-meta">
              <span>KEPT BY MAMA</span>
              <span>FAMILY</span>
            </div>
          </article>
          <img
            src="/marketing/voice-memory.jpg"
            alt="A parent recording a family voice memory"
            width="1536"
            height="1152"
            loading="lazy"
          />
          <div className="atelier-product-audio">
            <span>
              <Play size={13} fill="currentColor" />
            </span>
            <div>
              <small>MAMA'S VOICE</small>
              <b>Bedtime story · 01:28</b>
            </div>
          </div>
          <div className="atelier-product-capsule">
            <StarMark />
            <small>SEALED FOR LATER</small>
            <strong>For the person you become.</strong>
          </div>
        </div>
      </section>

      <section className="atelier-privacy" id="privacy">
        <div className="atelier-privacy-image">
          <img
            src="/marketing/voice-memory.jpg"
            alt="A parent saving a quiet memory beside a resting child"
            width="1536"
            height="1152"
            loading="lazy"
          />
          <span>PRIVATE LIVES · KEPT PRIVATE</span>
        </div>
        <div className="atelier-privacy-copy">
          <p className="atelier-kicker">Your family decides</p>
          <h2>Your child is not the product.</h2>
          <p>
            There is no public profile, no child email account, and no attention-hungry feed. Adults
            decide who joins and what each person can see.
          </p>
          <ol>
            <li>
              <span>01</span>
              <div>
                <strong>Family invitations expire</strong>
                <p>Adults invite trusted people, and access stays deliberate.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Child access is parent-managed</strong>
                <p>A simple PIN can unlock a child-friendly view without requiring email.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Public links are intentional</strong>
                <p>Shared memories are explicit and revocable.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="atelier-hosting" id="hosting">
        <header>
          <p className="atelier-kicker">One application</p>
          <h2>Use our home, or run your own.</h2>
        </header>
        <div className="atelier-hosting-grid">
          <article className="atelier-hosted">
            <span>HOSTED</span>
            <h3>Hosted</h3>
            <p>We handle setup, updates, and storage so your family can begin right away.</p>
            <a href="/sign-up">
              Create your archive <ArrowRight size={18} />
            </a>
          </article>
          <article className="atelier-self-hosted">
            <span>SELF-HOSTED</span>
            <h3>Self-hosted</h3>
            <p>Keep Everlittle and its data inside infrastructure you control.</p>
            <a href="https://github.com/Kuntash/everlittle">
              View the source <ArrowRight size={18} />
            </a>
          </article>
        </div>
        <p className="atelier-hosting-note">
          <Code2 size={15} /> Same codebase, two ways to run it.
        </p>
      </section>

      <section className="atelier-closing">
        <img
          src="/marketing/family-album.jpg"
          alt="Three generations sharing a family album"
          width="1536"
          height="1024"
          loading="lazy"
        />
        <div>
          <KeyRound size={28} />
          <h2>Begin with one memory.</h2>
          <p>The ordinary moments are often the ones they'll want most.</p>
          <a className="atelier-button atelier-button-light" href="/sign-up">
            Create your archive <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <footer className="atelier-footer">
        <Brand compact />
        <p>A private place for the memories they'll grow into.</p>
        <div>
          <a href="/sign-in">Sign in</a>
          <a href="#hosting">Self-host</a>
          <a href="#privacy">Privacy</a>
        </div>
      </footer>
    </main>
  );
}
