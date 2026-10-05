import { LOCALE_LANG, type ContentLocale } from "@/lib/locales";
import { articlePaths, findArticle } from "./journal-articles";
import { journalStrings } from "./journal-strings";

const ORIGIN = "https://geteverlittle.com";

// hreflang links for a guide and its translations, including the x-default English version.
function alternateLinks(alternates: Partial<Record<ContentLocale, string>>) {
  const entries = Object.entries(alternates) as [ContentLocale, string][];
  if (entries.length < 2) return [];
  return [
    ...entries.map(([locale, path]) => ({
      rel: "alternate",
      hrefLang: LOCALE_LANG[locale],
      href: `${ORIGIN}${path}`,
    })),
    ...(alternates.en
      ? [{ rel: "alternate", hrefLang: "x-default", href: `${ORIGIN}${alternates.en}` }]
      : []),
  ];
}

export function journalArticleHead(id: string, stylesheet: string) {
  const article = findArticle(id)!;
  const locale = article.locale ?? "en";
  const url = `${ORIGIN}${articlePaths[id]}`;
  const title = `${article.searchTitle ?? article.title} | ${locale === "en" ? "Everlittle Journal" : "Everlittle"}`;
  const image = `${ORIGIN}${article.cover?.src ?? "/marketing/family-album-us.jpg"}`;
  const alternates: Partial<Record<ContentLocale, string>> = { [locale]: articlePaths[id] };
  for (const [other, otherId] of Object.entries(article.translations ?? {})) {
    alternates[other as ContentLocale] = articlePaths[otherId];
  }
  return {
    links: [
      { rel: "canonical", href: url },
      ...alternateLinks(alternates),
      { rel: "stylesheet", href: stylesheet },
    ],
    meta: [
      { title },
      { name: "description", content: article.intro },
      { property: "og:type", content: "article" },
      { property: "og:title", content: title },
      { property: "og:description", content: article.intro },
      { property: "og:url", content: url },
      { property: "og:site_name", content: "Everlittle" },
      { property: "og:locale", content: LOCALE_LANG[locale].replace("-", "_") },
      { property: "og:image", content: image },
      ...(article.cover
        ? [
            { property: "og:image:alt", content: article.cover.alt },
            { property: "og:image:width", content: String(article.cover.width) },
            { property: "og:image:height", content: String(article.cover.height) },
          ]
        : []),
      { property: "article:published_time", content: article.published ?? "2026-09-09" },
      ...(article.updated ? [{ property: "article:modified_time", content: article.updated }] : []),
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: article.intro },
      { name: "twitter:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: article.title,
          description: article.intro,
          inLanguage: LOCALE_LANG[locale],
          url,
          mainEntityOfPage: url,
          image,
          datePublished: article.published ?? "2026-09-09",
          dateModified: article.updated ?? article.published ?? "2026-09-09",
          author: { "@type": "Organization", name: "Everlittle", url: ORIGIN },
          publisher: {
            "@type": "Organization",
            name: "Everlittle",
            url: ORIGIN,
          },
          articleSection: article.category,
          isPartOf: {
            "@type": "Blog",
            name: "Everlittle Journal",
            url: `${ORIGIN}${journalStrings[locale].journalPath}`,
          },
        },
      },
    ],
  };
}

export function journalHubHead(locale: ContentLocale, stylesheet: string) {
  const t = journalStrings[locale];
  return {
    meta: [{ title: t.hubMetaTitle }, { name: "description", content: t.hubIntro }],
    links: [
      { rel: "stylesheet", href: stylesheet },
      { rel: "canonical", href: `${ORIGIN}${t.journalPath}` },
    ],
  };
}
