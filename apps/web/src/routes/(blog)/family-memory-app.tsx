import { createFileRoute } from "@tanstack/react-router";
import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";

export const Route = createFileRoute("/(blog)/family-memory-app")({
  component: () => <JournalExperience initialArticle="family-archive" />,
  head: () => journalArticleHead("family-archive", journalCss),
});
