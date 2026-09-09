import { Input, ShadButton, SlidingTabs } from "@/components/design/controls";
import { MemoryIllustration } from "@/components/design/memory-illustrations";
import { Brand, Button } from "@/components/design/shared";
import { ArrowLeft, ArrowRight, ChevronDown, Clock, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { articles } from "./journal-articles";
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
    const paths: Record<string, string> = {
      "little-journal": "/baby-memory-journal",
      "future-letter": "/letters-to-your-future-child",
      grandparents: "/grandparents-memory-project",
      "small-firsts": "/journal/small-firsts",
      "photo-story": "/journal/photo-story",
    };
    window.location.assign(paths[id] ?? "/journal");
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
        <main className="article-reader">
          <div className="reader-tools">
            <ShadButton variant="quiet" onClick={() => open("")}>
              <ArrowLeft size={16} />
              All stories
            </ShadButton>
          </div>
          <header className="article-heading">
            <p className="eyebrow">{article.category}</p>
            <h1>{article.title}</h1>
            <p>{article.intro}</p>
            <div className="byline">
              <span>By the Everlittle journal</span>
              <span>September 9, 2026</span>
              <span>
                <Clock size={14} />
                {article.minutes} min read
              </span>
            </div>
          </header>
          <div className="article-hero">
            <MemoryIllustration kind={article.kind} size={310} />
            <span>
              Their story,
              <br />
              in your words.
            </span>
          </div>
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
                Choose one idea below and try it with a memory you already have.
              </p>
              {article.sectionTitles.map((t, i) => (
                <section id={`story-section-${i}`} key={t}>
                  <h2>{t}</h2>
                  {article.paragraphs[i].map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                  {i === 0 && (
                    <blockquote>
                      A little detail, kept today, can bring a whole season back.
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
                .filter((a) => a.id !== article.id)
                .slice(0, 2)
                .map((a) => (
                  <button onClick={() => open(a.id)} key={a.id}>
                    <MemoryIllustration kind={a.kind} size={90} />
                    <div>
                      <small>{a.category}</small>
                      <h3>{a.title}</h3>
                      <span>
                        Read story <ArrowRight size={15} />
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </section>
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
          <button className="featured-story" onClick={() => open(articles[0].id)}>
            <div className="featured-art">
              <MemoryIllustration kind="Story" size={290} />
            </div>
            <div className="featured-copy">
              <span className="eyebrow">Start here</span>
              <h2>{articles[0].title}</h2>
              <p>{articles[0].intro}</p>
              <span className="story-link">
                Read the story
                <ArrowRight size={18} />
                <small>2 min read</small>
              </span>
            </div>
          </button>
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
              <button className="editorial-story" onClick={() => open(a.id)} key={a.id}>
                <div className="story-art">
                  <MemoryIllustration kind={a.kind} size={160} />
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
              </button>
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
