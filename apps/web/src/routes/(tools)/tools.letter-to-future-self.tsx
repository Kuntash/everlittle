import journalCss from "@/features/journal/journal.css?url";
import { FutureLetterTool } from "@/features/tools/future-letter-tool";
import { ToolPage } from "@/features/tools/tool-page";
import { findTool } from "@/features/tools/tools";
import toolsCss from "@/features/tools/tools.css?url";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(tools)/tools/letter-to-future-self")({
  component: () => (
    <ToolPage tool={findTool("future-letter")}>
      <FutureLetterTool />
    </ToolPage>
  ),
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () =>
    (await import("@/features/tools/tools")).toolHead("future-letter", [journalCss, toolsCss]),
  head: ({ loaderData }) => loaderData ?? {},
});
