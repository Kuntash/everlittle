import { createFileRoute } from "@tanstack/react-router";
import {
  Archive,
  ArrowRight,
  BookHeart,
  CalendarDays,
  Camera,
  Heart,
  Home,
  Image,
  KeyRound,
  LockKeyhole,
  Mic,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/")({ component: Everlittle });

type PlatformState = { needsSetup: boolean };
type View = "parent" | "child";

function Everlittle() {
  const session = authClient.useSession();
  const [platform, setPlatform] = useState<PlatformState | null>(null);

  useEffect(() => {
    void fetch("/api/platform")
      .then((response) => response.json() as Promise<PlatformState>)
      .then(setPlatform);
  }, []);

  if (session.isPending || !platform) return <Loading />;
  if (!session.data?.user) return <AccessScreen needsSetup={platform.needsSetup} />;

  return <ArchiveApp name={session.data.user.name} />;
}

function Loading() {
  return (
    <main className="loading-shell">
      <Brand />
      <span className="loading-dot" aria-label="Loading" />
    </main>
  );
}

function AccessScreen({ needsSetup }: { needsSetup: boolean }) {
  const [mode, setMode] = useState<"sign-in" | "setup">(needsSetup ? "setup" : "sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const result =
      mode === "setup"
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password });

    if (result.error) {
      setError(result.error.message ?? "We could not open your archive.");
      setSubmitting(false);
      return;
    }

    window.location.reload();
  }

  return (
    <main className="access-shell">
      <section className="access-story" aria-labelledby="access-heading">
        <Brand />
        <div className="story-copy">
          <p className="eyebrow">Private family archive</p>
          <h1 id="access-heading">A place for the memories they’ll grow into.</h1>
          <p>
            Keep the photographs, voices, ordinary afternoons, and future letters that make a
            childhood feel whole.
          </p>
        </div>
        <div className="trust-row">
          <span>
            <ShieldCheck size={17} /> Private by default
          </span>
          <span>
            <Archive size={17} /> Your family owns its story
          </span>
        </div>
      </section>

      <section className="access-panel">
        <div className="access-card">
          <div className="access-icon">
            <LockKeyhole size={22} />
          </div>
          <p className="eyebrow">{mode === "setup" ? "Begin your archive" : "Welcome back"}</p>
          <h2>
            {mode === "setup" ? "Create your family’s private place" : "Your memories are waiting"}
          </h2>
          <p className="card-intro">
            {mode === "setup"
              ? "The first account becomes the archive owner. You can invite family later."
              : "Sign in to return to your family archive."}
          </p>

          <form onSubmit={submit}>
            {mode === "setup" ? (
              <label>
                Your name
                <input
                  autoComplete="name"
                  onChange={(event) => setName(event.target.value)}
                  required
                  value={name}
                />
              </label>
            ) : null}
            <label>
              Email address
              <input
                autoComplete="email"
                inputMode="email"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </label>
            <label>
              Password
              <input
                autoComplete={mode === "setup" ? "new-password" : "current-password"}
                minLength={10}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
              {mode === "setup" ? <small>At least 10 characters</small> : null}
            </label>

            {error ? (
              <p className="form-error" role="alert">
                {error}
              </p>
            ) : null}
            <button className="primary-button" disabled={submitting} type="submit">
              {submitting ? "Opening…" : mode === "setup" ? "Begin our story" : "Enter Everlittle"}
              <ArrowRight size={18} />
            </button>
          </form>

          {!needsSetup ? (
            <button
              className="text-button"
              onClick={() => setMode(mode === "setup" ? "sign-in" : "setup")}
              type="button"
            >
              {mode === "setup" ? "I already have an account" : "Set up a new archive"}
            </button>
          ) : null}
          <p className="privacy-note">
            <KeyRound size={14} /> Powered by Better Auth
          </p>
        </div>
      </section>
    </main>
  );
}

function ArchiveApp({ name }: { name: string }) {
  const [view, setView] = useState<View>("parent");

  return (
    <main className="app-shell">
      <header className="app-header">
        <Brand compact />
        <div className="view-switch" aria-label="Preview archive view">
          <button className={view === "parent" ? "active" : ""} onClick={() => setView("parent")}>
            Parent
          </button>
          <button className={view === "child" ? "active" : ""} onClick={() => setView("child")}>
            Child
          </button>
        </div>
      </header>
      {view === "parent" ? <ParentView name={name} /> : <ChildView />}
    </main>
  );
}

