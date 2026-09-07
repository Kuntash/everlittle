# Everlittle — Living Scrapbook redesign handoff

Updated: September 7, 2026. Status: reference comparison and interaction polish complete; current release details are recorded at the end. Separate blog source and live authenticated manual checks remain unverified.

## Start here — instructions for the next thread

This is the current design brief and implementation plan. Read it before changing the UI. The user chose **Living Scrapbook (option 2)** and subsequently refined it. Those refinements supersede the earlier recommendation of Quiet Heirloom and the original generated images.

The initial task was to write this detailed handoff. The user has since asked to continue with the revised visual checkpoint. See [the navigation and mobile refinement](../assets/design/living-scrapbook-refinement/README.md) for current studies and prompts. The user approved **B — horizontal folder tabs** on September 6, 2026. The shared redesign has been implemented and deployed to both installations; see the final release record below. Continue the selected direction across the app and public pages. Do not restart the three-direction exploration. The user requested seeing options before coding; this is a design checkpoint based on that request, not a new blanket requirement to seek permission for every edit.

Read repository instructions if present and inspect the current working tree before edits. Existing unrelated untracked file at handoff time: `apps/web/public/marketing/meta-ad-time-capsule-feed-v1.png`. Preserve it. Do not overwrite existing user work. Do not commit ignored installation configuration or credentials.

## 1. User decisions and scope

### Accepted direction

- Living Scrapbook: an intimate, playful family archive with memory cards that feel like sticky notes and keepsakes.
- Each memory should have a distinctive paper color and appropriate visual treatment. Variation includes material, edge, photo framing, tape, ruling, and small accents, not just background color.
- Primary audience is US parents. Replace the heavily Asian/Tibetan-focused fictional names and marketing imagery from the concept boards with American family settings and US English. Represent the diversity of US families naturally; American does not mean a single race or family structure.
- The heavy forest dashboard sidebar in option 2 feels disconnected from the notes. Make navigation lighter and more playful while retaining usability.
- Focus on the authenticated web app first. Then bring the homepage, pricing, corresponding guides/blog pages, and related entry flows into the same design system.
- Include appropriate animations on the landing page and useful interaction feedback in the app.
- Update **both geteverlittle.com and dikichoetso.com / everlittle-dikichoetso** as part of the eventual rollout.

### Not approved or implied

- No feature expansion into AI search, social engagement, draggable boards, arbitrary card customization, new billing, or a new CMS.
- No replacement of real family names, memories, photographs, languages, or culturally specific content in existing archives. The US targeting change applies to marketing, examples, fixtures, and new concept imagery.
- No redesign of the brand logo. Use the actual existing asset and preserve its identity.
- Do not infer approval for renamed routes, modified audience permissions, altered subscription rules, or changed child access.

## 2. Existing references and evidence

See [the original boards and prompts](../assets/design/product-directions-2026-09-06/README.md), especially [option 2](../assets/design/product-directions-2026-09-06/02-living-scrapbook.png). These are generated visual concepts, not functional prototypes or exact specifications. The user selected their scrapbook direction, not every detail.

The original option 2 has defects to correct: heavy green sidebar; overly narrow cultural representation; merged Photo/Story labels; illustrative author/date data. Option 1 incorrectly puts authenticated navigation into public previews. Do not reproduce those defects. The older [landing direction](../assets/design/LANDING_DESIGN_DIRECTION.md) is historical context and is superseded where it conflicts with this brief.

Review so far: live homepage text, source code, existing theme tokens, existing generated design assets, six public guide routes, and local deployment configuration. There was no connected browser in the originating session, so authenticated live screens and live interaction quality were not visually verified. Treat source-based findings as hypotheses to confirm in a browser.

No blog implementation was found in this checkout; `/blog` could not be retrieved in the prior review. This does not prove the deployed blog is absent. Identify the real blog URL and publishing source before claiming blog completion. Continue the app and known guides while that is resolved. Do not silently create a blog/CMS or rename guide routes.

### Source map (verify symbols instead of relying on old line numbers)

