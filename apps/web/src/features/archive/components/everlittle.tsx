import { MarketingHome } from "@/components/marketing-home";
import type {
  ChildSession,
  InvitationPreview,
  PlatformState,
} from "@/features/archive/archive-types";
import { AccessScreen } from "@/features/archive/components/access-screen";
import { ArchiveApp } from "@/features/archive/components/archive-app";
import { ArchiveRedirect } from "@/features/archive/components/archive-redirect";
import { ChildArchiveApp } from "@/features/archive/components/child-archive-app";
import { InvitationAcceptance } from "@/features/archive/components/invitation-acceptance";
import { Loading } from "@/features/archive/components/loading";
import { currentFamilySlug } from "@/features/archive/lib/archive-utils";
import { authClient } from "@/lib/auth-client";
import { useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function Everlittle() {
  const routeLocation = useLocation();
  const session = authClient.useSession();
  const [platform, setPlatform] = useState<PlatformState | null>(null);
  const [childSession, setChildSession] = useState<ChildSession | null>(null);
  const [invitation, setInvitation] = useState<InvitationPreview | null>(null);
  const [invitationChecked, setInvitationChecked] = useState(false);
  const inviteToken = new URLSearchParams(routeLocation.searchStr).get("invite") ?? "";
  const childModeRequested = new URLSearchParams(routeLocation.searchStr).get("child") === "1";

  useEffect(() => {
    void fetch("/api/platform")
      .then((response) => response.json() as Promise<PlatformState>)
      .then(setPlatform);
  }, []);

  useEffect(() => {
    void fetch("/api/child/session")
      .then((response) => response.json() as Promise<ChildSession>)
      .then(setChildSession);
  }, []);

  useEffect(() => {
    if (!inviteToken) {
      setInvitationChecked(true);
      return;
    }
    void fetch(`/api/invitations/preview?token=${encodeURIComponent(inviteToken)}`)
      .then(async (response) =>
        response.ok ? ((await response.json()) as InvitationPreview) : null,
      )
      .then(setInvitation)
      .finally(() => setInvitationChecked(true));
  }, [inviteToken]);

  if (session.isPending || !platform || !childSession || !invitationChecked) {
    const isPublicHomepage = routeLocation.pathname === "/" && !inviteToken && !childModeRequested;
    return isPublicHomepage && !session.data?.user ? <MarketingHome /> : <Loading />;
  }
  if (platform.deploymentMode === "hosted" && !session.data?.user && currentFamilySlug()) {
    const destination = `${location.pathname}${location.search}`;
    location.replace(`/sign-in?redirect=${encodeURIComponent(destination)}`);
    return <Loading />;
  }
  if (platform.deploymentMode === "hosted" && !session.data?.user && !inviteToken) {
    return <MarketingHome />;
  }
  if (childModeRequested && platform.childAccess?.enabled) {
    location.replace(
      `/${encodeURIComponent(platform.childAccess.familySlug)}/kids/${encodeURIComponent(platform.childAccess.childSlug)}`,
    );
    return <Loading />;
  }
  if (!session.data?.user) {
    if (childSession.signedIn) return <ChildArchiveApp />;
    return (
      <AccessScreen
        childAccess={platform.childAccess}
        invitation={invitation}
        inviteToken={inviteToken}
        needsSetup={platform.needsSetup}
        allowsPublicSignup={platform.allowsPublicSignup}
      />
    );
  }
  if (invitation) {
    return <InvitationAcceptance invitation={invitation} token={inviteToken} />;
  }

  if (!currentFamilySlug()) {
    return (
      <ArchiveRedirect
        defaultArchiveSlug={platform.defaultArchiveSlug}
        deploymentMode={platform.deploymentMode}
      />
    );
  }

  return <ArchiveApp />;
}
