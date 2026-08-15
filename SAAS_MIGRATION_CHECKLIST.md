# Everlittle hosted and self-hosted migration checklist

This checklist turns the current single-family reference deployment into one canonical Everlittle
codebase that supports hosted SaaS and self-hosted Cloudflare installations.

## Decisions already made

- [x] Keep `everlittle` as the canonical product repository.
- [x] Derive hosted and self-hosted products from one code path.
- [x] Use `DEPLOYMENT_MODE=hosted` and `DEPLOYMENT_MODE=self-hosted`.
- [x] Use readable family slugs in public routes.
- [x] Keep child access parent-managed without requiring a child email account.
- [x] Create `everlittle-dikichoetso` as the Dikichoetso deployment repository.
- [x] Migrate `dikichoetso.com` after the generic code path is proven.

## Phase 0: Naming and domain

- [x] Choose the hosted-product domain: `geteverlittle.com`.
- [x] Confirm the domain is available at registrar checkout immediately before purchase.
- [x] Perform trademark and brand-conflict searches in intended launch markets.
- [x] Check app stores, social handles, package registries, and major search engines.
- [x] Register the domain.
- [x] Enable registrar account MFA.
- [x] Add the domain to Cloudflare and enable DNSSEC.
- [x] Decide whether family routes live at `domain.com/:familySlug` or
      `app.domain.com/:familySlug`.
- [x] Reserve platform route names such as `sign-in`, `sign-up`, `pricing`, `invite`, `share`,
      `settings`, `admin`, `api`, and `support`.

## Phase 1: Deployment-mode foundation

- [x] Add a validated `DEPLOYMENT_MODE` runtime variable.
- [x] Add typed hosted and self-hosted deployment configuration.
- [x] Centralize capability checks instead of scattering environment comparisons through UI code.
- [x] Define `allowsPublicSignup`.
- [x] Define `supportsMultipleArchives`.
- [x] Define `showsMarketingSite`.
- [x] Define `requiresBilling`.
- [x] Define `allowsInitialOwnerBootstrap`.
- [x] Define `defaultArchiveSlug` for optional self-hosted root redirects.
- [x] Add configuration validation that fails deployment with actionable errors.
- [x] Add hosted and self-hosted local environment fixtures.
- [x] Add dedicated deployed hosted and self-hosted Wrangler environment fixtures.
- [x] Document every required and optional deployment-policy environment variable.

## Phase 2: Remove installation-specific assumptions

- [x] Replace every hardcoded `Diki` and `Diki Choetso` string with archive or child data.
- [x] Make invitation emails archive-aware.
- [x] Make PWA installation copy installation-neutral.
- [x] Replace Dikichoetso-specific empty states, labels, placeholders, and errors.
- [x] Move demo memories and production bootstrap data outside the canonical product path.
- [x] Remove Dikichoetso Cloudflare resource IDs and domains from canonical defaults.
- [x] Keep generic sample configuration safe to commit.
- [x] Verify the generic product can start with no child profiles or memories.

## Phase 3: Tenant model and readable slugs

- [x] Formalize validation and normalization for `family_archive.slug`.
- [x] Add `child_profile.slug`.
- [x] Add a unique index for child slugs within an archive.
- [x] Add reserved-slug validation.
- [x] Keep family slugs immutable after creation so installed routes and bookmarks remain stable.
- [x] Do not add slug-history redirects while family and child slugs remain immutable.
- [x] Resolve family slugs to immutable archive UUIDs on the server.
- [x] Resolve child slugs only within the already resolved archive.
- [x] Never accept a browser-provided archive UUID as authorization.
- [x] Add an explicit route-scoped archive context for adult requests.
- [x] Replace the current first-membership lookup with route-scoped membership resolution in
      hosted mode while retaining a temporary self-hosted compatibility fallback.
- [x] Support one adult account belonging to multiple family archives at the data and API layer.
- [x] Add a family switcher when an adult has more than one membership.

## Phase 4: Tenant-isolation audit

