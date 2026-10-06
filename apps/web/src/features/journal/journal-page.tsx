import { Input, SlidingTabs } from "@/components/design/controls";
import { MemoryIllustration } from "@/components/design/memory-illustrations";
import { Brand, Button } from "@/components/design/shared";
import { SiteFooter } from "@/features/marketing/site-footer";
import { ArrowRight, ChevronDown, Clock, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ContentLocale } from "@/lib/locales";
import { allArticles, articlePaths } from "./journal-articles";
import { journalStrings } from "./journal-strings";
export function JournalExperience({
  initialArticle = "",
  locale = "en",
  onStart = () => window.location.assign("/sign-up"),
}: {
  initialArticle?: string;
  locale?: ContentLocale;
  onStart?: () => void;
}) {
  const copy = journalStrings[locale];
  const articles = allArticles.filter((a) => (a.locale ?? "en") === locale);
  const [active] = useState(initialArticle),
    [category, setCategory] = useState("All stories"),
    [query, setQuery] = useState(""),
    [activeSection, setActiveSection] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const article = articles.find((a) => a.id === active);
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      root.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      }),
    );
    return () => cancelAnimationFrame(id);
  }, [active]);
  const jumpToSection = (index: number) => {
    setActiveSection(index);
    root.current?.querySelector("details")?.removeAttribute("open");
    requestAnimationFrame(() =>
      root.current?.querySelector(`#story-section-${index}`)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      }),
    );
  };
  const visible = articles.filter(
    (a) =>
      (category === "All stories" || a.category === category) &&
      (a.title + " " + a.intro).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="journal-experience" ref={root}>
      <header className="journal-header">
        <Brand />
        <div>
          <a className="journal-nav-link" href={copy.journalPath}>
            {copy.journal}
          </a>
          <Button onClick={onStart}>{copy.start}</Button>
        </div>
      </header>
      {article ? (
        <main>
          <article className="article-reader">
            <div className="forest-band">
              <nav className="reader-tools journal-breadcrumbs" aria-label="Breadcrumb">
                <a href="/">{copy.home}</a>
                <span aria-hidden="true">/</span>
                <a href={copy.journalPath}>{copy.journal}</a>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{article.title}</span>
              </nav>
              <header className="article-heading">
                <p className="eyebrow">{article.category}</p>
                <h1>{article.title}</h1>
                <p>{article.intro}</p>
                <div className="byline">
                  <span>{copy.byline}</span>
                  <time dateTime={article.published ?? "2026-09-09"}>
                    {new Intl.DateTimeFormat(copy.dateLocale, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "UTC",
                    }).format(new Date(article.published ?? "2026-09-09"))}
                  </time>
                  {article.updated && (
                    <time dateTime={article.updated}>
                      Updated{" "}
                      {new Intl.DateTimeFormat("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "UTC",
                      }).format(new Date(article.updated))}
                    </time>
                  )}
                  <span>
                    <Clock size={14} />
                    {article.minutes} {copy.minRead}
                  </span>
                </div>
              </header>
            </div>
            {article.cover ? (
              <figure className="article-product-cover">
                <img
                  src={article.cover.src}
                  alt={article.cover.alt}
                  width={article.cover.width}
                  height={article.cover.height}
                  fetchPriority="high"
                />
                <figcaption>{article.cover.caption}</figcaption>
              </figure>
            ) : (
              <div className="article-hero">
                <MemoryIllustration kind={article.kind} size={310} />
                <span>
                  {copy.heroLineOne}
                  <br />
                  {copy.heroLineTwo}
                </span>
              </div>
            )}
            <div className="reading-layout">
              <details className="article-contents" suppressHydrationWarning>
                <summary className="contents-toggle">
                  {copy.onThisPage}
                  <ChevronDown size={17} />
                </summary>
                <p className="contents-desktop-title">{copy.onThisPage}</p>
                <nav
                  id="article-contents-links"
                  aria-label={copy.contentsLabel}
                  className="contents-links"
                >
                  {article.sectionTitles.map((t, i) => (
                    <a
                      key={t}
                      href={`#story-section-${i}`}
                      aria-current={activeSection === i ? "location" : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        jumpToSection(i);
                      }}
                    >
                      {t}
                    </a>
                  ))}
                </nav>
              </details>
              <div className="reading-body">
                <p className="article-lede">{article.lede ?? copy.defaultLede}</p>
                {article.comparison && (
                  <section className="article-comparison" aria-labelledby="sharing-options-title">
                    <h2 id="sharing-options-title">{article.comparison.title}</h2>
                    <div
                      className="comparison-scroll"
                      role="region"
                      aria-label={
                        article.comparison.columns
                          ? article.comparison.title
                          : "Photo sharing options comparison"
                      }
                      tabIndex={0}
                    >
                      <table>
                        <caption>
                          {article.comparison.caption ??
                            "Compare the approach with the way your family wants to share."}
                        </caption>
                        <thead>
                          <tr>
                            {(
                              article.comparison.columns ?? [
                                "Option",
                                "Useful for",
                                "What to check",
                              ]
                            ).map((heading) => (
                              <th scope="col" key={heading}>
                                {heading}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {article.comparison.rows.map((row) => (
                            <tr key={row.method}>
                              <th scope="row">{row.method}</th>
                              <td>{row.bestFor}</td>
                              <td>{row.check}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}
                {article.sectionTitles.map((t, i) => (
                  <section id={`story-section-${i}`} key={t}>
                    <h2>{t}</h2>
                    {article.paragraphs[i].map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                    {article.sectionImages?.[i] && (
                      <figure className="article-mobile-figure">
                        <img
                          src={article.sectionImages[i].src}
                          alt={article.sectionImages[i].alt}
                          width={article.sectionImages[i].width}
                          height={article.sectionImages[i].height}
                          loading="lazy"
                          decoding="async"
                        />
                        <figcaption>{article.sectionImages[i].caption}</figcaption>
                      </figure>
                    )}
                    {article.lists?.[i] && (
                      <ul className="article-list">
                        {article.lists[i].map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {article.sectionLinks?.[i]?.map((link) => (
                      <p key={link.href}>
                        <a className="article-resource" href={link.href}>
                          {link.label} <ArrowRight size={14} />
                        </a>
                      </p>
                    ))}
                    {article.sectionSources?.[i] && (
                      <p className="article-section-sources">
                        {copy.sources}:{" "}
                        {article.sectionSources[i].map((sourceIndex, index) => {
                          const source = article.sources![sourceIndex];
                          return (
                            <span key={source.href}>
                              {index > 0 && "; "}
                              <a href={source.href}>{source.label}</a>
                            </span>
                          );
                        })}
                      </p>
                    )}
                    {i === 0 && <blockquote>{article.quote ?? copy.defaultQuote}</blockquote>}
                  </section>
                ))}
                {article.sources && (
                  <section className="article-sources" aria-labelledby="article-sources-title">
                    <h2 id="article-sources-title">{copy.sources}</h2>
                    <ol>
                      {article.sources.map((source) => (
                        <li key={source.href}>
                          <a href={source.href} rel="noopener noreferrer" target="_blank">
                            {source.label}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </section>
                )}
                {copy.languageNote && <p className="article-language-note">{copy.languageNote}</p>}
                <div className="reading-prompt">
                  <MemoryIllustration kind={article.kind} size={80} />
                  <div>
                    <h3>{copy.promptTitle}</h3>
                    <p>{copy.promptBody}</p>
                    <Button onClick={onStart}>
                      {copy.start}
                      <ArrowRight size={15} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <section className="related-stories">
              <p className="eyebrow">{copy.readNext}</p>
              <div>
                {articles
                  .filter((a) =>
                    article.relatedIds ? article.relatedIds.includes(a.id) : a.id !== article.id,
                  )
                  .slice(0, 2)
                  .map((a) => (
                    <a href={articlePaths[a.id]} key={a.id}>
                      <MemoryIllustration kind={a.kind} size={90} />
                      <div>
                        <small>{a.category}</small>
                        <h3>{a.title}</h3>
                        <span>
                          {copy.readStory} <ArrowRight size={15} />
                        </span>
                      </div>
                    </a>
                  ))}
              </div>
            </section>
          </article>
        </main>
      ) : (
        <main className="journal-home">
          <section className="journal-intro forest-band">
            <p className="eyebrow">{copy.hubEyebrow}</p>
            {locale === "en" ? (
              <>
                <h1>
                  Ideas for the memories
                  <br />
                  you want to keep.
                </h1>
                <p>
                  Practical ways to keep childhood memories.
                  <br />
                  From first entries to letters for later.
                </p>
              </>
            ) : (
              <>
                <h1>{copy.hubTitle}</h1>
                <p>{copy.hubIntro}</p>
              </>
            )}
          </section>
          <a className="featured-story" href={articlePaths[articles[0].id]}>
            <div className="featured-art">
              {articles[0].cover ? (
                <img
                  className="journal-cover-thumb"
                  src={articles[0].cover.src}
                  alt={articles[0].cover.alt}
                  width={articles[0].cover.width}
                  height={articles[0].cover.height}
                />
              ) : (
                <MemoryIllustration kind="Story" size={290} />
              )}
            </div>
            <div className="featured-copy">
              <span className="eyebrow">
                {locale === "en" ? "Start here" : articles[0].category}
              </span>
              <h2>{articles[0].title}</h2>
              <p>{articles[0].intro}</p>
              <span className="story-link">
                {locale === "en" ? "Read the story" : copy.readStory}
                <ArrowRight size={18} />
                <small>
                  {articles[0].minutes} {copy.minRead}
                </small>
              </span>
            </div>
          </a>
          {locale === "en" && (
            <div className="journal-filters">
              <SlidingTabs
                label="Journal categories"
                value={category}
                onChange={setCategory}
                items={["All stories", "Everyday memories", "Letters for later", "Family stories"]}
              />
              <div className="journal-search">
                <Search size={16} />
                <Input
                  aria-label="Search stories"
                  placeholder="Search the journal"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
          )}
          <div className="editorial-grid">
            {visible.map((a) => (
              <a className="editorial-story" href={articlePaths[a.id]} key={a.id}>
                <div className="story-art">
                  {a.cover ? (
                    <img
                      className="journal-cover-thumb"
                      src={a.cover.src}
                      alt={a.cover.alt}
                      width={a.cover.width}
                      height={a.cover.height}
                      loading="lazy"
                    />
                  ) : (
                    <MemoryIllustration kind={a.kind} size={160} />
                  )}
                </div>
                <small>
                  {a.category} · {a.minutes} {copy.minRead}
                </small>
                <h2>{a.title}</h2>
                <p>{a.intro}</p>
                <span className="story-link">
                  {copy.readStory}
                  <ArrowRight size={15} />
                </span>
              </a>
            ))}
          </div>
          {!visible.length && (
            <div className="journal-empty">
              <MemoryIllustration kind="Story" size={100} />
              <h2>No stories found.</h2>
              <p>Try a different word or browse all stories.</p>
              <Button
                secondary
                onClick={() => {
                  setQuery("");
                  setCategory("All stories");
                }}
              >
                Show all stories
              </Button>
            </div>
          )}
        </main>
      )}
      <SiteFooter locale={locale} journalLabel={copy.journal} journalPath={copy.journalPath} />
    </div>
  );
}
