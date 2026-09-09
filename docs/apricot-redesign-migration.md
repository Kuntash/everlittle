# Apricot redesign migration

The production UI uses the approved MagicPath project `447781616144764928` as its visual source. Authentication, archive permissions, invitations, uploads, child access, onboarding drafts, billing, and media playback remain connected to the existing services.

## Source revisions

- Interactive app: `448428650468093952`
- Landing page: `448428668398735360`
- Account and onboarding: `448428683347259392`
- Journal: `448428698161545216`

The production forms retain additional required fields and states that the design demonstrations did not implement. Subscription management continues through the real payment provider's customer portal. No simulated authentication, billing, or public-sharing behavior was imported.

## Code organization

- `apps/web/src/routes/(app)`: account, onboarding, invitation, and archive routes.
- `apps/web/src/routes/(blog)`: journal index and individual articles.
- `apps/web/src/routes/(marketing)`: landing, pricing, and product guides.
- `apps/web/src/features/archive`: API-backed views, forms, media players, shared hooks, types, and utilities extracted from the former monolithic route.
- `apps/web/src/features/marketing`: landing sections and motion hook.
- `apps/web/src/features/journal`: article content and responsive reader.
- `apps/web/src/components/design` and `components/ui`: shared Apricot controls and Radix/shadcn primitives.

Public URLs have not changed. Source filenames use kebab case. Framework-required `__root.tsx`, existing applied SQL migration filenames, generated tooling metadata, and the standard license filename remain intact. Applied migration names must not be changed: Cloudflare records them as migration identifiers. Historical design exports are reference material rather than application source.

The retired scrapbook landing component, its stylesheet, unused memory-paper helper, and superseded illustration files were removed. Existing app support styles remain where they still support real product states.

## Validation

Run `pnpm ready` for source formatting, lint/type checks, backend tests, UI tests, and a production build. Run `pnpm test:e2e` for desktop and mobile browser coverage. Local browser runs use installed Chrome; CI uses Playwright Chromium (`pnpm --filter @everlittle/web exec playwright install --with-deps chromium`).

Browser tests start a dedicated local Worker configuration, apply migrations only to its local D1 database, and create a local test archive. Authentication and archive API responses are intercepted in the browser. They never create, modify, or delete production family data. The suite covers responsive landing/footer rendering, password recovery payloads, expired reset links, journal navigation, fixed archive navigation across filters, borderless memory inputs, and nested responsive date controls.

## Deployment

Build each target independently. Hosted and self-hosted outputs must never be interchanged. Existing domains, D1 databases, R2 buckets, authentication secrets, sender addresses, and payment configuration are retained. This release introduces no database migration.

Previous Worker versions for rollback:

- `everlittle-hosted`: `31c43949-938d-487c-ba82-7a8c48015ec7`
- `everlittle-dikichoetso`: `cb7526fe-95c6-4146-b707-8037ff142580`

Release results are recorded below after deployment.

### Release verification — September 9, 2026

- Hosted Worker version: `14088e1a-4c02-4105-88ea-57a4ea529a7d`.
- Self-hosted Worker version: `569077c4-e8c8-43c5-8649-71ea00aad281`.
- Both domains serve build `1c9e8585e539` from `/version.json`.
- `pnpm ready`: passed (68 backend tests, 5 UI tests, source checks, production build).
- `pnpm test:e2e`: 10 passed across desktop and mobile, including the final visual polish.
- Self-hosted configuration validation and deployment dry run: passed.
- Live mobile browser smoke: both homepages returned HTTP 200, correct deployment modes, no horizontal overflow, and no page errors. Hosted journal and sign-in routes also returned HTTP 200 and rendered their expected controls.

No production account was created and no production family data was changed for verification. Authenticated flows were exercised against isolated browser fixtures and the backend's test database; a real payment transaction was not performed.

### Fidelity correction — September 9, 2026

Rechecked the same MagicPath revisions and compared the exported reference app against the repository at 402, 820, and 1440 pixels. The original import changed font families and CSS cascade order, and left legacy screen structure in several views. This correction restores the reference Nunito Sans typography for the app and landing, preserves the exported CSS rule order, and loads landing/journal styles only on their routes. Old scrapbook selectors are isolated from the redesigned screens.

Home, timeline, memory cards and detail, memory/capsule sheets, family settings, child view, and account framing now use the reference structure. Real uploads, sharing, permissions, password recovery, child PINs, billing portal navigation, and additional required onboarding fields remain connected to existing services. The mobile two-column footer is an explicit design exception: tablet and desktop use a horizontal footer.

Browser coverage now includes tablet alongside desktop and mobile, plus family profile, billing controls and child visibility rules. Visual comparisons confirmed matching Home heading geometry and settled mobile composer dimensions; screenshot content differs where real fixture data differs from MagicPath’s examples. Authenticated checks use isolated fixtures rather than production family accounts.

Correction release:

