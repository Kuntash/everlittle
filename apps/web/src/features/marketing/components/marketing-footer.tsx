import { Brand } from "@/components/design/shared";
import { CookiePreferencesLink } from "@/components/cookie-preferences-link";
export function MarketingFooter() {
  return (
    <footer className="landing-footer">
      <div className="footer-identity"><Brand /><p>A home for your family’s memories.</p></div>
      <nav aria-label="Footer">
        {[["Privacy", "/privacy"], ["Journal", "/journal"], ["Pricing", "/pricing"], ["About", "/about"], ["Contact", "/contact"], ["Sign in", "/sign-in"]].map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        <CookiePreferencesLink />
      </nav>
    </footer>
  );
}
