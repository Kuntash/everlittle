import { FamilyPerson } from "@/components/design/archive-presentations";
import { SlidingTabs } from "@/components/design/controls";
import { DateInput } from "@/components/design/date-input";
import { DesignSelect } from "@/components/design/design-select";
import { Button } from "@/components/design/shared";
import { PasswordInput } from "@/components/password-input";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ArchiveState, FamilyRole, PendingInvitation } from "@/features/archive/archive-types";
import { AnimatedActionLabel } from "@/features/archive/components/animated-action-label";
import { useBillingNavigation } from "@/features/archive/hooks/use-billing-navigation";
import { useConfirmation } from "@/features/archive/hooks/use-confirmation";
import {
  apiFetch,
  billingStatusDetail,
  billingStatusTitle,
  formatDate,
  formatFileSize,
  responseError,
  roleLabel,
} from "@/features/archive/lib/archive-utils";
import { authClient } from "@/lib/auth-client";
import { Check, Copy, Crown, ShieldCheck } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";

export function FamilySettings({
  state,
  refresh,
  onOpenChild,
}: {
  state: ArchiveState;
  refresh: () => Promise<void>;
  onOpenChild: () => void;
}) {
  const { confirm, confirmation } = useConfirmation();
  const isOwner = state.currentMember.role === "owner";
  const canEditChild = isOwner || state.currentMember.role === "parent";
  const [tab, setTab] = useState(() =>
    typeof window !== "undefined" &&
    window.location.pathname.replace(/\/$/, "").endsWith("/settings")
      ? "Plan"
      : "People",
  );
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Exclude<FamilyRole, "owner">>("contributor");
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
  const { billingBusy, billingError, openBilling } = useBillingNavigation();

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
      !(await confirm(
        `Turn off child sign-in for ${childName}? Every signed-in child device will lose access.`,
      ))
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
      {confirmation}
      <div className="page-intro">
        <h1>
          {tab === "People"
            ? "Your people"
            : tab === "Child profile"
              ? `${childName}’s profile`
              : "Your family plan"}
        </h1>
        <p className="subtitle">
          {tab === "People"
            ? "Invite loved ones to add their side of the story."
            : tab === "Child profile"
              ? "Manage their profile and the memories they can see."
              : "Manage your family’s storage and subscription."}
        </p>
      </div>
      {message ? (
        <p className="status-message">
          <Check size={16} /> {message}
        </p>
      ) : null}
      {error || billingError ? <p className="form-error">{error || billingError}</p> : null}

      <SlidingTabs
        label="Family sections"
        className="family-switch"
        value={tab}
        onChange={setTab}
        items={isVault ? ["People", "Plan"] : ["People", "Child profile", "Plan"]}
      />
      <div
        className={
          tab === "Plan" ? "plan-layout" : tab === "Child profile" ? "two-grid" : "family-grid"
        }
      >
        {tab === "Plan" && (
          <>
            <Card className="plan-current">
              <div className="section-heading">
                <span className="eyebrow">
                  {state.billing.plan === "self-hosted" ? "Self-hosted archive" : "Family archive"}
                </span>
                <span className={`plan-status ${state.billing.status}`}>
                  {billingStatusTitle(state.billing)}
                </span>
              </div>
              <h2>
                {state.billing.plan === "self-hosted"
                  ? "Your family’s own space."
                  : state.billing.canManage
                    ? state.billing.interval === "yearly"
                      ? "$60 / year"
                      : "$6 / month"
                    : "Keep adding to their story."}
              </h2>
              <p className="muted">{billingStatusDetail(state.billing)}</p>
              <ul className="plan-features">
                <li>
                  <Check size={17} />
                  {state.billing.limitBytes === null
                    ? "Storage on your own infrastructure"
                    : `${formatFileSize(state.billing.limitBytes)} for photos, voices and video`}
                </li>
                <li>
                  <Check size={17} />
                  Unlimited invited family members
                </li>
                <li>
                  <Check size={17} />
                  Child spaces and future capsules
                </li>
              </ul>
              <small>{formatFileSize(state.billing.usedBytes)} used</small>
              {isOwner && state.billing.plan === "family" && state.billing.checkoutAvailable && (
                <div className="actions">
                  {state.billing.canManage ? (
                    <>
                      <Button
                        secondary
                        disabled={billingBusy !== null}
                        onClick={() => void openBilling("portal")}
                      >
                        {billingBusy
                          ? "Opening…"
                          : state.billing.cancelAtPeriodEnd
                            ? "Keep my subscription"
                            : state.billing.status === "canceled"
                              ? "Manage subscription"
                              : "Change plan"}
                      </Button>
                      {!state.billing.cancelAtPeriodEnd && state.billing.status !== "canceled" && (
                        <Button
                          secondary
                          disabled={billingBusy !== null}
                          onClick={() => void openBilling("portal")}
                        >
                          Cancel subscription
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Button
                        disabled={billingBusy !== null}
                        onClick={() => void openBilling("monthly")}
                      >
                        Choose monthly
                      </Button>
                      <Button
                        secondary
                        disabled={billingBusy !== null}
                        onClick={() => void openBilling("yearly")}
                      >
                        Choose yearly
                      </Button>
                    </>
                  )}
                </div>
              )}
            </Card>
            <aside className="plan-aside">
              <h3>A little more room for memories.</h3>
              <p>
                {state.billing.plan === "self-hosted"
                  ? "Your memories stay on the infrastructure you manage."
                  : "Choose yearly and save $12 over twelve monthly payments."}
              </p>
              {state.billing.plan === "family" && (
                <div className="plan-comparison">
                  <span>Monthly</span>
                  <b>$6 / month</b>
                  <span>Yearly</span>
                  <b>$60 / year</b>
                </div>
              )}
            </aside>
          </>
        )}
        <section className="people-list" hidden={tab !== "People"}>
          <div className="member-list">
            {state.members.map((member) => (
              <FamilyPerson
                key={member.id}
                name={member.name}
                description={
                  member.userId === state.currentMember.userId
                    ? `${roleLabel(member.role)} · You`
                    : member.role === "viewer"
                      ? "Can view family memories"
                      : "Can add to your family story"
                }
              >
                <div className="member-controls">
                  {member.role === "owner" ? (
                    <span className="role-badge">
                      <Crown size={13} /> Owner
                    </span>
                  ) : isOwner ? (
                    <DesignSelect
                      aria-label={`${member.name} role`}
                      onChange={async (event) => {
                        const role = event.target.value;
                        if (
                          await confirm(
                            `Change ${member.name}’s family access to ${roleLabel(role as FamilyRole)}?`,
                          )
                        )
                          void mutate(
                            `/api/archive/members/${member.id}`,
                            { method: "PATCH", body: JSON.stringify({ role }) },
                            `${member.name}’s role was updated.`,
                          );
                      }}
                      value={member.role}
                    >
                      <option value="parent">Parent</option>
                      <option value="contributor">Contributor</option>
                      <option value="viewer">Viewer</option>
                    </DesignSelect>
                  ) : (
                    <span className="role-badge">{roleLabel(member.role)}</span>
                  )}
                  {isOwner && member.id !== state.currentMember.id ? (
                    <div className="row-actions">
                      <Button
                        secondary
                        onClick={async () => {
                          if (
                            await confirm(
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
                      </Button>
                      <button
                        className="text-button person-remove"
                        aria-label={`Remove ${member.name}`}
                        onClick={async () => {
                          if (await confirm(`Remove ${member.name} from this archive?`))
                            void mutate(
                              `/api/archive/members/${member.id}`,
                              { method: "DELETE" },
                              `${member.name} was removed.`,
                            );
                        }}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  ) : null}
                </div>
              </FamilyPerson>
            ))}
          </div>
          {state.currentMember.role !== "owner" ? (
            <button
              className="leave-button"
              onClick={async () => {
                if (await confirm("Leave this family archive? You will lose access."))
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

        {!isVault && tab === "Child profile" && (
          <>
            <Card className="profile-panel">
              <h2>About {childName}</h2>
              <form onSubmit={saveChild}>
                <Input
                  className="writing-input"
                  aria-label="Child’s name"
                  placeholder="Child’s name"
                  required
                  value={childName}
                  disabled={!canEditChild}
                  onChange={(event) => setChildName(event.target.value)}
                />
                <div className="attribute-row">
                  <span>Born</span>
                  <DateInput
                    aria-label="Date of birth"
                    value={birthDate}
                    onChange={(event) => setBirthDate(event.target.value)}
                    required
                    type="date"
                    disabled={!canEditChild}
                  />
                </div>
                {canEditChild && <Button>Save profile</Button>}
              </form>
            </Card>
            <Card className="profile-panel">
              <h2>Child sign-in</h2>
              <p className="muted">
                A six-digit PIN opens only the memories shared with {childName}.
              </p>
              {canEditChild && state.children[0] && (
                <form onSubmit={saveChildPin}>
                  <PasswordInput
                    secretLabel="PIN"
                    aria-label="Six-digit PIN"
                    placeholder="Six-digit PIN"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    minLength={6}
                    maxLength={6}
                    required
                    value={childPin}
                    onChange={(event) => setChildPin(event.target.value.replace(/\D/g, ""))}
                  />
                  <PasswordInput
                    secretLabel="PIN"
                    aria-label="Confirm PIN"
                    placeholder="Confirm PIN"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    minLength={6}
                    maxLength={6}
                    required
                    value={childPinConfirmation}
                    onChange={(event) =>
                      setChildPinConfirmation(event.target.value.replace(/\D/g, ""))
                    }
                  />
                  <Button disabled={childPin.length !== 6 || childPinConfirmation !== childPin}>
                    {state.children[0].childAccessEnabled ? "Change PIN" : "Turn on child sign-in"}
                  </Button>
                </form>
              )}
              {state.children[0]?.childAccessEnabled ? (
                <div className="actions child-view-actions">
                  <Button onClick={onOpenChild}>Open {childName}’s view</Button>
                  {canEditChild && (
                    <Button secondary onClick={() => void disableChildSignIn()}>
                      Turn off
                    </Button>
                  )}
                </div>
              ) : (
                <p className="muted">Child sign-in is off.</p>
              )}
              {state.children[0]?.childActiveDeviceCount ? (
                <small>{state.children[0].childActiveDeviceCount} active devices</small>
              ) : null}
            </Card>
          </>
        )}
        {isOwner ? (
          <section className="family-invite" hidden={tab !== "People"}>
            <h2>Invite someone to your archive</h2>
            <form className="settings-form invite-form" onSubmit={invite}>
              <label>
                <Input
                  className="writing-input"
                  aria-label="Email address"
                  placeholder="Email address"
                  inputMode="email"
                  onChange={(event) => setInviteEmail(event.target.value)}
                  required
                  type="email"
                  value={inviteEmail}
                />
              </label>
              <label>
                <DesignSelect
                  aria-label="Invitation role"
                  onChange={(event) =>
                    setInviteRole(event.target.value as Exclude<FamilyRole, "owner">)
                  }
                  value={inviteRole}
                >
                  <option value="parent">Parent</option>
                  <option value="contributor">Contributor</option>
                  <option value="viewer">Viewer</option>
                </DesignSelect>
              </label>
              <button
                aria-busy={inviteBusy}
                className="primary-button"
                disabled={inviteBusy}
                type="submit"
              >
                <AnimatedActionLabel
                  showArrow={false}
                  text={inviteBusy ? "Sending…" : "Send invitation"}
                  transitionKey={inviteBusy ? "sending" : "idle"}
                />
              </button>
            </form>
            {inviteUrl ? (
              <div className="invite-result">
                <Input aria-label="Invitation link" readOnly value={inviteUrl} />
                <button onClick={() => void copyInvite()} type="button">
                  {copied ? <Check /> : <Copy />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            ) : null}
            {state.invitations.length ? (
              <div className="pending">
                <h3>Pending invitations</h3>
                {state.invitations.map((item) => (
                  <div className="pending-row" key={item.id}>
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
                        Revoke
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
      <section className="account-session">
        <div>
          <h2>Your account</h2>
          <p>
            Signed in as{" "}
            {state.members.find((member) => member.userId === state.currentMember.userId)?.name ??
              "a family member"}
          </p>
        </div>
        <button
          className="button-quiet"
          type="button"
          onClick={() => void authClient.signOut().then(() => location.assign("/"))}
        >
          Sign out
        </button>
      </section>
    </div>
  );
}
