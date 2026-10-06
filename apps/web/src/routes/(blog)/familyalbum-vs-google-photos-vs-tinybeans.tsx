import journalCss from "@/features/journal/journal.css?url";
import { JournalExperience } from "@/features/journal/journal-page";
import { journalArticleHead } from "@/features/journal/journal-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(blog)/familyalbum-vs-google-photos-vs-tinybeans")({
  component: () => <JournalExperience initialArticle="photo-sharing-apps" />,
  head: () => journalArticleHead("photo-sharing-apps", journalCss),
});
