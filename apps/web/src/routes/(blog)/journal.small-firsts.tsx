import { createFileRoute } from "@tanstack/react-router";
import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";

export const Route = createFileRoute("/(blog)/journal/small-firsts")({
  component: () => <JournalExperience initialArticle="small-firsts" />,
  head: () => journalArticleHead("small-firsts", journalCss),
});
