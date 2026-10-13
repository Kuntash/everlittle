import journalCss from "@/features/journal/journal.css?url";
import { GraduationTool } from "@/features/tools/graduation-tool";
import { ToolPage } from "@/features/tools/tool-page";
import { findTool } from "@/features/tools/tools";
import toolsCss from "@/features/tools/tools.css?url";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(tools)/tools/graduation-year-calculator")({
  component: () => (
    <ToolPage tool={findTool("graduation-year")}>
      <GraduationTool />
    </ToolPage>
  ),
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () =>
    (await import("@/features/tools/tools")).toolHead("graduation-year", [journalCss, toolsCss]),
  head: ({ loaderData }) => loaderData ?? {},
});
