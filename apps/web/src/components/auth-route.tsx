import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";
import {
  AccessScreen,
  InvitationAcceptance,
  Loading,
  type InvitationPreview,
  type PlatformState,
} from "@/routes/index";

export function AuthRoute({
  inviteToken = "",
  mode,
}: {
  inviteToken?: string;
  mode: "sign-in" | "setup";
}) {
  const session = authClient.useSession();
  const [platform, setPlatform] = useState<PlatformState | null>(null);
  const [invitation, setInvitation] = useState<InvitationPreview | null>(null);
  const [checked, setChecked] = useState(!inviteToken);

  useEffect(() => {
    void fetch("/api/platform")
      .then((response) => response.json() as Promise<PlatformState>)
      .then(setPlatform);
  }, []);

  useEffect(() => {
    if (!inviteToken) return;
    void fetch(`/api/invitations/preview?token=${encodeURIComponent(inviteToken)}`)
      .then(async (response) =>
        response.ok ? ((await response.json()) as InvitationPreview) : null,
      )
      .then(setInvitation)
      .finally(() => setChecked(true));
  }, [inviteToken]);

  if (session.isPending || !platform || !checked) return <Loading />;
  if (session.data?.user && invitation) {
    return <InvitationAcceptance invitation={invitation} token={inviteToken} />;
  }
  if (session.data?.user) {
    location.replace("/");
    return <Loading />;
  }
  if (platform.deploymentMode === "self-hosted" && !inviteToken) {
    location.replace("/");
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
