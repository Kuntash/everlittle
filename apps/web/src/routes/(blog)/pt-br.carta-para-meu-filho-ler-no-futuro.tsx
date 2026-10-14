import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/pt-br/carta-para-meu-filho-ler-no-futuro")({
  component: () => <JournalExperience initialArticle="pt-carta-futuro" locale="pt-br" />,
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () =>
    (await import("@/features/journal/journal-head")).journalArticleHead(
      "pt-carta-futuro",
      journalCss,
    ),
  head: ({ loaderData }) => loaderData ?? {},
});
