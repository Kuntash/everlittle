import journalCss from "@/features/journal/journal.css?url";
import { InterviewTool } from "@/features/tools/interview-tool";
import { ToolPage } from "@/features/tools/tool-page";
import { findTool, toolHead } from "@/features/tools/tools";
import toolsCss from "@/features/tools/tools.css?url";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(tools)/tools/birthday-interview-questions")({
  component: () => (
    <ToolPage tool={findTool("birthday-interview")}>
      <InterviewTool />
    </ToolPage>
  ),
  head: () => toolHead("birthday-interview", [journalCss, toolsCss]),
});
