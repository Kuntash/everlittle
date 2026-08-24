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

## Payment-provider boundary

The schema deliberately keeps provider identifiers nullable. A future checkout integration must:

1. create checkout for the authenticated archive owner only;
2. bind the provider customer and subscription IDs to exactly one archive;
3. verify webhook signatures before changing `status` or billing-period fields;
4. process webhook events idempotently;
5. map paid subscriptions to `active`, failed renewals to `past_due`, and ended subscriptions to
   `canceled`; and
6. offer a customer-portal route without exposing provider identifiers to other archives.

Do not change an archive from `complimentary` until checkout, webhook handling, billing email,
refund, cancellation, and recovery paths have passed end-to-end tests.
