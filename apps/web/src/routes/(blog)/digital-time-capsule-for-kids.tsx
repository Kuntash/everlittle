import { createFileRoute } from "@tanstack/react-router";
import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";

export const Route = createFileRoute("/(blog)/digital-time-capsule-for-kids")({
  component: () => <JournalExperience initialArticle="time-capsule" />,
  head: () => journalArticleHead("time-capsule", journalCss),
});
