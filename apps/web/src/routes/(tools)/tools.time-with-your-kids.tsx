import journalCss from "@/features/journal/journal.css?url";
import { TimeWithKidsTool } from "@/features/tools/time-with-kids-tool";
import { ToolPage } from "@/features/tools/tool-page";
import { findTool } from "@/features/tools/tools";
import toolsCss from "@/features/tools/tools.css?url";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(tools)/tools/time-with-your-kids")({
  component: () => (
    <ToolPage tool={findTool("time-with-your-kids")}>
      <TimeWithKidsTool />
    </ToolPage>
  ),
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () =>
    (await import("@/features/tools/tools")).toolHead("time-with-your-kids", [
      journalCss,
      toolsCss,
    ]),
  head: ({ loaderData }) => loaderData ?? {},
});
