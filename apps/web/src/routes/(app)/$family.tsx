import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";

import { Everlittle } from "@/features/archive/components/everlittle";

export const Route = createFileRoute("/(app)/$family")({ component: FamilyRoute });

function FamilyRoute() {
  const { family } = Route.useParams();
  const pathname = useLocation({ select: (location) => location.pathname });
  return pathname.startsWith(`/${encodeURIComponent(family)}/kids`) ? <Outlet /> : <Everlittle />;
}
