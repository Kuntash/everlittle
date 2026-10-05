import journalCss from "@/features/journal/journal.css?url";
import { TimeWithKidsTool } from "@/features/tools/time-with-kids-tool";
import { ToolPage } from "@/features/tools/tool-page";
import { findTool, toolHead } from "@/features/tools/tools";
import toolsCss from "@/features/tools/tools.css?url";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(tools)/tools/time-with-your-kids")({
  component: () => (
    <ToolPage tool={findTool("time-with-your-kids")}>
      <TimeWithKidsTool />
    </ToolPage>
  ),
  head: () => toolHead("time-with-your-kids", [journalCss, toolsCss]),
});
