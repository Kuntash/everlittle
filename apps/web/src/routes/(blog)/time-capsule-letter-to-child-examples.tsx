import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/time-capsule-letter-to-child-examples")({
  component: () => <JournalExperience initialArticle="capsule-letter-examples" />,
  head: () => journalArticleHead("capsule-letter-examples", journalCss),
});
