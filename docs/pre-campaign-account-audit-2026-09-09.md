# Everlittle pre-campaign account audit

Observed September 9, 2026 through authenticated browser dashboards. Read-only
account review; only report filters/navigation and these local documents changed.
No campaign launched, budget committed, webhook changed, or tracking code implemented.
The redesign is in progress in the shared working tree; its files were left untouched.

## Decision

Complete the redesign and validate acquisition-to-payment measurement before spending.
There is enough access to identify the major gaps without asking for more credentials.
Current traffic and revenue are insufficient to judge price elasticity, CAC, retention,
or whether a larger storage allowance would improve conversion. Keep the $6/month,
$60/year offer as the control pending a measured test and cost model.

## PostHog: Everlittle Marketing, EU, project 257009

Source: https://eu.posthog.com/project/257009/web

Last 30 days, all domains, internal/test filter OFF, reporting timezone UTC:

| Metric | Observed |
| --- | ---: |
| Visitors | 67 |
| Sessions | 88 |
| Pageviews | 191 |
| Session duration | 2m 31s |
| Bounce rate | 70% |
| Homepage visitors / views | 51 / 83 |
| Sign-up page visitors / views | 7 / 11 |
| Onboarding page visitors / views | 2 / 3 |

These are uncleaned analytics observations, not qualified prospects or successful
registrations. Page-level visitor counts are not a sequential conversion funnel.
The seven-day report separately showed 27 visitors, 30 sessions, 62 views, 80% bounce.

Channel table: Direct 25 visitors, Referral 20, Organic Social 16, Paid Unknown 7.
Visitors can appear in multiple breakdown rows; do not sum these as unique people.
The UTM source/medium/campaign report showed geteverlittle.com, direct, Facebook
domains, and test.customer.dodopayments.com, with medium and campaign `(none)`.
This is evidence of missing campaign tagging and self/payment referrals, not proof
that seven genuine paid prospects were acquired. The test checkout referral shows
why internal/test exclusion and checkout attribution preservation matter.

Event definitions, with empty search and All events/All status, listed only:

- Pageview
- Identify
- billing_checkout_started

The checkout definition's last-30-days matching table showed all 2 entries, both
from the same analytics identity, approximately 10 days ago. Its top custom property
was billing_interval with example monthly. No insights or destinations using this
event were listed. The web report's conversion-goal section was empty.
Expected signup, onboarding, memory, payment and refund events were not present
in the event-definition list. This does not prove nobody signed up: the tracking
contract and real user journey must be verified after the redesign.

## Dodo Payments: merchant enabled, revenue measurement incomplete

Sources: https://app.dodopayments.com/verification,
https://app.dodopayments.com/products,
https://app.dodopayments.com/developer/webhooks

- Verification page explicitly says verification is complete and live payments are
  active, with receiving and payouts enabled. Account is verified as an individual.
- Live product view (including an Import from Test control) lists Everlittle Family
  Monthly $6 and Yearly $60, both Subscription. Other SaaS products share the merchant.
- Product summary says All Products 4, Active Products 0, Archived Products 0 while
  listing these products. Treat that counter as unresolved UI/status information;
  do not infer checkout works or fails from it. Verify actual checkout before launch.
- Home, Aug 11–Sep 9, all products: no gross/net revenue data, succeeded amount $0;
  current available balance and today's net volume $0. This is a period/account view,
  not a lifetime Everlittle-only reconciliation.
- Everlittle's enabled endpoint is https://geteverlittle.com/api/webhooks/dodo.
  Its overview showed no delivery attempts in the last 24 hours; the visible attempts
  list was also empty. No signing secrets were revealed or copied.
- All 10 subscribed event types are subscription.unpaused, subscription.cancelled,
  subscription.paused, subscription.expired, subscription.plan_changed,
  subscription.updated, subscription.on_hold, subscription.active,
  subscription.renewed, subscription.failed.
- Payment and refund events are absent from the live endpoint subscriptions.

Launch gap: implement verified payment/refund handling and durable analytics delivery,
then update the provider endpoint subscriptions alongside the deployed handler.
A subscription status or checkout redirect is not authoritative payment revenue.
Reconcile test cases, retries, first payment, renewals, cancellations and refunds.

## Cloudflare: production infrastructure and email

Account has multiple SaaS deployments; account-wide request and cost totals cannot
be attributed entirely to Everlittle.