| Location                                                        | Purpose / likely work                                                                                                                                                                                                                                                |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/web/src/routes/index.tsx`                                 | Main app and shared implementation: `ArchiveApp`, `ParentView`, `TimelineView`, `ChildView`, `MemoryComposer`, `MemoryDetail`, `MemoryRow`, `CapsulesView`, `CapsuleComposer`, `FamilySettings`, `MobileNav`, billing sheet, audio/video controls, sheet transitions |
| `apps/web/src/routes/$familySlug*.tsx`                          | Existing family, timeline, capsules, child, kids and settings route entry points; preserve URLs                                                                                                                                                                      |
| `apps/web/src/routes/onboarding.tsx` and auth routes/components | Setup, sign-in, signup, invitations, reset password and their state handling                                                                                                                                                                                         |
| `apps/web/src/components/scrapbook-home.tsx`                    | Current scrapbook homepage, content and one-time IntersectionObserver reveals                                                                                                                                                                                        |
| `apps/web/src/components/marketing-home.tsx`                    | Other marketing implementation and `MarketingPricingPage`; verify active call sites before editing                                                                                                                                                                   |
| `apps/web/src/components/seo-landing-page.tsx`                  | Shared six-guide page template                                                                                                                                                                                                                                       |
| `apps/web/src/lib/seo-pages.ts`, `seo-page-paths.ts`            | Guide content, metadata and public paths                                                                                                                                                                                                                             |
| `apps/web/src/components/brand.tsx`                             | Actual logo / wordmark component                                                                                                                                                                                                                                     |
| `apps/web/src/styles.css`                                       | Large stylesheet with app, legacy marketing, scrapbook and SEO sections plus multiple reduced-motion blocks                                                                                                                                                          |
| `packages/ui/src/theme.css`                                     | Existing shared color, radius and surface tokens                                                                                                                                                                                                                     |
| `packages/domain/src/index.ts`                                  | Memory kinds and audience types; retain these contracts                                                                                                                                                                                                              |
| `apps/web/src/lib/deployment.ts`                                | Semantic capabilities for hosted/self-hosted behavior                                                                                                                                                                                                                |
| `apps/web/src/lib/public-web.ts`, `server.ts`                   | Public rendering/indexability, canonical routing and server behavior                                                                                                                                                                                                 |
| `apps/web/src/lib/analytics.ts` and analytics provider          | Preserve event semantics and attribution                                                                                                                                                                                                                             |
| `apps/web/public/marketing/`                                    | Current public images and objects; replace only relevant marketing assets                                                                                                                                                                                            |
| `apps/web/public/sw.js`, manifest and icon files                | Verify installed PWA behavior and update delivery without gratuitous icon redesign                                                                                                                                                                                   |
| `docs/deployment-modes.md`, `docs/self-hosting.md`              | Deployment policy, downstream update workflow and rollback guidance                                                                                                                                                                                                  |

Stack at handoff: React, TanStack Router/Start, Vite Plus, Cloudflare Workers/D1/R2, pnpm, Lucide, Sonner. Cormorant Garamond, Geist and Geist Mono are already available. No animation package is currently listed; start with existing CSS and transition hooks.

## 3. Visual system — warm paper, clear structure

Use a warm neutral page that reads as an open scrapbook. Keep the actual app canvas quiet so colorful memories stand out. Avoid a full-screen corkboard, grunge texture, large decorative shadows, a corporate sidebar, or a wall of identical rectangular cards.

Starting palette, to validate with real contrast checks:

| Role           | Proposed starting color | Use                                                              |
| -------------- | ----------------------- | ---------------------------------------------------------------- |
| Canvas         | `#F6EFDF`               | Shared warm background                                           |
| Paper white    | `#FFFAF0`               | Forms, photo borders, reading surfaces                           |
| Primary ink    | `#292821`               | Text on all pastel notes                                         |
| Muted ink      | `#6E695C`               | Secondary text only where contrast passes                        |
| Forest         | `#365F47`               | Brand, links and structural accents                              |
| Primary action | `#A74330`               | Accessible darker terracotta starting point; validate white text |
| Butter note    | `#F7E6A3`               | Stories / quotes                                                 |
| Blush note     | `#F2D4CB`               | Letters / personal writing                                       |
| Sky note       | `#D9E7EC`               | Voice memories                                                   |
| Sage note      | `#DFE8D5`               | Milestones                                                       |
| Peach note     | `#F5DFC7`               | Alternate keepsake surface                                       |

Use semantic tokens for canvas, text, action, focus, borders and note variants. Unify duplicated app/SEO/homepage palette definitions rather than layering another set of unexplained overrides. Inventory active selectors first; do not remove old sections until their usages are checked.

Use Cormorant Garamond for expressive headings and selected note titles; Geist for navigation, inputs, dates, metadata and longer body text. A handwritten accent may appear on a short decorative label, never on essential controls or paragraphs. Prefer an existing font or small decorative asset rather than adding a heavy font dependency solely for this accent.

Baseline rhythm: 4/8px spacing scale; 16px mobile page gutters, 24–32px desktop gutters, roughly 16–24px between notes. Body text generally 16px with 1.5–1.65 line height. Notes may have sharper 4–10px edges while forms use 10–14px radii. Set final sizes after realistic content testing. Avoid huge hero typography pushing all memories below the fold.

### Memory card grammar

