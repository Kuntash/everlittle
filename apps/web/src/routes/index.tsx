import { createFileRoute } from "@tanstack/react-router";
import { usePostHog } from "@posthog/react";
import {
  Archive,
  ArrowRight,
  Baby,
  BookHeart,
  CalendarDays,
  Camera,
  Check,
  Copy,
  Crown,
  FileAudio,
  Heart,
  HardDrive,
  Home,
  Image,
  LockKeyhole,
  LogOut,
  Plus,
  PenLine,
  PlayCircle,
  Pause,
  Share2,
  Maximize2,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserPlus,
  Users,
  Video,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import { Brand } from "@/components/brand";
import { resolveArchiveEntry } from "@/lib/archive-navigation";
import { authClient } from "@/lib/auth-client";
import { isExistingAccountError } from "@/lib/auth-feedback";
import { ScrapbookHome } from "@/components/scrapbook-home";

export const Route = createFileRoute("/")({
  component: Everlittle,
  head: () => ({
    links: [{ href: "/", rel: "canonical" }],
    meta: [
      { title: "Everlittle — Memories to grow into" },
      {
        name: "description",
        content:
          "A private family archive for photographs, voices, everyday stories, and letters for the future.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Everlittle — Memories to grow into" },
      {
        property: "og:description",
        content: "Keep the little things in a private family archive your child can grow into.",
      },
      { property: "og:image", content: "/marketing/family-album.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index,follow" },
    ],
  }),
});

export type PlatformState = {
  allowsPublicSignup: boolean;
  defaultArchiveSlug: string | null;
  deploymentMode: "hosted" | "self-hosted";
  needsSetup: boolean;
  childAccess: {
    displayName: string;
    childSlug: string;
    familySlug: string;
    enabled: boolean;
  } | null;
};
type ChildSession = { signedIn: boolean; child?: { displayName: string } };
export type InvitationPreview = {
  archiveName: string;
  email: string;
  role: FamilyRole;
  expiresAt: string;
  inviterName: string;
};
type FamilyRole = "owner" | "parent" | "contributor" | "viewer";
type Member = {
  id: string;
  userId: string;
  role: FamilyRole;
  joinedAt: string;
  name: string;
  email: string;
  image?: string | null;
};
type Child = {
  id: string;
  slug: string;
  displayName: string;
  birthDate: string;
  avatarAssetKey?: string | null;
  childAccessEnabled?: 0 | 1;
  childLastAccessAt?: string | null;
  childActiveDeviceCount?: number;
  profileKind?: "child" | "vault";
};
type MemoryKind = "photo" | "story" | "voice" | "video" | "milestone" | "letter";
type Memory = {
  id: string;
  childId: string;
  kind: MemoryKind;
  title: string;
  body: string | null;
  happenedAt: string;
  audience: "parents" | "family" | "child" | "all";
  createdAt: string;
  createdByUserId: string | null;
  authorName: string | null;
  mediaId: string | null;
  mediaType: "image" | "audio" | "video" | null;
  contentType: string | null;
  byteSize: number | null;
};
type Capsule = {
  id: string;
  childId: string;
  title: string;
  body: string | null;
  unlocksAt: string;
  audience: "family" | "child";
  createdAt: string;
  createdByUserId: string | null;
  authorName: string | null;
  locked: 0 | 1;
};
type PendingInvitation = {
  id: string;
  email: string;
  role: Exclude<FamilyRole, "owner">;
  expiresAt: string;
  createdAt: string;
  emailStatus: "not_sent" | "sent" | "failed";
  emailSentAt: string | null;
  emailAttemptCount: number;
};
type ArchiveState = {
  archive: { id: string; name: string; slug: string; timezone: string; createdAt: string };
  currentMember: { id: string; role: FamilyRole; userId: string };
  members: Member[];
  children: Child[];
  memories: Memory[];
  capsules: Capsule[];
  invitations: PendingInvitation[];
  billing: {
    plan: "family" | "self-hosted";
    status: "active" | "canceled" | "complimentary" | "past_due" | "trialing";
    usedBytes: number;
    limitBytes: number | null;
    trialEndsAt: string | null;
    currentPeriodEndsAt: string | null;
    interval: "monthly" | "yearly" | null;
    cancelAtPeriodEnd: boolean;
    checkoutAvailable: boolean;
    canManage: boolean;
    canCreateContent: boolean;
    environment: "test_mode" | "live_mode" | null;
  };
};
type ArchiveMembership = {
  id: string;
  name: string;
  slug: string;
  role: FamilyRole;
};
type View = "parent" | "timeline" | "capsules" | "child" | "family";

export function Everlittle() {
  const session = authClient.useSession();
  const [platform, setPlatform] = useState<PlatformState | null>(null);
  const [childSession, setChildSession] = useState<ChildSession | null>(null);
  const [invitation, setInvitation] = useState<InvitationPreview | null>(null);
  const [invitationChecked, setInvitationChecked] = useState(false);
  const inviteToken =
    typeof window === "undefined" ? "" : (new URLSearchParams(location.search).get("invite") ?? "");
  const childModeRequested =
    typeof window !== "undefined" && new URLSearchParams(location.search).get("child") === "1";

  useEffect(() => {
    void fetch("/api/platform")
      .then((response) => response.json() as Promise<PlatformState>)
      .then(setPlatform);
  }, []);

  useEffect(() => {
    void fetch("/api/child/session")
      .then((response) => response.json() as Promise<ChildSession>)
      .then(setChildSession);
  }, []);

  useEffect(() => {
    if (!inviteToken) {
      setInvitationChecked(true);
      return;
    }
    void fetch(`/api/invitations/preview?token=${encodeURIComponent(inviteToken)}`)
      .then(async (response) =>
        response.ok ? ((await response.json()) as InvitationPreview) : null,
      )
      .then(setInvitation)
      .finally(() => setInvitationChecked(true));
  }, [inviteToken]);

  if (session.isPending || !platform || !childSession || !invitationChecked) return <Loading />;
  if (platform.deploymentMode === "hosted" && !session.data?.user && currentFamilySlug()) {
    const destination = `${location.pathname}${location.search}`;
    location.replace(`/sign-in?redirect=${encodeURIComponent(destination)}`);
    return <Loading />;
  }
  if (platform.deploymentMode === "hosted" && !session.data?.user && !inviteToken) {
    return <ScrapbookHome />;
  }
  if (childModeRequested && platform.childAccess?.enabled) {
    location.replace(
      `/${encodeURIComponent(platform.childAccess.familySlug)}/kids/${encodeURIComponent(platform.childAccess.childSlug)}`,
    );
    return <Loading />;
  }
  if (!session.data?.user) {
    if (childSession.signedIn) return <ChildArchiveApp />;
    return (
      <AccessScreen
        childAccess={platform.childAccess}
        invitation={invitation}
        inviteToken={inviteToken}
        needsSetup={platform.needsSetup}
        allowsPublicSignup={platform.allowsPublicSignup}
      />
    );
  }
  if (invitation) {
    return <InvitationAcceptance invitation={invitation} token={inviteToken} />;
  }

  if (!currentFamilySlug()) {
    return (
      <ArchiveRedirect
        defaultArchiveSlug={platform.defaultArchiveSlug}
        deploymentMode={platform.deploymentMode}
      />
    );
  }

  return <ArchiveApp name={session.data.user.name} />;
}

function ArchiveRedirect({
  defaultArchiveSlug,
  deploymentMode,
}: {
  defaultArchiveSlug: string | null;
  deploymentMode: PlatformState["deploymentMode"];
}) {
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch("/api/archives")
      .then(async (response) => {
        if (!response.ok) throw new Error(await responseError(response));
        return response.json() as Promise<{ archives: Array<{ slug: string }> }>;
      })
      .then(({ archives }) => {
        const destination = resolveArchiveEntry(archives, {
          defaultArchiveSlug,
          deploymentMode,
          rememberedArchiveSlug: localStorage.getItem("everlittle.last-family"),
        });
        if (!destination) {
          void authClient.signOut().finally(() => location.replace("/"));
          return;
        }
        location.replace(destination);
      })
      .catch((reason: Error) => setError(reason.message));
  }, [defaultArchiveSlug, deploymentMode]);

  return error ? (
    <main className="loading-shell">
      <Brand />
      <p className="form-error">{error}</p>
    </main>
  ) : (
    <Loading />
  );
}

export function Loading() {
  return (
    <main className="loading-shell">
      <Brand />
      <span className="loading-dot" aria-label="Loading" />
    </main>
  );
}