Everlittle worker: `everlittle-hosted`, linked to geteverlittle.com.
Last 24 hours overview: 362 invocations, CPU time tile 2 ms, 0 Worker errors.
Latest deployment shown approximately two days earlier. Logs enabled, traces disabled.
Bindings: D1 `everlittle-hosted-db`, R2 `everlittle-hosted-media`, Email Service.

R2 bound media bucket: Standard storage, public access disabled, 0 B and empty
object listing; summary showed 0 Class A and 14 Class B operations. This bucket has
no observed media utilization from which to estimate normal family storage costs.
No private media contents were opened. A real upload/save/read test remains required.

Cloudflare Web Analytics for geteverlittle.com, last 24 hours, bots excluded,
GMT+5:30: 10 visits, 14 views. LCP P75 1,304 ms, reported LCP and CLS 100% Good;
INP had no data. This tiny sample is not a mobile-US performance validation and does
not establish the redesigned site's performance. Cloudflare displays a soft-navigation
measurement-change notice, another reason not to equate its counts with PostHog.

Email Sending lists geteverlittle.com as Enabled and DNS Configured, with Emails
sent 0 in the list. This confirms configuration status, not inbox delivery.
Verify signup-verification, invitation and password-reset emails end to end.
Mailflare mailbox login alone would not establish transactional deliverability.

## Search Console: US baseline

Source: https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Ageteverlittle.com

Three-month Web report, chart covering Aug 29–Sep 6, last update seven hours earlier:

| Scope | Impressions | Clicks | CTR | Average position |
| --- | ---: | ---: | ---: | ---: |
| All countries | 84 | 0 | 0% | 74 |
| United States filter | 74 | 0 | 0% | 82.3 |

US therefore accounts for 74 of 84 observed impressions. Visible US queries include
preserve family memories app (14), share pictures with grandparents (10), and photo
sharing for grandparents (8). These are site impressions, not market search volumes
or Keyword Planner forecasts. Query-level rankings and CPC forecasts remain needed
before deciding which search ad groups deserve budget.

The account's Generative AI features beta report, retaining the United States filter
and three-month range, showed 0 impressions and no page rows. This covers that Google
report only; it does not measure all AI assistants or prove absence from their answers.
Earlier indexing overview showed 8 indexed and 3 excluded pages; excluded URLs were
not investigated in this pass. Inspect them and redirects/canonicals after redesign.

## Meta

Selected account 2081404256030839 is accessible. Last-30-days ad-set view contains
one completed unrelated Instagram promotion about selling on Instagram/WhatsApp.
Do not use its results as Everlittle evidence. Events Manager showed the initial
Connect your data welcome screen; Datasets showed no visible datasets. No working
Everlittle Pixel/Conversions API integration was verified. Verify the intended
business/ad-account ownership and dataset before any Meta campaign.

## Before the first campaign

1. Finish redesign and test mobile self-serve signup, email verification, checkout,
   upload, private sharing and return visits. Check that existing SEO URLs survive.
2. Implement the event/identity contract in paid-acquisition-measurement-plan.md.
   Persist first touch and last non-direct touch, campaign IDs and appropriate click
   identifiers through signup and payment. Exclude founder/test/demo traffic.
3. Add payment/refund provider events and reliable revenue capture. Join payments
   to the acquired owner/archive and deduplicate delivery to PostHog/Google Ads.
4. Confirm the Google Ads conversion action's received test events, value, currency
   and transaction IDs; PostHog capture by itself does not configure Ads bidding.
5. Build acquisition-to-paid and paid-to-activation funnels, failure breakdowns,
   cohort retention and spend/CAC reporting. Reconcile against Everlittle-only Dodo
   payments, separating test activity and the other SaaS products.
6. Obtain US Keyword Planner volume/CPC forecasts once Ads account setup permits.
   Approve an explicit learning budget and initial campaign structure. The wizard's
   Performance Max choice is not a completed campaign strategy.
7. Establish variable costs from payment fees, storage/operations, email and future
   media/AI processing. Current empty storage and zero revenue cannot establish LTV
   or profitable CAC. No pricing/storage change is supported by this sample alone.

No further account passwords/API keys are needed to continue the accessible UI audit.
Remaining decisions are billing country/currency/timezone, explicit ad budget, and
campaign structure after measurement passes. End-to-end tests and implementation are
separate from this information-gathering pass.
