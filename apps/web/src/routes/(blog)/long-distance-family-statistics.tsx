import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/long-distance-family-statistics")({
  component: () => <JournalExperience initialArticle="family-distance-stats" />,
  head: () => journalArticleHead("family-distance-stats", journalCss),
});
