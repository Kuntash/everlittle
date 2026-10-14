import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/pt-br/mensagem-capsula-do-tempo-cha-de-bebe")({
  component: () => <JournalExperience initialArticle="pt-capsula-cha" locale="pt-br" />,
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () =>
    (await import("@/features/journal/journal-head")).journalArticleHead(
      "pt-capsula-cha",
      journalCss,
    ),
  head: ({ loaderData }) => loaderData ?? {},
});
