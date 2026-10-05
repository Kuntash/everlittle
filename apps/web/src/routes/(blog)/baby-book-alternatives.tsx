import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/baby-book-alternatives")({
  component: () => <JournalExperience initialArticle="baby-book-alternatives" />,
  head: () => journalArticleHead("baby-book-alternatives", journalCss),
});
