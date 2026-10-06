import { Everlittle } from "@/features/archive/components/everlittle";
import landingCss from "@/features/marketing/landing.css?url";
import homeCss from "@/features/marketing/home/home.css?url";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/(marketing)/")({
  component: Everlittle,
  head: () => ({
    links: [
      { rel: "stylesheet", href: landingCss },
      { rel: "stylesheet", href: homeCss },
      { href: "https://geteverlittle.com/", rel: "canonical" },
    ],
    meta: [
      { title: "Everlittle — Private family memories, starting free" },
      {
        name: "description",
        content:
          "Save family photos, voices and stories in one private place. Invite loved ones to contribute. Start with 100 MB free, no card required.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Everlittle" },
      { property: "og:url", content: "https://geteverlittle.com/" },
      { property: "og:title", content: "Everlittle — Private family memories, starting free" },
      {
        property: "og:description",
        content: "Save photos, voices and stories with your family. Start with 100 MB free.",
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
      { name: "twitter:title", content: "Everlittle — Private family memories, starting free" },
      {
        name: "twitter:description",
        content: "Save photos, voices and stories with your family. Start with 100 MB free.",
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
            "Save family photos, voices and stories in one private place. Invite loved ones to contribute. Start with 100 MB free, no card required.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        },
      },
    ],
  }),
});
