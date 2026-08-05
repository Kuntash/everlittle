import { createFileRoute } from "@tanstack/react-router";
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
  Heart,
  Home,
  Image,
  KeyRound,
  LockKeyhole,
  LogOut,
  Mic,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/")({ component: Everlittle });

type PlatformState = { needsSetup: boolean };
type InvitationPreview = {
  archiveName: string;
  email: string;
  role: FamilyRole;
  expiresAt: string;
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
type Child = { id: string; displayName: string; birthDate: string; avatarAssetKey?: string | null };
type PendingInvitation = {
  id: string;
  email: string;
  role: Exclude<FamilyRole, "owner">;
  expiresAt: string;
  createdAt: string;
};
type ArchiveState = {
  archive: { id: string; name: string; slug: string; timezone: string; createdAt: string };
  currentMember: { id: string; role: FamilyRole; userId: string };
  members: Member[];
  children: Child[];
  invitations: PendingInvitation[];
};
type View = "parent" | "child" | "family";

function Everlittle() {
  const session = authClient.useSession();
  const [platform, setPlatform] = useState<PlatformState | null>(null);
  const [invitation, setInvitation] = useState<InvitationPreview | null>(null);
  const [invitationChecked, setInvitationChecked] = useState(false);
  const inviteToken =
    typeof window === "undefined" ? "" : (new URLSearchParams(location.search).get("invite") ?? "");

  useEffect(() => {
    void fetch("/api/platform")
      .then((response) => response.json() as Promise<PlatformState>)
      .then(setPlatform);
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

  if (session.isPending || !platform || !invitationChecked) return <Loading />;
  if (!session.data?.user) {
    return (
      <AccessScreen
        invitation={invitation}
        inviteToken={inviteToken}
        needsSetup={platform.needsSetup}
      />
    );
  }
  if (invitation) {
    return <InvitationAcceptance invitation={invitation} token={inviteToken} />;
  }

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

function AccessScreen({
  invitation,
  inviteToken,
  needsSetup,
}: {
  invitation: InvitationPreview | null;
  inviteToken: string;
  needsSetup: boolean;
}) {
  const isInvitation = Boolean(invitation && inviteToken);
  const [mode, setMode] = useState<"sign-in" | "setup">(
    needsSetup || isInvitation ? "setup" : "sign-in",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState(invitation?.email ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    inviteToken && !invitation ? "This invitation is invalid or has expired." : "",
  );
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const result =
      mode === "setup"
        ? await authClient.signUp.email(
            { name, email, password },
            isInvitation ? { headers: { "x-everlittle-invitation": inviteToken } } : undefined,
          )
        : await authClient.signIn.email({ email, password });

    if (result.error) {
      setError(result.error.message ?? "We could not open your archive.");
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

    window.location.assign("/");
  }

  return (
    <main className="access-shell">
      <section className="access-story" aria-labelledby="access-heading">
        <Brand />
        <div className="story-copy">
          <p className="eyebrow">Private family archive</p>
          <h1 id="access-heading">A place for the memories she’ll grow into.</h1>
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
          <p className="eyebrow">
            {isInvitation
              ? `Invitation to ${invitation?.archiveName ?? "your family"}`
              : mode === "setup"
                ? "Begin your archive"
                : "Welcome back"}
          </p>
          <h2>
            {isInvitation
              ? "Join Diki Choetso’s family archive"
              : mode === "setup"
                ? "Create your family’s private place"
                : "Your memories are waiting"}
          </h2>
          <p className="card-intro">
            {isInvitation
              ? `You were invited as ${roleLabel(invitation?.role ?? "parent")} using ${invitation?.email ?? email}.`
              : mode === "setup"
                ? "The first account becomes the archive owner."
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
                ? "Opening…"
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

          {isInvitation ? (
            <button
              className="text-button"
              onClick={() => setMode(mode === "setup" ? "sign-in" : "setup")}
              type="button"
            >
              {mode === "setup" ? "I already have an account" : "Create a new account"}
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

function InvitationAcceptance({
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
          Continue as {invitation.email} with the {roleLabel(invitation.role)} role.
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
  const [view, setView] = useState<View>("parent");
  const [state, setState] = useState<ArchiveState | null>(null);
  const [error, setError] = useState("");

  async function refresh() {
    const response = await fetch("/api/archive");
    if (!response.ok) {
      setError(await responseError(response));
      return;
    }
    setState((await response.json()) as ArchiveState);
    setError("");
  }

  useEffect(() => {
    void refresh();
  }, []);

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

  const childName = state.children[0]?.displayName ?? "Diki Choetso";

  return (
    <main className="app-shell">
      <header className="app-header">
        <Brand compact />
        <div className="header-actions">
          <div className="view-switch" aria-label="Archive view">
            <button className={view === "parent" ? "active" : ""} onClick={() => setView("parent")}>
              Parent
            </button>
            <button className={view === "child" ? "active" : ""} onClick={() => setView("child")}>
              Child
            </button>
            <button className={view === "family" ? "active" : ""} onClick={() => setView("family")}>
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
        <ParentView name={name} childName={childName} onNavigate={setView} />
      ) : null}
      {view === "child" ? <ChildView childName={childName} /> : null}
      {view === "family" ? <FamilySettings state={state} refresh={refresh} /> : null}
    </main>
  );
}

function ParentView({
  name,
  childName,
  onNavigate,
}: {
  name: string;
  childName: string;
  onNavigate: (view: View) => void;
}) {
  return (
    <div className="archive-layout">
      <section className="archive-main">
        <p className="eyebrow">Good morning, {name}</p>
        <div className="page-title-row">
          <div>
            <h1>{childName}’s story</h1>
            <p>A private family archive · ready for her first memory</p>
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
            <p className="eyebrow">Design preview</p>
            <h2>Your first monsoon</h2>
            <p>You pressed your tiny hands to the window and watched the rain arrive.</p>
            <span className="byline">A sample of how Diki’s memories will feel</span>
          </div>
        </article>
        <div className="section-heading">
          <h2>Recent memories</h2>
          <button>See timeline</button>
        </div>
        <div className="memory-list">
          <MemoryRow icon={<Camera />} title="Morning giggles" meta="Photo memory" />
          <MemoryRow icon={<Mic />} title="Bath time stories" meta="Voice memory" />
          <MemoryRow icon={<BookHeart />} title="To my little adventurer" meta="Future letter" />
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
          <p>Write a note now for Diki to open one day.</p>
          <button>
            Add a note <ArrowRight size={16} />
          </button>
        </div>
      </aside>
      <MobileNav active="parent" onNavigate={onNavigate} />
    </div>
  );
}

function ChildView({ childName }: { childName: string }) {
  return (
    <div className="child-view">
      <section className="child-hero">
        <p className="eyebrow">This story is yours</p>
        <h1>Hi, {childName}.</h1>
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

function FamilySettings({ state, refresh }: { state: ArchiveState; refresh: () => Promise<void> }) {
  const isOwner = state.currentMember.role === "owner";
  const canEditChild = isOwner || state.currentMember.role === "parent";
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Exclude<FamilyRole, "owner">>("parent");
  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [childName, setChildName] = useState(state.children[0]?.displayName ?? "Diki Choetso");
  const [birthDate, setBirthDate] = useState(state.children[0]?.birthDate ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
    const response = await apiFetch("/api/archive/invitations", {
      method: "POST",
      body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
    });
    if (!response.ok) {
      setError(await responseError(response));
      return;
    }
    const result = (await response.json()) as { invitationUrl: string };
    setInviteUrl(result.invitationUrl);
    setInviteEmail("");
    setMessage("Invitation link created.");
    setError("");
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
      child ? "Diki’s profile was updated." : "Diki’s profile is ready.",
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
          Invite the people who will help keep Diki Choetso’s story, then hand ownership to her
          mother when she is ready.
        </p>
      </section>
      {message ? (
        <p className="status-message">
          <Check size={16} /> {message}
        </p>
      ) : null}
      {error ? <p className="form-error">{error}</p> : null}

      <div className="family-grid">
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

        <section className="settings-card">
          <div className="settings-heading">
            <span>
              <Baby />
            </span>
            <div>
              <p className="eyebrow">Her story</p>
              <h2>Diki’s profile</h2>
            </div>
          </div>
          {canEditChild ? (
            <form className="settings-form" onSubmit={saveChild}>
              <label>
                Her full name
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
                  We kept this blank so her age and future capsules are calculated from the correct
                  date.
                </p>
              ) : null}
              <button className="primary-button" type="submit">
                {state.children.length ? "Save profile" : "Create Diki’s profile"}
              </button>
            </form>
          ) : (
            <p className="card-intro">An owner or parent can update Diki’s profile.</p>
          )}
        </section>

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
              <button className="primary-button" type="submit">
                Create invite link <ArrowRight size={17} />
              </button>
            </form>
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
                  <div key={item.id}>
                    <span>
                      <strong>{item.email}</strong>
                      <small>
                        {roleLabel(item.role)} · expires {formatDate(item.expiresAt)}
                      </small>
                    </span>
                    <button
                      aria-label={`Revoke invitation for ${item.email}`}
                      onClick={() =>
                        void mutate(
                          `/api/archive/invitations/${item.id}`,
                          { method: "DELETE" },
                          `Invitation for ${item.email} was revoked.`,
                        )
                      }
                    >
                      <Trash2 size={15} />
                    </button>
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

function MemoryRow({ icon, title, meta }: { icon: ReactNode; title: string; meta: string }) {
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

function MobileNav({ active, onNavigate }: { active: View; onNavigate: (view: View) => void }) {
  return (
    <nav className="mobile-nav" aria-label="Primary">
      <button className={active === "parent" ? "active" : ""} onClick={() => onNavigate("parent")}>
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
      <button className={active === "family" ? "active" : ""} onClick={() => onNavigate("family")}>
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

function apiFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (!headers.has("content-type")) headers.set("content-type", "application/json");
  return fetch(path, { ...init, headers });
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
