import { CookiePreferencesLink } from "@/components/cookie-preferences-link";
import { Brand } from "@/components/design/shared";

// One footer for the homepage, the journal and the free tools.
export function SiteFooter({
  locale = "en",
  journalLabel = "Journal",
  journalPath = "/journal",
}: {
  locale?: "en" | "es" | "pt-br";
  journalLabel?: string;
  journalPath?: string;
}) {
  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <Brand />
        <nav aria-label="Footer">
          <a href={journalPath}>{journalLabel}</a>
          <a href="/tools">Free tools</a>
          <a href="/pricing">Pricing</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>
      <div className="site-footer-small">
        <nav aria-label={locale === "en" ? "Languages" : "Idiomas"}>
          <a href="/journal" lang="en" aria-current={locale === "en" ? "page" : undefined}>
            English
          </a>
          <a href="/es" lang="es" aria-current={locale === "es" ? "page" : undefined}>
            Español
          </a>
          <a href="/pt-br" lang="pt-BR" aria-current={locale === "pt-br" ? "page" : undefined}>
            Português
          </a>
        </nav>
        <span>
          <a href="/privacy">Privacy</a>
          <CookiePreferencesLink />
        </span>
      </div>
    </footer>
  );
}
