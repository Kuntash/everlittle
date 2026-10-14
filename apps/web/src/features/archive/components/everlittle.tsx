import { MarketingHome } from "@/components/marketing-home";
import type { ChildSession, InvitationPreview } from "@/features/archive/archive-types";
import { ArchiveRedirect } from "@/features/archive/components/archive-redirect";
import { Loading } from "@/features/archive/components/loading";
import { authClient } from "@/lib/auth-client";
import { readBoot } from "@/lib/boot";
import { usePlatform } from "@/lib/platform-client";
import { useLocation } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

/*
 * The landing page uses this component too. The archive, the sign-in form and the child's view load on demand,
 * so a visitor to the landing page does not download them.
 */
const loadArchiveApp = () => import("@/features/archive/components/archive-app");
const ArchiveApp = lazy(async () => ({ default: (await loadArchiveApp()).ArchiveApp }));
const AccessScreen = lazy(async () => ({
  default: (await import("@/features/archive/components/access-screen")).AccessScreen,
}));
const ChildArchiveApp = lazy(async () => ({
  default: (await import("@/features/archive/components/child-archive-app")).ChildArchiveApp,
}));
const InvitationAcceptance = lazy(async () => ({
  default: (await import("@/features/archive/components/invitation-acceptance"))
    .InvitationAcceptance,
}));

/** A redirect needs the browser. The server renders the loading mark, and the browser then leaves the page. */
function leaveFor(destination: string) {
  if (typeof window !== "undefined") window.location.replace(destination);
  return <Loading />;
}

export function Everlittle() {
  const routeLocation = useLocation();
  const session = authClient.useSession();
  const boot = readBoot();
  const platform = usePlatform();
  /* Without a cookie there is no session, so neither answer needs a request. */
  const sessionPending = session.isPending && boot?.hasSession !== false;
  const [childSession, setChildSession] = useState<ChildSession | null>(
    boot?.hasChildSession === false ? { signedIn: false } : null,
  );
  const [invitation, setInvitation] = useState<InvitationPreview | null>(null);
  const inviteToken = new URLSearchParams(routeLocation.searchStr).get("invite") ?? "";
  const [invitationChecked, setInvitationChecked] = useState(!inviteToken);
  const childModeRequested = new URLSearchParams(routeLocation.searchStr).get("child") === "1";
  /* Read from the router, not from `window`, so the server and the browser render the same first page. */
  const familySlug = routeLocation.pathname.split("/").find(Boolean) ?? "";

  useEffect(() => {
    /* A signed-in parent on a family address will need the archive. Fetch its code while the session is checked. */
    if (boot?.hasSession && familySlug) void loadArchiveApp();
  }, []);

  useEffect(() => {
    if (childSession) return;
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

  // Logo links always open the public landing page, including for signed-in parents.
  if (
    routeLocation.pathname === "/" &&
    !inviteToken &&
    !childModeRequested &&
    platform?.deploymentMode === "hosted"
  ) {
    return <MarketingHome />;
  }

  if (sessionPending || !platform || !childSession || !invitationChecked) {
    const isPublicHomepage = routeLocation.pathname === "/" && !inviteToken && !childModeRequested;
    return isPublicHomepage && !session.data?.user ? <MarketingHome /> : <Loading />;
  }
  if (platform.deploymentMode === "hosted" && !session.data?.user && familySlug) {
    const destination = `${routeLocation.pathname}${routeLocation.searchStr}`;
    return leaveFor(`/sign-in?redirect=${encodeURIComponent(destination)}`);
  }
  if (platform.deploymentMode === "hosted" && !session.data?.user && !inviteToken) {
    return <MarketingHome />;
  }
  if (childModeRequested && platform.childAccess?.enabled) {
    return leaveFor(
      `/${encodeURIComponent(platform.childAccess.familySlug)}/kids/${encodeURIComponent(platform.childAccess.childSlug)}`,
    );
  }
  if (!session.data?.user) {
    return (
      <Suspense fallback={<Loading />}>
        {childSession.signedIn ? (
          <ChildArchiveApp />
        ) : (
          <AccessScreen
            childAccess={platform.childAccess}
            invitation={invitation}
            inviteToken={inviteToken}
            needsSetup={platform.needsSetup}
            allowsPublicSignup={platform.allowsPublicSignup}
          />
        )}
      </Suspense>
    );
  }
  if (invitation) {
    return (
      <Suspense fallback={<Loading />}>
        <InvitationAcceptance invitation={invitation} token={inviteToken} />
      </Suspense>
    );
  }

  if (!familySlug) {
    return (
      <ArchiveRedirect
        defaultArchiveSlug={platform.defaultArchiveSlug}
        deploymentMode={platform.deploymentMode}
      />
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <ArchiveApp />
    </Suspense>
  );
}
