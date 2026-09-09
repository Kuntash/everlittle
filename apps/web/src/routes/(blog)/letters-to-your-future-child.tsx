import journalCss from "@/features/journal/journal.css?url";
import { createFileRoute } from "@tanstack/react-router";

import { JournalExperience } from "@/features/journal/journal-page";
import { seoLandingPageHead, seoLandingPages } from "@/lib/seo-pages";

const page = seoLandingPages["/letters-to-your-future-child"];

export const Route = createFileRoute("/(blog)/letters-to-your-future-child")({
  component: () => <JournalExperience initialArticle="future-letter" />,
  head: () => {
    const head = seoLandingPageHead(page);
    return { ...head, links: [...(head.links ?? []), { rel: "stylesheet", href: journalCss }] };
  },
});
