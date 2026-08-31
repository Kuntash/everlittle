import { createFileRoute } from "@tanstack/react-router";

import { SeoLandingPage } from "@/components/seo-landing-page";
import { seoLandingPageHead, seoLandingPages } from "@/lib/seo-pages";

const page = seoLandingPages["/digital-time-capsule-for-kids"];

export const Route = createFileRoute("/digital-time-capsule-for-kids")({
  component: () => <SeoLandingPage page={page} />,
  head: () => seoLandingPageHead(page),
});
