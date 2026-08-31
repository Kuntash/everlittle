import { createFileRoute } from "@tanstack/react-router";

import { SeoLandingPage } from "@/components/seo-landing-page";
import { seoLandingPageHead, seoLandingPages } from "@/lib/seo-pages";

const page = seoLandingPages["/private-family-photo-sharing"];

export const Route = createFileRoute("/private-family-photo-sharing")({
  component: () => <SeoLandingPage page={page} />,
  head: () => seoLandingPageHead(page),
});
