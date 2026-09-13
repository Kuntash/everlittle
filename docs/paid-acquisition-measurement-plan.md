# Everlittle paid acquisition and measurement plan

Prepared September 9, 2026. Updated September 10: core measurement is implemented and deployed. See `measurement-implementation-2026-09-10.md` for the actual event definitions, configured dashboards, validation, and remaining launch checks. The audit and proposed work below are historical; they are not a claim that every proposed item is implemented. No campaign was launched.

## Agreed direction

- Acquire strangers online; no selling to personal contacts or live founder demos.
- First market: US adults, English, self-serve web onboarding.
- Complete the redesign before SEO changes and paid campaign launch.
- Keep $6 monthly / $60 yearly as the initial control offer, pending actual margin data.
- Budget is not yet approved. Proposed $300 cap is a learning experiment, not a forecast.

## Observed baseline

Google Search Console was already authenticated for sc-domain:geteverlittle.com.
Overview showed 8 indexed pages, 3 not indexed pages, and 0 search clicks.
The default three-month Web performance report showed 84 impressions, 0 clicks,
0% CTR, and average position 74. Its chart covered August 29–September 6, 2026;
the report said last updated 7 hours ago. These are all-country aggregate figures,
not US-only rankings or keyword search volumes.

Visible queries included:

| Query | Impressions | Clicks |
| --- | ---: | ---: |
| preserve family memories app | 14 | 0 |
| share pictures with grandparents | 10 | 0 |
| photo sharing for grandparents | 8 | 0 |
| memory sharing platform | 8 | 0 |
| send photos to grandma | 8 | 0 |
| everlittle | 6 | 0 |
| grandparent photo sharing | 6 | 0 |
| app to record family stories | 2 | 0 |

This supersedes the earlier public site-search concern: Google has indexed pages.
Inspect the three excluded URLs later; private/authentication pages may be excluded correctly.
No SEO settings or submissions were changed during this audit.

The initial Google Ads account selector listed no existing accounts for the selected login.
The subsequent authenticated dashboard audit is recorded in
`pre-campaign-account-audit-2026-09-09.md`. It verifies PostHog traffic, Dodo merchant
verification/products/webhook subscriptions, Cloudflare hosting/storage/email,
US Search Console performance, and the selected Meta account's measurement status.
The Google Ads signup has since progressed to Performance Max campaign creation;
no campaign was launched by this audit. Dashboard access does not establish launch readiness.

## Current code audit

Sources: analytics.ts, analytics-provider.tsx, routes/index.tsx,
routes/onboarding.tsx, billing.ts, server.ts, billing-analytics.test.ts.

- Present client events: $pageview, campaign_landing_view,
  marketing_signup_cta_clicked, account_signup_started, account_signup_completed,
  archive_onboarding_completed, memory_created, billing_checkout_started,
  billing_portal_opened.
- Signup completion precedes email verification; it is not an activated family.
- memory_created fires at the end of the client creation/upload flow, not from the
  authoritative persistence boundary. Partial upload failure can differ from a saved record.
- UTMs currently include source, medium, campaign, and content only.
- One browser-local attribution record is overwritten by a subsequent tagged visit;
  there is no separate first-touch record, expiration, or server-side acquisition snapshot.
- Current tests intentionally exclude click identifiers. Adding ad-platform conversion
  matching requires a deliberate separate design, not silently removing those tests.
- A user is identified after session discovery. Verify signup before verification and
  cross-device verification journeys; do not assume these identities always stitch.
- No family-level acquisition join connects relatives' activity to an acquired owner.
- Referrer is stripped, leaving organic/AI referral attribution incomplete.
- No PostHog server capture in Dodo webhook processing. Subscription lifecycle is
  recorded in D1, but confirmed revenue/refunds are not instrumented.
- Autocapture and replay are disabled. Preserve that privacy posture.

## Event contract to implement

Use bounded enum error codes, not raw errors. Success events fire after successful
operations. Preserve existing names where their semantics remain correct; avoid
double counting if an event moves from client to server.

