import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/email-address-for-baby")({
  component: () => <JournalExperience initialArticle="email-for-baby" />,
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () =>
    (await import("@/features/journal/journal-head")).journalArticleHead(
      "email-for-baby",
      journalCss,
    ),
  head: ({ loaderData }) => loaderData ?? {},
});
