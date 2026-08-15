import { ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";

import { Brand } from "@/components/brand";
import { authClient } from "@/lib/auth-client";

export function TwoFactorChallenge() {
  const [mode, setMode] = useState<"totp" | "backup">("totp");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const result =
      mode === "totp"
        ? await authClient.twoFactor.verifyTotp({ code, trustDevice: true })
        : await authClient.twoFactor.verifyBackupCode({ code, trustDevice: true });
    setSubmitting(false);
    if (result.error) {
      setError(result.error.message ?? "That code was not accepted.");
      return;
    }
    window.location.assign("/");
  }

  return (
    <main className="loading-shell invitation-shell">
      <Brand />
      <section className="access-card">
        <div className="access-icon">
          <ShieldCheck size={22} />
        </div>
        <p className="eyebrow">Two-factor authentication</p>
        <h2>One more private step</h2>
        <p className="card-intro">
          {mode === "totp"
            ? "Enter the six-digit code from your authenticator app."
            : "Enter one of the backup codes you saved during setup."}
        </p>
        <form onSubmit={submit}>
          <label>
            {mode === "totp" ? "Authenticator code" : "Backup code"}
            <input
              autoComplete="one-time-code"
              autoFocus
              inputMode={mode === "totp" ? "numeric" : "text"}
              onChange={(event) => setCode(event.target.value.trim())}
              required
              value={code}
            />
          </label>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          <button className="primary-button" disabled={submitting || !code} type="submit">
            {submitting ? "Checking…" : "Verify and continue"} <ArrowRight size={18} />
          </button>
        </form>
        <button
          className="text-button"
          onClick={() => {
            setMode(mode === "totp" ? "backup" : "totp");
            setCode("");
            setError("");
          }}
          type="button"
        >
          {mode === "totp" ? "Use a backup code" : "Use authenticator app"}
        </button>
      </section>
    </main>
  );
}
