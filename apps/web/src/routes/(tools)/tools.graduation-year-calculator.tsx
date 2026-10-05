import journalCss from "@/features/journal/journal.css?url";
import { GraduationTool } from "@/features/tools/graduation-tool";
import { ToolPage } from "@/features/tools/tool-page";
import { findTool, toolHead } from "@/features/tools/tools";
import toolsCss from "@/features/tools/tools.css?url";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(tools)/tools/graduation-year-calculator")({
  component: () => (
    <ToolPage tool={findTool("graduation-year")}>
      <GraduationTool />
    </ToolPage>
  ),
  head: () => toolHead("graduation-year", [journalCss, toolsCss]),
});
