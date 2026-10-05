import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/pt-br/carta-para-meu-neto")({
  component: () => <JournalExperience initialArticle="pt-carta-neto" locale="pt-br" />,
  head: () => journalArticleHead("pt-carta-neto", journalCss),
});
