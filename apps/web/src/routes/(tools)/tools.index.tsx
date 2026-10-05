import journalCss from "@/features/journal/journal.css?url";
import { ToolsHub } from "@/features/tools/tool-page";
import { toolsHubHead } from "@/features/tools/tools";
import toolsCss from "@/features/tools/tools.css?url";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(tools)/tools/")({
  component: ToolsHub,
  head: () => toolsHubHead([journalCss, toolsCss]),
});
