# Everlittle measurement implementation — September 10, 2026

Production deployment: `986ab6c0-06c1-4e0f-b75e-6399e94569fa`. Migration `0016_acquisition_measurement.sql` applied to hosted D1. Dodo remains in live mode. No campaign launched and no live payment made.

## Configured accounts

- Google tag: `AW-18440538542`.
- Google Ads **Everlittle first payment**: Primary Purchase, Every, 30-day click window, dynamic amount/currency. The application emits only the first positive verified receipt per archive/environment; renewals remain revenue events in PostHog.
- **Everlittle account created** and **Everlittle checkout started**: Secondary, One, no monetary value, 90-day click windows. These are observation goals, not bidding goals.
- Enhanced conversions are not configured. No customer email/name is supplied to Google.
- [PostHog dashboard](https://eu.posthog.com/project/257009/dashboard/943686), last 30 days.
- [Acquisition to first payment](https://eu.posthog.com/project/257009/insights/sfZsTEiV): landing → account created → email verified → archive onboarding → checkout created → first payment; 30-day sequential unique-user funnel.
- [Paid to family activation](https://eu.posthog.com/project/257009/insights/n5m0LITS): first payment → first saved memory → activation; 7-day sequential unique-user funnel.
- Both funnels use `is_test=false`. Empty production funnels are expected before actual customers arrive.
- Everlittle's live Dodo endpoint now subscribes to `payment.succeeded`, `payment.failed`, and `refund.succeeded` in addition to its ten existing subscription events. Other product endpoints were unchanged.

## Events and attribution

Browser events cover marketing landing views, signup CTA clicks, pricing visibility/plan selection, signup attempts/form submission/failure, onboarding starts/submission/failure, checkout redirects/failure, upload start/success/HTTP failure and memory form success. Browser success names differ from authoritative server milestones to avoid counting the same action twice.

Server milestones: `account_signup_completed`, `email_verified`, `archive_onboarding_completed`, `billing_checkout_started`, `memory_created`, `archive_first_memory`, `capsule_created`, `invitation_created`, `invitation_accepted`, `archive_activated`, `payment_succeeded`, `payment_failed`, `first_payment_succeeded`, and `refund_succeeded`.

First touch is preserved in browser storage and an owner acquisition snapshot. Last non-direct touch has a 30-day lifetime. Allowed fields include UTM source, medium, campaign, content, term and ID, with normalized landing paths and timestamps. Direct navigation and Dodo return redirects do not overwrite an unexpired campaign. Source classification also recognizes Google, Bing, ChatGPT and Perplexity referrers when provided by the browser. Attribution is descriptive input, not proof of ad delivery.

The snapshot attaches to signup and owner checkout requests, so verified payment events retain campaign context when the browser is closed. Current-owner attribution is used for archive events. Founder/QA visits tagged `utm_source=qa` remain excluded, and test-mode environments are always marked `is_test=true`.

Google click IDs are retained by Google's consented advertising tag for matching. They are deliberately excluded from PostHog event properties. Google Ads auto-tagging and explicit UTMs must be checked when creating the actual campaign; no campaign URL template is configured yet.

## Reliability and privacy

D1 outbox event keys prevent duplicate business milestones. Stable PostHog UUIDs survive delivery retries. A five-minute cron projects persisted business records and sends pending events, with exponential retry backoff. Signup/onboarding/memory/invitation projection starts from the migration cutoff and does not backfill historical activity. A photo, voice recording or video counts only after its media asset is stored. Deleting a record before the next projection can prevent its event from being counted.

Activation v1 is three saved memories and at least two adult family members within seven days of archive creation. Family contributions are associated with the owner for the activation funnel. This definition is a chosen initial product metric, not evidence of retention. First-memory projection applies to newly created archives. Ownership transfers and older archives need separate analysis.

Payment/refund events require Dodo webhook signature verification and an allowed subscription product/archive mapping. Amounts use the actual receipt currency and currency-specific minor units; they are gross amounts, not profit or net settlement. A first payment means the first positive verified receipt observed after installation; existing paid archives would require a historical baseline before interpreting renewal events as acquisition.

Google code loads only after explicit advertising consent. Declining measurement does not block checkout. Consent can be changed via Cookie preferences. QA traffic is suppressed from Google. The browser requests only the signed-in adult's recent live, non-QA conversion records. Google receives event type, value/currency and a deduplication transaction ID, with normalized page context. Session replay/autocapture remain disabled in PostHog; family slugs, share tokens and URL/referrer details are scrubbed.

Google delivery is browser-based: consent, a working tag, and a return/active session are required. A customer who closes checkout and never returns can be present in PostHog but missing from Google Ads. This is not an offline Google Ads conversion import. Refunds are recorded in PostHog but do not yet retract the Google purchase conversion. Use Dodo receipts and PostHog revenue when assessing net acquisition economics.

## Validation

- Full backend suite: 76 tests passed; UI suite: 7 tests passed; typecheck and production build passed.
- Additional signed-webhook test passed: an invalid signature is rejected, a valid receipt produces $6 USD in test mode, and duplicate delivery yields one receipt/first-payment event. All six targeted acquisition tests pass.
- Tests cover attribution continuity/expiry, private path scrubbing, currency precision, retry UUID stability, media readiness, owner activation attribution, adult-only conversion access, cross-user exclusion, test-mode/QA filtering, consent and tag deduplication.
- Production `/api/platform` reports hosted/live mode, public pages return 200, and unauthenticated conversion access returns 401.
- A QA visit through the public family-memory page continued to a live monthly Dodo checkout and returned without paying. The durable checkout event retained first/last QA source and `is_test=true`. Scheduled PostHog delivery succeeded at `2026-09-09 20:00:58 UTC` with zero retry attempts; the production payment ledger remains empty.
- Synthetic PostHog schema samples use `everlittle-schema-validation-20260910`, `measurement_validation=true`, `environment=test_mode`, and `is_test=true`. These make event definitions available for funnel configuration; they are not evidence of a completed Dodo payment or real customer conversions.

## Remaining launch checks

Google currently says Awaiting conversions. No real purchase is expected from this test. The complete hosted Dodo sandbox purchase, entitlement unlock, first upload, renewal and refund journey is still outstanding; local signed webhook tests do not replace that end-to-end test. Do not swap only the API token on production: test products, webhook secret, endpoint mode and provider customer IDs also need a consistent environment.

Before buying traffic: complete that sandbox checkout test, verify Google tag diagnostics on a consenting non-QA test session without sending a fake purchase, and configure the actual campaign's budget, geography, keywords and attribution parameters. Payment funding is not approval to launch a campaign.
