import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/baby-firsts-checklist")({
  component: () => <JournalExperience initialArticle="baby-firsts" />,
  head: () => journalArticleHead("baby-firsts", journalCss),
});
