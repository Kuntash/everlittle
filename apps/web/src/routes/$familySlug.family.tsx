import { createFileRoute } from "@tanstack/react-router";

import { Everlittle } from "@/routes/index";

export const Route = createFileRoute("/$familySlug/family")({ component: Everlittle });
