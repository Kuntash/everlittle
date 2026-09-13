# Search Console and shared-memory review — 10 September 2026

Read-only Search Console audit. No campaign, indexing, or budget settings changed.

## Observed search performance

Three-month selector; chart currently shows data from 29 August through 6 September. These figures are not three months of mature performance.

| Scope | Clicks | Impressions | CTR | Average position |
|---|---:|---:|---:|---:|
| Worldwide | 0 | 84 | 0% | 74 |
| United States | 0 | 74 | 0% | 82.3 |

US queries: preserve family memories app (14 impressions); share pictures with grandparents (10); photo sharing for grandparents (8); memory sharing platform (8); send photos to grandma (8); grandparent photo sharing (6); app to record family stories (2). Query rows do not necessarily sum to report totals.

US page rows: private-family-photo-sharing (33 impressions), family-memory-app (26). Worldwide page rows: private-family-photo-sharing (44), family-memory-app (29), HTTPS homepage (8), HTTP homepage (2), baby-memory-journal (1). Impressions are not keyword search-volume estimates.

Indexing report last updated 4 September: 8 indexed, 3 not indexed. Two noindex exclusions are /sign-in and /sign-up (intentional); one redirect exclusion was reported but not drilled down. Do not remove noindex from authentication or shared-memory pages.

Sitemap: Success; submitted 31 August, last read 8 September, 8 discovered pages. Live sitemap fetched successfully and currently contains 11 indexable public URLs. Live robots.txt allows crawling and points to that sitemap. The different counts can reflect reporting/crawl lag; not proof of a broken sitemap.

Generative AI features report: 1 homepage impression, three-month selector, chart dates 29 August–6 September. Insufficient evidence to assess AI performance; not evidence of ChatGPT referrals.

## Priorities

1. In URL Inspection, compare indexed versions and Google-selected canonical for the redesigned articles and journal hub; request indexing only if needed after final publication. Reports predate the redesign. HTTP homepage impressions warrant canonical/redirect verification, not an assumed fault.
2. Expand the existing private-sharing article with a practical grandparents workflow: invitation, access, viewing and contributing, with real product screenshots and clear limitations. Retain the existing URL. This directly addresses queries already appearing.
3. Create a substantive guide specifically to sharing photos with grandparents if it serves distinct intent from recording grandparents' stories. Explain web access versus native apps accurately. Link it from relevant product and journal pages.
4. Improve the family-memory-app article with concrete evaluation criteria, examples, current pricing, export details and privacy controls. Do not manufacture customer evidence or imply unavailable features.
5. Use descriptive internal links and clear answer-first sections. Current journal pages already have canonical URLs and BlogPosting markup; don't add duplicate or unsupported FAQ/schema solely for GEO. Useful original material and crawlability matter more than extra AI files.
6. Track organic landing visitors, signups, checkouts and first paid subscriptions separately from the new Google Ads campaign. Judge impressions and position over several weeks after recrawl; 84 impressions cannot establish a reliable CTR baseline.

## Public sharing implementation

New standalone renderer in src/lib/public-memory-page.ts, used by archive-api.ts. Apricot palette, local Nunito Sans, existing sprout design, linked wordmark, watermark below media, header and lower signup CTAs, responsive layout, and matching expired-link page. Images use contain rather than cropping. Original files are not modified or watermarked on download.

CTA uses utm_source=memory_share, utm_medium=referral, utm_campaign=shared_memory, utm_content=signup_cta. No memory tokens, content or children's names are passed in these analytics parameters. This provides source attribution at the destination; unique public-page views, per-sharer attribution and a full referral funnel are not implemented by this change.

Copy/share errors now have accessible feedback. Share token expiry/revocation and noindex behavior retained. Page preview uses fictional sample data only.

Validation: TypeScript passed; all 76 backend tests passed including public-share isolation/headers and CTA checks; hosted production build passed; desktop and 390px mobile previews inspected; Copy link success feedback checked. Not deployed.

Preview while local server is running: http://127.0.0.1:5181/sample ; expired state: http://127.0.0.1:5181/expired .

## Promotion question

User reports spend ₹20,000 by 9 November 2026 to earn ₹20,000 credit. Exact offer terms could not be fetched. General Google guidance: qualifying spend after redemption, not deposits; up to 35 days to process; credit for future ads, not cashback. Confirm status, taxes and credit expiration under Billing > Promotions before increasing budget. No budget changes made.
