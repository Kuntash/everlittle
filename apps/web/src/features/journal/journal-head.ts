import { articles, articlePaths } from "./journal-articles";

export function journalArticleHead(id: string, stylesheet: string) {
  const article = articles.find((entry) => entry.id === id)!;
  const url = `https://geteverlittle.com${articlePaths[id]}`;
  const title = `${article.title} | Everlittle Journal`;
  const image = "https://geteverlittle.com/marketing/family-album-us.jpg";
  return {
    links: [
      { rel: "canonical", href: url },
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
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: article.title,
          description: article.intro,
          url,
          mainEntityOfPage: url,
          image,
          datePublished: article.published ?? "2026-09-09",
          author: { "@type": "Organization", name: "Everlittle", url: "https://geteverlittle.com" },
          publisher: {
            "@type": "Organization",
            name: "Everlittle",
            url: "https://geteverlittle.com",
          },
          articleSection: article.category,
          isPartOf: {
            "@type": "Blog",
            name: "Everlittle Journal",
            url: "https://geteverlittle.com/journal",
          },
        },
      },
    ],
  };
}