| Event | Source and exact meaning | Safe dimensions |
| --- | --- | --- |
| marketing_landing_view | One public landing per acquisition session | landing path, creative, offer version |
| marketing_signup_cta_clicked | Existing CTA click | placement, landing path |
| demo_started / demo_completed | Recorded demo actually starts / reaches completion | demo version |
| pricing_viewed / plan_selected | Pricing exposure / explicit plan choice | interval, offer version |
| account_signup_started | Existing owner-signup attempt | method |
| account_signup_completed | Successfully created owner account | opaque owner ID, verification required |
| account_signup_failed | Failed submission | bounded reason |
| email_verified | Server confirms verification | opaque owner ID |
| archive_onboarding_started / completed / failed | Enter flow / persist archive / fail | step, bounded reason, opaque archive ID |
| upload_started / succeeded / failed | One logical upload attempt outcome | attempt ID, media kind, size bucket, duration, bounded reason |
| memory_created | Memory is persisted | opaque archive ID, type, actor role; never text |
| invitation_created / invitation_accepted | Invitation persisted / membership actually joined | archive ID, actor role; never address or token |
| capsule_created / capsule_opened | Persisted capsule / authorized successful open | archive ID, media kind; never contents or unlock message |
| archive_activated | First time archive has 3 saved memories and 2 adult members within 7 days of archive creation | archive ID, activation definition v1 |
| archive_active | Adult meaningfully creates or opens a memory | archive ID, actor role, action |
| billing_checkout_started / failed | Checkout session returned / creation failed | interval, checkout attempt ID, environment |
| payment_succeeded | Verified provider payment success, not redirect or subscription status | payment ID, actual amount, currency, first vs renewal, archive ID, environment |
| payment_failed | Verified failed payment | payment ID, bounded reason, environment |
| refund_succeeded | Verified completed refund | refund ID, payment ID, actual amount, currency, environment |
| subscription_cancel_scheduled / ended | Verified lifecycle transition | interval, environment, archive ID |

The current pay-before-upload flow means payment can precede activation. Build two
funnels: acquisition to paid, and paid to activation/retention. If a trial is introduced,
add trial_started/ended and measure trial activation to paid separately. Do not report
a paywall-induced activation failure as an onboarding failure.

## Attribution and identity

1. Store immutable first touch and most recent non-direct touch with timestamps,
   source, medium, campaign ID/name, ad-set/ad-group ID, ad ID, creative ID,
   utm_term, sanitized public landing route, and offer/design version.
2. Use first-party random anonymous ID before signup, then link to the owner ID.
   Persist a validated acquisition snapshot server-side when the owner registers;
   bind it to the new archive. Do not replace owner acquisition with an invited
   relative's acquisition source. Never merge unrelated people into one person.
3. Give archive activity an opaque archive ID so multi-adult activation and retention
   can be queried at family level. A group-analytics entitlement is not required if
   the same aggregation can be made using event properties and queries.
4. Adopt a documented initial 30-day last-non-direct attribution window; preserve
   first touch separately. A direct return or Dodo redirect must not overwrite it.
5. Store coarse referrer source (Google, Bing, ChatGPT, Perplexity, social, other)
   without raw URL paths/query strings. Unknown/direct remains explicit. This will
   not reconstruct every cross-device or AI-assisted discovery journey.
6. Exclude local/test, founder activity, previews, and demo archives from acquisition
   metrics. Environment is mandatory on payment events. Report unknown attribution
   rates instead of assigning unattributed conversions to a convenient campaign.
7. Configure consistent campaign UTMs, for example:
   utm_source=meta&utm_medium=paid_social&utm_campaign=us_memory_v1&utm_content=voice_demo_v1
   Add platform campaign/ad IDs when creating actual campaigns.
8. PostHog reporting does not automatically train Meta or Google bidding. Add a
   separate conversion-delivery path if required, using supported platform matching
   and consent controls. Keep click IDs in a bounded, protected first-party store
   where needed; do not send family activity/content to advertising platforms.
   Deduplicate browser/server purchase delivery with the same conversion ID.

## Reliable revenue measurement

- Verify current Dodo payment/refund webhook contracts and merchant configuration.
- Do not label subscription.active or a success-page visit as cash received.
- Use actual settled successful-payment amount/currency; separate tax, discounts,
  fees and refunds where available. Do not assume every annual charge is $60.
