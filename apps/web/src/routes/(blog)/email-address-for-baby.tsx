import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/email-address-for-baby")({
  component: () => <JournalExperience initialArticle="email-for-baby" />,
  head: () => journalArticleHead("email-for-baby", journalCss),
});
