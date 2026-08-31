import { createFileRoute } from "@tanstack/react-router";

import { SeoLandingPage } from "@/components/seo-landing-page";
import { seoLandingPageHead, seoLandingPages } from "@/lib/seo-pages";

const page = seoLandingPages["/baby-memory-journal"];

export const Route = createFileRoute("/baby-memory-journal")({
  component: () => <SeoLandingPage page={page} />,
  head: () => seoLandingPageHead(page),
});
