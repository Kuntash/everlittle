import { createFileRoute } from "@tanstack/react-router";

import landingCss from "@/features/marketing/landing.css?url";

import { MarketingPricingPage } from "@/features/marketing/pricing-page";

export const Route = createFileRoute("/(marketing)/pricing")({
  component: MarketingPricingPage,
  head: () => ({
    links: [
      { rel: "stylesheet", href: landingCss },
      { href: "https://geteverlittle.com/pricing", rel: "canonical" },
    ],
    meta: [
      { title: "Pricing — Everlittle" },
      {
        name: "description",
        content:
          "Start with 100 MB free. Upgrade to 25 GB for $6/month or $60/year. Photos, voices, stories and unlimited invited family members.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Everlittle" },
      { property: "og:url", content: "https://geteverlittle.com/pricing" },
      { property: "og:title", content: "Pricing — Everlittle" },
      {
        property: "og:description",
        content:
          "Start with 100 MB free. Upgrade to 25 GB for $6/month or $60/year. Photos, voices, stories and unlimited invited family members.",
      },
      {
        property: "og:image",
        content: "https://geteverlittle.com/marketing/family-album-us.jpg",
      },
      { property: "og:image:width", content: "1536" },
      { property: "og:image:height", content: "1024" },
      {
        property: "og:image:alt",
        content: "Three generations looking through a family album together",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Pricing — Everlittle" },
      {
        name: "twitter:description",
        content:
          "Start with 100 MB free. Upgrade to 25 GB for $6/month or $60/year. Photos, voices, stories and unlimited invited family members.",
      },
      {
        name: "twitter:image",
        content: "https://geteverlittle.com/marketing/family-album-us.jpg",
      },
      { name: "robots", content: "index,follow" },
    ],
  }),
});
