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
  FileAudio,
  Heart,
  Home,
  Image,
  LockKeyhole,
  LogOut,
  Plus,
  PenLine,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

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
type MemoryKind = "photo" | "story" | "voice" | "milestone" | "letter";
type Memory = {
  id: string;
  childId: string;
  kind: MemoryKind;
  title: string;
  body: string | null;
  happenedAt: string;
  audience: "parents" | "family" | "child";
  createdAt: string;
  createdByUserId: string | null;
  authorName: string | null;
  mediaId: string | null;
  mediaType: "image" | "audio" | null;
  contentType: string | null;
  byteSize: number | null;
};
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
  memories: Memory[];
  invitations: PendingInvitation[];
};
type View = "parent" | "timeline" | "child" | "family";

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

  return (
    <main className="app-shell">
      <header className="app-header">
        <Brand compact />
        <div className="header-actions">
          <div className="view-switch" aria-label="Archive view">
            <button className={view === "parent" ? "active" : ""} onClick={() => setView("parent")}>
              Parent
            </button>
            <button
              className={view === "timeline" ? "active" : ""}
              onClick={() => setView("timeline")}
            >
              Timeline
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
        <ParentView
          child={state.children[0]}
          currentUserId={state.currentMember.userId}
          memories={state.memories}
          name={name}
          onNavigate={setView}
          refresh={refresh}
          role={state.currentMember.role}
        />
      ) : null}
      {view === "timeline" ? (
        <TimelineView
          child={state.children[0]}
          currentUserId={state.currentMember.userId}
          memories={state.memories}
          onNavigate={setView}
          refresh={refresh}
          role={state.currentMember.role}
        />
      ) : null}
      {view === "child" ? <ChildView child={state.children[0]} memories={state.memories} /> : null}
      {view === "family" ? <FamilySettings state={state} refresh={refresh} /> : null}
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
}: {
  name: string;
  child?: Child;
  currentUserId: string;
  memories: Memory[];
  onNavigate: (view: View) => void;
  refresh: () => Promise<void>;
  role: FamilyRole;
}) {
  const [composerKind, setComposerKind] = useState<MemoryKind | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const canCreate = role !== "viewer";
  const childName = child?.displayName ?? "Diki Choetso";
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
            <h1>{childName}’s story</h1>
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
              <p className="eyebrow">
                {isDemoMemory(featured) ? "Sample · " : ""}Latest {kindLabel(featured.kind)}
              </p>
              <h2>{featured.title}</h2>
              {featured.body ? <p>{featured.body}</p> : null}
              {featured.mediaType === "audio" && featured.mediaId ? (
                <audio
                  className="memory-audio"
                  controls
                  preload="metadata"
                  src={`/api/media/${featured.mediaId}`}
                />
              ) : null}
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
            <p>A sleepy expression, a new sound, a photograph, or simply what today felt like.</p>
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
          <button disabled={!canCreate || !child} onClick={() => openComposer("milestone")}>
            {memoryIcon("milestone")} Milestone
          </button>
        </div>
        {!child ? (
          <p className="capture-note">Create Diki’s profile in Family before adding memories.</p>
        ) : null}
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
      {composerKind && child ? (
        <MemoryComposer
          child={child}
          initialKind={composerKind}
          onClose={() => setComposerKind(null)}
          onCreated={async () => {
            await refresh();
            setComposerKind(null);
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
            setSelectedMemory(null);
          }}
          role={role}
        />
      ) : null}
    </div>
  );
}

