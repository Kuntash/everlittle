import { JournalExperience } from "@/features/journal/journal-page";
import journalCss from "@/features/journal/journal.css?url";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/(blog)/journal/")({
  component: () => <JournalExperience initialArticle="" />,
  head: () => ({
    meta: [{ title: "Everlittle Journal — Ideas for the memories you want to keep" }],
    links: [
      { rel: "stylesheet", href: journalCss },
      { rel: "canonical", href: "https://geteverlittle.com/journal" },
    ],
  }),
});