| Kind           | Material / treatment                                                                 | Functional content to retain                                                     |
| -------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Photo          | Off-white print mounted on a pastel note; one small tape corner on selected variants | Image, title, date, author, actual audience, open affordance                     |
| Story          | Butter or peach sticky note; optional faint ruling and a tiny folded corner          | Readable excerpt, title, date, author; full text opens normally                  |
| Voice          | Blue note with compact recording label                                               | Real play/pause, elapsed time, duration, usable progress, loading/error states   |
| Video          | Muted paper frame with poster and unmistakable play button                           | Existing secure media loading and playback; duration when available              |
| Milestone      | Sage note with a small stamp/star accent                                             | Title and event date; never decorative celebration hiding content                |
| Letter         | Blush or cream stationery                                                            | Actual visibility and readable letter content when permitted                     |
| Future capsule | Envelope-inspired card, separate from an ordinary letter                             | Actual locked/open state and unlock date; no preview leakage from sealed content |

Variation must be deterministic: choose a bounded variant from stable memory ID plus kind. Never use `Math.random()` during rendering or array position that changes under sorting/filtering. The same memory must keep its appearance across the parent view, timeline, reloads and hydration. Use presentational metadata only; no migration or new persistence is needed for default visual variants.

Aim for 2–3 variants per relevant kind, not a unique bespoke illustration for each record. Do not make color the only kind/state signal. Keep metadata contrast reliable on every variant. Use tape, folds and shadows on decorative layers with `aria-hidden` and `pointer-events: none`. Decorative rotations should be very small (about ±0.5–1 degree), optional, and removed on narrow screens. Prefer rotating the paper backdrop while keeping text and controls level. Preserve chronological DOM and keyboard order; do not use visual masonry that changes reading order.

Photo cropping must not consistently cut off faces or meaningful artifacts. Offer an uncropped full image in detail. Cards must work with long titles, missing media, portrait/landscape photos, long notes, sparse archives and multiple languages. Do not force letters into square post-it dimensions.

Do not wrap a card containing playback/menu buttons in another button. Provide a clear primary open target and separate semantic media/actions. Ensure hover decoration cannot steal focus, clip menus or obscure controls.

## 4. Navigation — approved horizontal folder tabs

**Decision:** the user selected B on September 6, 2026. Use horizontal pastel folder tabs on desktop and paper bottom navigation on mobile. The index-rail discussion below records the superseded comparison, not the implementation target.

Replace the broad solid green rail with a narrow paper-colored index, approximately 184–208px on desktop. It should feel like the inside cover of a family album.

- Actual Everlittle logo at the top; a small family thumbnail or initials, family name, and existing archive switcher behavior beneath it.
- Navigation entries look like lightly overlapping index tabs. Each has a restrained pastel backing, a consistent small line icon, and a readable horizontal label.
- The active tab extends slightly toward the content, with a stronger outline or ink accent and `aria-current`; use shape/weight as well as color.
- Tabs remain aligned, with stable hit areas at least 44px high. Do not rotate text, scatter the navigation, or make the pointer chase moving tabs.
- One small handwritten-style label such as “Our scrapbook” can add personality above the index. Treat this as secondary decoration, not a replacement for the actual family name.
- Put utility controls in a quiet footer. Preserve the existing sign-out action and settings access; avoid adding a second confusing navigation system.
- Keep one clear terracotta primary capture action near the page heading. Quick capture shortcuts are secondary and must distinguish Photo and Story.

Retain current nav labels initially: Parent, Timeline, Capsules, Child, Family. “Our scrapbook” replacing Parent could be explored as an explicitly proposed copy change, but is not accepted in this handoff. Preserve existing hidden/available routes for vault profiles and roles; do not reveal a Child destination when the current app excludes it.

For the next visual checkpoint, show two bounded navigation treatments in the same US-focused sticky-note screen: (A) the recommended paper index rail, (B) horizontal folder tabs across the top. This is a comparison of navigation, not a reopening of the selected brand direction. Recommend A for desktop scanning; consider B when width is limited. Show mobile separately with a paper-colored bottom bar and small active tab treatment; no miniature desktop sidebar. Account for safe-area insets and ensure the final memory/form action is not covered.

## 5. US audience content and imagery

Use a coherent fictional example family, e.g. the Parker family with child Emma, Mom Sarah, Dad Ben and Grandma June. Use “Mom,” “Grandma,” “September 6, 2026,” “first day of kindergarten,” “Saturday pancakes,” “backyard sprinkler,” “Grandpa’s bedtime story,” and “your 18th birthday” where helpful. Dates/ages must be internally consistent. Maintain locale-aware formatting for real user data rather than forcing US formats throughout all private archives.

Photography direction: candid everyday US family life, natural light, lived-in homes, kitchens, parks, backyards, school-day routines and intergenerational moments. Include a natural mix of US families across marketing assets without making the entire site a single demographic portrait. Avoid cultural costumes as the default visual cue, generic luxury homes, flags as shorthand for American, or posed stock-photo smiles.

Replace hardcoded fictional names and marketing images in the homepage, six guides, onboarding examples, preview boards and applicable social/OG images. Search source and public assets, review actual usage, and keep a replacement inventory. Do not run a blind repo-wide replacement: real data, branding for Dikichoetso, migration fixtures and historical references have different purposes. Do not use private family photos from either deployment in marketing or send them to generation tools.

