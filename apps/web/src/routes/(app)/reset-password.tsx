import { createFileRoute } from "@tanstack/react-router";

import { ResetPassword } from "@/components/reset-password";

export const Route = createFileRoute("/(app)/reset-password")({ component: ResetPassword });