function ChildView({ child, memories }: { child?: Child; memories: Memory[] }) {
  const childMemories = memories.filter((memory) => memory.audience === "child");
  const featured = childMemories[0];
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const childName = child?.displayName ?? "Diki Choetso";
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
            <button
              className={`story-card child-story-button ${index === 0 ? "large" : ""}`}
              key={memory.id}
              onClick={() => setSelectedMemory(memory)}
              type="button"
            >
              {memory.mediaType === "image" ? <MemoryMedia memory={memory} featured /> : null}
              <p className="eyebrow">
                {isDemoMemory(memory) ? "Sample · " : ""}
                {kindLabel(memory.kind)} from {memory.authorName ?? "your family"}
              </p>
              <h2>{memory.title}</h2>
              {memory.body ? <p>{memory.body}</p> : null}
              {memory.mediaType === "audio" && memory.mediaId ? (
                <audio
                  className="memory-audio"
                  controls
                  preload="metadata"
                  src={`/api/media/${memory.mediaId}`}
                />
              ) : null}
            </button>
          ))}
        </section>
      ) : (
        <section className="child-empty">
          <Sparkles />
          <h2>Your family is still gathering your stories.</h2>
          <p>The memories marked “For Diki” will appear here.</p>
        </section>
      )}
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
  onNavigate,
  refresh,
  role,
}: {
  child?: Child;
  currentUserId: string;
  memories: Memory[];
  onNavigate: (view: View) => void;
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
        <p className="eyebrow">Her days, kept gently</p>
        <h1>{child?.displayName ?? "Diki Choetso"}’s timeline</h1>
        <p>Every small beginning, in the order your family remembers it.</p>
      </section>
      <div className="timeline-filters" aria-label="Filter memories">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
          type="button"
        >
          All
        </button>
        {(["photo", "story", "voice", "milestone", "letter"] as MemoryKind[]).map((kind) => (
          <button
            className={filter === kind ? "active" : ""}
            key={kind}
            onClick={() => setFilter(kind)}
            type="button"
          >
            {memoryIcon(kind)}
            <span>{kindLabel(kind)}</span>
          </button>
        ))}
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
                  <button
                    className="timeline-card"
                    key={memory.id}
                    onClick={() => setSelectedMemory(memory)}
                    type="button"
                  >
                    <MemoryMedia memory={memory} />
                    <span className="timeline-card-copy">
                      <small>
                        {isDemoMemory(memory) ? "Sample · " : ""}
                        {kindLabel(memory.kind)} · {audienceLabel(memory.audience)}
                      </small>
                      <strong>{memory.title}</strong>
                      <span>{memory.body ?? `Kept by ${memory.authorName ?? "family"}`}</span>
                    </span>
                  </button>
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
      <MobileNav active="timeline" onNavigate={onNavigate} />
      {selectedMemory && child ? (
        <MemoryDetail
          child={child}
          currentUserId={currentUserId}
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
          onChanged={async () => {
            await refresh();
            setSelectedMemory(null);
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
  const canEdit =
    role === "owner" ||
    role === "parent" ||
    (role === "contributor" && memory.createdByUserId === currentUserId);
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
  }

  return (
    <div
      className="composer-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
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
              {isDemoMemory(memory) ? "Sample · " : ""}
              {kindLabel(memory.kind)} · {audienceLabel(memory.audience)}
            </p>
            <h2 id="memory-detail-title">{editing ? "Edit this memory" : memory.title}</h2>
          </div>
          <button aria-label="Close" disabled={busy} onClick={onClose} type="button">
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
                  {role === "owner" || role === "parent" ? (
                    <option value="parents">Parents only</option>
                  ) : null}
                  <option value="child">For Diki</option>
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
            {memory.mediaType === "audio" && memory.mediaId ? (
              <audio
                className="memory-audio"
                controls
                preload="metadata"
                src={`/api/media/${memory.mediaId}`}
              />
            ) : null}
            <p className="detail-meta">
              Kept by {memory.authorName ?? "family"} · {formatMemoryDate(memory.happenedAt)}
            </p>
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
  const [audience, setAudience] = useState<"parents" | "family" | "child">("family");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [stage, setStage] = useState<"idle" | "saving" | "uploading">("idle");

  const needsMedia = kind === "photo" || kind === "voice";
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
        kind === "photo" ? "Choose a photograph to keep." : "Choose an audio recording to keep.",
      );
      return;
    }
    if (file && file.size > 25 * 1024 * 1024) {
      setError("Media files must be 25 MB or smaller.");
      return;
    }

    setError("");
    setStage("saving");
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
      const upload = await fetch(`/api/archive/memories/${created.id}/media`, {
        method: "PUT",
        headers: { "content-type": file.type },
        body: file,
      });
      if (!upload.ok) {
        await apiFetch(`/api/archive/memories/${created.id}`, { method: "DELETE" });
        setError(await responseError(upload));
        setStage("idle");
        return;
      }
    }

    await onCreated();
  }

  return (
    <div
      className="composer-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && stage === "idle") onClose();
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
            <h2 id="composer-title">A new memory for {child.displayName}</h2>
          </div>
          <button aria-label="Close" disabled={stage !== "idle"} onClick={onClose} type="button">
            <X />
          </button>
        </header>

        <div className="kind-picker" aria-label="Memory type">
          {(["photo", "story", "voice", "milestone", "letter"] as MemoryKind[]).map((item) => (
            <button
              className={kind === item ? "active" : ""}
              key={item}
              onClick={() => chooseKind(item)}
              type="button"
            >
              {memoryIcon(item)}
              <span>{kindLabel(item)}</span>
            </button>
          ))}
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

          {needsMedia ? (
            <label className="media-drop">
              {kind === "photo" ? <Camera /> : <FileAudio />}
              <span>
                <strong>
                  {file
                    ? file.name
                    : kind === "photo"
                      ? "Choose a photograph"
                      : "Choose an audio recording"}
                </strong>
                <small>
                  {file
                    ? formatFileSize(file.size)
                    : "JPEG, PNG, WebP, MP3, M4A, WebM, OGG or WAV · up to 25 MB"}
                </small>
              </span>
              <input
                accept={
                  kind === "photo"
                    ? "image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
                    : "audio/mpeg,audio/mp4,audio/x-m4a,audio/aac,audio/webm,audio/ogg,audio/wav,audio/wave,audio/x-wav"
                }
                capture={kind === "voice" ? "user" : undefined}
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                required
                type="file"
              />
            </label>
          ) : null}

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
                {role === "owner" || role === "parent" ? (
                  <option value="parents">Parents only</option>
                ) : null}
                <option value="child">For Diki</option>
              </select>
            </label>
          </div>
          <p className="audience-note">
            {audience === "child"
              ? "This will appear in Diki’s child view."
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
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button className="primary-button" disabled={stage !== "idle"} type="submit">
              {stage === "saving"
                ? "Saving memory…"
                : stage === "uploading"
                  ? "Keeping media private…"
                  : "Keep this memory"}
              {stage === "idle" ? <ArrowRight size={17} /> : null}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function MemoryMedia({ memory, featured = false }: { memory: Memory; featured?: boolean }) {
  if (memory.mediaType === "image" && memory.mediaId) {
    return (
      <div className={`memory-photo real-photo ${featured ? "featured" : ""}`}>
        <img alt="" loading={featured ? "eager" : "lazy"} src={`/api/media/${memory.mediaId}`} />
        <span>{formatMemoryDate(memory.happenedAt)}</span>
      </div>
    );
  }
  return (
    <div className={`memory-photo memory-symbol ${memory.kind}`}>
      {memoryIcon(memory.kind)}
      <span>{formatMemoryDate(memory.happenedAt)}</span>
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

function MemoryRow({ memory, onOpen }: { memory: Memory; onOpen: () => void }) {
  return (
    <button className="memory-row" onClick={onOpen} type="button">
      <span>{memoryIcon(memory.kind)}</span>
      <div>
        <h3>{memory.title}</h3>
        <p>
          {formatMemoryDate(memory.happenedAt)} · {memory.authorName ?? "Family"} ·{" "}
          {audienceLabel(memory.audience)}
          {isDemoMemory(memory) ? " · Sample" : ""}
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
        Home
      </button>
      <button
        className={active === "timeline" ? "active" : ""}
        onClick={() => onNavigate("timeline")}
      >
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

function formatMemoryDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

function currentLocalDateTime() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
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

function kindLabel(kind: MemoryKind) {
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

function audienceLabel(audience: Memory["audience"]) {
  if (audience === "child") return "For Diki";
  if (audience === "parents") return "Parents only";
  return "Family";
}

function memoryIcon(kind: MemoryKind) {
  return <img alt="" className="memory-kind-art" src={`/memory-icons/${kind}.png`} />;
}

function memoryTitlePlaceholder(kind: MemoryKind) {
  if (kind === "photo") return "That sleepy afternoon smile";
  if (kind === "voice") return "The sound she made today";
  if (kind === "milestone") return "She reached for us";
  if (kind === "letter") return "For the day you wonder…";
  return "A small moment worth keeping";
}

function memoryBodyPlaceholder(kind: MemoryKind) {
  if (kind === "letter") return "Dear Diki…";
  if (kind === "milestone") return "What happened, and how did it feel?";
  return "Write the detail a photograph or recording cannot hold…";
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isDemoMemory(memory: Memory) {
  return memory.id.startsWith("demo-memory-");
}
