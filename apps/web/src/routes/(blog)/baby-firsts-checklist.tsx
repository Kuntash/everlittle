import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/baby-firsts-checklist")({
  component: () => <JournalExperience initialArticle="baby-firsts" />,
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () =>
    (await import("@/features/journal/journal-head")).journalArticleHead("baby-firsts", journalCss),
  head: ({ loaderData }) => loaderData ?? {},
});
