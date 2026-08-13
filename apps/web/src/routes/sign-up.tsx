import { createFileRoute } from "@tanstack/react-router";

import { AuthRoute } from "@/components/auth-route";

export const Route = createFileRoute("/sign-up")({ component: () => <AuthRoute mode="setup" /> });
