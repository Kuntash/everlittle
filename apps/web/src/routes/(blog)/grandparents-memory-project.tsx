import journalCss from "@/features/journal/journal.css?url";
import { createFileRoute } from "@tanstack/react-router";

import { JournalExperience } from "@/features/journal/journal-page";
import { seoLandingPageHead, seoLandingPages } from "@/lib/seo-pages";

const page = seoLandingPages["/grandparents-memory-project"];

export const Route = createFileRoute("/(blog)/grandparents-memory-project")({
  component: () => <JournalExperience initialArticle="grandparents" />,
  head: () => {
    const head = seoLandingPageHead(page);
    return { ...head, links: [...(head.links ?? []), { rel: "stylesheet", href: journalCss }] };
  },
});
