import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/storyworth-alternatives")({
  component: () => <JournalExperience initialArticle="storyworth-alternatives" />,
  head: () => journalArticleHead("storyworth-alternatives", journalCss),
});
