import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/letter-to-my-baby-on-first-birthday")({
  component: () => <JournalExperience initialArticle="first-birthday-letter" />,
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () =>
    (await import("@/features/journal/journal-head")).journalArticleHead(
      "first-birthday-letter",
      journalCss,
    ),
  head: ({ loaderData }) => loaderData ?? {},
});
