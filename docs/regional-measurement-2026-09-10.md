# Regional Google measurement release — 10 September 2026

Production version: 10131659-cb5e-4aa5-9e0f-74a9f941cb7a.

Chrome Tag Assistant visibly confirmed Connected, one Google tag AW-18440538542 (alias GT-5TNHCH85), consent initialization/update, config and a page-view hit before this release. This is base-tag verification, not proof of purchase-conversion delivery. Comet's blocker previously substituted a uBlock no-op script for gtag.js.

US requests use an opt-out default. Other or unknown countries require opt-in. Cloudflare request.cf.country determines the policy server-side. /api/platform uses private,no-store and the browser fetch uses no-store. A regional default is never saved as explicit consent. Existing refusals and browser/server GPC override defaults and consent. QA and sandbox suppression remain. Preferences stay available; US Google configuration enables restricted_data_processing and disables advertising personalization. Privacy copy describes the regional distinction.

Validation: typecheck, hosted build/deploy, 76 backend tests and 15 UI/measurement tests pass. Live /api/platform from India returns opt-in; Sec-GPC:1 returns globalPrivacyControl:true; production billing remains live_mode. Live article returns updated journal content and BlogPosting metadata. US branch verified by automated tests; no live US-origin browser verification claimed.

The same release includes the three migrated journal articles and non-sticky contents sidebar.
