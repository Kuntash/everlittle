import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/pt-br/mensagem-capsula-do-tempo-cha-de-bebe")({
  component: () => <JournalExperience initialArticle="pt-capsula-cha" locale="pt-br" />,
  head: () => journalArticleHead("pt-capsula-cha", journalCss),
});
