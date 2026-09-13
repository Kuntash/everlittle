import { createFileRoute } from "@tanstack/react-router";
import { InformationPage } from "@/features/information/information-page";
export const Route = createFileRoute("/(marketing)/about")({
  component: () => <InformationPage page="about" />,
  head: () => ({
    links: [{ rel: "canonical", href: "https://geteverlittle.com/about" }],
    meta: [
      { title: "About Everlittle" },
      {
        name: "description",
        content:
          "Learn about Everlittle, a web app for family photos, voices, stories and letters.",
      },
    ],
  }),
});
