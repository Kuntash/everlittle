import journalCss from "@/features/journal/journal.css?url";
import { ToolsHub } from "@/features/tools/tool-page";
import toolsCss from "@/features/tools/tools.css?url";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(tools)/tools/")({
  component: ToolsHub,
  // The page's text is imported here, not at the top of the file, so only this page downloads it.
  loader: async () => (await import("@/features/tools/tools")).toolsHubHead([journalCss, toolsCss]),
  head: ({ loaderData }) => loaderData ?? {},
});
