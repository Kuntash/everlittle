import journalCss from "@/features/journal/journal.css?url";
import { BabyDatesTool } from "@/features/tools/baby-dates-tool";
import { ToolPage } from "@/features/tools/tool-page";
import { findTool, toolHead } from "@/features/tools/tools";
import toolsCss from "@/features/tools/tools.css?url";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(tools)/tools/baby-milestone-dates")({
  component: () => (
    <ToolPage tool={findTool("baby-milestone-dates")}>
      <BabyDatesTool />
    </ToolPage>
  ),
  head: () => toolHead("baby-milestone-dates", [journalCss, toolsCss]),
});
