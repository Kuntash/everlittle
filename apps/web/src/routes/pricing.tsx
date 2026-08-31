import { createFileRoute } from "@tanstack/react-router";

import { MarketingPricingPage } from "@/components/marketing-home";

export const Route = createFileRoute("/pricing")({
  component: MarketingPricingPage,
  head: () => ({
    links: [{ href: "https://geteverlittle.com/pricing", rel: "canonical" }],
    meta: [
      { title: "Pricing — Everlittle" },
      {
        name: "description",
        content: "Simple pricing for a private family archive, with a free self-hosted option.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Everlittle" },
      { property: "og:url", content: "https://geteverlittle.com/pricing" },
      { property: "og:title", content: "Pricing — Everlittle" },
      {
        property: "og:description",
        content: "Simple pricing for a private family archive, with a free self-hosted option.",
      },
      {
        property: "og:image",
        content: "https://geteverlittle.com/marketing/family-album.jpg",
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
        content: "Simple pricing for a private family archive, with a free self-hosted option.",
      },
      {
        name: "twitter:image",
        content: "https://geteverlittle.com/marketing/family-album.jpg",
      },
      { name: "robots", content: "index,follow" },
    ],
  }),
});