Generate or source new public images with clear reuse rights; save finals in the repo with stable names and descriptive alt text. Preserve image dimensions/aspect ratios and use responsive optimized formats to avoid layout shift. Synthetic concept images must not be presented as actual customers, testimonials or endorsements.

## 6. Product coverage and behavioral requirements

1. **Parent view:** identity, primary capture action, secondary kind shortcuts, recent sticky-note memories and a quiet future-capsule entry. Reduce competing oversized panels. Keep empty states useful, without fabricated sample memories in a real archive.
2. **Timeline:** same note components, month grouping, existing filters, correct ordering and readable dates. Long archives must remain usable without animating every item.
3. **Capture:** paper sheet with readable fields; present all existing required kinds and controls. Retain upload/recording flows, pending states, errors and subscription gates. Keep real visibility options explicit. Save must respond promptly; do not delay network work for animation.
4. **Memory detail/edit:** calm reading surface, full media, author/date/audience and existing permitted actions. Preserve ownership rules, sharing, delete confirmation, focus restoration and scroll locking.
5. **Capsules:** envelope motif with truthful locked, scheduled and opened states. Display real unlock dates. Preserve permission checks and the existing unlock mechanism. Do not imply an envelope can be opened by an unauthorized user.
6. **Child space:** same family of colors and notes with simpler controls. Preserve protected child access/PIN flows and server-enforced visibility. No adult-only actions or locked-body leaks.
7. **Family/settings:** aligned readable paper panels for members, roles, invitations, profile and existing controls. Limit decorative treatments around permissions and destructive actions.
8. **Auth/onboarding/billing:** share type, paper and action tokens; preserve verification, reset, invitations, deployment gates and checkout/portal functionality. Do not make billing look like editable sample content.
9. **System states:** skeleton/loading, no memories, filtered-empty, missing image, upload progress/failure, permission denial, offline/network failure and save success. Never hide errors beneath decoration.

Domain audiences currently include `parents`, `family`, `child`, `all`. Do not relabel all records “Family only” as in a concept image. Use actual audience semantics and existing helpers. Privacy comes from the server, not a lock icon.

## 7. Motion specification — app and landing page

Use motion to communicate touch, placement and state. Do not add constant floating, wobbling notes, scroll hijacking, cursor-following tilt, confetti on every save, autoplay audio or forced cinematic page transitions. Keep keyboard selection and frequent navigation immediate.

| Surface / trigger              | Normal motion starting point                                                                         | Reduced motion                               |
| ------------------------------ | ---------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| App buttons                    | 100–150ms press feedback, scale about .98; subtle hover                                              | Color/opacity feedback or instant state      |
| Note hover, fine pointers only | Inner decorative layer lifts 1–2px in 140–180ms; stable outer hit area                               | No translation/rotation; outline/ink change  |
| Index tab hover                | Inner tab extends 2–3px in about 140ms; active state immediate                                       | Immediate active outline/color               |
| Capture/detail sheet           | 220–280ms, opacity + modest 12–20px translation; shorter exit                                        | Short fade or immediate; same focus behavior |
| Successful save                | Existing toast plus one subtle 180–220ms settle on the newly inserted note                           | Status announcement + immediate insertion    |
| Voice/video                    | State responds to actual playback; no fake recording loop                                            | Static waveform/progress remains usable      |
| Landing hero                   | Text and CTA visible immediately; secondary collage settles once over 450–650ms with 30–60ms offsets | Fully composed static collage                |
| Landing content reveal         | Once per section, 300–450ms fade with 8–16px travel                                                  | Visible immediately or a short fade          |
| Landing capsule illustration   | One short envelope/seal reveal when entering viewport; optional 300–450ms                            | Static sealed illustration                   |
| FAQ/menus                      | 160–220ms where useful, interruptible, no delayed usability                                          | Immediate expansion or minimal fade          |
| Blog/guide reading             | Mostly static; minimal link/button feedback                                                          | Static                                       |

Start with existing responsive easing `cubic-bezier(0.2, 0.8, 0.2, 1)` and stronger arrival `cubic-bezier(0.22, 1, 0.36, 1)`. Tune in context. Use transform and opacity for movement, avoid animation of layout dimensions or large blurred shadows, and do not blanket-apply `will-change`.

The homepage already has IntersectionObserver reveals and a reduced-motion path. Improve this implementation instead of stacking another reveal library. Preserve visible server-rendered content with JS disabled or observer failure. Never gate the primary heading, CTA or LCP image on a long entrance. Reveal once and unobserve. Cancel timers/observers on unmount. Respect preference changes where appropriate.

Reuse `useSheetTransition`, scroll-lock behavior and existing save/action-state mechanisms. Avoid one sheet entrance plus a stagger of every form field. Make transitions interruptible; rapid open/close, filters, back navigation and repeated saves must not leave stale overlays or hidden content. No motion dependency is required by default. Add Motion only if a concrete interaction needs it and existing code cannot handle it cleanly.

