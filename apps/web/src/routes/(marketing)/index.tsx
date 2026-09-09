import { Everlittle } from "@/features/archive/components/everlittle";
import landingCss from "@/features/marketing/landing.css?url";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/(marketing)/")({
  component: Everlittle,
  head: () => ({
    links: [
      { rel: "stylesheet", href: landingCss },
      { href: "https://geteverlittle.com/", rel: "canonical" },
    ],
    meta: [
      { title: "Everlittle — Memories to grow into" },
      {
        name: "description",
        content:
          "A private family archive for photographs, voices, everyday stories, and letters for the future.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Everlittle" },
      { property: "og:url", content: "https://geteverlittle.com/" },
      { property: "og:title", content: "Everlittle — Memories to grow into" },
      {
        property: "og:description",
        content: "Keep the little things in a private family archive your child can grow into.",
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
      { name: "twitter:title", content: "Everlittle — Memories to grow into" },
      {
        name: "twitter:description",
        content: "Keep the little things in a private family archive your child can grow into.",
      },
      {
        name: "twitter:image",
        content: "https://geteverlittle.com/marketing/family-album-us.jpg",
      },
      {
        name: "twitter:image:alt",
        content: "Three generations looking through a family album together",
      },
      { name: "robots", content: "index,follow" },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Everlittle",
          applicationCategory: "LifestyleApplication",
          operatingSystem: "Web",
          url: "https://geteverlittle.com/",
          image: "https://geteverlittle.com/marketing/family-album-us.jpg",
          description:
            "A private family archive for photographs, voices, everyday stories, and letters for the future.",
          offers: {
            "@type": "Offer",
            price: "6",
            priceCurrency: "USD",
          },
        },
      },
    ],
  }),
});
