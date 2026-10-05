import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/18-letters-for-18th-birthday")({
  component: () => <JournalExperience initialArticle="eighteen-letters" />,
  head: () => journalArticleHead("eighteen-letters", journalCss),
});
