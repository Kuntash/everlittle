import { createFileRoute } from "@tanstack/react-router";

import { ResetPassword } from "@/components/reset-password";

export const Route = createFileRoute("/reset-password")({ component: ResetPassword });
