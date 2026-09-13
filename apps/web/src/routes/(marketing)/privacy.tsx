import { createFileRoute } from "@tanstack/react-router";
import { InformationPage } from "@/features/information/information-page";
export const Route = createFileRoute("/(marketing)/privacy")({
  component: () => <InformationPage page="privacy" />,
  head: () => ({
    links: [{ rel: "canonical", href: "https://geteverlittle.com/privacy" }],
    meta: [
      { title: "Privacy at Everlittle" },
      {
        name: "description",
        content:
          "Learn how Everlittle handles account information, family memories, sharing and advertising measurement.",
      },
    ],
  }),
});