Test normal and reduced motion, touch and keyboard, Safari and Chromium, and a slower mobile device where available. Aim for smooth frame delivery without making unmeasured performance claims. Do not make mobile users tap twice to open a note just to see hover decoration.

## 8. Landing, guides and blog consistency

Apply the same canvas, ink, terracotta action, note palette, typography hierarchy, icon treatment and envelope vocabulary across public pages. Public navigation must still be public navigation, with real sign-in/signup links; do not reuse the private family tab bar there.

Preserve the homepage's useful emotional story and sections: opening promise, memories over time, family contributions, formats, future capsules, privacy, pricing, six ways to begin and closing CTA. Update the cultural examples and visual treatments; do not turn the whole page into an endless sticky-note grid. Use quiet editorial sections between playful compositions.

Keep these existing guide URLs:

- `/family-memory-app`
- `/digital-time-capsule-for-kids`
- `/letters-to-your-future-child`
- `/private-family-photo-sharing`
- `/baby-memory-journal`
- `/grandparents-memory-project`

Use a shared article reading system: readable title/deck, honest byline/date only where real, 60–70ch body measure, heading hierarchy, restrained contents navigation when warranted, one or two note-style pullquotes/examples, related guides and a relevant CTA. Long text should remain on a calm light surface. Do not fabricate authors, publication dates or testimonials.

Confirm blog source and apply matching tokens/templates there. Record any separate repo/CMS and exact deployment path in this file. If unavailable, mark blog completion blocked with the missing URL/source; do not report it done because a mock article exists.

Preserve metadata, canonicals, structured data, internal links, sitemap/indexability, image alt text and campaign attribution. Do not expose family pages to indexing. Preserve legal/privacy copy and billing facts unless separately requested. Review pricing page and social preview assets for visual consistency too.

## 9. Step-by-step execution plan

### Phase 0 — resume and verify

- [ ] Read this brief, applicable repo instructions, original option 2 and deployment docs.
- [ ] Inspect git status; preserve unrelated work and ignored local configuration.
- [ ] Use existing Graphify map to locate relationships if helpful; verify against current source.
- [ ] Run the app locally in a safe test environment and capture baseline desktop/mobile views with fictional data.
- [ ] Confirm active homepage and pricing components, real blog location, and both deployment targets.
- [ ] Record baseline URLs, key interactions, image weights and any known defects.

### Phase 1 — revised visual checkpoint

- [ ] Produce the two navigation variations described above with the same US-focused sample memories.
- [ ] Show photo, story, voice, milestone and capsule treatments together; include mobile.
- [ ] Show a matching landing hero and one article excerpt, correcting generated labels/navigation.
- [ ] Recommend the paper index rail; record the user's selected navigation/refinements here.
- [ ] Do not interpret old Quiet Heirloom imagery or Asian names as the accepted final brief.

### Phase 2 — shared foundations

- [ ] Inventory active tokens/styles and establish semantic paper/note/action/focus tokens.
- [ ] Introduce reusable note surfaces, metadata rows, tabs and capture shortcuts where duplication warrants them.
- [ ] Keep card variation deterministic and testable without database changes.
- [ ] Extract narrowly scoped components from the large `index.tsx` only as needed; do not undertake a full architecture rewrite.
- [ ] Prepare the fictional US sample dataset and new public asset inventory.

### Phase 3 — app first

- [ ] Implement shell/navigation and parent view with real data.
- [ ] Implement shared note treatments in timeline and child view.
- [ ] Restyle capture, detail/edit and real media controls.
- [ ] Restyle capsules and their actual state transitions.
- [ ] Align family/settings, auth/onboarding, billing and all system states.
- [ ] Verify mobile layout, long content, keyboard/focus, reduced motion and role-specific actions as each surface lands.

### Phase 4 — public pages and motion

- [ ] Replace relevant fictional names/images with the US audience direction.
- [ ] Align homepage and pricing with shared tokens and note vocabulary.
- [ ] Tune existing landing motion according to section 7; verify no-JS/reduced-motion visibility.
- [ ] Align all six guide routes and the identified blog implementation.
- [ ] Verify public navigation, SEO, CTAs, attribution and responsive assets.

### Phase 5 — validation and review

- [ ] Run meaningful existing checks and fix regressions; see section 10.
- [ ] Capture final desktop/mobile and normal/reduced-motion evidence.
- [ ] Compare against accepted revised mockups and document intentional differences.
- [ ] Review both deployment modes and verify actual audience/role behavior.
- [ ] Update this file with changed files, tests/results, unresolved work and the source revision intended for release.

### Phase 6 — release both installations

- [ ] Follow section 11, building separately for each deployment mode.
- [ ] Smoke-test both actual domains after release, including authenticated app routes and PWA updates.
- [ ] Record worker versions, domains, timestamps, checks and rollback references.
- [ ] Do not declare the overall rollout complete when only one target has been updated.

