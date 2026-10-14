import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/storyworth-alternatives")({
  component: () => <JournalExperience initialArticle="storyworth-alternatives" />,
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () =>
    (await import("@/features/journal/journal-head")).journalArticleHead(
      "storyworth-alternatives",
      journalCss,
    ),
  head: ({ loaderData }) => loaderData ?? {},
});
