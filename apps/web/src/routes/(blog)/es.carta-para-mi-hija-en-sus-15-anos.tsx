import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/es/carta-para-mi-hija-en-sus-15-anos")({
  component: () => <JournalExperience initialArticle="es-carta-quince" locale="es" />,
  head: () => journalArticleHead("es-carta-quince", journalCss),
});
