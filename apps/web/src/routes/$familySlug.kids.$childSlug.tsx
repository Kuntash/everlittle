import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { Brand } from "@/components/brand";
import { ChildArchiveApp } from "@/routes/index";

export const Route = createFileRoute("/$familySlug/kids/$childSlug")({ component: ChildAccess });

type ChildSession = { signedIn: boolean; child?: { displayName: string; slug: string } };

function ChildAccess() {
  const { childSlug, familySlug } = Route.useParams();
  const apiPrefix = `/api/families/${encodeURIComponent(familySlug)}/children/${encodeURIComponent(childSlug)}`;
  const [displayName, setDisplayName] = useState("");
  const [session, setSession] = useState<ChildSession | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/families/${encodeURIComponent(familySlug)}/children`).then(async (response) => {
        if (!response.ok) throw new Error("This child space is not available.");
        return response.json() as Promise<{
          children: Array<{ displayName: string; slug: string }>;
        }>;
      }),
      fetch(`${apiPrefix}/session`).then((response) => response.json() as Promise<ChildSession>),
    ])
      .then(([profiles, currentSession]) => {
        const profile = profiles.children.find((child) => child.slug === childSlug);
        if (!profile) throw new Error("This child space is not available.");
        setDisplayName(profile.displayName);
        setSession(currentSession);
      })
      .catch((reason: Error) => setError(reason.message));
  }, [apiPrefix, childSlug, familySlug]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const response = await fetch(`${apiPrefix}/sign-in`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "We could not open this story.");
      setSubmitting(false);
      return;
    }
    setSession({ signedIn: true, child: { displayName, slug: childSlug } });
  }

  if (session?.signedIn) {
    return (
      <ChildArchiveApp apiPrefix={apiPrefix} leaveTo={`/${encodeURIComponent(familySlug)}/kids`} />
    );
  }

  return (
    <main className="child-access-shell">
      <Brand />
      <section className="access-card">
        <a className="child-back-link" href={`/${encodeURIComponent(familySlug)}/kids`}>
          <ArrowLeft size={15} /> Choose another name
        </a>
        <div className="access-icon">
          <LockKeyhole size={22} />
        </div>
        <p className="eyebrow">
          {displayName ? `${displayName}’s private space` : "Private child space"}
        </p>
        <h2>Open the story your family kept for you</h2>
        <p className="card-intro">
          Enter your six-digit PIN. You do not need an email or adult account.
        </p>
        <form onSubmit={submit}>
          <label>
            Your PIN
            <input
              autoComplete="one-time-code"
              autoFocus
              className="pin-input"
              inputMode="numeric"
              maxLength={6}
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
          <button
            className="primary-button"
            disabled={submitting || pin.length !== 6}
            type="submit"
          >
            {submitting ? "Opening…" : "Open my story"} <ArrowRight size={18} />
          </button>
        </form>
      </section>
    </main>
  );
}