## 10. Verification and acceptance

Existing scripts from the repository (recheck before running in a future thread):

```sh
pnpm dev
pnpm typecheck
pnpm test
pnpm ready
pnpm self-host:check
```

`pnpm ready` currently regenerates routes, runs `vp check`, tests and a build. Avoid redundantly rerunning every full suite after a docs-only update or when no new change warrants it. `pnpm self-host:check` validates the local config, builds for self-hosted mode and performs a deployment dry run. Read the relevant Cloudflare/Wrangler skill before operational commands. Do not overwrite a user's `.dev.vars` to switch modes; use a controlled test setup.

Relevant existing coverage includes archive navigation, tenant isolation, archive API isolation, deployment, billing analytics, public web/SEO, auth feedback, brand and PWA tests. Add focused behavior tests where a change introduces risk: deterministic note variants, filter preservation, role-aware controls, save/error states, keyboard/modal behavior. Avoid tests that only mirror CSS declarations or snapshot every cosmetic detail.

Manual/browser matrix:

- Representative widths 360, 390, 768, 1024 and 1440px; also check 320px and zoom to 200% for overflow.
- Empty, one-memory and long mixed-memory archives; long titles and missing/broken media.
- All existing memory types; actual save/edit/playback/filter/capsule flows.
- Owner, contributor/viewer roles as supported, and child access. Hidden data must remain inaccessible.
- Hosted paid/unpaid content gates and self-hosted no-billing behavior.
- Keyboard tab order, clear focus, Escape/close, focus return and screen-reader labels/status feedback.
- Touch interactions, mobile keyboard, safe areas, scrolling, fixed bottom bars and form submission.
- Contrast: normal text at least 4.5:1, large text 3:1, essential UI boundaries/focus indicators 3:1 as applicable. Measure final rendered combinations.
- Normal/reduced motion, rapid repeated interactions, no-JS public visibility and absence of continuous decorative motion.
- Optimized images, reserved dimensions, no new layout shift, no blocking font/animation payload without justification.
- URLs, sign-in/signup, guide links, pricing, canonical metadata, indexability and analytics events.

Completion means a coherent working app plus corresponding public surfaces, not just an attractive parent screenshot. Automated tests do not replace visual/browser review. Mark unavailable checks explicitly rather than claiming them passed.

## 11. Mandatory rollout: hosted geteverlittle AND Dikichoetso

**Both deployments need the redesign.** They share product code but have different policies and independent resources. The local configuration resolves the user's “dikichoetso or everlittle-dikichoetso” naming as follows:

| Target                   | Domain                      | Worker                   | Mode          | Configuration / script                                                 |
| ------------------------ | --------------------------- | ------------------------ | ------------- | ---------------------------------------------------------------------- |
| Hosted Everlittle        | `https://geteverlittle.com` | `everlittle-hosted`      | `hosted`      | `apps/web/wrangler.jsonc`, `env.hosted`; `pnpm deploy:hosted`          |
| Dikichoetso installation | `https://dikichoetso.com`   | `everlittle-dikichoetso` | `self-hosted` | local `apps/web/wrangler.self-hosted.jsonc`; `pnpm deploy:self-hosted` |

These mappings were observed in local configuration on September 6, 2026; verify the current account, target and config before deploying. Local installation config is intentionally not a portable committed template. If it is absent in the next workspace, follow `docs/self-hosting.md` and locate the installation's downstream deployment configuration. Do not guess resource IDs, create replacement databases/buckets, or deploy the placeholder default worker.

Keep `PUBLIC_APP_URL`, auth origins, email bindings, database/media bindings, secrets, immutable family slugs and branded installation identity unchanged. Do not move data between installations. Shared visual design must consume semantic capabilities from `lib/deployment.ts`; do not fork the design with hardcoded hostname checks.

Hosted must retain public marketing/signup, onboarding, archive switching and billing. Self-hosted must retain initial-owner bootstrap, invite-only signup after bootstrap, its existing default archive behavior, and no hosted billing requirement. Dikichoetso should receive the redesigned app and entry surfaces it actually exposes; do not force-enable the public marketing site there merely for visual parity.

Release procedure:

1. Establish a known-good revision and collect before screenshots/health checks for both domains. Record each previous Worker version for rollback.
2. Complete app/public review, tests, production build and self-host dry run. Read current operational docs and confirm target mappings.
3. Prefer a UI-only release with no schema migrations. If implementation unexpectedly needs schema changes, reassess scope and follow backup/migration policy; do not automatically run remote migration commands for a styling change.
4. Build and release the hosted target using its script. Verify homepage, pricing, all six guides, auth entry and an authorized test archive. Do not create or alter a real family's memories just to test the design.
5. Rebuild separately for Dikichoetso using its config and release script. Do not reuse hosted build output, because mode/bindings differ.
6. Verify the Dikichoetso sign-in/root routing, app shell, notes, capture availability, timeline, capsules, family and child access with authorized test data. Confirm no billing gate appeared.
7. Check asset/cache/PWA delivery so existing users receive the new UI without a stuck mixed-version experience.
8. Record both deployments' source revision, Worker version, completion time, smoke results and any limitations. If the second target fails, report a partial rollout explicitly and resolve or roll back based on the concrete failure.
9. Use each target's recorded previous Worker version and its correct configuration for rollback. Follow `docs/self-hosting.md`; do not restore databases for an ordinary UI rollback.

