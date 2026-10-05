import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/first-birthday-time-capsule-letters")({
  component: () => <JournalExperience initialArticle="first-birthday-capsule" />,
  head: () => journalArticleHead("first-birthday-capsule", journalCss),
});
