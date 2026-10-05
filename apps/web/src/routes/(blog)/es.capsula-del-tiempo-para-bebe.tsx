import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/es/capsula-del-tiempo-para-bebe")({
  component: () => <JournalExperience initialArticle="es-capsula-bebe" locale="es" />,
  head: () => journalArticleHead("es-capsula-bebe", journalCss),
});
