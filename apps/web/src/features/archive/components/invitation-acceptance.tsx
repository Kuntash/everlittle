import { Brand } from "@/components/brand";
import type { InvitationPreview } from "@/features/archive/archive-types";
import {
  apiFetch,
  responseError,
  roleDescription,
  roleLabel,
} from "@/features/archive/lib/archive-utils";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

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
