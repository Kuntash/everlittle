import { createFileRoute } from "@tanstack/react-router";
import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";

export const Route = createFileRoute("/(blog)/journal/small-firsts")({
  component: () => <JournalExperience initialArticle="small-firsts" />,
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () =>
    (await import("@/features/journal/journal-head")).journalArticleHead(
      "small-firsts",
      journalCss,
    ),
  head: ({ loaderData }) => loaderData ?? {},
});
