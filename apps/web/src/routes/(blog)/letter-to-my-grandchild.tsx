import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/letter-to-my-grandchild")({
  component: () => <JournalExperience initialArticle="grandchild-letter" />,
  head: () => journalArticleHead("grandchild-letter", journalCss),
});
