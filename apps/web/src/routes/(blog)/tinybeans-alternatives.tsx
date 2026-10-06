import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/tinybeans-alternatives")({
  component: () => <JournalExperience initialArticle="tinybeans-alternatives" />,
  head: () => journalArticleHead("tinybeans-alternatives", journalCss),
});
