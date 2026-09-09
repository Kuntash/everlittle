import journalCss from "@/features/journal/journal.css?url";
import { createFileRoute } from "@tanstack/react-router";

import { JournalExperience } from "@/features/journal/journal-page";
import { seoLandingPageHead, seoLandingPages } from "@/lib/seo-pages";

const page = seoLandingPages["/baby-memory-journal"];

export const Route = createFileRoute("/(blog)/baby-memory-journal")({
  component: () => <JournalExperience initialArticle="little-journal" />,
  head: () => {
    const head = seoLandingPageHead(page);
    return { ...head, links: [...(head.links ?? []), { rel: "stylesheet", href: journalCss }] };
  },
});
