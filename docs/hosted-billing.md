# Hosted plans and storage

The hosted Everlittle Family plan is priced at **$6 USD monthly** or **$60 USD yearly** and includes
25 GiB of private media per family archive. Invited family members do not consume separate seats.
Self-hosted installations remain free and open source and do not have an application-enforced
storage limit.

## Free entry plan

New hosted archives use `complimentary` status for a free 100 MiB media allowance (marketed as
100 MB), with no card or expiry. Photos, voice recordings, videos and thumbnails share this
allowance across the family. Text memories, letters, capsules and invited family members are
included. Existing complimentary archives also use this limit; existing content remains readable
and exportable even if already over quota. No migration is needed: the API resolves the free
limit from `FREE_PLAN`, while retaining the stored paid storage entitlement for upgrades.

Active subscriptions and valid trials retain their stored allowance (normally 25 GiB). Canceled,
past-due and expired trial subscriptions remain read-only under the existing billing policy.
A missing billing record does not grant write access. Self-hosted behavior is unchanged.

Everlittle calculates usage from the original media bytes and generated video-thumbnail bytes
recorded in D1. The archive API returns this meter to the Family screen. A hosted upload is rejected
before it reaches R2 when it would exceed the archive allowance. Self-hosted uploads bypass the
hosted entitlement and quota policy.

## Lifetime access

A gifted archive is marked with `archive_subscription.lifetime = 1`. The Family screen then shows
"Lifetime access" with no checkout or portal buttons, checkout requests for the archive are
refused, and subscription webhooks leave the row alone. The stored allowance and `status` still
apply, so a grant sets both. Granting is a deliberate, hand-run statement against the hosted
database once the owner has finished onboarding:

```sh
pnpm --filter @everlittle/web exec wrangler d1 execute DB --remote --env hosted --command \
  "UPDATE archive_subscription SET status = 'active', lifetime = 1, updated_at = CURRENT_TIMESTAMP
   WHERE archive_id = (SELECT id FROM family_archive WHERE slug = '<family-slug>')
     AND provider_subscription_id IS NULL"
```

The last condition keeps a grant from masking a live paid subscription; resolve that with the
owner first. Apply migration `0018_lifetime_access.sql` before deploying.

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

Put only `DODO_PAYMENTS_API_KEY` in `apps/web/.dev.vars`, then run:

```sh
pnpm --filter @everlittle/web billing:setup:test
```

The idempotent setup command creates or reuses the $6 monthly and $60 yearly recurring SaaS
products, registers the subscription lifecycle webhook, retrieves its signing secret, and bulk
stores all four Dodo values in the hosted Cloudflare Worker. It never prints secret values. The
registered webhook URL is:

```text
https://geteverlittle.com/api/webhooks/dodo
```

Keep `DODO_PAYMENTS_ENVIRONMENT=test_mode` until checkout, renewal failure, period-end
cancellation, immediate cancellation, and recovery have all passed end-to-end tests. Archives
remain `complimentary` when Dodo credentials are absent, so an incomplete setup cannot lock a
family out.

PostHog is also optional. Set `POSTHOG_PROJECT_TOKEN` and the project-region `POSTHOG_HOST` to enable
it. Everlittle disables autocapture and session replay, identifies only the internal user ID, and
replaces family slugs and share tokens with route placeholders before sending page views.

### Upload quota and deployment

There is no separate 50 MB media-file cap. Files must fit the archive's remaining storage;
replacement uploads credit the old attachment's storage. The browser sends files larger than
8 MiB as sequential R2 multipart uploads, with retries and progress, so the 25 GB paid allowance
is usable without hitting the edge's per-request limit. Quota is checked before uploading and
atomically when the attachment is saved. Concurrent uploads can consume remaining space while a
file transfers; a rejected completion removes its staged object and preserves the old attachment.

Apply migration `0017_multipart_uploads.sql` before deploying the upload changes. Sessions expire
after 24 hours, and the scheduled handler cleans up abandoned sessions and objects. R2's default
incomplete-multipart lifecycle rule remains a fallback. Email templates are rendered in the app;
no email-provider template update or free Dodo product is required.