export function AccessScreen({
  allowsPublicSignup,
  childAccess,
  forceChildMode = false,
  invitation,
  initialMode,
  inviteToken,
  needsSetup,
}: {
  allowsPublicSignup: boolean;
  childAccess: PlatformState["childAccess"];
  forceChildMode?: boolean;
  invitation: InvitationPreview | null;
  initialMode?: "sign-in" | "setup";
  inviteToken: string;
  needsSetup: boolean;
}) {
  const isInvitation = Boolean(invitation && inviteToken);
  const [mode, setMode] = useState<"sign-in" | "setup">(
    initialMode ?? (needsSetup || isInvitation || allowsPublicSignup ? "setup" : "sign-in"),
  );
  const [entrance, setEntrance] = useState<"adult" | "child">(forceChildMode ? "child" : "adult");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(invitation?.email ?? "");
  const [password, setPassword] = useState("");
  const [recovering, setRecovering] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState(
    inviteToken && !invitation ? "This invitation is invalid or has expired." : "",
  );
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);

    const redirect = requestedRedirect();
    const callbackURL = isInvitation
      ? `/invite/${encodeURIComponent(inviteToken)}`
      : mode === "setup"
        ? "/onboarding"
        : redirect;

    const result =
      mode === "setup"
        ? await authClient.signUp.email(
            { callbackURL, name, email, password },
            isInvitation ? { headers: { "x-everlittle-invitation": inviteToken } } : undefined,
          )
        : await authClient.signIn.email({ callbackURL, email, password });

    if (result.error) {
      if (isExistingAccountError(result.error)) {
        setMode("sign-in");
        setPassword("");
        toast("You already have an account", {
          description: "Please sign in instead.",
        });
      } else if (result.error.code === "EMAIL_NOT_VERIFIED") {
        setNotice("Check your email for a fresh verification link before signing in.");
      } else {
        setError(result.error.message ?? "We could not open your archive.");
      }
      setSubmitting(false);
      return;
    }

    if (mode === "setup" && allowsPublicSignup) {
      setVerificationEmail(email);
      setSubmitting(false);
      return;
    }

    if (mode === "sign-in" && isInvitation) {
      const response = await apiFetch("/api/invitations/accept", {
        method: "POST",
        body: JSON.stringify({ token: inviteToken }),
      });
      if (!response.ok) {
        setError(await responseError(response));
        setSubmitting(false);
        return;
      }
    }

    window.location.assign(
      mode === "setup" && allowsPublicSignup && !isInvitation ? "/onboarding" : redirect,
    );
  }

  async function requestRecovery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);
    const response = await fetch("/api/auth/request-password-reset", {
      body: JSON.stringify({ email, redirectTo: "/reset-password" }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });
    setSubmitting(false);
    if (!response.ok) {
      setError("We could not send a recovery email. Please try again.");
      return;
    }
    setNotice("If that email belongs to an account, a private reset link is on its way.");
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
          {entrance === "child" ? (
            <>
              <p className="eyebrow">{childAccess?.displayName ?? "Your child"}’s private space</p>
              <h2>Open the story your family kept for you</h2>
              <p className="card-intro">
                Enter the six-digit family PIN. No email address or adult account is needed.
              </p>
              <form
                className="child-pin-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!childAccess) return;
                  location.assign(
                    `/${encodeURIComponent(childAccess.familySlug)}/kids/${encodeURIComponent(childAccess.childSlug)}`,
                  );
                }}
              >
                <label>
                  Family PIN
                  <input
                    autoComplete="one-time-code"
                    autoFocus
                    className="pin-input"
                    inputMode="numeric"
                    maxLength={6}
                    minLength={6}
                    onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))}
                    pattern="[0-9]{6}"
                    placeholder="••••••"
                    required
                    type="password"
                    value={pin}
                  />
                </label>
                {error ? (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                ) : null}
                <button className="primary-button" disabled={!childAccess} type="submit">
                  {submitting ? "Opening…" : "Open my story"} <ArrowRight size={18} />
                </button>
              </form>
              <button
                className="text-button"
                onClick={() => {
                  if (forceChildMode) {
                    window.location.assign("/");
                  } else {
                    setEntrance("adult");
                    setError("");
                  }
                }}
                type="button"
              >
                {forceChildMode ? "Back to the family archive" : "Back to family sign in"}
              </button>
            </>
          ) : (
            <>
              <p className="eyebrow">
                {isInvitation
                  ? `Invitation to ${invitation?.archiveName ?? "your family"}`
                  : mode === "setup"
                    ? "Begin your archive"
                    : "Welcome back"}
              </p>
              <h2>
                {isInvitation
                  ? `Join ${invitation?.archiveName ?? "your family archive"}`
                  : mode === "setup"
                    ? "Create your family’s private place"
                    : "Your memories are waiting"}
              </h2>
              <p className="card-intro">
                {isInvitation
                  ? `You were invited as ${roleLabel(invitation?.role ?? "parent")} using ${invitation?.email ?? email}.`
                  : mode === "setup"
                    ? needsSetup
                      ? "The first account becomes the archive owner."
                      : "Create an account to begin your family archive."
                    : "Sign in to return to your family archive."}
              </p>

              {notice ? <p className="status-message">{notice}</p> : null}
              {verificationEmail ? (
                <div className="verification-sent" role="status">
                  <span className="verification-sent-icon">
                    <Check size={22} />
                  </span>
                  <h3>Check your inbox</h3>
                  <p>
                    We sent a verification email to <strong>{verificationEmail}</strong>. Open the
                    link inside to confirm your address and begin your private archive.
                  </p>
                  <small>The link is valid for 24 hours. It may take a minute to arrive.</small>
                  <button
                    className="text-button"
                    onClick={() => {
                      setVerificationEmail("");
                      setMode("sign-in");
                    }}
                    type="button"
                  >
                    Back to sign in
                  </button>
                </div>
              ) : recovering ? (
                <form onSubmit={requestRecovery}>
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
                  {error ? (
                    <p className="form-error" role="alert">
                      {error}
                    </p>
                  ) : null}
                  <button className="primary-button" disabled={submitting} type="submit">
                    {submitting ? "Sending…" : "Send recovery link"} <ArrowRight size={18} />
                  </button>
                </form>
              ) : (
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
                      disabled={isInvitation}
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
                  <button
                    className="primary-button"
                    disabled={submitting || Boolean(inviteToken && !invitation)}
                    type="submit"
                  >
                    {submitting
                      ? mode === "setup"
                        ? "Sending verification email…"
                        : "Signing in…"
                      : isInvitation
                        ? mode === "setup"
                          ? "Create account & join"
                          : "Sign in & join"
                        : mode === "setup"
                          ? "Begin our story"
                          : "Enter Everlittle"}
                    <ArrowRight size={18} />
                  </button>
                </form>
              )}
              {!verificationEmail && mode === "sign-in" && !recovering ? (
                <div className="auth-alternatives">
                  <button
                    className="text-button"
                    onClick={() => {
                      setRecovering(true);
                      setError("");
                      setNotice("");
                    }}
                    type="button"
                  >
                    Forgot your password?
                  </button>
                </div>
              ) : null}
              {verificationEmail ? null : recovering ? (
                <button
                  className="text-button"
                  onClick={() => {
                    setRecovering(false);
                    setError("");
                    setNotice("");
                  }}
                  type="button"
                >
                  Back to sign in
                </button>
              ) : isInvitation || allowsPublicSignup ? (
                <button
                  className="text-button"
                  onClick={() => {
                    setMode(mode === "setup" ? "sign-in" : "setup");
                    setError("");
                    setNotice("");
                  }}
                  type="button"
                >
                  {mode === "setup" ? "I already have an account" : "Create a family archive"}
                </button>
              ) : null}
              {!verificationEmail && !recovering && !isInvitation && childAccess?.enabled ? (
                <div className="child-entrance">
                  <span>or</span>
                  <button
                    onClick={() =>
                      location.assign(`/${encodeURIComponent(childAccess.familySlug)}/kids`)
                    }
                    type="button"
                  >
                    <Baby size={18} /> Open child space
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export function InvitationAcceptance({
  invitation,
  token,
}: {
  invitation: InvitationPreview;
  token: string;
}) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function accept() {
    setSubmitting(true);
    setError("");
    const response = await apiFetch("/api/invitations/accept", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
    if (!response.ok) {
      setError(await responseError(response));
      setSubmitting(false);
      return;
    }
    window.location.assign("/");
  }

  return (
    <main className="loading-shell invitation-shell">
      <Brand />
      <section className="access-card">
        <p className="eyebrow">Family invitation</p>
        <h2>Join {invitation.archiveName}</h2>
        <p className="card-intro">
          {invitation.inviterName} invited {invitation.email} to join as a{" "}
          {roleLabel(invitation.role)}. {roleDescription(invitation.role)}
        </p>
        {error ? <p className="form-error">{error}</p> : null}
        <button
          className="primary-button full-button"
          disabled={submitting}
          onClick={accept}
          type="button"
        >
          {submitting ? "Joining…" : "Join family archive"} <ArrowRight size={18} />
        </button>
      </section>
    </main>
  );
}

function ArchiveApp({ name }: { name: string }) {
  const [view, setView] = useState<View>(currentArchiveView);
  const [state, setState] = useState<ArchiveState | null>(null);
  const [archives, setArchives] = useState<ArchiveMembership[]>([]);
  const [error, setError] = useState("");

  async function refresh() {
    const response = await apiFetch("/api/archive");
    if (!response.ok) {
      setError(await responseError(response));
      return;
    }
    setState((await response.json()) as ArchiveState);
    setError("");
  }

  useEffect(() => {
    void refresh();
    void fetch("/api/archives")
      .then(async (response) => {
        if (!response.ok) throw new Error(await responseError(response));
        return response.json() as Promise<{ archives: ArchiveMembership[] }>;
      })
      .then(({ archives: memberships }) => setArchives(memberships))
      .catch(() => setArchives([]));
  }, []);

  useEffect(() => {
    const slug = currentFamilySlug();
    if (slug) localStorage.setItem("everlittle.last-family", slug);
    const syncView = () => setView(currentArchiveView());
    window.addEventListener("popstate", syncView);
    return () => window.removeEventListener("popstate", syncView);
  }, []);

  useEffect(() => {
    if (state?.children[0]?.profileKind === "vault" && view === "child") setView("parent");
  }, [state?.children, view]);

  function navigateView(next: View) {
    const slug = currentFamilySlug();
    if (!slug) return;
    const segment = next === "parent" ? "" : `/${next}`;
    window.history.pushState({}, "", `/${encodeURIComponent(slug)}${segment}`);
    setView(next);
  }

  if (!state) {
    return error ? (
      <main className="loading-shell">
        <Brand />
        <p className="form-error">{error}</p>
      </main>
    ) : (
      <Loading />
    );
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="archive-header-identity">
          <Brand compact />
          {archives.length > 1 ? (
            <label className="family-switcher">
              <span>Family</span>
              <select
                aria-label="Switch family archive"
                onChange={(event) => location.assign(`/${encodeURIComponent(event.target.value)}`)}
                value={state.archive.slug}
              >
                {archives.map((archive) => (
                  <option key={archive.id} value={archive.slug}>
                    {archive.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
        <div className="header-actions">
          <div className="view-switch" aria-label="Archive view">
            <button
              className={view === "parent" ? "active" : ""}
              onClick={() => navigateView("parent")}
            >
              Parent
            </button>
            <button
              className={view === "timeline" ? "active" : ""}
              onClick={() => navigateView("timeline")}
            >
              Timeline
            </button>
            <button
              className={view === "capsules" ? "active" : ""}
              onClick={() => navigateView("capsules")}
            >
              Capsules
            </button>
            {state.children[0]?.profileKind !== "vault" ? (
              <button
                className={view === "child" ? "active" : ""}
                onClick={() => navigateView("child")}
              >
                Child
              </button>
            ) : null}
            <button
              className={view === "family" ? "active" : ""}
              onClick={() => navigateView("family")}
            >
              Family
            </button>
          </div>
          <button
            className="icon-button"
            aria-label="Sign out"
            onClick={() => void authClient.signOut().then(() => location.reload())}
          >
            <LogOut size={17} />
          </button>
        </div>
      </header>
      {view === "parent" ? (
        <ParentView
          child={state.children[0]}
          currentUserId={state.currentMember.userId}
          memories={state.memories}
          name={name}
          onNavigate={navigateView}
          refresh={refresh}
          role={state.currentMember.role}
          canCreateContent={state.billing.canCreateContent}
        />
      ) : null}
      {view === "timeline" ? (
        <TimelineView
          child={state.children[0]}
          currentUserId={state.currentMember.userId}
          memories={state.memories}
          refresh={refresh}
          role={state.currentMember.role}
        />
      ) : null}
      {view === "capsules" ? (
        <CapsulesView
          capsules={state.capsules}
          child={state.children[0]}
          currentUserId={state.currentMember.userId}
          refresh={refresh}
          role={state.currentMember.role}
          canCreateContent={state.billing.canCreateContent}
        />
      ) : null}
      {view === "child" ? (
        <ChildView
          capsules={state.capsules.filter(
            (capsule) => !capsule.locked && capsule.audience === "child",
          )}
          child={state.children[0]}
          memories={state.memories}
        />
      ) : null}
      {view === "family" ? <FamilySettings state={state} refresh={refresh} /> : null}
      <MobileNav active={view} onNavigate={navigateView} />
    </main>
  );
}

export function ChildArchiveApp({
  apiPrefix = "/api/child",
  leaveTo = "/",
}: {
  apiPrefix?: string;
  leaveTo?: string;
}) {
  const [state, setState] = useState<{
    child: Child;
    memories: Memory[];
    capsules: Capsule[];
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch(`${apiPrefix}/archive`)
      .then(async (response) => {
        if (!response.ok) throw new Error(await responseError(response));
        return response.json() as Promise<{
          child: Child;
          memories: Memory[];
          capsules: Capsule[];
        }>;
      })
      .then(setState)
      .catch((reason: Error) => setError(reason.message));
  }, [apiPrefix]);

  async function leave() {
    await apiFetch(`${apiPrefix}/sign-out`, { method: "POST" });
    location.assign(leaveTo);
  }

  if (!state) {
    return error ? (
      <main className="loading-shell">
        <Brand />
        <p className="form-error">{error}</p>
      </main>
    ) : (
      <Loading />
    );
  }

  return (
    <main className="app-shell child-shell">
      <header className="app-header">
        <Brand compact />
        <button className="child-leave" onClick={() => void leave()} type="button">
          <LogOut size={16} /> Leave {state.child.displayName}’s space
        </button>
      </header>
      <ChildView capsules={state.capsules} child={state.child} memories={state.memories} />
    </main>
  );
}

function ParentView({
  name,
  child,
  currentUserId,
  memories,
  onNavigate,
  refresh,
  role,
  canCreateContent,
}: {
  name: string;
  child?: Child;
  currentUserId: string;
  memories: Memory[];
  onNavigate: (view: View) => void;
  refresh: () => Promise<void>;
  role: FamilyRole;
  canCreateContent: boolean;
}) {
  const [composerKind, setComposerKind] = useState<MemoryKind | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const canCreate = role !== "viewer" && canCreateContent;
  const isVault = child?.profileKind === "vault";
  const childName = child?.displayName ?? "your child";
  const featured = memories[0];

  function openComposer(kind: MemoryKind) {
    if (child) setComposerKind(kind);
  }

  return (
    <div className="archive-layout">
      <section className="archive-main">
        <p className="eyebrow">Good morning, {name}</p>
        <div className="page-title-row">
          <div>
            <h1>{isVault ? "Our memory vault" : `${childName}’s story`}</h1>
            <p>
              A private family archive · {memories.length}{" "}
              {memories.length === 1 ? "memory" : "memories"}
            </p>
          </div>
          {canCreate ? (
            <button
              className="round-action"
              aria-label="Add memory"
              disabled={!child}
              onClick={() => openComposer("story")}
            >
              <Plus />
            </button>
          ) : null}
        </div>
        {featured ? (
          <article className="featured-memory">
            <MemoryMedia memory={featured} featured />
            <div className="memory-copy">
              <p className="eyebrow">Latest {kindLabel(featured.kind)}</p>
              <h2>{featured.title}</h2>
              {featured.body ? <p>{featured.body}</p> : null}
              {featured.kind === "voice" ? <MemoryPlayback memory={featured} /> : null}
              <span className="byline">
                {formatMemoryDate(featured.happenedAt)} · {featured.authorName ?? "Family"}
              </span>
              <button
                className="memory-open"
                onClick={() => setSelectedMemory(featured)}
                type="button"
              >
                Open memory <ArrowRight size={15} />
              </button>
            </div>
          </article>
        ) : (
          <div className="memory-empty">
            <span>
              <Sparkles />
            </span>
            <p className="eyebrow">The first page is waiting</p>
            <h2>Keep the small thing you don’t want to forget.</h2>
            <p>
              {isVault
                ? "A trip, an ordinary afternoon, a note to each other, or simply what today felt like."
                : "A sleepy expression, a new sound, a photograph, or simply what today felt like."}
            </p>
            {canCreate && child ? (
              <button
                className="primary-button"
                onClick={() => openComposer("story")}
                type="button"
              >
                Write the first memory <ArrowRight size={17} />
              </button>
            ) : null}
          </div>
        )}
        <div className="section-heading">
          <h2>Recent memories</h2>
          {memories.length ? <span>{memories.length} kept</span> : null}
        </div>
        <div className="memory-list">
          {memories.slice(featured ? 1 : 0, 7).map((memory) => (
            <MemoryRow key={memory.id} memory={memory} onOpen={() => setSelectedMemory(memory)} />
          ))}
        </div>
      </section>
      <aside className="archive-side">
        <p className="eyebrow">Quick capture</p>
        <h2>What happened today?</h2>
        <div className="capture-grid">
          <button disabled={!canCreate || !child} onClick={() => openComposer("photo")}>
            {memoryIcon("photo")} Photo
          </button>
          <button disabled={!canCreate || !child} onClick={() => openComposer("story")}>
            {memoryIcon("story")} Story
          </button>
          <button disabled={!canCreate || !child} onClick={() => openComposer("voice")}>
            {memoryIcon("voice")} Voice
          </button>
          <button disabled={!canCreate || !child} onClick={() => openComposer("video")}>
            {memoryIcon("video")} Video
          </button>
          <button disabled={!canCreate || !child} onClick={() => openComposer("milestone")}>
            {memoryIcon("milestone")} Milestone
          </button>
        </div>
        {!child ? (
          <p className="capture-note">Create a child profile in Family before adding memories.</p>
        ) : !canCreateContent && role !== "viewer" ? (
          <p className="capture-note">
            Start a family subscription to add new memories. Everything already here stays available
            to view.
          </p>
        ) : null}
        <div className="capsule-card">
          <span className="capsule-seal">
            <Sparkles />
          </span>
          <p className="eyebrow">Future capsule</p>
          <h3>{isVault ? "For another day" : "For when you’re 18"}</h3>
          <p>
            {isVault
              ? "Seal a note for the two of you to open on a day you choose."
              : `Write a note now for ${childName} to open one day.`}
          </p>
          <button onClick={() => onNavigate("capsules")} type="button">
            {canCreate ? "Add a note" : "View capsules"} <ArrowRight size={16} />
          </button>
        </div>
      </aside>
      {composerKind && child ? (
        <MemoryComposer
          child={child}
          initialKind={composerKind}
          onClose={() => setComposerKind(null)}
          onCreated={async () => {
            await refresh();
          }}
          role={role}
        />
      ) : null}
      {selectedMemory && child ? (
        <MemoryDetail
          child={child}
          currentUserId={currentUserId}
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
          onChanged={async () => {
            await refresh();
          }}
          role={role}
        />
      ) : null}
    </div>
  );
}

function ChildView({
  capsules,
  child,
  memories,
}: {
  capsules: Capsule[];
  child?: Child;
  memories: Memory[];
}) {
  const childMemories = memories.filter(
    (memory) => memory.audience === "child" || memory.audience === "all",
  );
  const featured = childMemories[0];
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const childName = child?.displayName ?? "there";
  return (
    <div className="child-view">
      <section className="child-hero">
        <p className="eyebrow">This story is yours</p>
        <h1>Hi, {childName}.</h1>
        <p>Here are the moments your family kept for you.</p>
        <div className="child-actions">
          <button
            className="primary-button"
            disabled={!featured}
            onClick={() => featured && setSelectedMemory(featured)}
          >
            Start with today <ArrowRight size={18} />
          </button>
          <button
            className="soft-button"
            onClick={() =>
              document.getElementById("child-stories")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <CalendarDays size={18} /> Explore my timeline
          </button>
        </div>
      </section>
      {featured ? (
        <section className="child-grid real-child-grid" id="child-stories">
          {childMemories.map((memory, index) => (
            <article
              className={`story-card child-story-button ${index === 0 ? "large" : ""}`}
              key={memory.id}
            >
              {memory.mediaType === "image" ? <MemoryMedia memory={memory} featured /> : null}
              {memory.mediaType === "video" ? <MemoryMedia memory={memory} featured /> : null}
              <p className="eyebrow">
                {kindLabel(memory.kind)} from {memory.authorName ?? "your family"}
              </p>
              <h2>{memory.title}</h2>
              {memory.body ? <p>{memory.body}</p> : null}
              {memory.kind === "voice" ? <MemoryPlayback memory={memory} /> : null}
              <button
                className="story-open"
                onClick={() => setSelectedMemory(memory)}
                type="button"
              >
                Read this memory <ArrowRight size={15} />
              </button>
            </article>
          ))}
        </section>
      ) : (
        <section className="child-empty">
          <Sparkles />
          <h2>Your family is still gathering your stories.</h2>
          <p>The memories marked “For child” will appear here.</p>
        </section>
      )}
      {capsules.length ? (
        <section className="child-capsules">
          <p className="eyebrow">Opened for you</p>
          <h2>Letters sent from an earlier day</h2>
          {capsules.map((capsule) => (
            <article key={capsule.id}>
              <BookHeart />
              <div>
                <small>From {capsule.authorName ?? "your family"}</small>
                <h3>{capsule.title}</h3>
                <p>{capsule.body}</p>
              </div>
            </article>
          ))}
        </section>
      ) : null}
      {selectedMemory && child ? (
        <MemoryDetail
          child={child}
          currentUserId=""
          memory={selectedMemory}
          onChanged={async () => undefined}
          onClose={() => setSelectedMemory(null)}
          role="viewer"
        />
      ) : null}
    </div>
  );
}

function TimelineView({
  child,
  currentUserId,
  memories,
  refresh,
  role,
}: {
  child?: Child;
  currentUserId: string;
  memories: Memory[];
  refresh: () => Promise<void>;
  role: FamilyRole;
}) {
  const [filter, setFilter] = useState<MemoryKind | "all">("all");
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const visible = filter === "all" ? memories : memories.filter((memory) => memory.kind === filter);
  const groups = new Map<string, Memory[]>();
  for (const memory of visible) {
    const key = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(
      new Date(memory.happenedAt),
    );
    groups.set(key, [...(groups.get(key) ?? []), memory]);
  }

  return (
    <div className="timeline-page">
      <section className="timeline-hero">
        <p className="eyebrow">
          {child?.profileKind === "vault" ? "Your days, kept gently" : "Their days, kept gently"}
        </p>
        <h1>
          {child?.profileKind === "vault"
            ? "Your shared timeline"
            : `${child?.displayName ?? "Your child"}’s timeline`}
        </h1>
        <p>
          {child?.profileKind === "vault"
            ? "The moments you want to carry with you, in the order they happened."
            : "Every small beginning, in the order your family remembers it."}
        </p>
      </section>
      <div className="timeline-filters" aria-label="Filter memories">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
          type="button"
        >
          All
        </button>
        {(["photo", "story", "voice", "video", "milestone", "letter"] as MemoryKind[]).map(
          (kind) => (
            <button
              className={filter === kind ? "active" : ""}
              key={kind}
              onClick={() => setFilter(kind)}
              type="button"
            >
              {memoryIcon(kind)}
              <span>{kindLabel(kind)}</span>
            </button>
          ),
        )}
      </div>
      {groups.size ? (
        <div className="timeline-groups">
          {[...groups].map(([label, items]) => (
            <section className="timeline-group" key={label}>
              <header>
                <span />
                <h2>{label}</h2>
                <small>
                  {items.length} {items.length === 1 ? "memory" : "memories"}
                </small>
              </header>
              <div className="timeline-cards">
                {items.map((memory) => (
                  <article className="timeline-card" key={memory.id}>
                    <MemoryMedia memory={memory} />
                    {memory.kind === "voice" ? <MemoryPlayback memory={memory} /> : null}
                    <button
                      className="timeline-card-copy"
                      onClick={() => setSelectedMemory(memory)}
                      type="button"
                    >
                      <small>
                        {kindLabel(memory.kind)} · {audienceLabel(memory.audience)}
                      </small>
                      <strong>{memory.title}</strong>
                      <span>{memory.body ?? `Kept by ${memory.authorName ?? "family"}`}</span>
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <section className="timeline-empty">
          <Sparkles />
          <h2>No {filter === "all" ? "memories" : `${filter} memories`} yet.</h2>
          <p>New moments will settle here in time.</p>
        </section>
      )}
      {selectedMemory && child ? (
        <MemoryDetail
          child={child}
          currentUserId={currentUserId}
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
          onChanged={async () => {
            await refresh();
          }}
          role={role}
        />
      ) : null}
    </div>
  );
}

function MemoryDetail({
  child,
  currentUserId,
  memory,
  onClose,
  onChanged,
  role,
}: {
  child: Child;
  currentUserId: string;
  memory: Memory;
  onClose: () => void;
  onChanged: () => Promise<void>;
  role: FamilyRole;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(memory.title);
  const [body, setBody] = useState(memory.body ?? "");
  const [happenedAt, setHappenedAt] = useState(toLocalDateTime(memory.happenedAt));
  const [audience, setAudience] = useState<Memory["audience"]>(memory.audience);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const canEdit = memory.createdByUserId === currentUserId;
  const { closing, requestClose } = useSheetTransition(onClose, busy);
  useDocumentScrollLock();

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await apiFetch(`/api/archive/memories/${memory.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        childId: child.id,
        kind: memory.kind,
        title,
        body: body || undefined,
        happenedAt: new Date(happenedAt).toISOString(),
        audience,
      }),
    });
    if (!response.ok) {
      setError(await responseError(response));
      setBusy(false);
      return;
    }
    await onChanged();
    requestClose(true);
  }

  async function remove() {
    if (!confirm(`Delete “${memory.title}”? Its private media will also be removed.`)) return;
    setBusy(true);
    const response = await apiFetch(`/api/archive/memories/${memory.id}`, { method: "DELETE" });
    if (!response.ok) {
      setError(await responseError(response));
      setBusy(false);
      return;
    }
    await onChanged();
    requestClose(true);
  }

  async function createShare() {
    setShareBusy(true);
    setError("");
    const response = await apiFetch(`/api/archive/memories/${memory.id}/share`, {
      method: "POST",
    });
    if (!response.ok) {
      setError(await responseError(response));
      setShareBusy(false);
      return;
    }
    const result = (await response.json()) as { shareUrl: string };
    setShareUrl(result.shareUrl);
    setShareBusy(false);
  }

  async function sharePublicLink() {
    if (!shareUrl) return;
    if (navigator.share) {
      await navigator.share({ title: memory.title, url: shareUrl });
      return;
    }
    await navigator.clipboard.writeText(shareUrl);
  }

  async function copyPublicLink() {
    if (shareUrl) await navigator.clipboard.writeText(shareUrl);
  }

  async function revokeShare() {
    setShareBusy(true);
    setError("");
    const response = await apiFetch(`/api/archive/memories/${memory.id}/share`, {
      method: "DELETE",
    });
    if (!response.ok) {
      setError(await responseError(response));
      setShareBusy(false);
      return;
    }
    setShareUrl("");
    setShareBusy(false);
  }

  return (
    <div
      className={`composer-backdrop ${closing ? "is-closing" : ""}`}
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <section
        className="memory-detail"
        role="dialog"
        aria-modal="true"
        aria-labelledby="memory-detail-title"
      >
        <header className="composer-header detail-header">
          <div>
            <p className="eyebrow">
              {kindLabel(memory.kind)} · {audienceLabel(memory.audience)}
            </p>
            <h2 id="memory-detail-title">{editing ? "Edit this memory" : memory.title}</h2>
          </div>
          <button aria-label="Close" disabled={busy} onClick={() => requestClose()} type="button">
            <X />
          </button>
        </header>
        {editing ? (
          <form className="composer-form detail-form" onSubmit={save}>
            <label>
              Memory title
              <input
                maxLength={160}
                onChange={(event) => setTitle(event.target.value)}
                required
                value={title}
              />
            </label>
            <label>
              The story behind it
              <textarea
                maxLength={20_000}
                onChange={(event) => setBody(event.target.value)}
                rows={6}
                value={body}
              />
            </label>
            <div className="composer-fields">
              <label>
                When it happened
                <input
                  max={currentLocalDateTime()}
                  onChange={(event) => setHappenedAt(event.target.value)}
                  required
                  type="datetime-local"
                  value={happenedAt}
                />
              </label>
              <label>
                Who can see it
                <select
                  onChange={(event) => setAudience(event.target.value as Memory["audience"])}
                  value={audience}
                >
                  <option value="family">Family archive</option>
                  <option value="all">Everyone — family + {child.displayName}</option>
                  {role === "owner" || role === "parent" ? (
                    <option value="parents">Parents only</option>
                  ) : null}
                  <option value="child">For {child.displayName}</option>
                </select>
              </label>
            </div>
            {error ? <p className="form-error">{error}</p> : null}
            <div className="composer-actions">
              <button
                className="text-button"
                disabled={busy}
                onClick={() => setEditing(false)}
                type="button"
              >
                Cancel
              </button>
              <button className="primary-button" disabled={busy} type="submit">
                {busy ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="detail-content">
            <MemoryMedia memory={memory} featured />
            {memory.body ? <p className="detail-story">{memory.body}</p> : null}
            {memory.kind === "voice" ? <MemoryPlayback memory={memory} /> : null}
            <p className="detail-meta">
              Kept by {memory.authorName ?? "family"} · {formatMemoryDate(memory.happenedAt)}
            </p>
            {canEdit ? (
              <div className="public-share-box">
                <div>
                  <strong>Share this single memory</strong>
                  <small>
                    Anyone with the link can view it for 30 days. You can disable it anytime.
                  </small>
                </div>
                {shareUrl ? (
                  <div className="public-share-actions">
                    <button onClick={() => void sharePublicLink()} type="button">
                      <Share2 size={16} /> Share to an app
                    </button>
                    <button onClick={() => void copyPublicLink()} type="button">
                      <Copy size={16} /> Copy
                    </button>
                    <button disabled={shareBusy} onClick={() => void revokeShare()} type="button">
                      Disable
                    </button>
                  </div>
                ) : (
                  <button
                    className="soft-button"
                    disabled={shareBusy}
                    onClick={() => void createShare()}
                    type="button"
                  >
                    <Share2 size={16} /> {shareBusy ? "Creating link…" : "Create public link"}
                  </button>
                )}
              </div>
            ) : null}
            {error ? <p className="form-error">{error}</p> : null}
            {canEdit ? (
              <div className="detail-actions">
                <button className="soft-button" onClick={() => setEditing(true)} type="button">
                  <PenLine size={16} /> Edit memory
                </button>
                <button
                  className="delete-memory"
                  disabled={busy}
                  onClick={() => void remove()}
                  type="button"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}

function MemoryComposer({
  child,
  initialKind,
  onClose,
  onCreated,
  role,
}: {
  child: Child;
  initialKind: MemoryKind;
  onClose: () => void;
  onCreated: () => Promise<void>;
  role: FamilyRole;
}) {
  const [kind, setKind] = useState<MemoryKind>(initialKind);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [happenedAt, setHappenedAt] = useState(currentLocalDateTime());
  const [audience, setAudience] = useState<"parents" | "family" | "child" | "all">("family");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [stage, setStage] = useState<"idle" | "saving" | "uploading">("idle");

  const needsMedia = kind === "photo" || kind === "voice" || kind === "video";
  const { closing, requestClose } = useSheetTransition(onClose, stage !== "idle");
  useDocumentScrollLock();

  function chooseKind(nextKind: MemoryKind) {
    setKind(nextKind);
    setFile(null);
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (needsMedia && !file) {
      setError(
        kind === "photo"
          ? "Choose a photograph to keep."
          : kind === "voice"
            ? "Choose an audio recording to keep."
            : "Choose a video to keep.",
      );
      return;
    }
    if (file && file.size > 50 * 1024 * 1024) {
      setError("Media files must be 50 MB or smaller.");
      return;
    }

    setError("");
    setStage("saving");
    const videoThumbnail =
      kind === "video" && file ? await createVideoThumbnail(file).catch(() => null) : null;
    const response = await apiFetch("/api/archive/memories", {
      method: "POST",
      body: JSON.stringify({
        childId: child.id,
        kind,
        title,
        body: body || undefined,
        happenedAt: new Date(happenedAt).toISOString(),
        audience,
      }),
    });
    if (!response.ok) {
      setError(await responseError(response));
      setStage("idle");
      return;
    }

    const created = (await response.json()) as { id: string };
    if (file) {
      setStage("uploading");
      const upload = await fetch(scopedApiPath(`/api/archive/memories/${created.id}/media`), {
        method: "PUT",
        headers: {
          "content-type": file.type || "application/octet-stream",
          "x-everlittle-file-name": encodeURIComponent(file.name),
        },
        body: file,
      });
      if (!upload.ok) {
        await apiFetch(`/api/archive/memories/${created.id}`, { method: "DELETE" });
        setError(await responseError(upload));
        setStage("idle");
        return;
      }
      if (videoThumbnail) {
        const thumbnailUpload = await fetch(
          scopedApiPath(`/api/archive/memories/${created.id}/media/thumbnail`),
          {
            method: "PUT",
            headers: { "content-type": videoThumbnail.type },
            body: videoThumbnail,
          },
        );
        if (!thumbnailUpload.ok) {
          console.warn("The video was saved without its generated thumbnail.");
        }
      }
    }

    await onCreated();
    requestClose(true);
  }

  return (
    <div
      className={`composer-backdrop ${closing ? "is-closing" : ""}`}
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <section
        className="memory-composer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="composer-title"
      >
        <header className="composer-header">
          <div>
            <p className="eyebrow">Keep this moment</p>
            <h2 id="composer-title">
              {child.profileKind === "vault"
                ? "A new memory for your vault"
                : `A new memory for ${child.displayName}`}
            </h2>
          </div>
          <button
            aria-label="Close"
            disabled={stage !== "idle"}
            onClick={() => requestClose()}
            type="button"
          >
            <X />
          </button>
        </header>

        <div className="composer-scroll">
          <div className="kind-picker" aria-label="Memory type">
            {(["photo", "story", "voice", "video", "milestone", "letter"] as MemoryKind[]).map(
              (item) => (
                <button
                  className={kind === item ? "active" : ""}
                  key={item}
                  onClick={() => chooseKind(item)}
                  type="button"
                >
                  {memoryIcon(item)}
                  <span>{kindLabel(item)}</span>
                </button>
              ),
            )}
          </div>

          <form className="composer-form" onSubmit={submit}>
            <label>
              {kind === "letter"
                ? "Letter title"
                : kind === "milestone"
                  ? "What changed?"
                  : "Memory title"}
              <input
                autoFocus
                maxLength={160}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={memoryTitlePlaceholder(kind)}
                required
                value={title}
              />
            </label>
            <label>
              {kind === "letter" ? "Your letter" : "The story behind it"}
              <textarea
                maxLength={20_000}
                onChange={(event) => setBody(event.target.value)}
                placeholder={memoryBodyPlaceholder(kind)}
                rows={5}
                value={body}
              />
            </label>

            <div
              aria-hidden={!needsMedia}
              className={`media-field-shell ${needsMedia ? "is-visible" : ""}`}
            >
              <div className="media-field-inner">
                <label className="media-drop">
                  {kind === "photo" ? <Camera /> : kind === "voice" ? <FileAudio /> : <Video />}
                  <span>
                    <strong>
                      {file
                        ? file.name
                        : kind === "photo"
                          ? "Choose a photograph"
                          : kind === "voice"
                            ? "Choose an audio recording"
                            : "Choose a video"}
                    </strong>
                    <small>
                      {file
                        ? formatFileSize(file.size)
                        : "Photos, MP3, M4A, MP4, MOV or WebM · up to 50 MB"}
                    </small>
                  </span>
                  <input
                    accept={
                      kind === "photo"
                        ? "image/*,.heic,.heif"
                        : kind === "voice"
                          ? "audio/*,.m4a,.caf"
                          : "video/*,.mov,.m4v"
                    }
                    disabled={!needsMedia}
                    onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                    required={needsMedia}
                    tabIndex={needsMedia ? 0 : -1}
                    type="file"
                  />
                </label>
              </div>
            </div>

            <div className="composer-fields">
              <label>
                When it happened
                <input
                  max={currentLocalDateTime()}
                  onChange={(event) => setHappenedAt(event.target.value)}
                  required
                  type="datetime-local"
                  value={happenedAt}
                />
              </label>
              <label>
                Who can see it
                <select
                  onChange={(event) => setAudience(event.target.value as typeof audience)}
                  value={audience}
                >
                  <option value="family">Family archive</option>
                  {child.profileKind !== "vault" ? (
                    <option value="all">Everyone — family + {child.displayName}</option>
                  ) : null}
                  {role === "owner" || role === "parent" ? (
                    <option value="parents">Parents only</option>
                  ) : null}
                  {child.profileKind !== "vault" ? (
                    <option value="child">For {child.displayName}</option>
                  ) : null}
                </select>
              </label>
            </div>
            <p className="audience-note">
              {audience === "all"
                ? `Visible to every accepted family member and in ${child.displayName}’s child view.`
                : audience === "child"
                  ? `This will appear in ${child.displayName}’s child view.`
                  : audience === "parents"
                    ? "Only owners and parents should use this private context."
                    : "Visible to accepted family members."}
            </p>
            {error ? (
              <p className="form-error" role="alert">
                {error}
              </p>
            ) : null}
            <div className="composer-actions">
              <button
                className="text-button"
                disabled={stage !== "idle"}
                onClick={() => requestClose()}
                type="button"
              >
                Cancel
              </button>
              <button
                aria-busy={stage !== "idle"}
                className="primary-button"
                disabled={stage !== "idle"}
                type="submit"
              >
                <MemoryStageLabel stage={stage} />
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

function MemoryMedia({ memory, featured = false }: { memory: Memory; featured?: boolean }) {
  if (memory.mediaType === "image" && memory.mediaId) {
    return (
      <div className={`memory-photo real-photo ${featured ? "featured" : ""}`}>
        <img
          alt=""
          loading={featured ? "eager" : "lazy"}
          src={scopedApiPath(`/api/media/${memory.mediaId}`)}
        />
        <span>{formatMemoryDate(memory.happenedAt)}</span>
      </div>
    );
  }
  if (memory.mediaType === "video" && memory.mediaId) {
    return <SecureVideoPlayer featured={featured} memory={memory} />;
  }
  return (
    <div className={`memory-photo memory-symbol ${memory.kind}`}>
      {memoryIcon(memory.kind)}
      <span>{formatMemoryDate(memory.happenedAt)}</span>
    </div>
  );
}

function MemoryPlayback({ memory }: { memory: Memory }) {
  if (memory.mediaType === "audio" && memory.mediaId) return <SecureAudioPlayer memory={memory} />;
  return (
    <div className="voice-player empty" aria-label="No recording attached">
      <span aria-hidden="true">
        <PlayCircle />
      </span>
      <p>No recording is attached to this sample.</p>
    </div>
  );
}

const WAVEFORM_BARS = [
  9, 15, 21, 13, 27, 35, 22, 17, 31, 39, 25, 14, 20, 33, 42, 29, 18, 24, 36, 30, 16, 12, 26, 38, 28,
  19, 34, 23, 15, 31, 40, 27, 18, 24, 13, 21,
];

function SecureAudioPlayer({ memory }: { memory: Memory }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveform, setWaveform] = useState(WAVEFORM_BARS);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setReady(false);
    setError("");
    void (async () => {
      try {
        const response = await fetch(scopedApiPath(`/api/media/${memory.mediaId}`), {
          credentials: "same-origin",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(await responseError(response));
        const blob = await response.blob();
        if (!active) return;
        const objectUrl = URL.createObjectURL(blob);
        objectUrlRef.current = objectUrl;
        if (audioRef.current) audioRef.current.src = objectUrl;
        setWaveform(await waveformFromAudio(blob));
        if (active) setReady(true);
      } catch (caught) {
        if (active && !controller.signal.aborted) {
          setError(
            caught instanceof Error && caught.message
              ? caught.message
              : "The recording could not be loaded. Check your connection and try again.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
      controller.abort();
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    };
  }, [memory.mediaId]);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio || !ready) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    setError("");
    try {
      await audio.play();
    } catch {
      setError("This recording could not be played on this device.");
    }
  }

  function seek(value: number) {
    if (!audioRef.current || !duration) return;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  }

  const progress = duration ? currentTime / duration : 0;
  return (
    <div className="voice-player custom-player">
      <audio
        aria-label={memory.title}
        onDurationChange={(event) => setDuration(event.currentTarget.duration || 0)}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        ref={audioRef}
      />
      <button
        aria-label={playing ? "Pause recording" : "Play recording"}
        className="media-play"
        disabled={loading || !ready}
        onClick={() => void toggle()}
        type="button"
      >
        {loading ? <span className="player-loader" /> : playing ? <Pause /> : <PlayCircle />}
      </button>
      <div className="waveform-wrap">
        <div className="waveform" aria-hidden="true">
          {waveform.map((height, index) => (
            <i
              className={index / waveform.length <= progress ? "played" : ""}
              key={`${height}-${index}`}
              style={{ height }}
            />
          ))}
        </div>
        <input
          aria-label="Recording position"
          max={duration || 1}
          min={0}
          onChange={(event) => seek(Number(event.target.value))}
          step="0.01"
          type="range"
          value={currentTime}
        />
        <div className="player-time">
          <span>{formatMediaTime(currentTime)}</span>
          <span>{duration ? formatMediaTime(duration) : "—:—"}</span>
        </div>
      </div>
      {error ? <p className="media-error">{error}</p> : null}
    </div>
  );
}

function SecureVideoPlayer({ memory, featured }: { memory: Memory; featured: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const [error, setError] = useState("");
  const source = scopedApiPath(`/api/media/${memory.mediaId}`);
  const thumbnailSource = scopedApiPath(`/api/media/${memory.mediaId}/thumbnail`);

  useEffect(() => {
    setPlaying(false);
    setLoading(false);
    setCurrentTime(0);
    setDuration(0);
    setReady(false);
    setThumbnailFailed(false);
    setError("");
  }, [memory.mediaId]);

  async function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) {
      video.pause();
      return;
    }
    setError("");
    setLoading(true);
    try {
      await video.play();
    } catch {
      setLoading(false);
      setError("This video could not be played on this device.");
    }
  }

  return (
    <div
      className={`memory-video custom-video ${featured ? "featured" : ""} ${ready ? "is-ready" : ""} ${playing ? "is-playing" : ""}`}
    >
      <video
        aria-label={memory.title}
        onCanPlay={() => {
          setLoading(false);
          setReady(true);
        }}
        onDurationChange={(event) => {
          setDuration(event.currentTarget.duration || 0);
          setReady(true);
        }}
        onEnded={() => setPlaying(false)}
        onError={() => {
          setLoading(false);
          setError("This video could not be played on this device.");
        }}
        onLoadedData={() => setReady(true)}
        onPause={() => setPlaying(false)}
        onPlay={() => {
          setLoading(false);
          setPlaying(true);
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        playsInline
        preload={featured ? "metadata" : "none"}
        ref={videoRef}
        src={source}
      />
      {!ready ? (
        <img
          alt=""
          onError={() => setThumbnailFailed(true)}
          src={thumbnailFailed ? "/memory-icons/video.png" : thumbnailSource}
        />
      ) : null}
      <button
        aria-label={playing ? "Pause video" : "Play video"}
        className="video-play"
        onClick={() => void toggle()}
        type="button"
      >
        {loading ? <span className="player-loader" /> : playing ? <Pause /> : <PlayCircle />}
      </button>
      <div className="video-controls">
        <button
          aria-label={playing ? "Pause video" : "Play video"}
          onClick={() => void toggle()}
          type="button"
        >
          {playing ? <Pause /> : <PlayCircle />}
        </button>
        <input
          aria-label="Video position"
          max={duration || 1}
          min={0}
          onChange={(event) => {
            if (videoRef.current) videoRef.current.currentTime = Number(event.target.value);
          }}
          step="0.01"
          type="range"
          value={currentTime}
        />
        <span>
          {formatMediaTime(currentTime)} / {duration ? formatMediaTime(duration) : "—:—"}
        </span>
        <button
          aria-label="Full screen"
          onClick={() => void videoRef.current?.requestFullscreen()}
          type="button"
        >
          <Maximize2 />
        </button>
      </div>
      <span>{formatMemoryDate(memory.happenedAt)}</span>
      {error ? <p className="media-error video-error">{error}</p> : null}
    </div>
  );
}

function CapsulesView({
  capsules,
  child,
  currentUserId,
  refresh,
  role,
  canCreateContent,
}: {
  capsules: Capsule[];
  child?: Child;
  currentUserId: string;
  refresh: () => Promise<void>;
  role: FamilyRole;
  canCreateContent: boolean;
}) {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const locked = capsules.filter((capsule) => capsule.locked);
  const opened = capsules.filter((capsule) => !capsule.locked);
  const canCreate = role !== "viewer" && canCreateContent;

  async function remove(capsule: Capsule) {
    if (!confirm(`Delete the capsule “${capsule.title}”?`)) return;
    const response = await apiFetch(`/api/archive/capsules/${capsule.id}`, { method: "DELETE" });
    if (!response.ok) {
      setError(await responseError(response));
      return;
    }
    await refresh();
  }

  return (
    <div className="capsules-page">
      <section className="capsules-hero">
        <div>
          <p className="eyebrow">Words for their future</p>
          <h1>Time capsules</h1>
          <p>
            Seal a note today. Everlittle will keep its contents private until the day you choose.
          </p>
        </div>
        {canCreate ? (
          <button className="primary-button" disabled={!child} onClick={() => setCreating(true)}>
            <Plus size={17} /> New capsule
          </button>
        ) : null}
      </section>

      {!canCreateContent && role !== "viewer" ? (
        <p className="capture-note">
          Start a family subscription to seal new capsules. Existing capsules remain available.
        </p>
      ) : null}

      {error ? <p className="form-error capsule-page-error">{error}</p> : null}
      {capsules.length ? (
        <div className="capsule-sections">
          {locked.length ? (
            <section>
              <header className="section-heading">
                <h2>Waiting for their day</h2>
                <span>{locked.length} sealed</span>
              </header>
              <div className="capsule-grid">
                {locked.map((capsule) => (
                  <article className="capsule-item locked" key={capsule.id}>
                    <span className="capsule-lock">
                      <LockKeyhole />
                    </span>
                    <p className="eyebrow">Opens {formatDate(capsule.unlocksAt)}</p>
                    <h3>{capsule.title}</h3>
                    <p>The note is sealed—even the person who wrote it cannot read it yet.</p>
                    <footer>
                      <small>From {capsule.authorName ?? "family"}</small>
                      {role === "owner" ||
                      role === "parent" ||
                      capsule.createdByUserId === currentUserId ? (
                        <button
                          aria-label={`Delete ${capsule.title}`}
                          onClick={() => void remove(capsule)}
                        >
                          <Trash2 size={15} />
                        </button>
                      ) : null}
                    </footer>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
          {opened.length ? (
            <section>
              <header className="section-heading">
                <h2>Ready to open</h2>
                <span>{opened.length} opened</span>
              </header>
              <div className="capsule-grid">
                {opened.map((capsule) => (
                  <article className="capsule-item opened" key={capsule.id}>
                    <span className="capsule-lock">
                      <BookHeart />
                    </span>
                    <p className="eyebrow">Opened {formatDate(capsule.unlocksAt)}</p>
                    <h3>{capsule.title}</h3>
                    <p className="capsule-body">{capsule.body}</p>
                    <footer>
                      <small>From {capsule.authorName ?? "family"}</small>
                      {role === "owner" ||
                      role === "parent" ||
                      capsule.createdByUserId === currentUserId ? (
                        <button
                          aria-label={`Delete ${capsule.title}`}
                          onClick={() => void remove(capsule)}
                        >
                          <Trash2 size={15} />
                        </button>
                      ) : null}
                    </footer>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : (
        <section className="capsules-empty">
          <span>
            <LockKeyhole />
          </span>
          <p className="eyebrow">A message can travel through time</p>
          <h2>Write something {child?.displayName ?? "your child"} should meet later.</h2>
          <p>A birthday letter, a family story, or a few words for the person they are becoming.</p>
          {canCreate && child ? (
            <button className="primary-button" onClick={() => setCreating(true)}>
              Create the first capsule <ArrowRight size={17} />
            </button>
          ) : null}
        </section>
      )}
      {creating && child ? (
        <CapsuleComposer
          child={child}
          onClose={() => setCreating(false)}
          onCreated={async () => {
            await refresh();
          }}
        />
      ) : null}
    </div>
  );
}

function CapsuleComposer({
  child,
  onClose,
  onCreated,
}: {
  child: Child;
  onClose: () => void;
  onCreated: () => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [unlocksAt, setUnlocksAt] = useState(defaultCapsuleDate());
  const [audience, setAudience] = useState<"family" | "child">("child");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { closing, requestClose } = useSheetTransition(onClose, busy);
  useDocumentScrollLock();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await apiFetch("/api/archive/capsules", {
      method: "POST",
      body: JSON.stringify({
        childId: child.id,
        title,
        body,
        unlocksAt: new Date(unlocksAt).toISOString(),
        audience,
      }),
    });
    if (!response.ok) {
      setError(await responseError(response));
      setBusy(false);
      return;
    }
    await onCreated();
    requestClose(true);
  }

  function setEighteenthBirthday() {
    const birthday = new Date(`${child.birthDate}T09:00:00`);
    birthday.setFullYear(birthday.getFullYear() + 18);
    setUnlocksAt(toLocalDateTime(birthday.toISOString()));
  }

  return (
    <div
      className={`composer-backdrop ${closing ? "is-closing" : ""}`}
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <section
        className="memory-composer capsule-composer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="capsule-title"
      >
        <header className="composer-header">
          <div>
            <p className="eyebrow">Seal it for later</p>
            <h2 id="capsule-title">A capsule for {child.displayName}</h2>
          </div>
          <button aria-label="Close" disabled={busy} onClick={() => requestClose()} type="button">
            <X />
          </button>
        </header>
        <form className="composer-form" onSubmit={submit}>
          <label>
            Capsule title
            <input
              autoFocus
              maxLength={160}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="For the day you turn eighteen…"
              required
              value={title}
            />
          </label>
          <label>
            Your sealed note
            <textarea
              maxLength={20_000}
              onChange={(event) => setBody(event.target.value)}
              placeholder={`Dear ${child.displayName}…`}
              required
              rows={7}
              value={body}
            />
          </label>
          <div className="capsule-date-row">
            <label>
              Unlock on
              <input
                min={currentLocalDateTime()}
                onChange={(event) => setUnlocksAt(event.target.value)}
                required
                type="datetime-local"
                value={unlocksAt}
              />
            </label>
            <button className="soft-button" onClick={setEighteenthBirthday} type="button">
              Her 18th birthday
            </button>
          </div>
          <label>
            Once opened, show it in
            <select
              onChange={(event) => setAudience(event.target.value as typeof audience)}
              value={audience}
            >
              <option value="child">{child.displayName}’s view</option>
              <option value="family">Family archive</option>
            </select>
          </label>
          <p className="audience-note">
            <LockKeyhole size={14} /> The note disappears from API responses until this date. Only
            its title and unlock date remain visible.
          </p>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="composer-actions">
            <button
              className="text-button"
              disabled={busy}
              onClick={() => requestClose()}
              type="button"
            >
              Cancel
            </button>
            <button className="primary-button" disabled={busy} type="submit">
              {busy ? "Sealing…" : "Seal capsule"} {!busy ? <LockKeyhole size={16} /> : null}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function FamilySettings({ state, refresh }: { state: ArchiveState; refresh: () => Promise<void> }) {
  const posthog = usePostHog();
  const isOwner = state.currentMember.role === "owner";
  const canEditChild = isOwner || state.currentMember.role === "parent";
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Exclude<FamilyRole, "owner">>("parent");
  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [inviteBusy, setInviteBusy] = useState(false);
  const isVault = state.children[0]?.profileKind === "vault";
  const [childName, setChildName] = useState(state.children[0]?.displayName ?? "Your child");
  const [birthDate, setBirthDate] = useState(state.children[0]?.birthDate ?? "");
  const [childPin, setChildPin] = useState("");
  const [childPinConfirmation, setChildPinConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [billingBusy, setBillingBusy] = useState<"monthly" | "yearly" | "portal" | null>(null);

  async function openBilling(destination: "monthly" | "yearly" | "portal") {
    setBillingBusy(destination);
    setError("");
    const response = await apiFetch(
      destination === "portal" ? "/api/archive/billing/portal" : "/api/archive/billing/checkout",
      {
        method: "POST",
        body: destination === "portal" ? undefined : JSON.stringify({ interval: destination }),
      },
    );
    if (!response.ok) {
      setError(await responseError(response));
      setBillingBusy(null);
      return;
    }
    const result = (await response.json()) as { url: string };
    posthog?.capture(
      destination === "portal" ? "billing_portal_opened" : "billing_checkout_started",
      destination === "portal" ? undefined : { billing_interval: destination },
    );
    window.location.assign(result.url);
  }

  async function mutate(path: string, init: RequestInit, success: string) {
    setError("");
    setMessage("");
    const response = await apiFetch(path, init);
    if (!response.ok) {
      setError(await responseError(response));
      return false;
    }
    setMessage(success);
    await refresh();
    return true;
  }

  async function invite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInviteBusy(true);
    setError("");
    setMessage("");
    const response = await apiFetch("/api/archive/invitations", {
      method: "POST",
      body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
    });
    if (!response.ok) {
      setError(await responseError(response));
      setInviteBusy(false);
      return;
    }
    const result = (await response.json()) as {
      invitationUrl: string;
      delivery: { status: "sent" | "failed" };
    };
    setInviteUrl(result.invitationUrl);
    setInviteEmail("");
    setMessage(
      result.delivery.status === "sent"
        ? "Invitation sent by email."
        : "The invitation is ready, but email could not be sent. Copy the private link below.",
    );
    setError("");
    await refresh();
    setInviteBusy(false);
  }

  async function resendInvite(item: PendingInvitation) {
    setError("");
    setMessage("");
    const response = await apiFetch(`/api/archive/invitations/${item.id}/resend`, {
      method: "POST",
    });
    if (!response.ok) {
      setError(await responseError(response));
      return;
    }
    const result = (await response.json()) as {
      invitationUrl: string;
      delivery: { status: "sent" | "failed" };
    };
    setInviteUrl(result.invitationUrl);
    setMessage(
      result.delivery.status === "sent"
        ? `A new invitation was sent to ${item.email}. The old link no longer works.`
        : "A new link was created, but email failed. Copy the private link below.",
    );
    await refresh();
  }

  async function saveChild(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const child = state.children[0];
    await mutate(
      child ? `/api/archive/children/${child.id}` : "/api/archive/children",
      {
        method: child ? "PUT" : "POST",
        body: JSON.stringify({ displayName: childName, birthDate }),
      },
      child ? `${childName}’s profile was updated.` : `${childName}’s profile is ready.`,
    );
  }

  async function saveChildPin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const child = state.children[0];
    if (!child) return;
    if (childPin !== childPinConfirmation) {
      setMessage("");
      setError("The two PINs do not match.");
      return;
    }
    const saved = await mutate(
      `/api/archive/children/${child.id}/access-pin`,
      { method: "PUT", body: JSON.stringify({ pin: childPin }) },
      child.childAccessEnabled
        ? `${childName}’s family PIN was changed. Their other child sessions were signed out.`
        : `${childName}’s private sign-in is ready.`,
    );
    if (saved) {
      setChildPin("");
      setChildPinConfirmation("");
    }
  }

  async function disableChildSignIn() {
    const child = state.children[0];
    if (!child) return;
    if (
      !confirm(
        `Turn off child sign-in for ${childName}? Every signed-in child device will lose access.`,
      )
    )
      return;
    await mutate(
      `/api/archive/children/${child.id}/access-pin`,
      { method: "DELETE" },
      `${childName}’s child sign-in was turned off and every child session was revoked.`,
    );
  }

  async function copyInvite() {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="family-page">
      <section className="family-intro">
        <p className="eyebrow">Private family circle</p>
        <h1>{state.archive.name}</h1>
        <p>
          {isVault
            ? "Invite the people you trust with this memory vault. You can change roles or hand ownership to another adult whenever you need."
            : `Invite the people who will help keep ${childName}’s story. You can change roles or hand ownership to another adult whenever your family needs.`}
        </p>
      </section>
      {message ? (
        <p className="status-message">
          <Check size={16} /> {message}
        </p>
      ) : null}
      {error ? <p className="form-error">{error}</p> : null}

      <div className="family-grid">
        <section className="settings-card storage-card">
          <div className="settings-heading">
            <span>
              <HardDrive />
            </span>
            <div>
              <p className="eyebrow">Storage</p>
              <h2>
                {state.billing.plan === "self-hosted" ? "Your infrastructure" : "Family plan"}
              </h2>
            </div>
          </div>
          <div className="storage-summary">
            <strong>{formatFileSize(state.billing.usedBytes)} used</strong>
            <span>
              {state.billing.limitBytes === null
                ? "No Everlittle limit"
                : `${formatFileSize(state.billing.limitBytes)} included`}
            </span>
          </div>
          {state.billing.limitBytes !== null ? (
            <div
              aria-label={`${Math.min(100, (state.billing.usedBytes / state.billing.limitBytes) * 100).toFixed(1)} percent of storage used`}
              className="storage-meter"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={state.billing.limitBytes}
              aria-valuenow={state.billing.usedBytes}
            >
              <i
                style={{
                  width: `${Math.min(100, (state.billing.usedBytes / state.billing.limitBytes) * 100)}%`,
                }}
              />
            </div>
          ) : null}
          <p className="storage-note">
            {state.billing.plan === "self-hosted"
              ? "Media stays in the R2 bucket owned by this installation."
              : state.billing.status === "complimentary"
                ? "Your archive stays available to view. Start a subscription to add new memories or capsules."
                : "Photographs, audio, video, and generated thumbnails count toward this total."}
          </p>
          {isOwner && state.billing.plan === "family" && state.billing.checkoutAvailable ? (
            <div className="billing-panel">
              <div className="billing-state">
                <span aria-hidden="true" className="billing-state-dot" />
                <div>
                  <strong>{billingStatusTitle(state.billing)}</strong>
                  <span>{billingStatusDetail(state.billing)}</span>
                </div>
              </div>
              <div className="billing-actions">
                {state.billing.canManage ? (
                  <button
                    className="secondary-button"
                    disabled={billingBusy !== null}
                    onClick={() => void openBilling("portal")}
                    type="button"
                  >
                    {billingBusy === "portal"
                      ? "Opening…"
                      : state.billing.status === "active" || state.billing.status === "trialing"
                        ? "Manage or cancel"
                        : "View billing history"}
                  </button>
                ) : (
                  <>
                    <button
                      className="secondary-button"
                      disabled={billingBusy !== null}
                      onClick={() => void openBilling("monthly")}
                      type="button"
                    >
                      {billingBusy === "monthly" ? "Opening…" : "$6 monthly"}
                    </button>
                    <button
                      className="primary-button"
                      disabled={billingBusy !== null}
                      onClick={() => void openBilling("yearly")}
                      type="button"
                    >
                      {billingBusy === "yearly" ? "Opening…" : "$60 yearly"}
                    </button>
                  </>
                )}
                {state.billing.environment === "test_mode" ? (
                  <small>Dodo test mode · no real charge</small>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>
        <section className="settings-card">
          <div className="settings-heading">
            <span>
              <Users />
            </span>
            <div>
              <p className="eyebrow">People</p>
              <h2>Family members</h2>
            </div>
          </div>
          <div className="member-list">
            {state.members.map((member) => (
              <article className="member-row" key={member.id}>
                <span className="member-avatar">{initials(member.name)}</span>
                <div className="member-identity">
                  <strong>{member.name}</strong>
                  <small>{member.email}</small>
                </div>
                <div className="member-controls">
                  {member.role === "owner" ? (
                    <span className="role-badge">
                      <Crown size={13} /> Owner
                    </span>
                  ) : isOwner ? (
                    <select
                      aria-label={`${member.name} role`}
                      onChange={(event) =>
                        void mutate(
                          `/api/archive/members/${member.id}`,
                          { method: "PATCH", body: JSON.stringify({ role: event.target.value }) },
                          `${member.name}’s role was updated.`,
                        )
                      }
                      value={member.role}
                    >
                      <option value="parent">Parent</option>
                      <option value="contributor">Contributor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  ) : (
                    <span className="role-badge">{roleLabel(member.role)}</span>
                  )}
                  {isOwner && member.id !== state.currentMember.id ? (
                    <div className="row-actions">
                      <button
                        className="small-button"
                        onClick={() => {
                          if (
                            confirm(
                              `Make ${member.name} the archive owner? You will become a parent.`,
                            )
                          )
                            void mutate(
                              `/api/archive/members/${member.id}/transfer`,
                              { method: "POST" },
                              `Ownership was transferred to ${member.name}.`,
                            );
                        }}
                        type="button"
                      >
                        Transfer ownership
                      </button>
                      <button
                        className="danger-icon"
                        aria-label={`Remove ${member.name}`}
                        onClick={() => {
                          if (confirm(`Remove ${member.name} from this archive?`))
                            void mutate(
                              `/api/archive/members/${member.id}`,
                              { method: "DELETE" },
                              `${member.name} was removed.`,
                            );
                        }}
                        type="button"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
          {state.currentMember.role !== "owner" ? (
            <button
              className="leave-button"
              onClick={() => {
                if (confirm("Leave this family archive? You will lose access."))
                  void mutate(
                    `/api/archive/members/${state.currentMember.id}`,
                    { method: "DELETE" },
                    "You left the archive.",
                  ).then((ok) => {
                    if (ok) void authClient.signOut().then(() => location.reload());
                  });
              }}
              type="button"
            >
              Leave this archive
            </button>
          ) : (
            <p className="owner-note">
              <ShieldCheck size={15} /> Transfer ownership before leaving the archive.
            </p>
          )}
        </section>

        {!isVault ? (
          <section className="settings-card">
            <div className="settings-heading">
              <span>
                <Baby />
              </span>
              <div>
                <p className="eyebrow">Child profile</p>
                <h2>{childName}’s profile</h2>
              </div>
            </div>
            {canEditChild ? (
              <>
                <form className="settings-form" onSubmit={saveChild}>
                  <label>
                    Child’s full name
                    <input
                      onChange={(event) => setChildName(event.target.value)}
                      required
                      value={childName}
                    />
                  </label>
                  <label>
                    Date of birth
                    <input
                      onChange={(event) => setBirthDate(event.target.value)}
                      required
                      type="date"
                      value={birthDate}
                    />
                  </label>
                  {!state.children.length ? (
                    <p className="field-note">
                      We kept this blank so their age and future capsules are calculated from the
                      correct date.
                    </p>
                  ) : null}
                  <button className="primary-button" type="submit">
                    {state.children.length ? "Save profile" : "Create child profile"}
                  </button>
                </form>
                {state.children[0] ? (
                  <form className="settings-form child-access-settings" onSubmit={saveChildPin}>
                    <div className="child-access-heading">
                      <span>
                        <LockKeyhole size={16} />
                      </span>
                      <div>
                        <strong>
                          {state.children[0].childAccessEnabled
                            ? "Child sign-in is on"
                            : "Set up child sign-in"}
                        </strong>
                        <small>
                          {childName} uses this PIN instead of an email and sees only items marked
                          for their child view.
                        </small>
                      </div>
                    </div>
                    <label>
                      {state.children[0].childAccessEnabled
                        ? "Choose a new six-digit PIN"
                        : "Six-digit family PIN"}
                      <input
                        autoComplete="off"
                        inputMode="numeric"
                        maxLength={6}
                        minLength={6}
                        onChange={(event) => setChildPin(event.target.value.replace(/\D/g, ""))}
                        pattern="[0-9]{6}"
                        placeholder="••••••"
                        required
                        type="password"
                        value={childPin}
                      />
                    </label>
                    <label>
                      Confirm the six-digit PIN
                      <input
                        autoComplete="off"
                        inputMode="numeric"
                        maxLength={6}
                        minLength={6}
                        onChange={(event) =>
                          setChildPinConfirmation(event.target.value.replace(/\D/g, ""))
                        }
                        pattern="[0-9]{6}"
                        placeholder="••••••"
                        required
                        type="password"
                        value={childPinConfirmation}
                      />
                    </label>
                    <button
                      className="soft-button"
                      disabled={
                        childPin.length !== 6 ||
                        childPinConfirmation.length !== 6 ||
                        childPin !== childPinConfirmation
                      }
                      type="submit"
                    >
                      {state.children[0].childAccessEnabled
                        ? "Change PIN"
                        : "Turn on child sign-in"}
                    </button>
                    {state.children[0].childAccessEnabled ? (
                      <div className="child-access-test">
                        <span>
                          <Check size={15} /> Child sign-in is ready
                        </span>
                        <p>
                          {state.children[0].childActiveDeviceCount ?? 0} active{" "}
                          {(state.children[0].childActiveDeviceCount ?? 0) === 1
                            ? "device"
                            : "devices"}
                          {state.children[0].childLastAccessAt
                            ? ` · Last used ${formatDateTime(state.children[0].childLastAccessAt)}`
                            : " · Not used yet"}
                        </p>
                        <p>
                          Test the exact screen {childName} will use. You will stay signed in as a
                          parent.
                        </p>
                        <button
                          className="text-button"
                          onClick={() => window.location.assign("/?child=1")}
                          type="button"
                        >
                          Test {childName}’s sign-in <ArrowRight size={15} />
                        </button>
                        <button
                          className="disable-child-access"
                          onClick={() => void disableChildSignIn()}
                          type="button"
                        >
                          Turn off child sign-in
                        </button>
                      </div>
                    ) : null}
                  </form>
                ) : null}
              </>
            ) : (
              <p className="card-intro">An owner or parent can update the child profile.</p>
            )}
          </section>
        ) : null}

        {isOwner ? (
          <section className="settings-card invite-card">
            <div className="settings-heading">
              <span>
                <UserPlus />
              </span>
              <div>
                <p className="eyebrow">Invitation</p>
                <h2>Invite family</h2>
              </div>
            </div>
            <form className="settings-form invite-form" onSubmit={invite}>
              <label>
                Email address
                <input
                  inputMode="email"
                  onChange={(event) => setInviteEmail(event.target.value)}
                  required
                  type="email"
                  value={inviteEmail}
                />
              </label>
              <label>
                Role
                <select
                  onChange={(event) =>
                    setInviteRole(event.target.value as Exclude<FamilyRole, "owner">)
                  }
                  value={inviteRole}
                >
                  <option value="parent">Parent</option>
                  <option value="contributor">Contributor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </label>
              <button
                aria-busy={inviteBusy}
                className="primary-button"
                disabled={inviteBusy}
                type="submit"
              >
                <AnimatedActionLabel
                  showArrow={!inviteBusy}
                  text={inviteBusy ? "Sending…" : "Send invitation"}
                  transitionKey={inviteBusy ? "sending" : "idle"}
                />
              </button>
            </form>
            <p className="invite-privacy-note">
              We’ll email a private, seven-day link to this address. Anyone with the link can open
              the invitation, so only share the fallback copy with its intended recipient.
            </p>
            {inviteUrl ? (
              <div className="invite-result">
                <input aria-label="Invitation link" readOnly value={inviteUrl} />
                <button onClick={() => void copyInvite()} type="button">
                  {copied ? <Check /> : <Copy />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            ) : null}
            {state.invitations.length ? (
              <div className="pending-list">
                <p className="eyebrow">Pending</p>
                {state.invitations.map((item) => (
                  <div className="pending-invite" key={item.id}>
                    <span>
                      <strong>{item.email}</strong>
                      <small>
                        {roleLabel(item.role)} · expires {formatDate(item.expiresAt)}
                      </small>
                      <small className={`delivery-status is-${item.emailStatus}`}>
                        {item.emailStatus === "sent"
                          ? "Email sent"
                          : item.emailStatus === "failed"
                            ? "Email failed"
                            : "Not emailed"}
                      </small>
                    </span>
                    <span className="pending-actions">
                      <button onClick={() => void resendInvite(item)} type="button">
                        {item.emailStatus === "failed" ? "Retry" : "Send again"}
                      </button>
                      <button
                        aria-label={`Revoke invitation for ${item.email}`}
                        onClick={() =>
                          void mutate(
                            `/api/archive/invitations/${item.id}`,
                            { method: "DELETE" },
                            `Invitation for ${item.email} was revoked.`,
                          )
                        }
                        type="button"
                      >
                        <Trash2 size={15} />
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  );
}

function MemoryRow({ memory, onOpen }: { memory: Memory; onOpen: () => void }) {
  return (
    <button className="memory-row" onClick={onOpen} type="button">
      <span>{memoryIcon(memory.kind)}</span>
      <div>
        <h3>{memory.title}</h3>
        <p>
          {formatMemoryDate(memory.happenedAt)} · {memory.authorName ?? "Family"} ·{" "}
          {audienceLabel(memory.audience)}
        </p>
      </div>
      <Heart size={18} />
    </button>
  );
}

function MobileNav({ active, onNavigate }: { active: View; onNavigate: (view: View) => void }) {
  return (
    <nav className="mobile-nav" aria-label="Primary">
      <button className={active === "parent" ? "active" : ""} onClick={() => onNavigate("parent")}>
        <Home />
        <span>Home</span>
      </button>
      <button
        className={active === "timeline" ? "active" : ""}
        onClick={() => onNavigate("timeline")}
      >
        <Image />
        <span>Timeline</span>
      </button>
      <button
        className={active === "capsules" ? "active" : ""}
        onClick={() => onNavigate("capsules")}
      >
        <BookHeart />
        <span>Capsules</span>
      </button>
      <button className={active === "family" ? "active" : ""} onClick={() => onNavigate("family")}>
        <Users />
        <span>Family</span>
      </button>
    </nav>
  );
}

function apiFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (!headers.has("content-type")) headers.set("content-type", "application/json");
  return fetch(scopedApiPath(path), { ...init, headers });
}

function scopedApiPath(path: string) {
  const slug = currentFamilySlug();
  if (!slug || !path.startsWith("/api/")) return path;
  if (!path.startsWith("/api/archive") && !path.startsWith("/api/media")) return path;
  return `/api/families/${encodeURIComponent(slug)}${path.slice(4)}`;
}

function currentFamilySlug() {
  if (typeof window === "undefined") return "";
  const [first = ""] = window.location.pathname.split("/").filter(Boolean);
  return first;
}

function currentArchiveView(): View {
  if (typeof window === "undefined") return "parent";
  const [, section = ""] = window.location.pathname.split("/").filter(Boolean);
  if (section === "timeline" || section === "capsules" || section === "child") return section;
  if (section === "family" || section === "settings") return "family";
  return "parent";
}

function requestedRedirect() {
  if (typeof window === "undefined") return "/";
  const value = new URLSearchParams(location.search).get("redirect") ?? "/";
  return value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

async function responseError(response: Response) {
  try {
    return ((await response.json()) as { error?: string }).error ?? "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

function roleLabel(role: FamilyRole) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function roleDescription(role: FamilyRole) {
  if (role === "parent") return "Parents can manage the archive and add memories.";
  if (role === "contributor") return "Contributors can add memories to the child’s story.";
  if (role === "viewer") return "Viewers can see family memories shared with them.";
  return "Owners manage the family archive.";
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

function billingStatusTitle(billing: ArchiveState["billing"]) {
  if (!billing.canManage) return "No paid subscription";
  if (billing.cancelAtPeriodEnd) return "Cancellation scheduled";
  if (billing.status === "past_due") return "Payment needs attention";
  if (billing.status === "canceled") return "Subscription ended";
  if (billing.status === "trialing") return "Trial active";
  const price = billing.interval === "monthly" ? "$6 monthly" : "$60 yearly";
  return billing.interval ? `${price} · Active` : "Subscription active";
}

function billingStatusDetail(billing: ArchiveState["billing"]) {
  if (!billing.canManage) return "No charges or invoices. Choose a plan when you’re ready.";
  if (billing.cancelAtPeriodEnd && billing.currentPeriodEndsAt) {
    return `Access continues until ${formatDate(billing.currentPeriodEndsAt)}.`;
  }
  if (billing.status === "active" && billing.currentPeriodEndsAt) {
    return `Renews ${formatDate(billing.currentPeriodEndsAt)}. Dodo handles invoices and cancellation.`;
  }
  if (billing.status === "trialing" && billing.trialEndsAt) {
    return `Trial ends ${formatDate(billing.trialEndsAt)}.`;
  }
  return "Open Dodo’s secure portal for invoices, payment methods, and plan controls.";
}

function formatDateTime(value: string) {
  const normalized = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(normalized),
  );
}

function formatMemoryDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

function formatMediaTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

async function createVideoThumbnail(file: File): Promise<Blob | null> {
  const objectUrl = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = objectUrl;

  try {
    video.load();
    await waitForVideoEvent(video, "loadeddata");
    if (Number.isFinite(video.duration) && video.duration > 0.12) {
      video.currentTime = 0.1;
      await waitForVideoEvent(video, "seeked");
    }

    if (!video.videoWidth || !video.videoHeight) return null;
    const scale = Math.min(1, 960 / video.videoWidth, 720 / video.videoHeight);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
    canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.84));
  } finally {
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(objectUrl);
  }
}

function waitForVideoEvent(video: HTMLVideoElement, eventName: "loadeddata" | "seeked") {
  return new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => finish(new Error("Video frame timed out.")), 12_000);
    const onEvent = () => finish();
    const onError = () => finish(new Error("This video format cannot provide a thumbnail."));
    function finish(error?: Error) {
      window.clearTimeout(timeout);
      video.removeEventListener(eventName, onEvent);
      video.removeEventListener("error", onError);
      if (error) reject(error);
      else resolve();
    }
    video.addEventListener(eventName, onEvent, { once: true });
    video.addEventListener("error", onError, { once: true });
  });
}

async function waveformFromAudio(blob: Blob): Promise<number[]> {
  try {
    const context = new AudioContext();
    const buffer = await context.decodeAudioData(await blob.arrayBuffer());
    const samples = buffer.getChannelData(0);
    const bars = WAVEFORM_BARS.length;
    const bucketSize = Math.max(1, Math.floor(samples.length / bars));
    const amplitudes = Array.from({ length: bars }, (_, index) => {
      const start = index * bucketSize;
      const end = Math.min(samples.length, start + bucketSize);
      let sum = 0;
      for (let sample = start; sample < end; sample += 1) sum += samples[sample] ** 2;
      return Math.sqrt(sum / Math.max(1, end - start));
    });
    const peak = Math.max(...amplitudes, 0.01);
    await context.close();
    return amplitudes.map((amplitude) => Math.round(8 + (amplitude / peak) * 34));
  } catch {
    return WAVEFORM_BARS;
  }
}

function currentLocalDateTime() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function defaultCapsuleDate() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  date.setMinutes(0, 0, 0);
  return toLocalDateTime(date.toISOString());
}

function toLocalDateTime(value: string) {
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function useDocumentScrollLock() {
  useEffect(() => {
    const scrollY = window.scrollY;
    const previous = {
      bodyOverflow: document.body.style.overflow,
      bodyPosition: document.body.style.position,
      bodyTop: document.body.style.top,
      bodyWidth: document.body.style.width,
      htmlOverflow: document.documentElement.style.overflow,
      htmlOverscroll: document.documentElement.style.overscrollBehavior,
    };
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overflow = previous.bodyOverflow;
      document.body.style.position = previous.bodyPosition;
      document.body.style.top = previous.bodyTop;
      document.body.style.width = previous.bodyWidth;
      document.documentElement.style.overflow = previous.htmlOverflow;
      document.documentElement.style.overscrollBehavior = previous.htmlOverscroll;
      window.scrollTo(0, scrollY);
    };
  }, []);
}

function useSheetTransition(onClose: () => void, blocked: boolean) {
  const [closing, setClosing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const requestClose = useCallback(
    (force = false) => {
      if (closing || (blocked && !force)) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        onClose();
        return;
      }
      setClosing(true);
      timer.current = setTimeout(onClose, 190);
    },
    [blocked, closing, onClose],
  );

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") requestClose();
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [requestClose]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return { closing, requestClose };
}

function MemoryStageLabel({ stage }: { stage: "idle" | "saving" | "uploading" }) {
  return (
    <AnimatedActionLabel
      showArrow={stage === "idle"}
      text={
        stage === "saving"
          ? "Saving memory…"
          : stage === "uploading"
            ? "Keeping media private…"
            : "Keep this memory"
      }
      transitionKey={stage}
    />
  );
}

function AnimatedActionLabel({
  showArrow,
  text,
  transitionKey,
}: {
  showArrow: boolean;
  text: string;
  transitionKey: string;
}) {
  const [shown, setShown] = useState({ showArrow, text, transitionKey });
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");

  useEffect(() => {
    if (transitionKey === shown.transitionKey) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown({ showArrow, text, transitionKey });
      setPhase("idle");
      return;
    }
    setPhase("out");
    const swap = setTimeout(() => {
      setShown({ showArrow, text, transitionKey });
      setPhase("in");
    }, 90);
    const settle = setTimeout(() => setPhase("idle"), 230);
    return () => {
      clearTimeout(swap);
      clearTimeout(settle);
    };
  }, [transitionKey]);

  return (
    <span aria-live="polite" className={`stage-label is-${phase}`}>
      {shown.text}
      {shown.showArrow ? <ArrowRight size={17} /> : null}
    </span>
  );
}

function kindLabel(kind: MemoryKind) {
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

function audienceLabel(audience: Memory["audience"]) {
  if (audience === "all") return "Everyone";
  if (audience === "child") return "For child";
  if (audience === "parents") return "Parents only";
  return "Family";
}

function memoryIcon(kind: MemoryKind) {
  return (
    <img alt="" className="memory-kind-art" draggable={false} src={`/memory-icons/${kind}.png`} />
  );
}

function memoryTitlePlaceholder(kind: MemoryKind) {
  if (kind === "photo") return "That sleepy afternoon smile";
  if (kind === "voice") return "The sound they made today";
  if (kind === "video") return "A little moment in motion";
  if (kind === "milestone") return "They reached for us";
  if (kind === "letter") return "For the day you wonder…";
  return "A small moment worth keeping";
}

function memoryBodyPlaceholder(kind: MemoryKind) {
  if (kind === "letter") return "Dear you…";
  if (kind === "milestone") return "What happened, and how did it feel?";
  return "Write the detail a photograph or recording cannot hold…";
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(0)} GB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
