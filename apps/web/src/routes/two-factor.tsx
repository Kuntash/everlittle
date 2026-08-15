import { createFileRoute } from "@tanstack/react-router";

import { TwoFactorChallenge } from "@/components/two-factor";

export const Route = createFileRoute("/two-factor")({ component: TwoFactorChallenge });
