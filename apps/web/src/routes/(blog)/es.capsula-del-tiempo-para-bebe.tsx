import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/es/capsula-del-tiempo-para-bebe")({
  component: () => <JournalExperience initialArticle="es-capsula-bebe" locale="es" />,
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () =>
    (await import("@/features/journal/journal-head")).journalArticleHead(
      "es-capsula-bebe",
      journalCss,
    ),
  head: ({ loaderData }) => loaderData ?? {},
});
