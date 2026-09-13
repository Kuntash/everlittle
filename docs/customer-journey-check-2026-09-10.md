# Redesign customer journey check — September 10, 2026

Status: redesigned empty states deployed; public entry, authenticated unpaid journey,
monthly checkout and cancellation checked. This is not a complete end-to-end pass.
The user completed account setup. No payment, invitation, upload, or profile edit
was made during the authenticated testing pass.

Production version: `4c635032-f7a0-4195-a67f-65527652e62f` (September 10, 2026).

## Verified

- Live geteverlittle.com renders the redesigned homepage.
- Main signup CTA opens /sign-up and renders the new account form.
- Empty signup submission is blocked by required-field validation.
- Pricing toggles from $6/month to $60/year; pricing CTA opens /sign-up.
- Sample photo-memory detail opens with its caption and closes successfully.
- Read about privacy opens the privacy explanation dialog.
- A synthetic landing with utm_source=qa, utm_medium=internal and
  utm_campaign=redesign_journey_20260910 produced campaign_landing_view in EU
  PostHog project 257009. The event definition shows the expected campaign values
  and landing path /. Exclude this campaign from acquisition reports.
- pnpm --filter @everlittle/web test: 12 files, 69 tests passed.
- pnpm --filter @everlittle/web test:ui: 1 file, 5 tests passed.

Local tests use isolated D1/R2 fixtures; component tests use jsdom. These do not
prove production email delivery, checkout, persistence, or responsive browser behavior.
The existing Playwright archive suite mocks session/archive APIs, so it likewise
cannot establish real signup-to-payment success. It was inspected, not executed.

## Tracking findings

The AnalyticsProvider signup-click listener only matches a[href] pointing to
/sign-up. The redesigned homepage CTAs are buttons, and marketing-home.tsx has no
matching signup-click capture. PostHog's event list after the exercised clicks had
campaign_landing_view but no marketing_signup_cta_clicked. Update capture to match
the actual navigation controls and verify the delivered event once, without duplicates.

Existing source contains account_signup_started/completed, archive_onboarding_completed,
memory_created and checkout capture; they still require verification through the real
journey. Absence of earlier production events is not proof that these are absent in code.

Current attribution is partially persistent: a browser localStorage record stores
source/medium/campaign/content/landing path and is restored on direct visits.
A later tagged visit overwrites the same record. It does not establish immutable
first touch, a server account/archive acquisition snapshot, or a confirmed-payment join.
See paid-acquisition-measurement-plan.md for the fuller implementation contract.

## Authenticated production checks and changes

- Approved illustrated empty home and compact timeline states deployed and observed
  in the signed-in archive. Local preview had no horizontal overflow at 390 px.
- Home and timeline creation actions, and New capsule, open the subscription prompt.
- Monthly/yearly pricing renders at $6/month and $60/year with $12 annual savings.
- Monthly checkout opens a branded live Dodo checkout for the correct monthly product
  and 25 GB storage. It defaults to India/local currency in this browser; US checkout
  currency/tax behavior was not exercised.
- Cancelling checkout returns to `/kunga/settings`; the archive still reports no paid
  subscription, no charges or invoices, and 0 KB used.
- Fixed checkout return opening People instead of Plan. Verified the deployed
  `/kunga/settings` route now initially selects Plan.
- Existing child profile settings and disabled child sign-in render. No private profile
  values were edited or copied into this report.
- PostHog checkout event definition updated during testing and exposes monthly billing
  plus QA campaign source, medium, name, and landing path from the earlier tagged visit.
  This supports browser attribution continuity, not a durable server/payment join.
- Type checking, five component tests, and build passed for the empty-state change.
  Type checking and production build also passed after the checkout-return fix.

## Remaining journey

1. Verify email delivery and verification-link behavior separately; account setup was
   completed by the user and was not observed end-to-end by this test.
2. Use a separate Dodo sandbox environment for successful payment and failure scenarios,
   or have the user activate the archive themselves. Do not switch production to test
   billing or initiate a real charge without spending authorization.
3. With an active test subscription, save/reload synthetic photo/story/audio memories,
   verify actual R2 persistence, access controls, invitations to controlled recipients,
   export, and sealed capsules.
4. Reconcile signup, onboarding, memory creation and confirmed payment across PostHog,
   Dodo, and conversion delivery. The attribution gaps above remain outstanding.

No advertising campaign was launched during this work.
