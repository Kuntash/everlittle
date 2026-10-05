import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalHubHead } from "@/features/journal/journal-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/es/")({
  component: () => <JournalExperience initialArticle="" locale="es" />,
  head: () => journalHubHead("es", journalCss),
});
