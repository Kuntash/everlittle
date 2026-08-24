import { createFileRoute } from "@tanstack/react-router";

import { MarketingPricingPage } from "@/components/marketing-home";

export const Route = createFileRoute("/pricing")({
  component: MarketingPricingPage,
  head: () => ({
    links: [{ href: "/pricing", rel: "canonical" }],
    meta: [
      { title: "Pricing — Everlittle" },
      {
        name: "description",
        content: "Simple pricing for a private family archive, with a free self-hosted option.",
      },
      { name: "robots", content: "index,follow" },
    ],
  }),
});
