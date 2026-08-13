import {
  ArrowRight,
  BookHeart,
  Camera,
  Cloud,
  FileAudio,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { Brand } from "@/components/brand";

export function MarketingHome() {
  return (
    <main className="marketing-shell">
      <nav className="marketing-nav" aria-label="Main navigation">
        <a href="/" aria-label="Everlittle home">
          <Brand compact />
        </a>
        <div className="marketing-nav-links">
          <a href="#what-you-keep">What you keep</a>
          <a href="#privacy">Privacy</a>
          <a href="#self-host">Self-host</a>
        </div>
        <div className="marketing-nav-actions">
          <a className="marketing-sign-in" href="/sign-in">
            Sign in
          </a>
          <a className="marketing-button" href="/sign-up">
            Create your archive
          </a>
        </div>
      </nav>

      <section className="marketing-hero">
        <div className="marketing-hero-copy">
          <p className="marketing-eyebrow">A private family archive</p>
          <h1>Keep the little things.</h1>
          <p>Save the photographs, voices, stories, and letters they’ll grow into.</p>
          <div className="marketing-hero-actions">
            <a className="marketing-button" href="/sign-up">
              Create your archive <ArrowRight size={18} />
            </a>
            <a className="marketing-text-link" href="#what-you-keep">
              See what belongs here
            </a>
          </div>
        </div>
        <figure className="marketing-hero-visual">
          <img
            alt="A child, parent, and grandparent looking through a family photo album together"
            fetchPriority="high"
            height="1024"
            src="/marketing/family-album.jpg"
            width="1536"
          />
        </figure>
      </section>

      <section className="marketing-promises" aria-label="Everlittle principles">
        <span>
          <LockKeyhole size={18} /> Private by default
        </span>
        <span>
          <ShieldCheck size={18} /> Shared only by your family
        </span>
        <span>
          <Cloud size={18} /> Hosted or self-hosted
        </span>
      </section>

      <section className="marketing-keeps" id="what-you-keep">
        <div className="marketing-section-heading">
          <h2>Childhood is more than a camera roll.</h2>
          <p>
            Keep the sound of their voice, the story behind the photograph, and words meant for a
            future day.
          </p>
        </div>
        <div className="marketing-keeps-grid">
          <article className="marketing-keeps-primary">
            <Camera size={25} />
            <h3>Memories with context</h3>
            <p>
              Add the date, the story, and who was there. A photograph becomes something they can
              return to.
            </p>
          </article>
          <article>
            <FileAudio size={23} />
            <h3>Voices worth keeping</h3>
            <p>Save a laugh, a bedtime song, or a message in the voices they know.</p>
          </article>
          <article>
            <BookHeart size={23} />
            <h3>Time capsules for later</h3>
            <p>Seal letters that open when the moment is right.</p>
          </article>
        </div>
      </section>

      <section className="marketing-privacy" id="privacy">
        <div className="marketing-privacy-image">
          <img
            alt="A parent quietly recording a voice memory beside a resting child"
            height="1152"
            loading="lazy"
            src="/marketing/voice-memory.jpg"
            width="1536"
          />
        </div>
        <div className="marketing-privacy-copy">
          <p className="marketing-eyebrow">Made for private lives</p>
          <h2>Your child is not the product.</h2>
          <p>
            Everlittle does not need a public profile or child email account. Adults decide who
            joins and what each person can see.
          </p>
          <div className="marketing-privacy-points">
            <span>Family invitations expire</span>
            <span>Child access uses a parent-managed PIN</span>
            <span>Public links are deliberate and revocable</span>
          </div>
        </div>
      </section>

      <section className="marketing-self-host" id="self-host">
        <div>
          <h2>Use our home, or run your own.</h2>
          <p>
            Get Everlittle is the hosted service. The same application can also run in your own
            Cloudflare account.
          </p>
        </div>
        <div className="marketing-hosting-choice">
          <article>
            <strong>Hosted</strong>
            <p>We handle setup, updates, and storage so your family can begin right away.</p>
            <a href="/sign-up">
              Create your archive <ArrowRight size={16} />
            </a>
          </article>
          <article>
            <strong>Self-hosted</strong>
            <p>Keep the application and its data inside infrastructure that you control.</p>
            <a href="https://github.com/Kuntash/everlittle">
              View the source <ArrowRight size={16} />
            </a>
          </article>
        </div>
      </section>

      <section className="marketing-final-cta">
        <h2>Begin with one memory.</h2>
        <p>The ordinary moments are often the ones they’ll want most.</p>
        <a className="marketing-button" href="/sign-up">
          Create your archive <ArrowRight size={18} />
        </a>
      </section>

      <footer className="marketing-footer">
        <Brand compact />
        <p>A private place for the memories they’ll grow into.</p>
        <div>
          <a href="/sign-in">Sign in</a>
          <a href="#self-host">Self-host</a>
        </div>
      </footer>
    </main>
  );
}
