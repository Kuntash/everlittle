import { describe, expect, it } from "vitest";

import { allArticles, articlePaths } from "@/features/journal/journal-articles";
import { journalArticleHead } from "@/features/journal/journal-head";
import { tools } from "@/features/tools/tools";
import { localeFromPath } from "@/lib/locales";
import { INDEXABLE_PATHS, isIndexablePath, sitemapResponse } from "@/lib/public-web";
import { analyticsPath } from "@/lib/analytics";

const internalLinks = [
  ...allArticles.flatMap((article) =>
    Object.values(article.sectionLinks ?? {})
      .flat()
      .map((link) => link.href),
  ),
  ...tools.flatMap((tool) => tool.related.map((link) => link.href)),
];

describe("journal guides and free tools", () => {
  it("gives every article a unique indexable path and complete sections", () => {
    const paths = allArticles.map((article) => articlePaths[article.id]);
    expect(new Set(paths).size).toBe(allArticles.length);
    for (const article of allArticles) {
      expect(isIndexablePath(articlePaths[article.id]), article.id).toBe(true);
      expect(article.paragraphs, article.id).toHaveLength(article.sectionTitles.length);
      expect(localeFromPath(articlePaths[article.id]), article.id).toBe(article.locale ?? "en");
      for (const index of Object.keys({ ...article.lists, ...article.sectionLinks })) {
        expect(Number(index), article.id).toBeLessThan(article.sectionTitles.length);
      }
      for (const related of article.relatedIds ?? []) {
        const target = allArticles.find((entry) => entry.id === related);
        expect(target, `${article.id} -> ${related}`).toBeDefined();
        expect(target?.locale ?? "en", `${article.id} -> ${related}`).toBe(article.locale ?? "en");
      }
      for (const sourceIndexes of Object.values(article.sectionSources ?? {})) {
        for (const index of sourceIndexes)
          expect(article.sources?.[index], article.id).toBeDefined();
      }
    }
  });

  it("links only to published public pages or the signup page", () => {
    for (const href of internalLinks)
      expect(href === "/sign-up" || isIndexablePath(href), href).toBe(true);
    expect(isIndexablePath("/sign-up")).toBe(false);
    for (const tool of tools) expect(isIndexablePath(tool.path), tool.path).toBe(true);
  });

  it("lists guides, tools and localized pages in the sitemap", async () => {
    const body = await sitemapResponse({
      mode: "hosted",
      publicAppUrl: "https://geteverlittle.com",
    } as Parameters<typeof sitemapResponse>[0]).text();
    expect(new Set(INDEXABLE_PATHS).size).toBe(INDEXABLE_PATHS.length);
    expect(body).toContain("<loc>https://geteverlittle.com/tools/time-with-your-kids</loc>");
    expect(body).toContain("<loc>https://geteverlittle.com/long-distance-family-statistics</loc>");
    expect(body).toContain("<loc>https://geteverlittle.com/es/carta-para-mi-nieto</loc>");
    expect(body).toContain("<loc>https://geteverlittle.com/pt-br</loc>");
  });

  it("describes localized guides in their own language", () => {
    const head = journalArticleHead("es-carta-nieto", "/journal.css");
    const schema = head.meta.find((entry) => "script:ld+json" in entry) as {
      "script:ld+json": { inLanguage: string };
    };
    expect(schema["script:ld+json"].inLanguage).toBe("es");
    expect(head.links[0]).toEqual({
      rel: "canonical",
      href: "https://geteverlittle.com/es/carta-para-mi-nieto",
    });
  });

  it("reports nested public pages by their own path", () => {
    expect(analyticsPath("/tools/how-old-will-i-be")).toBe("/tools/how-old-will-i-be");
    expect(analyticsPath("/es/carta-para-mi-nieto")).toBe("/es/carta-para-mi-nieto");
    expect(analyticsPath("/tools")).toBe("/tools");
    expect(analyticsPath("/baby-firsts-checklist")).toBe("/baby-firsts-checklist");
  });
});