- Hosted Worker: `2de142c1-1a75-4f94-968b-c06f65171461`.
- Self-hosted Worker: `d9200407-90aa-4fef-a2fa-e8c52a885b4a`.
- `pnpm ready`: passed (68 backend tests, 5 UI tests, formatting/lint/types, production build).
- `pnpm test:e2e`: 18 passed across desktop, tablet, and mobile.
- Self-hosted configuration validation: passed.
- Fixed first service-worker installation reloading the page during an interaction; subsequent updates still reload normally. Browser API-fixture tests block service workers to keep interception reliable.
- Rollback to the immediately preceding releases: hosted `14088e1a-4c02-4105-88ea-57a4ea529a7d`, self-hosted `569077c4-e8c8-43c5-8649-71ea00aad281`.
- Live verification: both domains returned HTTP 200, serve build `2b456a8985f1`, reported the expected deployment mode, and showed no page errors or horizontal overflow. Hosted footer was grid at 390px and flex at 820px/1440px; journal and sign-in routes returned HTTP 200 with their expected controls visible.

### Product review corrections — September 9, 2026

Separated underlined link actions from the shared `quiet` shadcn button variant. Quiet actions, primary actions and secondary actions share their height; icon controls keep compact rounded hit areas. Updated password alignment, child PIN inputs, family form spacing, calendar actions and close buttons. Account entry includes the approved Create account / Sign in tabs, and sign-in resolves the archive directly instead of visiting the marketing homepage. The family route now renders its child outlet, restoring dedicated PIN entry routes.

Memory media no longer prints a duplicate date. Photos have bounded dimensions and rounded corners; video cards contain an inline player with a thumbnail and play overlay. The editor displays attached media. Creation copy is “Add a memory” / “Save memory.” Sharing uses a mobile bottom sheet and animated copied feedback. Tests use synthetic media; no friend/family content was changed.

Landing previews reuse shared memory, capsule and family presentation components. The second section uses a different image; all journey illustrations animate on hover. Tablet header navigation is reduced, and journal cards align below a shared section heading. Removed the transient Save for later control. The favicon uses the current transparent sprout mark.

Validation: `pnpm ready` passed (68 backend tests, 5 UI tests, source checks and production build); 30 browser tests passed across mobile, tablet and desktop, including real inline playback of a synthetic video, photo attachment preview, mobile sharing-sheet placement, account tabs, password alignment, link hover styling and child entry routing.

Live review verified the deployed journal’s quiet button height (50px), corner radius (14px), and borderless focused search. The self-hosted archive was inspected read-only: video previews load, child PIN controls align, and profile spacing is compact. Final adjustments match video/photo aspect ratios, stack long-name child actions at narrow widths, and keep the adult archive mounted between tab changes. Targeted media/profile and navigation/child-entry checks passed again after these adjustments.

Final product-review releases:

- Hosted: `6db33320-cdb0-452e-849e-7b1f2c410901`.
- Self-hosted: `62954a14-677c-4cd1-b2f2-d4c99427a8f2`.
- Final live Home → Family → Home check preserved the archive screen without an intervening loader.
- Prior stable releases for rollback: hosted `2de142c1-1a75-4f94-968b-c06f65171461`, self-hosted `d9200407-90aa-4fef-a2fa-e8c52a885b4a`.

### Follow-up layout and media corrections — September 10, 2026

Matched the hero link's padding to the primary CTA at mobile and larger breakpoints. Mobile product previews now include working navigation inside the preview frame. Journal cards retain all their copy while aligning their article links along a shared baseline.

People lists precede invitations at every width. Person details and fixed-width roles share the first row; a secondary Transfer ownership button and underlined Remove action share the second. Dropdown hover/selected states use rounded coral-tinted backgrounds. Child profile fields align to the card content. Child PIN entry only offers “Choose another name” when multiple profiles exist, avoiding a redirect loop for single-child families.

Memory editing offers attachment replacement, local preview, Remove/Restore controls and cover-cropped media inside the upload area. Removing an attachment in the editor requires a replacement before saving; canceling discards the local selection. Uploads require the current asset ID to prevent stale replacements. The old object remains until the new asset metadata commits, then old media and thumbnails are cleaned up. Existing ownership, family isolation, file limits and storage accounting remain enforced. No database migration is needed.

Validation: 69 backend tests, 5 UI tests, source checks and production builds passed. All 36 browser tests passed across mobile, tablet and desktop. Additional People checks passed after the live tablet review caught and corrected an inherited full-width Remove style. Tests cover successful replacement, cancel without upload, rejected/stale replacement, permissions, fixed navigation and responsive alignment. Production family data was inspected read-only.

Final follow-up releases:

- Hosted: `7d775f08-822f-4027-9202-e94021d3bb67`.
- Self-hosted: `b6f4f54e-d2d0-4416-a9eb-86009c938f49`.
- Live verification confirmed equal CTA padding at 548px and 747px, mobile preview navigation inside its frame, equal article-link baselines, child PIN entry without the single-profile redirect link, and both member actions at the same vertical position with 50px heights. The invite section followed the People list without horizontal overflow.
- Prior stable releases: hosted `6db33320-cdb0-452e-849e-7b1f2c410901`, self-hosted `62954a14-677c-4cd1-b2f2-d4c99427a8f2`.
