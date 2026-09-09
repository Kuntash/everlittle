import { createFileRoute } from "@tanstack/react-router";
import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";

export const Route = createFileRoute("/(blog)/baby-memory-journal")({
  component: () => <JournalExperience initialArticle="little-journal" />,
  head: () => journalArticleHead("little-journal", journalCss),
});
