import journalCss from "@/features/journal/journal.css?url";
import { CapsuleChecklistTool } from "@/features/tools/capsule-checklist-tool";
import { ToolPage } from "@/features/tools/tool-page";
import { findTool } from "@/features/tools/tools";
import toolsCss from "@/features/tools/tools.css?url";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(tools)/tools/first-birthday-time-capsule-checklist")({
  component: () => (
    <ToolPage tool={findTool("capsule-checklist")}>
      <CapsuleChecklistTool />
    </ToolPage>
  ),
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () =>
    (await import("@/features/tools/tools")).toolHead("capsule-checklist", [journalCss, toolsCss]),
  head: ({ loaderData }) => loaderData ?? {},
});
