import journalCss from "@/features/journal/journal.css?url";
import { LetterPromptsTool } from "@/features/tools/letter-prompts-tool";
import { ToolPage } from "@/features/tools/tool-page";
import { findTool } from "@/features/tools/tools";
import toolsCss from "@/features/tools/tools.css?url";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(tools)/tools/time-capsule-letter-prompts")({
  component: () => (
    <ToolPage tool={findTool("letter-prompts")}>
      <LetterPromptsTool />
    </ToolPage>
  ),
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () =>
    (await import("@/features/tools/tools")).toolHead("letter-prompts", [journalCss, toolsCss]),
  head: ({ loaderData }) => loaderData ?? {},
});
