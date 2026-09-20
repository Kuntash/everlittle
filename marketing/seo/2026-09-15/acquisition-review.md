# Everlittle acquisition review — 15 September 2026

## Search baseline and guide targets

Read from the existing domain property in Google Search Console, Web search, selected three-month view. The chart showed data from 29 August through 12 September. Site totals: 215 impressions, 0 clicks, average position 78.4. These are early observations, not a stable conversion benchmark.

| Query | Impressions | Average position | Guide treatment |
| --- | ---: | ---: | --- |
| photo sharing for grandparents | 32 | 81.5 | Primary title, immediate answer, comparison and FAQ |
| preserve family memories app | 27 | 86.6 | Photo context, stories, voices, originals and exports; link to family-memory-app |
| grandparent photo sharing | 25 | 72.7 | Device comfort, account setup, repeat use and privacy |
| share pictures with grandparents | 25 | 82.9 | Mobile setup walkthrough and comparison |
| send photos to grandma | 22 | 93.4 | Familiar messaging app versus one-memory public link |
| memory sharing platform | 12 | 96.1 | Cost, roles, media, account requirements and preservation checklist |

Keep `/sharing-photos-with-grandparents` canonical. Do not create six near-duplicate pages. The two broader queries are supporting topics; `/family-memory-app` remains the broader product-category guide. The homepage now links directly to the grandparents guide, and its related guides already link back.

Page-level observations: private-family-photo-sharing had 128 impressions at position 83.3; family-memory-app 62 at 85.6; sharing-photos-with-grandparents 13 at 58.8. Page totals can differ from site totals. This does not establish which page ranks for each query; inspect query → Pages before diagnosing cannibalization.

Evaluate the same query/page/country/device combinations over comparable periods after recrawling. Track impressions, clicks and position alongside organic signup, archive creation and paid subscription events. An expanding keyword mix can worsen aggregate average position while useful clicks grow. Do not judge a snippet on one or two impressions.

## Existing backlink review: limited by conflicting/unavailable data

- Ahrefs authority checker initially displayed DR 0, 261 backlinks and 261 linking websites.
- A fresh detailed Ahrefs Backlink Checker request for `geteverlittle.com`, including subdomains, returned “No backlinks” with 0 links, 0 linking websites and DR 0. It exposed no referring URLs to assess.
- Google Search Console → Links returned “Processing data, please check again in a day or so”; external-link export was disabled.

Therefore **261 is unverified and must not be treated as an established backlink inventory**. DR 0 was consistent across Ahrefs tools; the backlink count was not. No source-level quality audit is possible from these reports today. This is not proof that no links exist on the web. Do not buy links, send removals, or disavow anything based on these counts.

When a referring-URL export is available, record source URL, target URL, anchor, follow/nofollow/sponsored, editorial context, audience relevance, live status and suggested action. Prioritize real editorial links to useful pages. Google says most sites do not need disavow: https://support.google.com/webmasters/answer/2648487

## Earning relevant links

Start with an editorially useful resource, then suggest it to a small set of appropriate publishers. The improved illustrated guide is ready to be that resource once published. A printable grandparent setup checklist or story-interview worksheet would add a reason to reference it independently of buying Everlittle.

| Prospect type | Useful contribution | Appropriate destination |
| --- | --- | --- |
| Family photographers | Post-session guide to sharing photos privately with relatives; actual mobile walkthrough | Grandparents guide |
| Parenting newsletters / blogs | A practical comparison of messaging, shared albums and private archives | Grandparents or private-sharing guide |
| Grandparent / intergenerational organizations | Device setup and invitation checklist; voice-story prompts | Grandparents guide or grandparents-memory-project |
| Family-history writers | Keeping captions, dates, recordings and exportable originals together | Family-memory-app or grandparents-memory-project |

Suggested first cycle: identify 10 relevant articles/resources, read each, select the best 5, and write individual pitches naming the exact reader problem the resource solves. Record replies, accepted references and qualified visits, not just DR. A reasonable outreach target is 5 carefully chosen pitches, not a promise of a particular number of links.

Draft only; not sent:

> Hi [name], your guide on [specific topic] helps families [specific outcome]. We put together a practical guide to sharing photos with grandparents, with readable screenshots of the mobile flow and a comparison of messaging, albums and family archives. It also explains when a public link is the wrong choice. If it would help your readers with [specific gap], you’re welcome to reference it: https://geteverlittle.com/sharing-photos-with-grandparents . Happy to hear what would make it more useful.

The repository records a previous outreach message to Amanda the Memory Keeper. Check that conversation before contacting her again; do not send a duplicate pitch. Free access must not be conditional on a followed backlink or favorable review. Paid/compensated placements need appropriate disclosure and link qualification. Do not request reciprocal-link schemes or mass directory placements. Google's policy: https://developers.google.com/search/docs/essentials/spam-policies

## Google Ads and whether to start Meta

Read-only account observations, all time (9–15 September):

- Campaign: Everlittle | US Search Traffic | INR1000 | Sep2026.
- Enabled and Eligible (Learning); ad eligible.
- Maximise clicks, not conversion bidding. Maximum CPC is capped at ₹35 (confirmed in Bidding settings).
- ₹1,000 total campaign budget, scheduled 10–20 September.
- 0 impressions, 0 clicks, ₹0 spend.
- Diagnostics: 4 days since last significant change; 1 day left in learning.
- Purchases is the account-default conversion goal. Overview says a conversion tag is not verified. This does not demonstrate absent website code; validate the actual goal/tag status before changing it.

The immediate issue is delivery, not a proven failure to convert. Let the displayed learning period finish without unrelated edits, and investigate zero delivery: the ₹35 CPC cap, keyword eligibility/volume, geography, schedule and account diagnostics. Google notes that a CPC cap can restrict ad position and click volume (https://support.google.com/google-ads/answer/6336101). Compare it with actual keyword bid estimates before recommending a higher cap. A tiny total budget across the US test may restrict how much can be learned, but the current observations do not prove it caused zero impressions. Do not apply the “50 conversions” guideline as a prerequisite for this Maximise clicks campaign. See https://support.google.com/google-ads/answer/6268626 and https://support.google.com/google-ads/answer/13020501 .

Recommendation: do not split the current ₹1,000 test between Google and Meta just to escape learning. A later, separately capped Meta creative test could fit the visual/emotional product: try a mobile screenshot carousel and a family-distance story, with the grandparents use case as the message. Treat this as a hypothesis, not evidence Meta will be cheaper or convert better. Use one audience/ad set and a small number of meaningfully different creatives; judge qualified signup/activation and paid conversion costs, not likes or cheap clicks. Agree the total spend ceiling and acceptable acquisition cost before launch. No Meta campaign, audience upload, pixel, budget or Google Ads settings were changed.

PostHog's current 30-day view includes internal/QA sources and test filtering is off. Exclude internal and sandbox traffic before using its 105 visitors / 70% bounce rate as customer performance. Validate attribution and the signup → archive → paid activation funnel before increasing spend. Meta measurement would need its own consent-aware setup and verification; existing Google/PostHog measurement does not establish that Meta measurement is configured.
