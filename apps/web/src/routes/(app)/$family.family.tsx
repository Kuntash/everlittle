import { createFileRoute } from "@tanstack/react-router";

import { Everlittle } from "@/features/archive/components/everlittle";

export const Route = createFileRoute("/(app)/$family/family")({ component: Everlittle });
