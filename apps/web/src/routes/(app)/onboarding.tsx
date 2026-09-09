import { Onboarding } from "@/features/onboarding/onboarding-page";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/(app)/onboarding")({ component: Onboarding });
