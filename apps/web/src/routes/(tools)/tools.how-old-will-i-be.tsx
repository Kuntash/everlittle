import journalCss from "@/features/journal/journal.css?url";
import { FamilyAgeTool } from "@/features/tools/family-age-tool";
import { ToolPage } from "@/features/tools/tool-page";
import { findTool } from "@/features/tools/tools";
import toolsCss from "@/features/tools/tools.css?url";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(tools)/tools/how-old-will-i-be")({
  component: () => (
    <ToolPage tool={findTool("how-old-will-i-be")}>
      <FamilyAgeTool />
    </ToolPage>
  ),
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () =>
    (await import("@/features/tools/tools")).toolHead("how-old-will-i-be", [journalCss, toolsCss]),
  head: ({ loaderData }) => loaderData ?? {},
});
