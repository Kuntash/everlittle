# Hosted plans and storage

The hosted Everlittle Family plan is priced at **$6 USD monthly** or **$60 USD yearly** and includes
25 GiB of private media per family archive. Invited family members do not consume separate seats.
Self-hosted installations remain free and open source and do not have an application-enforced
storage limit.

## Current founding access

Hosted archives use an `archive_subscription` entitlement record. Existing and newly created
archives are marked `complimentary` while checkout is being connected. Complimentary access has
the same 25 GiB media allowance as a paid Family plan, and the marketing site states that no card
is currently required.

Everlittle calculates usage from the original media bytes and generated video-thumbnail bytes
recorded in D1. The archive API returns this meter to the Family screen. A hosted upload is rejected
before it reaches R2 when it would exceed the archive allowance. Self-hosted uploads bypass the
hosted entitlement and quota policy.

## Dodo Payments boundary

Everlittle uses Dodo Payments hosted Checkout and its hosted Customer Portal. The archive owner can
start monthly or yearly checkout from Family settings. Once a Dodo customer exists, the same screen
opens Dodo's portal for invoices, payment methods, plan changes, and cancellation. Everlittle does
not build or store those billing-management screens.

The integration:

1. create checkout for the authenticated archive owner only;
2. bind the provider customer and subscription IDs to exactly one archive;
3. verify webhook signatures before changing `status` or billing-period fields;
4. process webhook events idempotently;
5. map paid subscriptions to `active`, failed renewals to `past_due`, and ended subscriptions to
   `canceled`; and
6. offer a customer-portal route without exposing provider identifiers to other archives.

Signed subscription webhooks are the only path that changes paid entitlement state. Webhook IDs are
stored for idempotency and provider timestamps prevent an older delivery from overwriting newer
state. A cancellation scheduled for period end remains active until its reported billing date.

### Test-mode setup

Create monthly and yearly recurring products in the Dodo test dashboard, then set the five Dodo values in
`.dev.vars.hosted.example`. The hosted Cloudflare environment uses the same names and should be
configured with `wrangler secret put --env hosted` until a secret manager owns deployment config.
Register this webhook URL in Dodo:

```text
https://geteverlittle.com/api/webhooks/dodo
```

Subscribe it to the `subscription.*` lifecycle events. Keep
`DODO_PAYMENTS_ENVIRONMENT=test_mode` until checkout, renewal failure, period-end cancellation,
immediate cancellation, and recovery have all passed end-to-end tests. Archives remain
`complimentary` when Dodo credentials are absent, so an incomplete setup cannot lock a family out.

PostHog is also optional. Set `POSTHOG_PROJECT_TOKEN` and the project-region `POSTHOG_HOST` to enable
it. Everlittle disables autocapture and session replay, identifies only the internal user ID, and
replaces family slugs and share tokens with route placeholders before sending page views.
