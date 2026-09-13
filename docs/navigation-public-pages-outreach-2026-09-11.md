# Navigation, public pages and outreach — 11 September 2026

## Implemented locally

- Mobile app shell fixed to dynamic viewport, body overscroll contained, tab bar height constrained with safe-area padding. Only app content scrolls. Tab bar prevents vertical pan and selection.
- Homepage section navigation, journal cards and footer use anchors without changing their existing design classes.
- Public About, Contact and Privacy routes with semantic headings, skip link, keyboard focus styles, canonical URLs and sitemap inclusion. Contact: kunga@geteverlittle.com. Copy describes implemented behavior, including public-memory links and the distinction between Google ad consent and PostHog product analytics.
- Cookie choices: Allow / Not allow, no Done button. Allow hides the floating control. Not allow leaves the compact preferences control. Footer and privacy page provide a way to reopen preferences and revoke consent.

## Validation

Production build and TypeScript check pass. Existing backend tests: 76 passed; UI tests: 16 passed. Existing desktop/mobile browser suite: 24 passed. Added browser regressions: 3 passed, 1 desktop-only skip for a mobile test. Consent regression suite rerun: 5 passed. Mobile contact and archive screenshots inspected for layout and tab placement.

Mobile browser tests use Chromium with iPhone dimensions, not physical iOS Safari. A physical device check remains appropriate for the original Safari gesture report.

## Live

Independent www redirect Worker deployed, version 93345649-716a-4563-b68a-2f212016d0d6. HTTPS www redirects with 308 to apex and preserves path/query, including UTM parameters.

Main web app changes have not been deployed. The existing working tree includes earlier billing, acquisition measurement and other changes; a full deployment would include those as well. No main-app production configuration or customer billing records were changed for this task.

## Outreach

Amanda invitation sent and verified in Instagram. Milena invitation prepared but blocked on Substack sign-in. The originally supplied Milena publication URL is invalid; independently verified her actual publication through her Medium author bio. Exact messages, sources, offer scope and fulfillment requirements are in marketing/outreach/2026-09-first-batch/README.md.

## Existing unrelated issue

Whole-tree git diff --check reports a trailing blank line in apps/web/scripts/setup-dodo-test.mjs:146, an earlier edit outside this task. Left unchanged.

## Deployment update — 11 September 2026

User explicitly requested deployment. Prior release notes confirmed earlier billing/measurement changes had already been deployed (regional measurement version 10131659-cb5e-4aa5-9e0f-74a9f941cb7a; acquisition migration applied previously). Hosted D1 migrations list confirmed none pending.

Ran `pnpm --filter @everlittle/web deploy:hosted`: hosted build and deployment succeeded. Production version **74e1c2b8-67d9-4299-a8d4-6c0ad9c28355**. Hosted/live billing configuration retained. No new migration applied.

Post-deployment checks: homepage, About, Contact, Privacy and sitemap respond successfully; all three new pages have correct canonical URLs and contact email; homepage links and sitemap entries present. Public stylesheet contains dynamic viewport and tab pan guard. Platform reports hosted mode with setup complete. Physical iPhone Safari gesture verification still pending. Earlier “not deployed” notes above describe the previous state and are superseded here.
