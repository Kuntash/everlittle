import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/birthday-interview-questions-for-kids")({
  component: () => <JournalExperience initialArticle="birthday-interview" />,
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () =>
    (await import("@/features/journal/journal-head")).journalArticleHead(
      "birthday-interview",
      journalCss,
    ),
  head: ({ loaderData }) => loaderData ?? {},
});
