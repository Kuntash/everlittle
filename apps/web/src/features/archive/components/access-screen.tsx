import { AuthFrame } from "@/components/design/auth-frame";
import { SlidingTabs } from "@/components/design/controls";
import { PasswordInput } from "@/components/password-input";
import { Input } from "@/components/ui/input";
import type { InvitationPreview, PlatformState } from "@/features/archive/archive-types";
import {
  apiFetch,
  requestedRedirect,
  responseError,
  roleLabel,
} from "@/features/archive/lib/archive-utils";
import { resolveArchiveEntry } from "@/lib/archive-navigation";
import { authClient } from "@/lib/auth-client";
import { isExistingAccountError } from "@/lib/auth-feedback";
import { usePostHog } from "@posthog/react";
import { ArrowRight, Check } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";

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
  const posthog = usePostHog();
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
    const isAcquisitionSignup = mode === "setup" && allowsPublicSignup && !isInvitation;
    if (isAcquisitionSignup) {
      posthog?.capture("account_signup_started", { signup_method: "email" });
    }

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

    if (isAcquisitionSignup) {
      posthog?.capture("account_signup_completed", {
        signup_method: "email",
        email_verification_required: true,
      });
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

    if (mode === "sign-in" && redirect === "/" && !isInvitation) {
      const response = await fetch("/api/archives");
      if (response.ok) {
        const { archives } = (await response.json()) as { archives: Array<{ slug: string }> };
        const destination = resolveArchiveEntry(archives, {
          defaultArchiveSlug: null,
          rememberedArchiveSlug: localStorage.getItem("everlittle.last-family"),
          deploymentMode: allowsPublicSignup ? "hosted" : "self-hosted",
        });
        if (destination) {
          window.location.assign(destination);
          return;
        }
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
    <AuthFrame>
      {entrance === "child" ? (
        <>
          <p className="eyebrow">{childAccess?.displayName ?? "Your child"}’s private space</p>
          <h1>Open the story your family kept for you</h1>
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
              <PasswordInput
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
                secretLabel="PIN"
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
          {isInvitation && (
            <p className="eyebrow">Invitation to {invitation?.archiveName ?? "your family"}</p>
          )}
          <h1>
            {isInvitation
              ? `Join ${invitation?.archiveName ?? "your family archive"}`
              : mode === "setup"
                ? "Start your family’s story."
                : "Welcome back."}
          </h1>
          <p className="card-intro">
            {isInvitation
              ? `You were invited as ${roleLabel(invitation?.role ?? "parent")} using ${invitation?.email ?? email}.`
              : mode === "setup"
                ? needsSetup
                  ? "The first account becomes the archive owner."
                  : "Keep photos, voices and stories in one place for your family."
                : "Come back to the moments you’ve kept."}
          </p>

          {!verificationEmail && !recovering && (allowsPublicSignup || isInvitation) && (
            <SlidingTabs
              label="Account access"
              value={mode === "setup" ? "Create account" : "Sign in"}
              items={["Create account", "Sign in"]}
              onChange={(value) => {
                setMode(value === "Create account" ? "setup" : "sign-in");
                setError("");
                setNotice("");
              }}
            />
          )}
          {notice ? <p className="status-message">{notice}</p> : null}
          {verificationEmail ? (
            <div className="verification-sent" role="status">
              <span className="verification-sent-icon">
                <Check size={22} />
              </span>
              <h3>Check your inbox</h3>
              <p>
                We sent a verification email to <strong>{verificationEmail}</strong>. Open the link
                inside to confirm your address and begin your private archive.
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
                <Input
                  autoComplete="email"
                  placeholder="you@example.com"
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
                  <Input
                    autoComplete="name"
                    placeholder="What should we call you?"
                    onChange={(event) => setName(event.target.value)}
                    required
                    value={name}
                  />
                </label>
              ) : null}
              <label>
                Email address
                <Input
                  autoComplete="email"
                  placeholder="you@example.com"
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
                <PasswordInput
                  autoComplete={mode === "setup" ? "new-password" : "current-password"}
                  placeholder={mode === "setup" ? "Create a password" : "Your password"}
                  minLength={10}
                  onChange={(event) => setPassword(event.target.value)}
                  required
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
                className="raised secondary"
                onClick={() =>
                  location.assign(`/${encodeURIComponent(childAccess.familySlug)}/kids`)
                }
                type="button"
              >
                Open child space
              </button>
            </div>
          ) : null}
        </>
      )}
    </AuthFrame>
  );
}
