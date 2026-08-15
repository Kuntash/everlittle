import { ArrowRight, LockKeyhole } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";

import { Brand } from "@/components/brand";

export function ResetPassword() {
  const search = new URLSearchParams(location.search);
  const token = search.get("token") ?? "";
  const invalid = Boolean(search.get("error")) || !token;
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState(
    invalid ? "This reset link is invalid or has expired. Request a new one from sign in." : "",
  );
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== confirmation) {
      setError("The two passwords do not match.");
      return;
    }
    setSubmitting(true);
    const response = await fetch("/api/auth/reset-password", {
      body: JSON.stringify({ newPassword: password, token }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });
    setSubmitting(false);
    if (!response.ok) {
      setError("This reset link is invalid or has expired. Request a new one from sign in.");
      return;
    }
    setComplete(true);
  }

  return (
    <main className="loading-shell invitation-shell">
      <Brand />
      <section className="access-card">
        <div className="access-icon">
          <LockKeyhole size={22} />
        </div>
        <p className="eyebrow">Account recovery</p>
        <h2>{complete ? "Your password is ready" : "Choose a new password"}</h2>
        {complete ? (
          <>
            <p className="card-intro">Your other adult sessions have been signed out.</p>
            <a className="primary-button" href="/sign-in">
              Return to sign in <ArrowRight size={18} />
            </a>
          </>
        ) : (
          <form onSubmit={submit}>
            <label>
              New password
              <input
                autoComplete="new-password"
                disabled={invalid}
                minLength={10}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
              <small>At least 10 characters</small>
            </label>
            <label>
              Confirm new password
              <input
                autoComplete="new-password"
                disabled={invalid}
                minLength={10}
                onChange={(event) => setConfirmation(event.target.value)}
                required
                type="password"
                value={confirmation}
              />
            </label>
            {error ? (
              <p className="form-error" role="alert">
                {error}
              </p>
            ) : null}
            <button
              className="primary-button"
              disabled={invalid || submitting || password !== confirmation}
              type="submit"
            >
              {submitting ? "Saving…" : "Save new password"} <ArrowRight size={18} />
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
