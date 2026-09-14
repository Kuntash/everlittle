import { Input, ShadButton, SlidingTabs } from "@/components/design/controls";
import { MemoryIllustration } from "@/components/design/memory-illustrations";
import { Brand, Button } from "@/components/design/shared";
import { ArrowRight, ChevronDown, Clock, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { articles, articlePaths } from "./journal-articles";
export function JournalExperience({
  initialArticle = "",
  onStart = () => window.location.assign("/sign-up"),
}: {
  initialArticle?: string;
  onStart?: () => void;
}) {
  const [active] = useState(initialArticle),
    [category, setCategory] = useState("All stories"),
    [query, setQuery] = useState(""),
    [activeSection, setActiveSection] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const article = articles.find((a) => a.id === active);
  const open = (id: string) => {
    window.location.assign(articlePaths[id] ?? "/journal");
  };
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
          <ShadButton variant="quiet" onClick={() => open("")}>
            Journal
          </ShadButton>
          <Button onClick={onStart}>Start your archive</Button>
        </div>
      </header>
      {article ? (
        <main>
          <article className="article-reader">
            <nav className="reader-tools journal-breadcrumbs" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span aria-hidden="true">/</span>
              <a href="/journal">Journal</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{article.title}</span>
            </nav>
            <header className="article-heading">
              <p className="eyebrow">{article.category}</p>
              <h1>{article.title}</h1>
              <p>{article.intro}</p>
              <div className="byline">
                <span>By the Everlittle journal</span>
                <time dateTime={article.published ?? "2026-09-09"}>
                  {new Intl.DateTimeFormat("en-US", {
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
                  {article.minutes} min read
                </span>
              </div>
            </header>
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
                  Their story,
                  <br />
                  in your words.
                </span>
              </div>
            )}
            <div className="reading-layout">
              <details className="article-contents" suppressHydrationWarning>
                <summary className="contents-toggle">
                  On this page
                  <ChevronDown size={17} />
                </summary>
                <p className="contents-desktop-title">On this page</p>
                <nav
                  id="article-contents-links"
                  aria-label="Article contents"
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
                <p className="article-lede">
                  {article.lede ??
                    "Choose one idea below and try it with a memory you already have."}
                </p>
                {article.comparison && (
                  <section className="article-comparison" aria-labelledby="sharing-options-title">
                    <h2 id="sharing-options-title">{article.comparison.title}</h2>
                    <div
                      className="comparison-scroll"
                      role="region"
                      aria-label="Photo sharing options comparison"
                      tabIndex={0}
                    >
                      <table>
                        <caption>
                          Compare the approach with the way your family wants to share.
                        </caption>
                        <thead>
                          <tr>
                            <th scope="col">Option</th>
                            <th scope="col">Useful for</th>
                            <th scope="col">What to check</th>
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
                    {article.sectionLinks?.[i]?.map((link) => (
                      <p key={link.href}>
                        <a className="article-resource" href={link.href}>
                          {link.label} <ArrowRight size={14} />
                        </a>
                      </p>
                    ))}
                    {i === 0 && (
                      <blockquote>
                        {article.quote ??
                          "A little detail, kept today, can bring a whole season back."}
                      </blockquote>
                    )}
                  </section>
                ))}
                <div className="reading-prompt">
                  <MemoryIllustration kind={article.kind} size={80} />
                  <div>
                    <h3>Keep one detail from today.</h3>
                    <p>Start with a sentence, a photo or a familiar voice.</p>
                    <Button onClick={onStart}>
                      Start your archive
                      <ArrowRight size={15} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <section className="related-stories">
              <p className="eyebrow">Read next</p>
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
                          Read story <ArrowRight size={15} />
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
          <section className="journal-intro">
            <p className="eyebrow">The Everlittle journal</p>
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
              <span className="eyebrow">Start here</span>
              <h2>{articles[0].title}</h2>
              <p>{articles[0].intro}</p>
              <span className="story-link">
                Read the story
                <ArrowRight size={18} />
                <small>{articles[0].minutes} min read</small>
              </span>
            </div>
          </a>
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
                  {a.category} · {a.minutes} min read
                </small>
                <h2>{a.title}</h2>
                <p>{a.intro}</p>
                <span className="story-link">
                  Read story
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
      <footer className="journal-bottom">
        <Brand />
        <p>A home for your family’s memories.</p>
        <ShadButton variant="quiet" onClick={onStart}>
          Create your archive
          <ArrowRight size={16} />
        </ShadButton>
      </footer>
    </div>
  );
}
