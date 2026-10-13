import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/es/carta-para-mi-ahijado-de-bautizo")({
  component: () => <JournalExperience initialArticle="es-carta-ahijado" locale="es" />,
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () =>
    (await import("@/features/journal/journal-head")).journalArticleHead(
      "es-carta-ahijado",
      journalCss,
    ),
  head: ({ loaderData }) => loaderData ?? {},
});
