import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/18-letters-for-18th-birthday")({
  component: () => <JournalExperience initialArticle="eighteen-letters" />,
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () =>
    (await import("@/features/journal/journal-head")).journalArticleHead(
      "eighteen-letters",
      journalCss,
    ),
  head: ({ loaderData }) => loaderData ?? {},
});
