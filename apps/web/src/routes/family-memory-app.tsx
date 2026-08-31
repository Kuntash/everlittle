import { createFileRoute } from "@tanstack/react-router";

import { SeoLandingPage } from "@/components/seo-landing-page";
import { seoLandingPageHead, seoLandingPages } from "@/lib/seo-pages";

const page = seoLandingPages["/family-memory-app"];

export const Route = createFileRoute("/family-memory-app")({
  component: () => <SeoLandingPage page={page} />,
  head: () => seoLandingPageHead(page),
});
