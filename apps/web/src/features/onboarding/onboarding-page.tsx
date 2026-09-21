import { AuthFrame } from "@/components/design/auth-frame";
import { DateInput } from "@/components/design/date-input";
import { Input } from "@/components/ui/input";
import { usePostHog } from "@posthog/react";
import { ArrowLeft, ArrowRight, Check, LockKeyhole, ShieldCheck } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { PasswordInput } from "@/components/password-input";
import { authClient } from "@/lib/auth-client";

type Draft = {
  familyName: string | null;
  familySlug: string | null;
  childName: string | null;
  childBirthDate: string | null;
  timezone: string | null;
  profileKind?: "child" | "vault" | null;
};

const sections = ["Family", "Memories", "Finish"] as const;

export function Onboarding() {
  const posthog = usePostHog();
  const session = authClient.useSession();
  const [deploymentMode, setDeploymentMode] = useState<"hosted" | "self-hosted" | null>(null);
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
  const [enablePin, setEnablePin] = useState(false);
  const [childPin, setChildPin] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch("/api/platform")
      .then(async (response) => {
        if (!response.ok) throw new Error("We could not check this archive.");
        return response.json() as Promise<{ deploymentMode: "hosted" | "self-hosted" }>;
      })
      .then(({ deploymentMode: mode }) => setDeploymentMode(mode))
      .catch((reason: Error) => {
        setError(reason.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (session.isPending || !deploymentMode) return;
    if (deploymentMode === "self-hosted") {
      location.replace("/");
      return;
    }
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
        posthog?.capture("archive_onboarding_started");
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
  }, [deploymentMode, session.data?.user, session.isPending]);

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
    if (!slugEdited) {
      setSlugAvailable(null);
      setFamilySlug(toSlug(value));
    }
  }

  async function saveDraft(nextSection: number) {
    setError("");
    setSaving(true);
    try {
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
        posthog?.capture("archive_onboarding_failed", {
          reason: response.status === 409 ? "conflict" : "request_rejected",
          step: section,
        });
        setError(await responseMessage(response));
        setSaving(false);
        return;
      }
      setSection(nextSection);
      setSaving(false);
    } catch {
      setError("Couldn’t connect. Please try again.");
      posthog?.capture("archive_onboarding_failed", { reason: "network_error", step: section });
    } finally {
      setSaving(false);
    }
  }

  async function complete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
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
        posthog?.capture("archive_onboarding_failed", {
          reason: response.status === 409 ? "conflict" : "request_rejected",
          step: section,
        });
        setError(await responseMessage(response));
        setSaving(false);
        return;
      }
      const result = (await response.json()) as { archiveSlug: string };
      posthog?.capture("archive_onboarding_submitted", {
        archive_profile_kind: profileKind,
        child_pin_enabled: profileKind === "child" && enablePin,
      });
      location.assign(`/${encodeURIComponent(result.archiveSlug)}`);
    } catch {
      setError("Couldn’t connect. Please try again.");
      posthog?.capture("archive_onboarding_failed", { reason: "network_error", step: section });
    } finally {
      setSaving(false);
    }
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
            disabled={saving || index > section}
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
          <h1>What’s your family name?</h1>
          <p className="onboarding-intro">Start with 100 MB free. Invite family after setup.</p>
          <div className="onboarding-fields">
            <label>
              Family name
              <Input
                autoFocus
                maxLength={100}
                onChange={(event) => updateFamilyName(event.target.value)}
                placeholder="The Norbu family"
                value={familyName}
              />
            </label>
            <label>
              Archive address
              <div className="slug-field">
                <span>geteverlittle.com/</span>
                <Input
                  aria-describedby="slug-status"
                  onChange={(event) => {
                    setSlugEdited(true);
                    setSlugAvailable(null);
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
                  ? "Available"
                  : slugAvailable === false
                    ? "Already taken. Try another."
                    : "3–48 letters, numbers or hyphens."}
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
            disabled={saving || !familyName.trim() || slugAvailable !== true}
            onClick={() => void saveDraft(1)}
            type="button"
          >
            {saving ? "Saving…" : "Continue"} <ArrowRight size={18} />
          </button>
        </section>
      ) : null}

      {section === 1 ? (
        <section className="onboarding-panel">
          <button
            className="onboarding-back"
            disabled={saving}
            onClick={() => setSection(0)}
            type="button"
          >
            <ArrowLeft size={15} /> Family details
          </button>

          <h1>Who are you saving memories for?</h1>
          <p className="onboarding-intro">You can add more people later.</p>
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
                <strong>Our family</strong>
                <small>Photos and stories for everyone.</small>
              </span>
              <HeartIcon />
            </label>
            <label className="onboarding-choice">
              <input
                checked={profileKind === "child"}
                name="profile-kind"
                onChange={() => {
                  setProfileKind("child");
                  setEnablePin(false);
                }}
                type="radio"
              />
              <span>
                <strong>Our child</strong>
                <small>Their childhood, saved in one place.</small>
              </span>
              <ChildIcon />
            </label>
            {profileKind === "child" ? (
              <>
                <label>
                  Child’s name
                  <Input
                    autoFocus
                    onChange={(event) => setChildName(event.target.value)}
                    placeholder="Their name"
                    value={childName}
                  />
                </label>
                <label>
                  Date of birth
                  <DateInput
                    aria-label="Date of birth"
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
            disabled={
              saving ||
              (profileKind === "child" &&
                (!childName.trim() ||
                  !childBirthDate ||
                  childBirthDate > new Date().toISOString().slice(0, 10)))
            }
            onClick={() => void saveDraft(2)}
            type="button"
          >
            {saving ? "Saving…" : "Continue"} <ArrowRight size={18} />
          </button>
        </section>
      ) : null}

      {section === 2 ? (
        <section className="onboarding-panel">
          <button
            className="onboarding-back"
            disabled={saving}
            onClick={() => setSection(1)}
            type="button"
          >
            <ArrowLeft size={15} /> Back
          </button>

          <h1>
            {profileKind === "child"
              ? "Ready for your first memory?"
              : "Ready for your first memory?"}
          </h1>
          <p className="onboarding-intro">
            {profileKind === "child"
              ? "Child access is optional. You can set it up later."
              : "Only the people you invite can see your memories."}
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
                  <strong>Let my child sign in</strong>
                  <small>A PIN opens only the memories you choose.</small>
                </span>
                <LockKeyhole size={20} />
              </label>
            ) : null}
            {profileKind === "child" && enablePin ? (
              <label>
                {childName || "Child"}’s PIN
                <PasswordInput
                  autoComplete="new-password"
                  className="pin-input"
                  inputMode="numeric"
                  maxLength={6}
                  onChange={(event) => setChildPin(event.target.value.replace(/\D/g, ""))}
                  pattern="[0-9]{6}"
                  placeholder="••••••"
                  required
                  secretLabel="PIN"
                  value={childPin}
                />
                <small>Use a separate six-digit PIN.</small>
              </label>
            ) : null}
            <label>
              Family timezone
              <Input onChange={(event) => setTimezone(event.target.value)} value={timezone} />
              <small>For dates and scheduled letters.</small>
            </label>
            <div className="privacy-note">
              <ShieldCheck size={19} />
              <p>100 MB free. No card. No expiry.</p>
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
              {saving ? "Creating your archive…" : "Open my free archive"} <ArrowRight size={18} />
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
    <AuthFrame>
      <div className="onboarding-flow">{children}</div>
    </AuthFrame>
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