function ParentView({ name }: { name: string }) {
  return (
    <div className="archive-layout">
      <section className="archive-main">
        <p className="eyebrow">Good morning, {name}</p>
        <div className="page-title-row">
          <div>
            <h1>Mila’s story</h1>
            <p>8 months, 12 days · 42 memories</p>
          </div>
          <button className="round-action" aria-label="Add memory">
            <Plus />
          </button>
        </div>

        <article className="featured-memory">
          <div className="memory-photo monsoon">
            <span>August 5, 2026</span>
          </div>
          <div className="memory-copy">
            <p className="eyebrow">On this day</p>
            <h2>Your first monsoon</h2>
            <p>You pressed your tiny hands to the window and watched the rain arrive.</p>
            <span className="byline">From Papa · Voice note 0:38</span>
          </div>
        </article>

        <div className="section-heading">
          <h2>Recent memories</h2>
          <button>See timeline</button>
        </div>
        <div className="memory-list">
          <MemoryRow icon={<Camera />} title="Morning giggles" meta="Today · Photo" />
          <MemoryRow icon={<Mic />} title="Bath time stories" meta="Yesterday · Voice" />
          <MemoryRow icon={<BookHeart />} title="To my little adventurer" meta="July 31 · Letter" />
        </div>
      </section>

      <aside className="archive-side">
        <p className="eyebrow">Quick capture</p>
        <h2>What happened today?</h2>
        <div className="capture-grid">
          <button>
            <Camera /> Photo
          </button>
          <button>
            <BookHeart /> Story
          </button>
          <button>
            <Mic /> Voice
          </button>
          <button>
            <Sparkles /> Milestone
          </button>
        </div>
        <div className="capsule-card">
          <span className="capsule-seal">
            <Sparkles />
          </span>
          <p className="eyebrow">Future capsule</p>
          <h3>For when you’re 18</h3>
          <p>6 notes · opens May 14, 2044</p>
          <button>
            Add a note <ArrowRight size={16} />
          </button>
        </div>
      </aside>
      <MobileNav />
    </div>
  );
}

function ChildView() {
  return (
    <div className="child-view">
      <section className="child-hero">
        <p className="eyebrow">This story is yours</p>
        <h1>Hi, Mila.</h1>
        <p>Here are the moments your family kept for you.</p>
        <div className="child-actions">
          <button className="primary-button">
            Start with today <ArrowRight size={18} />
          </button>
          <button className="soft-button">
            <CalendarDays size={18} /> Explore my timeline
          </button>
        </div>
      </section>
      <section className="child-grid">
        <article className="story-card large">
          <div className="memory-photo monsoon" />
          <p className="eyebrow">A memory from Papa</p>
          <h2>Your first monsoon</h2>
          <button className="listen-button">
            <Mic size={18} /> Listen to the story · 0:38
          </button>
        </article>
        <article className="story-card letter-card">
          <span className="capsule-seal">
            <Sparkles />
          </span>
          <p className="eyebrow">Unlocked for you</p>
          <h2>For your twelfth birthday</h2>
          <p>A letter from Mama, written eleven years ago.</p>
          <button>
            Open the letter <ArrowRight size={16} />
          </button>
        </article>
        <article className="story-card voices-card">
          <Users />
          <p className="eyebrow">Family voices</p>
          <h2>People who love you</h2>
          <p>Stories from Mama, Papa, Aama, and your family.</p>
        </article>
      </section>
    </div>
  );
}

function MemoryRow({ icon, title, meta }: { icon: React.ReactNode; title: string; meta: string }) {
  return (
    <article className="memory-row">
      <span>{icon}</span>
      <div>
        <h3>{title}</h3>
        <p>{meta}</p>
      </div>
      <Heart size={18} />
    </article>
  );
}

function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Primary">
      <button className="active">
        <Home />
        Home
      </button>
      <button>
        <Image />
        Timeline
      </button>
      <button>
        <BookHeart />
        Capsules
      </button>
      <button>
        <Users />
        Family
      </button>
    </nav>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? "compact" : ""}`}>
      <span className="brand-mark" aria-hidden="true">
        <Sparkles size={14} />
        <span />
      </span>
      <div>
        <strong>Everlittle</strong>
        {compact ? null : <small>A place for the memories they’ll grow into.</small>}
      </div>
    </div>
  );
}
