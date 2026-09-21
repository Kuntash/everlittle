import { Onboarding } from "@/features/onboarding/onboarding-page";
import { createFileRoute } from "@tanstack/react-router";
import onboardingCss from "@/features/onboarding/onboarding.css?url";
export const Route = createFileRoute("/(app)/onboarding")({
  component: Onboarding,
  head: () => ({ links: [{ rel: "stylesheet", href: onboardingCss }] }),
});
