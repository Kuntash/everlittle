# Everlittle TODO

This file tracks product gaps between the current scaffold and a safe, usable family archive.

## P0 — Claim the reference installation

- [x] Create the first owner account at [dikichoetso.com](https://dikichoetso.com).
- [x] Create Diki Choetso’s child profile and replace the demo name, dates, and content.

## P1 — Family invitation and ownership handover

The gift workflow must allow the creator to set up the archive, invite the child’s parents, transfer
ownership to a parent, and then leave without weakening access control.

### Required UX

- [x] Add a **Family** settings screen backed by real membership data.
- [x] Let an owner invite an adult by email as `parent`, `contributor`, or `viewer`.
- [ ] Show pending, accepted, expired, and revoked invitations.
- [x] Give invitees a clear preview of the archive, inviter, and proposed role before acceptance.
- [x] Add a guided **Hand over this archive** flow for transferring ownership.
- [ ] Require recent authentication and an explicit confirmation from the current owner.
- [ ] Notify the new owner and show a clear change-of-control receipt.
- [x] Let the former owner leave, remain a parent, or become a contributor/viewer.

### Current invitation UX gaps

- [x] Send invitation emails automatically instead of requiring the owner to copy and privately
      deliver a bearer link.
- [x] Warn the owner that an invitation link grants access and should be shared only with the
      intended recipient.
- [x] Add **Resend** and **Replace link** actions with clear expiry information.
- [ ] Let an invitee explicitly decline an invitation.
- [ ] Show accepted, expired, revoked, and declined invitation history—not only active invitations.
- [ ] Notify the owner when an invitation is accepted, declined, or expires.
- [x] Show the inviter’s identity and a plain-language permission summary before acceptance.
- [ ] Add a correction flow for an invitation sent to the wrong email address.
- [ ] Require password re-entry or another recent-authentication check before ownership transfer.
- [ ] Give both parties a durable ownership-transfer receipt with the previous owner, new owner,
      timestamp, and resulting roles.
- [ ] End the transfer flow with an explicit choice for the former owner: remain a parent, change
      role, or leave the archive.

### Safety invariants

- [x] Never allow an archive to have zero owners.
- [ ] Only an existing owner can transfer ownership or remove another owner.
- [x] Only transfer ownership to an accepted family member, never a pending invitation.
- [x] Perform the ownership swap atomically in D1.
- [ ] Revoke active sessions when a member is removed or materially downgraded.
- [x] Hash invitation tokens at rest; make them expiring, revocable, and single-use.
- [x] Record invitation, acceptance, role-change, ownership-transfer, and removal audit events.
- [ ] Prevent child profiles from managing membership or archive ownership.

### Server work

- [x] Add `family_invitation` and `audit_event` migrations.
- [x] Add authenticated endpoints for invitation preview, create, accept, revoke, and resend.
- [x] Add endpoints for role changes, ownership transfer, self-removal, and owner removal.
- [x] Add same-origin checks, Zod validation, authorization checks, and rate limits.
- [ ] Add integration tests for concurrent transfer/removal and last-owner protection.

## P1 — Real archive data

- [x] Replace the parent and child demo screens with D1-backed loaders.
- [x] Implement child-profile creation and editing.
- [x] Implement memory creation for photos, stories, voice notes, videos, milestones, and letters.
- [x] Show private range-streamed playback controls for voice and video memories.
- [x] Store private media in R2 and serve it only through authorized requests.
- [ ] Normalize uploaded MOV/WebM/audio files into browser-safe playback formats and keep the
      original files for archive-quality export.
- [ ] Generate image thumbnails and audio metadata without exposing the bucket publicly.
- [ ] Implement timeline filtering, pagination, favorites, and contributor attribution.
- [x] Implement sealed capsules with server-enforced unlock dates.

## P1 — Privacy and durability

- [ ] Add passkeys and optional two-factor authentication for owners and parents.
- [ ] Define retention, deletion, consent, and child-safety policies.
- [ ] Add encrypted backups and a documented restore drill.
- [ ] Add a complete archive export so families are never locked in.
- [ ] Add account and archive deletion flows with deliberate confirmation windows.

## P2 — Child experience

- [x] Implement parent-managed child access without a public email account.
- [ ] Let an owner or parent turn child access off and revoke every child session without changing the PIN.
- [ ] Show parents the last child-access time and active-device count.
- [ ] Define age-aware permissions and presentation modes.
- [ ] Allow a child to add reflections without editing the original family memory.
- [x] Keep locked capsule bodies inaccessible at the API layer until their unlock date.
- [ ] Add a parent-controlled transition from child access to an independent adult account.

## P2 — Deferred account recovery

- [ ] Add email verification and password-reset delivery when account recovery becomes a priority.

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
