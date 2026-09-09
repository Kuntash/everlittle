import { createFileRoute } from "@tanstack/react-router";

import { AuthRoute } from "@/components/auth-route";

export const Route = createFileRoute("/(app)/invite/$token")({
  component: InvitationRoute,
});

function InvitationRoute() {
  const { token } = Route.useParams();
  return <AuthRoute inviteToken={token} mode="setup" />;
}
