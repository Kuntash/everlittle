import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/letter-to-my-baby-on-first-birthday")({
  component: () => <JournalExperience initialArticle="first-birthday-letter" />,
  head: () => journalArticleHead("first-birthday-letter", journalCss),
});
