import { createFileRoute } from "@tanstack/react-router";

import { SeoLandingPage } from "@/components/seo-landing-page";
import { seoLandingPageHead, seoLandingPages } from "@/lib/seo-pages";

const page = seoLandingPages["/grandparents-memory-project"];

export const Route = createFileRoute("/grandparents-memory-project")({
  component: () => <SeoLandingPage page={page} />,
  head: () => seoLandingPageHead(page),
});