Deployment results are recorded in the final release log below. The user requested both installations be covered in the eventual work; do not ask them to repeat that scope decision. Apply current session permissions and any concrete operational blockers when the release is actually ready.

## 12. Continuation log — keep this current

### Completed

- [x] Initial source/public-content review and three visual concept boards.
- [x] User selected Living Scrapbook and refined note styling, US audience, navigation and rollout scope.
- [x] Detailed implementation/motion/two-deployment handoff written.
- [x] Revised US-focused desktop A (paper index), desktop B (folder tabs), and mobile feed studies saved in `assets/design/living-scrapbook-refinement/`. After viewing the results, the assistant recommends B for the stronger scrapbook metaphor and wider content area. This supersedes the assistant's earlier A recommendation; the user approved B at 13:07 UTC on September 6, 2026.

### Outstanding decisions / evidence

- [x] User selected B — folder tabs; no further navigation decision is needed.
- [ ] Actual blog URL/source and ownership/deployment path.
- [ ] Authenticated browser baseline and test dataset/environment.
- [ ] Final palette contrast measurements and asset inventory.

### In progress / not yet released

- [x] Shared paper tokens, folder tabs, mobile navigation, parent/timeline/child memory notes, capture/detail styling, capsules/settings styling, and public-page palette/image alignment implemented.
- [ ] Functional/visual regression validation of the redesign.
- [ ] Hosted deployment.
- [ ] Dikichoetso deployment.

### Next-thread status template

```text
Date / source revision:
Accepted visual refinements:
Completed phases and changed files:
Assets replaced / fictional content changes:
Tests and browser evidence (actual results):
Blog URL/source and status:
Remaining issues and precise next action:
Hosted domain / Worker version / smoke result / rollback version:
Dikichoetso domain / Worker version / smoke result / rollback version:
```

Suggested first action for the next thread: read this file and the linked revised previews, incorporate the user's navigation choice if supplied, and inspect the current app locally. Then carry the chosen treatment through the phased plan instead of shipping only the parent view. Do not regenerate the same navigation comparison unless the user requests further refinement.

### September 6, 2026 — resumed through codex-alt

Recovered T3 thread `50d23987-0f48-49b4-bbab-e2d3ec0c8e93` (Polish Web App Design Consistency), underlying Codex thread `01a07664-b63e-78a0-abef-426445288f33`. The original session stopped at a usage limit after implementing the core design.

- Preserved the existing worktree and unrelated advertising image.
- Fixed formatting; the first `pnpm ready` completed with 65/65 tests and production build passing.
- Self-hosted configuration validation, build and deployment dry run passed. No deployment performed by that check.
- Fixed a server/client initial-render mismatch on family URLs by deriving the initial public/loading state from TanStack Router location on both server and client. Reloading the family timeline now produces no page exceptions.
- Added pressed-state semantics to every timeline kind filter; fixed the public example timeline ordering and an inherited marketing heading width affecting the app.
- Local isolated fictional Sarah Parker/Emma archive: tested mobile memory creation, timeline filtering, detail opening and Escape close. Parent width checks passed at 320, 360, 390, 768, 1024 and 1440px; Capsules, Child and Family fit at 390px.
- Local preview: `EVERLITTLE_WRANGLER_CONFIG=wrangler.design-preview.jsonc pnpm dev`; this existing ignored config uses a local-only database and compatibility date, leaving production settings unchanged.
- Separate blog source remains unidentified; asked user for its URL/repository. Six guide routes are the known public article implementation.
- Further validation and release evidence will be appended below; do not interpret the earlier uncompleted checkboxes as completed.

### Release validation — September 6, 2026

