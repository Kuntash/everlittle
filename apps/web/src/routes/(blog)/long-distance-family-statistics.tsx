import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/long-distance-family-statistics")({
  component: () => <JournalExperience initialArticle="family-distance-stats" />,
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () =>
    (await import("@/features/journal/journal-head")).journalArticleHead(
      "family-distance-stats",
      journalCss,
    ),
  head: ({ loaderData }) => loaderData ?? {},
});
