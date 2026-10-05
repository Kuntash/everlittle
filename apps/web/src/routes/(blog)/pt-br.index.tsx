import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalHubHead } from "@/features/journal/journal-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/pt-br/")({
  component: () => <JournalExperience initialArticle="" locale="pt-br" />,
  head: () => journalHubHead("pt-br", journalCss),
});
