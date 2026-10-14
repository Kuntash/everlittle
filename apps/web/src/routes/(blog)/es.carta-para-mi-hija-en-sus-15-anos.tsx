import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/es/carta-para-mi-hija-en-sus-15-anos")({
  component: () => <JournalExperience initialArticle="es-carta-quince" locale="es" />,
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () =>
    (await import("@/features/journal/journal-head")).journalArticleHead(
      "es-carta-quince",
      journalCss,
    ),
  head: ({ loaderData }) => loaderData ?? {},
});