- Final `pnpm ready`: formatting/lint/type checks, **65 tests across 11 files**, and production build passed after the functional fixes. `git diff --check` passed.
- Added keyboard containment and focus return to the existing sheet transition hook; retained the existing fixed-body scroll lock. Chromium verified repeated Tab stays inside, Escape closes, trigger focus returns, and body overflow restores. WebKit verified mobile sign-in, capture opening/closing and 390px layout with reduced motion.
- Local photo upload completed and rendered at natural width 1536px. A locally generated 3-second WAV uploaded and real audio play/pause states passed. No live family records were used or changed.
- Hosted local preview: homepage, pricing and all six guides returned 200 and fit 390px. Homepage also fits 320/768/1440px; mobile Sign in remains visible. With reduced motion and with JavaScript disabled, reveal content is visible.
- Muted note text darkened to `#605b50`: contrast ranges **4.84:1–6.49:1** across the six note colors. White primary-action text is **6.02:1**. Pink homepage envelope copy now uses dark ink.
- Public pricing social previews use the same updated family image.
- Desktop and mobile app evidence: [desktop](../assets/design/living-scrapbook-refinement/implementation/everlittle-desktop.png), [mobile](../assets/design/living-scrapbook-refinement/implementation/everlittle-mobile.png). These contain fictional local test data.
- Known dev-only console messages: `/version.json` returns 404 in Vite dev because the manifest is emitted on production builds; existing route-export code-splitting warning. Family route reload has no hydration page exception after the fix.
- Not exhaustively verified: physical iOS keyboard/safe areas, 200% browser zoom, live authenticated role flows, video recording/upload, separate blog source. Existing role/isolation tests passed; these limits must not be represented as completed manual checks.

Source: base commit `d89c2a34ca9ccfe84a1c4c96fe9aa6e8c13c23d3` plus the current uncommitted redesign worktree. Production asset build ID: `f965af237301`. No schema or deployment configuration changes.

Rollback references captured before release:

| Target                                   | Previous Worker version                | Previous build ID |
| ---------------------------------------- | -------------------------------------- | ----------------- |
| geteverlittle.com / everlittle-hosted    | `6e984c28-9e97-4cf5-a9a7-318925e5ef1f` | `635fb50ee83d`    |
| dikichoetso.com / everlittle-dikichoetso | `c412af2e-3943-4c3a-a7fd-fd8424064cc8` | `94fc7540521a`    |

Both roots returned 200 in Chromium before release and `/api/platform` confirmed the intended hosted/self-hosted modes. Raw Python HTTP requests received 403, so actual-domain smoke checks use the browser.

### Final release record — verified September 7, 2026

Both installations now serve build `f965af237301`:

| Target            | New Worker version                     | Smoke result                                                                                                                                                 |
| ----------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| geteverlittle.com | `74a2d7a0-65de-4a80-b5b5-b2f75be3df8a` | Root, pricing, six guides, sign-in and sign-up return 200; updated imagery, guide canonicals and 390px layout verified; hosted mode retained.                |
| dikichoetso.com   | `f0595b82-8996-4782-acdb-e24832cb6193` | Root returns 200 and fits 390px; new version manifest verified; self-hosted mode, default archive, closed public signup and configured child entry retained. |

Each target was rebuilt separately with its existing deployment script. No schema migrations, secret changes, production memory writes or commits were made. Live authenticated archive interactions were not checked; functional capture/media/navigation checks used the isolated local fictional archive. Separate blog remains unverified pending its URL/source. Source remains the uncommitted working tree described above.

### September 7, 2026 — reference comparison and interaction polish

The user requested direct reference verification, calmer typography, better button feedback/contrast, text-only mobile tabs, bounded date inputs, and reveal controls for passwords and PINs, followed by commit, push and deployment to both installations. The [visual review](living-scrapbook-visual-review.md) records the comparison, intentional deviations, evidence and browser checks. This request supersedes earlier mobile icon-and-label guidance.

Functional typography now uses regular and medium weights; serif keepsake and editorial treatments remain intentional. Shared fixes cover account/onboarding, all archive destinations, homepage, pricing and six guide/article routes. Existing unrelated advertising artwork remains outside the release.

Release validation: `pnpm ready` passed (65 tests across 11 files, lint/types/formatting and production build). `pnpm self-host:check` passed configuration validation, build and Worker dry run. Public navigation actions on homepage, guide and pricing were browser-verified with identical cream text and terracotta normal/hover/pressed backgrounds; reduced motion and focus restoration passed locally.

### September 7, 2026 — waveform fix and completion of the pending release

Resumed the interrupted thread in the current conversation. Before release, Cloudflare confirmed hosted version `74a2d7a0-65de-4a80-b5b5-b2f75be3df8a` and Dikichoetso version `f0595b82-8996-4782-acdb-e24832cb6193`; the subsequent interaction polish was still staged and had not been deployed.

The local sample recording produced 36 identical 42px RMS bars. Audible recordings with less than 5% amplitude variation now use the static illustrative waveform, as does decoding failure. Variable recordings retain measured RMS across all channels and the full sample range; silence remains flat. A tooltip identifies illustrative versus measured waveforms. Playback no longer waits for waveform decoding, stale decode results are ignored after switching memories, audio contexts close on failure, and progress starts with no bars highlighted.

Validation: `pnpm ready` passed all 68 tests, lint/types/formatting and production build. `pnpm self-host:check` passed. Chromium confirmed playback advances, pause works, and seeking reaches 1.5 seconds. Chromium and WebKit showed the varied 9–42px bars without horizontal overflow in the local fictional archive. Production family recordings were not accessed or modified. Existing development-only missing version-manifest warnings remain; production manifests are checked after deployment.