- Persist events to a durable outbox alongside business state; retry delivery and
  use stable event IDs so retries do not inflate purchases. Reconcile Dodo totals
  against analytics. A failed analytics request must not lose a paid entitlement.
- Never multiply a $60 annual payment by 12; distinguish cash collected, MRR, and
  contribution after variable service costs. Monthly-equivalent list revenue is
  $5 for the annual plan, before fees/costs.
- Bring campaign spend into reports by date, source and campaign ID. Normalize
  reporting currency and timezone; retain source currency. Platform spend may be
  billed in INR while Everlittle charges USD.

## Dashboard and launch acceptance

Build reports for acquisition-to-paid funnel, payment-to-activation funnel,
family week-1/week-4 retention, failures by stage, revenue/refunds by cohort,
and campaign spend/CAC by source and creative. CAC denominator is new paying
archives, not all relatives, checkout attempts, renewals, or test purchases.

Before launch, verify in the actual PostHog project:

- A synthetic tagged visit keeps attribution through signup, email verification,
  onboarding, and hosted checkout; a direct return does not erase it.
- First touch survives a later second campaign. Last touch changes only as defined.
- A separate invited adult contributes to the same family activation without
  becoming another paid acquisition. Activation emits exactly once.
- Three memories and two adults outside the seven-day window do not count as
  seven-day activation. Browsing pricing does not count as retained product use.
- Failed uploads, signup errors and unavailable checkout are distinguishable.
- Verified payment, duplicate webhook retry, renewal, failure and refund produce
  correct counts/amounts; a cancelled checkout produces no payment success.
- Lost delivery retries successfully, without duplicate revenue or business errors.
- Test events are visible for QA but excluded from business dashboards.
- Inspect event payloads: no child names, birthdays, PINs, invitation tokens,
  family slugs, media URLs, memory text, audio, images, or raw search queries.
- Re-run the journey after the redesign; new button/navigation implementations
  must preserve event semantics. Only then describe tracking as launch-ready.

## Product differentiation hypotheses

Prioritize features with value on the first visit:

1. Photo plus a short spoken story, with optional transcription and a parent-approved
   caption. Preserve the original recording and permit correction.
2. A gentle weekly prompt that produces a small family chapter from chosen memories.
3. Easy invitations and an optional digest for grandparents.
4. Search across captions, stories and audio transcripts after an archive has content.

Semantic search example: find the recording where Grandma explained the nickname.
Return original memories with timestamps and sources before attempting generated
answers. Enforce family membership, audience permissions, and sealed-capsule rules
before retrieval; propagate deletion to embeddings and transcripts. Require source
support and show no-match results instead of inventing family history. Evaluate with
synthetic/permitted archives. Do not imply broad AI search is unique: Google Photos
already offers natural-language Ask Photos.

## Self-serve paid experiment after redesign

Keep one market, one control offer and a small creative set. Try voice memories,
grandparent contributions, and future letters as messages. Recorded screen demos
and an interactive sample archive replace live sales calls. Advertise implemented
features only. Optimize for a meaningful conversion, not page traffic alone.

Proposed first cap: $140 Meta, $100 tightly scoped Search, $60 conditional reserve.
If keyword forecasts make Search too expensive to produce useful visits, concentrate
the initial test in Meta rather than splitting an already small budget. Actual spend
requires a selected budget and ready conversion measurement. Higher US income is
not evidence of low CAC or indifference to another subscription.

Sources:

- https://blog.google/products-and-platforms/products/photos/updates-ask-photos-search/
- https://developer.apple.com/app-store/review/guidelines/ (3.1.1(a), 3.1.3(f))
- https://support.google.com/googleplay/android-developer/answer/16497028?hl=en
- https://support.google.com/googleplay/android-developer/answer/10281818?hl=en

Native app decision: test the installable web product first. Native capture, share-sheet
support, upload reliability and reminders may improve retention; measure demand and
mobile friction before investing. Store billing is not universally mandatory for every
companion app; US link-out and platform-specific programs must be evaluated against
the actual app implementation at submission time. A web/PWA checkout avoids app-store
billing integration for the initial acquisition experiment.
