import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/best-baby-book-apps")({
  component: () => <JournalExperience initialArticle="baby-book-apps" />,
  head: () => journalArticleHead("baby-book-apps", journalCss),
});
