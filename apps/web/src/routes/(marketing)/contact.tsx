import { createFileRoute } from "@tanstack/react-router";
import { InformationPage } from "@/features/information/information-page";
export const Route = createFileRoute("/(marketing)/contact")({
  component: () => <InformationPage page="contact" />,
  head: () => ({
    links: [{ rel: "canonical", href: "https://geteverlittle.com/contact" }],
    meta: [
      { title: "Contact Everlittle" },
      {
        name: "description",
        content: "Contact Kunga with Everlittle product questions, feedback and privacy requests.",
      },
    ],
  }),
});