- [x] Inventory every archive, child, memory, capsule, invitation, member, media, and share query.
- [x] Require `archive_id` in every applicable read, update, and delete.
- [x] Add `archive_id` directly to records where indirect scoping is fragile.
- [x] Verify child IDs cannot cross archive boundaries.
- [x] Verify member IDs cannot cross archive boundaries.
- [x] Verify invitation tokens resolve to exactly one archive.
- [x] Verify public shares expose only one authorized memory and its authorized media.
- [x] Store new media under `archives/{archiveId}/...` R2 keys.
- [x] Authorize media before opening an R2 object stream.
- [x] Add negative tests for cross-family reads, writes, uploads, invitations, and shares.
- [x] Add regression tests for owner, parent, contributor, viewer, and child permissions.
- [x] Treat tenant-isolation test failures as deployment blockers.

## Phase 5: Child identity and PIN access

- [x] Add `/:familySlug/kids` as the child profile chooser.
- [x] Add `/:familySlug/kids/:childSlug` as the selected child entrance.
- [x] Show only the selected family's child profiles.
- [x] Change the entrance copy from `I am Diki Choetso` to a profile-choice question.
- [x] After profile selection, ask for that child's PIN.
- [x] Call it `your PIN` instead of `the family PIN`.
- [x] Keep one PIN per child, even if a family chooses the same digits for siblings.
- [x] Replace global PIN scanning with one archive-and-child-scoped lookup.
- [x] Add a dedicated `CHILD_PIN_PEPPER` separate from `BETTER_AUTH_SECRET`.
- [x] Evaluate a deliberately slow Worker-compatible PIN hash.
- [x] Rate-limit by archive, child, IP, and device signal.
- [x] Add progressive delays or temporary lockouts after repeated failures.
- [x] Scope child sessions to both `archive_id` and `child_id`.
- [x] Revoke all sessions for that child when their PIN changes.
- [x] Add a parent action to disable child access and revoke every child session.
- [x] Show parents the last child-access time and active-device count.
- [x] Require reauthentication before switching from one child's space to another.
- [x] Preserve a future path to passkeys, trusted devices, and adult-account transition.

## Phase 6: Hosted authentication and onboarding

- [x] Allow public adult signup only in hosted mode.
- [x] Keep first-owner bootstrap plus invitation-only signup in self-hosted mode.
- [x] Add email verification.
- [x] Add password reset and recovery email delivery.
- [x] Add optional passkeys and two-factor authentication for owners and parents.
- [x] Build family creation after hosted account creation.
- [x] Add family-name and slug selection with live validation.
- [x] Add the first child profile step.
- [x] Add privacy, audience, timezone, and child-access defaults.
- [x] Support joining an existing family instead of creating one.
- [x] Make onboarding resumable without persisting a plaintext child PIN.
- [x] Add complete loading, empty, validation, error, and recovery states.
- [ ] Verify mobile keyboard, safe-area, and back-navigation behavior.

## Phase 7: Hosted application routes

- [x] Add the marketing site at `/` in hosted mode.
- [x] Add `/sign-up`, `/sign-in`, `/invite/:token`, and `/share/:token` (`/onboarding` is complete).
- [x] Move the family application under `/:familySlug`.
- [x] Move timeline, capsules, family, and settings under the family route.
- [x] Preserve deep links after authentication.
- [x] Make unauthorized family routes return a privacy-preserving response.
- [x] Store the last active family without making it an authorization source.
- [x] Ensure installed PWA launches restore a valid family route.
- [x] Add canonical metadata and social preview images for public pages only.
- [x] Prevent authenticated archive pages from being indexed or broadly cached.

## Phase 8: Landing page and product presentation

- [x] Create the hosted landing page using the `design-taste-frontend` direction.
- [x] Use a private, intimate, trustworthy family-product visual language.
- [x] Generate real, section-specific family-memory imagery.
- [x] Keep one consistent light/dark token system and one accent color.
- [x] Build an asymmetric hero with one primary signup intent.
- [x] Explain memories, child views, capsules, privacy, ownership, and self-hosting.
- [ ] Add honest hosted pricing only after costs and limits are known.
- [x] Add a self-hosting path without competing with the hosted signup CTA.
- [x] Honor reduced motion and reduced transparency.
- [ ] Verify mobile, tablet, desktop, light mode, and dark mode.
- [ ] Run accessibility, Lighthouse, and real-device checks.

