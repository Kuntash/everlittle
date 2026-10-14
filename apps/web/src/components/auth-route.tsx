import { ArchiveRedirect } from "@/features/archive/components/archive-redirect";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { InvitationPreview } from "@/features/archive/archive-types";
import { AccessScreen } from "@/features/archive/components/access-screen";
import { InvitationAcceptance } from "@/features/archive/components/invitation-acceptance";
import { Loading } from "@/features/archive/components/loading";
import { authClient } from "@/lib/auth-client";
import { readBoot } from "@/lib/boot";
import { usePlatform } from "@/lib/platform-client";

export function AuthRoute({
  inviteToken = "",
  mode,
}: {
  inviteToken?: string;
  mode: "sign-in" | "setup";
}) {
  const session = authClient.useSession();
  const platform = usePlatform();
  /* Without a session cookie nobody is signed in, so the form does not wait for the session request. */
  const sessionPending = session.isPending && readBoot()?.hasSession !== false;
  const [invitation, setInvitation] = useState<InvitationPreview | null>(null);
  const [checked, setChecked] = useState(!inviteToken);

  useEffect(() => {
    if (!inviteToken) return;
    void fetch(`/api/invitations/preview?token=${encodeURIComponent(inviteToken)}`)
      .then(async (response) =>
        response.ok ? ((await response.json()) as InvitationPreview) : null,
      )
      .then(setInvitation)
      .finally(() => setChecked(true));
  }, [inviteToken]);

  const shouldRedirectSignedInUser = Boolean(session.data?.user && checked && !invitation);

  useEffect(() => {
    if (!shouldRedirectSignedInUser || safeRedirect() === "/") return;

    if (mode === "setup") {
      toast("You already have an account", {
        description: "You’re already signed in. Opening your private archive.",
      });
    }

    const redirect = window.setTimeout(
      () => location.replace(safeRedirect()),
      mode === "setup" ? 900 : 0,
    );
    return () => window.clearTimeout(redirect);
  }, [mode, shouldRedirectSignedInUser]);

  if (sessionPending || !platform || !checked) return <Loading />;
  if (session.data?.user && invitation) {
    return <InvitationAcceptance invitation={invitation} token={inviteToken} />;
  }
  if (session.data?.user)
    return safeRedirect() === "/" ? (
      <ArchiveRedirect
        defaultArchiveSlug={platform.defaultArchiveSlug}
        deploymentMode={platform.deploymentMode}
      />
    ) : (
      <Loading />
    );
  if (platform.deploymentMode === "self-hosted" && !inviteToken) {
    /* A redirect needs the browser. The server renders the loading mark. */
    if (typeof window !== "undefined") location.replace("/");
    return <Loading />;
  }

  return (
    <AccessScreen
      allowsPublicSignup={platform.allowsPublicSignup}
      childAccess={platform.childAccess}
      initialMode={mode}
      invitation={invitation}
      inviteToken={inviteToken}
      needsSetup={platform.needsSetup}
    />
  );
}

function safeRedirect() {
  const value = new URLSearchParams(location.search).get("redirect") ?? "/";
  return value.startsWith("/") && !value.startsWith("//") ? value : "/";
}
