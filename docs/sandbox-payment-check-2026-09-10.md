# Isolated payment QA — 10 September 2026

Production remains in `live_mode`. A separate `sandbox` Wrangler environment uses its own Worker, D1 database, R2 bucket, authentication secrets, Dodo test API key and test webhook.

- Canonical test URL: https://everlittle-sandbox.kuntashtashi11.workers.dev
- Custom domain: https://sandbox.geteverlittle.com (public DNS resolves; local browser resolver was still failing during setup).
- Worker: `everlittle-sandbox`, version `83f91261-f949-45bd-8ed9-29d6ffb4f103`.
- Database: `everlittle-sandbox-db`, all 16 migrations applied.
- Media: `everlittle-sandbox-media`.
- Test webhook: `ep_3J6cfjfnuXTBakvseFJNP5h22AV`, canonical test URL `/api/webhooks/dodo`; subscription lifecycle plus payment.succeeded, payment.failed and refund.succeeded.
- Test products: monthly `pdt_0Nm8wlcJehzHTzRwiw7EC` ($6 USD), yearly `pdt_0Nm8wldHKeHXlQCd22UuP` ($60 USD).
- Dodo test key created in dashboard: `Everlittle sandbox QA 2026-09-10`. Secret values are excluded from this repository and report.

The test setup script now requires `DODO_TEST_API_KEY_FILE` and targets only `--env sandbox`. It no longer writes test credentials into the production Worker. Run from apps/web after providing a private key file. Deployment and migrations have explicit `deploy:sandbox` and `db:migrate:sandbox` scripts.

Verified: test product API access, successful sandbox deployment, platform reports test_mode, private/no-store and noindex/nofollow/noarchive response headers. Typecheck and build passed. Setup script syntax check passed.

## Completed customer path

Registered a separate QA account using an alias of the connected owner Gmail account. Received the verification email and followed its real link; no database verification bypass was used. Created a fictional `qa-sample-family` archive with Sample Child and disabled child access.

The unpaid first-memory action opened the $6 monthly paywall and explicitly displayed Dodo test mode. Completed checkout on `test.checkout.dodopayments.com`, with fictional US billing details and Dodo's published 4242 success test card. Payment `pay_0NnFclJ0v4XN8gX0dTAWv` succeeded for 600 USD minor units ($6). Session `cks_0NnFcLJklRZkCqYXwfsKq`; subscription `sub_0NnFclJS7IJg8T1RjeNd5`.

The return screen showed Active and unlocked the memory composer. Saved a synthetic 64×64 PNG, reopened it, and verified the image loaded at its expected dimensions. No real family media was uploaded or changed. The test subscription is set to cancel at its next billing date, preventing automatic test renewals.

The durable outbox recorded and delivered all of these events with `is_test=true`, `campaign_source=qa`, `first_campaign_source=qa`, and `campaign_name=sandbox_checkout_20260910`, with zero failed delivery attempts:

- account_signup_completed and email_verified: 20:31:08 UTC
- billing_checkout_started, payment_succeeded, first_payment_succeeded: 20:35:19 UTC
- archive_onboarding_completed: 20:36:00 UTC
- memory_created and archive_first_memory: 20:41:00 UTC

Payment events carry amount=6 and currency=USD. The existing production funnels exclude is_test=true. This is a simulated purchase, not first real revenue. The activation threshold beyond first memory was not exercised.

## Remaining external limitations

Dodo rejected the simulated full refund with HTTP409 `INSUFFICIENT_WALLET_FUNDS` (confirmed no refund was created). Thus end-to-end refund delivery is not passed. Dodo documents this as insufficient wallet balance: https://docs.dodopayments.com/api-reference/error-codes. Do not add real funds to resolve a sandbox check without a separate decision.

Google Tag Assistant could not connect through the in-app browser. Its production QA attribution intentionally suppresses Google tag loading; this is not evidence of a missing production tag. A separate clean Chrome session was unavailable. A consented, non-QA browser diagnostic is still needed before launch. No real purchase conversion was injected to work around the diagnostic.

Production `/api/platform` was rechecked at 20:42 UTC and still reports live_mode. Production was never switched to test credentials. No ads were launched or additional ad funds added.
