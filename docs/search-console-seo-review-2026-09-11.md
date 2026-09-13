# Search Console, SEO and AI search review — 11 September 2026

## Completed action

Inspected https://geteverlittle.com/sharing-photos-with-grandparents in Search Console. Google reported URL unknown to Google, no recorded crawl or sitemap discovery. The live page is published, returns 200, has a self-canonical, server-rendered text, and no noindex header/meta. It is present in the live sitemap. Requested indexing once; Google confirmed it entered the priority crawl queue. This is a request, not confirmation of indexing. Do not repeatedly submit it.

## Search Console observations

- Performance: selected three months, actual chart 29 August–8 September 2026; last update eight hours ago. 0 clicks, 144 impressions, 0% CTR, average position 78.7. Earlier audit showed 84 impressions through 6 September, so this is a longer reporting window, not evidence that the recent changes improved rankings.
- Leading queries: preserve family memories app (20 impressions), photo sharing for grandparents (17), share pictures with grandparents (16), send photos to grandma (16), grandparent photo sharing (12), memory sharing platform (12), private family photos (7), everlittle (6). These are observed site impressions, not market search volumes.
- Page indexing: last update 4 September; 8 indexed, 3 excluded. Redirect example is http://geteverlittle.com/, correctly redirecting 308 to HTTPS. Prior audit identified /sign-in and /sign-up as the two noindex examples; both were rechecked live and retain noindex headers. These exclusions are intentional.
- Sitemap: Success, last read 8 September, eight discovered pages in the report. Live sitemap now contains 12. No broken submission; no unnecessary resubmission made.
- Manual actions: No issues detected.
- Security issues: No issues detected.
- Core Web Vitals: No data for mobile or desktop. This is not a passing performance score. No Lighthouse/PageSpeed audit performed in this review.
- HTTPS overview: six HTTPS, zero non-HTTPS reported.
- This property exposes a Generative AI features beta report: one homepage impression, actual chart 29 August–8 September. This is insufficient to assess effectiveness and says nothing about ChatGPT or Perplexity citations. The live beta report is newer than the general documentation/skill claim that no separate report exists.

## Live technical checks

Evidence: seo-live-check-2026-09-11.json.

All 12 sitemap URLs return 200 and have self-canonicals and initial-HTML headings/content. None has a noindex header. Journal articles contain parseable BlogPosting JSON-LD; homepage contains SoftwareApplication/Offer. Pricing is publicly rendered. HTTP homepage returns 308 to HTTPS. The www hostname does not resolve from this environment; apex works. No DNS changes made.

robots.txt allows all public paths and disallows /api/. OAI-SearchBot and other search crawlers are not explicitly blocked by these rules. This does not prove real crawler IPs pass Cloudflare's security rules; verified-bot request logs/WAF settings were not audited.

## Prioritized remaining work

1. **Crawlable homepage navigation.** JournalSection navigation/cards and MarketingFooter use onClick buttons for navigation. Replace cross-page navigation with anchors/Link hrefs; preserve buttons for actions and appropriate in-page interactions. Sitemap discovery is working, but these controls don't provide ordinary crawlable homepage links. Validate generated HTML and keyboard behavior after the change.
2. **Public product identity and trust.** Add clear About/contact access and a directly linkable privacy page. The homepage's privacy detail currently opens a modal; footer has no direct About/contact/privacy-document links. Write policy details from verified product/business facts, not an invented legal template. Connect the real Instagram profile; optional consistent Organization @id/logo/sameAs markup once visible facts are in place. This is clarity/trust work, not a guaranteed ranking boost.
3. **Improve existing articles before duplicating topics.** Prioritize the grandparents-sharing and family-memory-app pages, where query impressions already exist. The new guide is already deployed—do not rebuild it. Add actual product screenshots and concrete decision criteria where useful. Give future-letter and grandparents-story articles descriptive search titles while retaining their editorial headings. Add genuine modified dates when substantive updates occur; no artificial freshness.
4. **Canonical hostname convenience.** Configure www to reach the existing canonical redirect with valid DNS/TLS. Lower priority than indexing/content because all declared canonicals use the functioning apex. Hosting change remains pending.
5. **Measurement and AI visibility baseline.** Review organic landing sessions and completed signups separately from paid/social traffic in PostHog. Check actual OAI-SearchBot/Perplexity access in Cloudflare. Sample a small fixed set of relevant questions across AI search systems and preserve responses/citations/date/platform; no cross-platform citation audit was performed today. Do not interpret one AI impression as meaningful traction.

## AI SEO interpretation

Google says no special AI markup or AI text file is required; indexed, accessible, useful content remains the foundation. llms.txt, OKF bundles, mass FAQs and new schema are not urgent blockers. OpenAI's OAI-SearchBot controls search discovery; GPTBot concerns training and is independently configurable. Do not enable training solely on the mistaken assumption it is needed for search. No crawler permissions were changed.

Sources:
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.openai.com/api/docs/bots
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable

Only indexing submission and audit documents changed in this review. Production code, DNS, budgets and security settings were not changed. The existing dirty working tree was preserved.
