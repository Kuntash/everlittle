import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, LockKeyhole, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { authClient } from "@/lib/auth-client";
import { Brand } from "@/components/brand";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

type Draft = {
  familyName: string | null;
  familySlug: string | null;
  childName: string | null;
  childBirthDate: string | null;
  timezone: string | null;
  profileKind?: "child" | "vault" | null;
};

const sections = ["Your archive", "Memory focus", "Privacy"] as const;

function Onboarding() {
  const session = authClient.useSession();
  const [section, setSection] = useState(0);
  const [familyName, setFamilyName] = useState("");
  const [familySlug, setFamilySlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [childName, setChildName] = useState("");
  const [childBirthDate, setChildBirthDate] = useState("");
  const [profileKind, setProfileKind] = useState<"child" | "vault">("child");
  const [timezone, setTimezone] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  );
  const [enablePin, setEnablePin] = useState(true);
  const [childPin, setChildPin] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session.isPending) return;
    if (!session.data?.user) {
      location.replace("/");
      return;
    }
    void fetch("/api/onboarding")
      .then(async (response) => {
        if (!response.ok) throw new Error("We could not restore your setup.");
        return response.json() as Promise<
          { complete: true; archiveSlug: string } | { complete: false; draft: Draft | null }
        >;
      })
      .then((state) => {
        if (state.complete) {
          location.replace(`/${encodeURIComponent(state.archiveSlug)}`);
          return;
        }
        if (state.draft) {
          setFamilyName(state.draft.familyName ?? "");
          setFamilySlug(state.draft.familySlug ?? "");
          setSlugEdited(Boolean(state.draft.familySlug));
          setChildName(state.draft.childName ?? "");
          setChildBirthDate(state.draft.childBirthDate ?? "");
          setProfileKind(state.draft.profileKind ?? "child");
          if (state.draft.profileKind === "vault") setEnablePin(false);
          setTimezone(
            state.draft.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC",
          );
          if (
            state.draft.profileKind === "vault" ||
            (state.draft.childName && state.draft.childBirthDate)
          )
            setSection(2);
          else if (state.draft.familyName && state.draft.familySlug) setSection(1);
        }
      })
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, [session.data?.user, session.isPending]);

  useEffect(() => {
    if (!familySlug || familySlug.length < 3) {
      setSlugAvailable(null);
      return;
    }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      void fetch(`/api/onboarding/slug?slug=${encodeURIComponent(familySlug)}`, {
        signal: controller.signal,
      })
        .then((response) => response.json() as Promise<{ available: boolean }>)
        .then(({ available }) => setSlugAvailable(available))
        .catch((reason: Error) => {
          if (reason.name !== "AbortError") setSlugAvailable(null);
        });
    }, 350);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [familySlug]);

  function updateFamilyName(value: string) {
    setFamilyName(value);
    if (!slugEdited) setFamilySlug(toSlug(value));
  }

  async function saveDraft(nextSection: number) {
    setError("");
    setSaving(true);
    const response = await fetch("/api/onboarding", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        familyName: familyName || undefined,
        familySlug: familySlug || undefined,
        childName: childName || undefined,
        childBirthDate: childBirthDate || undefined,
        profileKind,
        timezone: timezone || undefined,
      }),
    });
    if (!response.ok) {
      setError(await responseMessage(response));
      setSaving(false);
      return;
    }
    setSection(nextSection);
    setSaving(false);
  }

  async function complete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        familyName,
        familySlug,
        profileKind,
        childName: profileKind === "child" ? childName : undefined,
        childBirthDate: profileKind === "child" ? childBirthDate : undefined,
        timezone,
        childPin: profileKind === "child" && enablePin ? childPin : "",
      }),
    });
    if (!response.ok) {
      setError(await responseMessage(response));
      setSaving(false);
      return;
    }
    const result = (await response.json()) as { archiveSlug: string };
    location.assign(`/${encodeURIComponent(result.archiveSlug)}`);
  }

  if (loading || session.isPending) {
    return (
      <OnboardingShell>
        <div className="onboarding-skeleton" aria-label="Loading setup" />
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell>
      <nav className="onboarding-progress" aria-label="Setup progress">
        {sections.map((label, index) => (
          <button
            aria-current={section === index ? "step" : undefined}
            disabled={index > section}
            key={label}
            onClick={() => setSection(index)}
            type="button"
          >
            {index < section ? <Check size={14} /> : null}
            {label}
          </button>
        ))}
      </nav>

      {section === 0 ? (
        <section className="onboarding-panel">
          <p className="eyebrow">Begin with a home</p>
          <h1>Name your family archive</h1>
          <p className="onboarding-intro">
            This name stays private. The address is what your family will use to open it.
          </p>
          <div className="onboarding-fields">
            <label>
              Family name
              <input
                autoFocus
                onChange={(event) => updateFamilyName(event.target.value)}
                placeholder="The Norbu family"
                value={familyName}
              />
            </label>
            <label>
              Family address
              <div className="slug-field">
                <span>geteverlittle.com/</span>
                <input
                  aria-describedby="slug-status"
                  onChange={(event) => {
                    setSlugEdited(true);
                    setFamilySlug(toSlug(event.target.value));
                  }}
                  placeholder="norbu-family"
                  value={familySlug}
                />
              </div>
              <small
                className={slugAvailable === false ? "field-status error" : "field-status"}
                id="slug-status"
              >
                {slugAvailable === true
                  ? "This address is available."
                  : slugAvailable === false
                    ? "That address is not available."
                    : "Use 3-48 lowercase letters, numbers, or hyphens."}
              </small>
            </label>
          </div>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          <button
            className="primary-button"
            disabled={saving || !familyName || slugAvailable !== true}
            onClick={() => void saveDraft(1)}
            type="button"
          >
            {saving ? "Saving…" : "Choose what to keep"} <ArrowRight size={18} />
          </button>
        </section>
      ) : null}

      {section === 1 ? (
        <section className="onboarding-panel">
          <button className="onboarding-back" onClick={() => setSection(0)} type="button">
            <ArrowLeft size={15} /> Family details
          </button>
          <p className="eyebrow">Make it yours</p>
          <h1>What kind of archive are you beginning?</h1>
          <p className="onboarding-intro">
            Everlittle can hold a child’s story or simply be a private memory vault for the two of
            you. You can add a child later.
          </p>
          <div className="onboarding-fields">
            <label className="onboarding-choice">
              <input
                checked={profileKind === "vault"}
                name="profile-kind"
                onChange={() => {
                  setProfileKind("vault");
                  setEnablePin(false);
                }}
                type="radio"
              />
              <span>
                <strong>Our memory vault</strong>
                <small>
                  A shared place for the moments, trips, notes, and years you keep together.
                </small>
              </span>
              <HeartIcon />
            </label>
            <label className="onboarding-choice">
              <input
                checked={profileKind === "child"}
                name="profile-kind"
                onChange={() => {
                  setProfileKind("child");
                  setEnablePin(true);
                }}
                type="radio"
              />
              <span>
                <strong>A child’s story</strong>
                <small>Keep memories for a child to explore now or grow into later.</small>
              </span>
              <ChildIcon />
            </label>
            {profileKind === "child" ? (
              <>
                <label>
                  Child’s name
                  <input
                    autoFocus
                    onChange={(event) => setChildName(event.target.value)}
                    placeholder="Their name"
                    value={childName}
                  />
                </label>
                <label>
                  Date of birth
                  <input
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={(event) => setChildBirthDate(event.target.value)}
                    type="date"
                    value={childBirthDate}
                  />
                </label>
              </>
            ) : null}
          </div>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          <button
            className="primary-button"
            disabled={saving || (profileKind === "child" && (!childName || !childBirthDate))}
            onClick={() => void saveDraft(2)}
            type="button"
          >
            {saving ? "Saving…" : "Set privacy"} <ArrowRight size={18} />
          </button>
        </section>
      ) : null}

      {section === 2 ? (
        <section className="onboarding-panel">
          <button className="onboarding-back" onClick={() => setSection(1)} type="button">
            <ArrowLeft size={15} /> Memory focus
          </button>
          <p className="eyebrow">Private by default</p>
          <h1>
            {profileKind === "child"
              ? `Choose how ${childName || "your child"} enters`
              : "Set your archive privacy"}
          </h1>
          <p className="onboarding-intro">
            {profileKind === "child"
              ? "Adults sign in with email. A child can use a private six-digit PIN without an account."
              : "Only invited adults can enter your memory vault. You can change sharing choices later."}
          </p>
          <form className="onboarding-fields" onSubmit={complete}>
            {profileKind === "child" ? (
              <label className="onboarding-choice">
                <input
                  checked={enablePin}
                  onChange={(event) => setEnablePin(event.target.checked)}
                  type="checkbox"
                />
                <span>
                  <strong>Enable child access</strong>
                  <small>Only memories shared with children will appear.</small>
                </span>
                <LockKeyhole size={20} />
              </label>
            ) : null}
            {profileKind === "child" && enablePin ? (
              <label>
                {childName || "Child"}’s PIN
                <input
                  autoComplete="new-password"
                  className="pin-input"
                  inputMode="numeric"
                  maxLength={6}
                  onChange={(event) => setChildPin(event.target.value.replace(/\D/g, ""))}
                  pattern="[0-9]{6}"
                  placeholder="••••••"
                  required
                  type="password"
                  value={childPin}
                />
                <small>Keep this separate from your account password.</small>
              </label>
            ) : null}
            <label>
              Family timezone
              <input onChange={(event) => setTimezone(event.target.value)} value={timezone} />
              <small>Used for memory dates and time capsules.</small>
            </label>
            <div className="privacy-note">
              <ShieldCheck size={19} />
              <p>
                <strong>Your archive starts private.</strong> Nothing is public unless an adult
                deliberately creates a share link.
              </p>
            </div>
            {error ? (
              <p className="form-error" role="alert">
                {error}
              </p>
            ) : null}
            <button
              className="primary-button"
              disabled={saving || (profileKind === "child" && enablePin && childPin.length !== 6)}
              type="submit"
            >
              {saving ? "Creating your archive…" : "Create family archive"} <ArrowRight size={18} />
            </button>
          </form>
        </section>
      ) : null}
    </OnboardingShell>
  );
}

function HeartIcon() {
  return (
    <span aria-hidden="true" className="choice-symbol">
      ♥
    </span>
  );
}

function ChildIcon() {
  return (
    <span aria-hidden="true" className="choice-symbol">
      ✶
    </span>
  );
}

function OnboardingShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="onboarding-shell">
      <header>
        <Brand compact />
        <span>Private family archive</span>
      </header>
      <div className="onboarding-layout">{children}</div>
    </main>
  );
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

async function responseMessage(response: Response) {
  const body = (await response.json().catch(() => null)) as { error?: string } | null;
  return body?.error ?? "We could not save your setup.";
}
