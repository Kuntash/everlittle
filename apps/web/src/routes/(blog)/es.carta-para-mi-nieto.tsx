import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/es/carta-para-mi-nieto")({
  component: () => <JournalExperience initialArticle="es-carta-nieto" locale="es" />,
  head: () => journalArticleHead("es-carta-nieto", journalCss),
});
