# Everlittle TODO

This file tracks product gaps between the current scaffold and a safe, usable family archive.

## P0 — Claim the reference installation

- [ ] Create the first owner account at [dikichoetso.com](https://dikichoetso.com).
- [ ] Create the child profile and replace the demo name, dates, and content.
- [ ] Confirm the recovery email and store recovery information securely.

## P1 — Family invitation and ownership handover

The gift workflow must allow the creator to set up the archive, invite the child’s parents, transfer
ownership to a parent, and then leave without weakening access control.

### Required UX

- [ ] Add a **Family** settings screen backed by real membership data.
- [ ] Let an owner invite an adult by email as `parent`, `contributor`, or `viewer`.
- [ ] Show pending, accepted, expired, and revoked invitations.
- [ ] Give invitees a clear preview of the archive, inviter, and proposed role before acceptance.
- [ ] Add a guided **Hand over this archive** flow for transferring ownership.
- [ ] Require recent authentication and an explicit confirmation from the current owner.
- [ ] Notify the new owner and show a clear change-of-control receipt.
- [ ] Let the former owner leave, remain a parent, or become a contributor/viewer.

### Safety invariants

- [ ] Never allow an archive to have zero owners.
- [ ] Only an existing owner can transfer ownership or remove another owner.
- [ ] Only transfer ownership to an accepted family member, never a pending invitation.
- [ ] Perform the ownership swap atomically in D1.
- [ ] Revoke active sessions when a member is removed or materially downgraded.
- [ ] Hash invitation tokens at rest; make them expiring, revocable, and single-use.
- [ ] Record invitation, acceptance, role-change, ownership-transfer, and removal audit events.
- [ ] Prevent child profiles from managing membership or archive ownership.

### Server work

- [ ] Add `family_invitation` and `audit_event` migrations.
- [ ] Add authenticated endpoints for invitation preview, create, accept, revoke, and resend.
- [ ] Add endpoints for role changes, ownership transfer, self-removal, and owner removal.
- [ ] Add same-origin checks, Zod validation, authorization checks, and rate limits.
- [ ] Add integration tests for concurrent transfer/removal and last-owner protection.

## P1 — Real archive data

- [ ] Replace the parent and child demo screens with D1-backed loaders.
- [ ] Implement child-profile creation and editing.
- [ ] Implement memory creation for photos, stories, voice notes, milestones, and letters.
- [ ] Store private media in R2 and serve it only through authorized requests.
- [ ] Generate image thumbnails and audio metadata without exposing the bucket publicly.
- [ ] Implement timeline filtering, pagination, favorites, and contributor attribution.
- [ ] Implement sealed capsules with server-enforced unlock dates.

## P1 — Privacy, recovery, and durability

- [ ] Add email verification and password-reset delivery.
- [ ] Add passkeys and optional two-factor authentication for owners and parents.
- [ ] Define retention, deletion, consent, and child-safety policies.
- [ ] Add encrypted backups and a documented restore drill.
- [ ] Add a complete archive export so families are never locked in.
- [ ] Add account and archive deletion flows with deliberate confirmation windows.

## P2 — Child experience

- [ ] Implement parent-managed child access without a public email account.
- [ ] Define age-aware permissions and presentation modes.
- [ ] Allow a child to add reflections without editing the original family memory.
- [ ] Keep locked letters and capsules inaccessible at the API layer until their unlock date.
- [ ] Add a parent-controlled transition from child access to an independent adult account.

## P2 — PWA and device polish

- [ ] Add platform-specific installation guidance for iOS and Android.
- [ ] Add an offline read-only library for explicitly downloaded memories.
- [ ] Define safe caching rules so authenticated HTML and private media are never broadly cached.
- [ ] Test standalone mode, safe areas, camera capture, microphone permissions, and uploads.
- [ ] Add update prompts when a new service-worker version is ready.

## P2 — Quality and operations

- [ ] Add unit, integration, accessibility, and mobile end-to-end tests.
- [ ] Add GitHub Actions for `pnpm ready` and migration validation.
- [ ] Configure Cloudflare Workers Builds for production after deployment ownership is settled.
- [ ] Add structured audit logging, error monitoring, and backup alerts without recording private
      memory content.
- [ ] Document local development, gifting, handover, recovery, and disaster-response runbooks.
