import journalCss from "@/features/journal/journal.css?url";
import { InterviewTool } from "@/features/tools/interview-tool";
import { ToolPage } from "@/features/tools/tool-page";
import { findTool } from "@/features/tools/tools";
import toolsCss from "@/features/tools/tools.css?url";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(tools)/tools/birthday-interview-questions")({
  component: () => (
    <ToolPage tool={findTool("birthday-interview")}>
      <InterviewTool />
    </ToolPage>
  ),
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () =>
    (await import("@/features/tools/tools")).toolHead("birthday-interview", [journalCss, toolsCss]),
  head: ({ loaderData }) => loaderData ?? {},
});
