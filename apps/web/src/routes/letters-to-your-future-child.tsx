import { createFileRoute } from "@tanstack/react-router";

import { SeoLandingPage } from "@/components/seo-landing-page";
import { seoLandingPageHead, seoLandingPages } from "@/lib/seo-pages";

const page = seoLandingPages["/letters-to-your-future-child"];

export const Route = createFileRoute("/letters-to-your-future-child")({
  component: () => <SeoLandingPage page={page} />,
  head: () => seoLandingPageHead(page),
});