## Phase 9: Cloudflare self-hosting template

- [ ] Define the minimum required Cloudflare account permissions.
- [ ] Create generic D1, R2, Worker, asset, and optional email configuration.
- [ ] Add an interactive setup command.
- [ ] Provision D1 and R2 with collision-safe names.
- [ ] Generate `BETTER_AUTH_SECRET` and `CHILD_PIN_PEPPER` securely.
- [ ] Apply all D1 migrations automatically.
- [ ] Configure an optional custom domain.
- [ ] Configure invitation email or clearly disable email-dependent features.
- [ ] Add a post-deployment first-owner setup flow.
- [ ] Add a GitHub Actions deployment workflow.
- [ ] Add backup, restore, upgrade, and rollback documentation.
- [ ] Test the template against a clean Cloudflare account.
- [ ] Target a setup experience close to `npx create-everlittle` followed by `pnpm deploy`.

## Phase 10: Create `everlittle-dikichoetso`

- [ ] Create the new deployment repository from a known canonical Everlittle release.
- [ ] Keep product logic upstream rather than editing a long-lived private fork.
- [ ] Configure `DEPLOYMENT_MODE=self-hosted`.
- [ ] Configure `DEFAULT_ARCHIVE_SLUG=choetso-family`.
- [ ] Add Dikichoetso D1, R2, email, secrets, and custom-domain bindings.
- [ ] Keep private bootstrap data and operational runbooks out of the public template.
- [ ] Establish a documented upstream update process.
- [ ] Pin the canonical Everlittle version used for every deployment.
- [ ] Add production deployment approvals and rollback instructions.

## Phase 11: Migrate `dikichoetso.com`

- [ ] Export and verify a production D1 backup.
- [ ] Inventory and verify every production R2 object.
- [ ] Rehearse restore into disposable D1 and R2 resources.
- [ ] Apply forward-only slug and tenancy migrations to the rehearsal database.
- [ ] Assign `choetso-family` to the existing archive.
- [ ] Assign `diki` to the existing child profile.
- [ ] Preserve all existing UUIDs, timestamps, ownership, invitations, memories, and capsules.
- [ ] Decide whether existing child sessions remain valid or are deliberately revoked.
- [ ] Verify adult login and every family role.
- [ ] Verify Diki's profile selection and PIN login.
- [ ] Verify photos, audio, video, range requests, and downloads.
- [ ] Verify capsule locking and unlocking.
- [ ] Verify invitation and public-share links.
- [ ] Run a read-only production rehearsal before changing traffic.
- [ ] Deploy `everlittle-dikichoetso` and switch `dikichoetso.com` only after verification.
- [ ] Keep the previous Worker version and database backup available for rollback.
- [ ] Run post-deployment health, authorization, media, email, and PWA checks.

## Phase 12: Operations, privacy, and release readiness

- [ ] Define hosted-service terms, privacy policy, retention policy, and child-safety policy.
- [ ] Define account, archive, child-profile, and media deletion behavior.
- [ ] Add complete archive export so families can leave without losing their history.
- [ ] Add encrypted backups and scheduled restore drills.
- [ ] Add structured audit logs without memory content.
- [ ] Add error monitoring and backup alerts.
- [ ] Define hosted storage and upload limits before enabling billing.
- [ ] Add unit, integration, tenant-isolation, accessibility, and mobile end-to-end tests.
- [ ] Require typecheck, build, migrations, and security tests in CI.
- [ ] Publish release notes and self-hosted upgrade instructions.
- [ ] Document incident response and compromised-account recovery.

## Launch gates

- [ ] No unresolved cross-tenant authorization findings.
- [x] No globally scanned child PIN authentication.
- [ ] Hosted and self-hosted modes pass the same core product test suite.
- [ ] A clean self-host deployment completes successfully from the documented steps.
- [ ] A full backup can be restored into new infrastructure.
- [ ] Dikichoetso migration rehearsal passes before production migration.
- [ ] Domain, trademark, privacy, and child-safety reviews are complete.
