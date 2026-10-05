import { ShadButton } from "@/components/design/controls";
import { MemoryIllustration } from "@/components/design/memory-illustrations";
import { Brand, Button } from "@/components/design/shared";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { tools, type ToolContent } from "./tools";

const start = () => window.location.assign("/sign-up");

function ToolsHeader() {
  return (
    <header className="journal-header">
      <a className="tools-brand-link" href="/" aria-label="Everlittle home">
        <Brand />
      </a>
      <div>
        <a className="journal-nav-link" href="/tools">
          Free tools
        </a>
        <Button onClick={start}>Start your archive</Button>
      </div>
    </header>
  );
}

function ToolsFooter() {
  return (
    <footer className="journal-bottom">
      <Brand />
      <p>A home for your family’s memories.</p>
      <ShadButton variant="quiet" onClick={start}>
        Create your archive
        <ArrowRight size={16} />
      </ShadButton>
    </footer>
  );
}

export function ToolPage({ tool, children }: { tool: ToolContent; children: ReactNode }) {
  return (
    <div className="journal-experience tools-experience">
      <ToolsHeader />
      <main>
        <article className="article-reader tool-reader">
          <nav className="reader-tools journal-breadcrumbs" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span aria-hidden="true">/</span>
            <a href="/tools">Free tools</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{tool.name}</span>
          </nav>
          <header className="article-heading">
            <p className="eyebrow">{tool.eyebrow}</p>
            <h1>{tool.title}</h1>
            <p>{tool.intro}</p>
          </header>
          <section className="tool-card" aria-label={tool.name}>
            {children}
            <p className="tool-note">
              Inputs stay in this browser. A copied result link contains the details you entered, so
              share it only with people you want to see them.
            </p>
          </section>
          <div className="reading-body tool-body">
            {tool.sections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.list && (
                  <ul className="article-list">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            {tool.faq.length > 0 && (
              <section>
                <h2>Common questions</h2>
                {tool.faq.map((item) => (
                  <div className="tool-faq" key={item.question}>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </div>
                ))}
              </section>
            )}
            {tool.sources && (
              <section className="article-sources" aria-labelledby="tool-sources-title">
                <h2 id="tool-sources-title">Sources</h2>
                <ol>
                  {tool.sources.map((source) => (
                    <li key={source.href}>
                      <a href={source.href} rel="noopener noreferrer" target="_blank">
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            )}
            <div className="reading-prompt">
              <MemoryIllustration kind={tool.kind} size={80} />
              <div>
                <h3>{tool.ctaTitle}</h3>
                <p>{tool.ctaBody}</p>
                <Button onClick={start}>
                  Start your archive
                  <ArrowRight size={15} />
                </Button>
              </div>
            </div>
          </div>
          <section className="related-stories">
            <p className="eyebrow">Keep going</p>
            <div>
              {tool.related.map((link) => (
                <a href={link.href} key={link.href}>
                  <MemoryIllustration kind={link.kind} size={90} />
                  <div>
                    <small>{link.label}</small>
                    <h3>{link.title}</h3>
                    <span>
                      Open <ArrowRight size={15} />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </article>
      </main>
      <ToolsFooter />
    </div>
  );
}

export function ToolsHub() {
  return (
    <div className="journal-experience tools-experience">
      <ToolsHeader />
      <main className="journal-home">
        <section className="journal-intro">
          <p className="eyebrow">Free tools from Everlittle</p>
          <h1>Small tools for the years that go quickly.</h1>
          <p>
            Free calculators and prompt generators for parents and grandparents. No account needed,
            and calculations run in your browser. You choose whether to share a result link.
          </p>
        </section>
        <div className="editorial-grid">
          {tools.map((tool) => (
            <a className="editorial-story" href={tool.path} key={tool.path}>
              <div className="story-art">
                <MemoryIllustration kind={tool.kind} size={160} />
              </div>
              <small>{tool.eyebrow}</small>
              <h2>{tool.name}</h2>
              <p>{tool.summary}</p>
              <span className="story-link">
                Open the tool
                <ArrowRight size={15} />
              </span>
            </a>
          ))}
        </div>
      </main>
      <ToolsFooter />
    </div>
  );
}
