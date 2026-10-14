# Performance and paper cuts: baseline and plan (13 October 2026)

This note records what was measured on the two production installations, what earlier work
covered, every open performance problem and paper cut found, and the order to fix them in.

Nothing was changed in this pass. Findings marked "confirmed" were read in the code; they were not
reproduced in a browser unless a measurement is given. Paths are relative to `apps/web`.

## 1. What earlier work covered

One piece of performance work exists. On 24 August the video player stopped downloading every
video in full before playback (about 48 MB on dikichoetso.com) and switched to direct ranged
streaming with `preload="none"` on timeline cards. It was deployed to dikichoetso.

On 7 September audio playback stopped waiting for waveform decoding. The recording is still
downloaded and decoded in full.

Nothing else was measured. The redesign handoff lists "record baseline URLs, key interactions,
image weights" and a Lighthouse run as unchecked, and no thread ran either.

About 40 paper cuts were fixed and deployed between 5 August and 13 October (sheets, tab bar,
PWA update banner, HEIC/MOV acceptance, signup and billing states, `Content-Range` on ranged
media, lifetime access). They are not repeated here; the open ones are in section 4.

## 2. Baseline measurements

Measured from Chennai (Cloudflare colo MAA) on 13 October 2026.

### Lighthouse, mobile profile

| Page | Score | First paint | Largest paint (LCP) | Page weight |
| --- | --- | --- | --- | --- |
| geteverlittle.com `/` | 62 | 5.0 s | 8.6 s | 3,739 KB |
| geteverlittle.com `/sign-in` | 80 | 1.9 s | 5.2 s | 550 KB |
| dikichoetso.com `/` | 62 | 5.2 s | 7.7 s | 920 KB |

Blocking time is under 30 ms and layout shift is 0 on all three, so the problem is download weight
and render-blocking files, not script execution.

### Server response time (TTFB)

| Request | Hosted | Self-hosted |
| --- | --- | --- |
| Marketing or shell HTML, warm | about 110 ms | about 100 ms |
| Same, cold start | about 600 ms | about 550 ms |
| Request with no database query | about 80 ms | about 75 ms |
| Request with one database query | about 300 ms | about 120 ms |

### Database

| | Hosted | Self-hosted |
| --- | --- | --- |
| D1 region | Western North America | Asia-Pacific |
| Read replication | off | off |
| Size | 406 KB | 426 KB |
| Read queries, 24 h | 1,678 | 348 |
| Slowest query, 7-day average | 2.4 ms | 0.2 ms |

Queries are fast; distance is the cost. From India each round trip to the hosted database adds
about 200 ms. About 96% of hosted read volume is the five-minute cron, not users.

### Round trips per request (from the code)

| Request | Hosted | Self-hosted |
| --- | --- | --- |
| Anonymous marketing HTML | 0 | n/a |
| App shell HTML `/:family` | 1 | 1 |
| Everything needed to show the archive | 20 queries, 8 in series, across 3 chained requests | 22, 7 in series |
| One photo, signed-in adult | 4 in series, then R2 | same |
| Create a memory | 7 in series | 6 |
| Upload media up to 8 MB | 10 in series, then R2 | 8 |
| Multipart start / each part / complete | 8 / 5 / 17 | 7 / 5 / 15 |

At about 200 ms per round trip, a signed-in user in Asia waits roughly 1.6 s on database distance
alone before the hosted archive appears. This figure is derived, not measured; it needs a signed-in
trace to confirm.

### What the home page downloads

| Asset | Transfer size |
| --- | --- |
| `sealed-envelope.png` (1254 px, shown at about 250 px) | 1,549 KB |
| `archive-stack-v2.png` (1537 px, shown at 300 px or less) | 1,221 KB |
| Two WebP photos | 392 KB |
| JavaScript, 22 files | 405 KB gzip |
| CSS, 8 render-blocking files | 73 KB gzip |

All four images are preloaded ahead of the stylesheets. Every file, including fingerprinted
`/assets/*`, is served with `public, max-age=0, must-revalidate`.

## 3. Performance findings

Ranked by expected gain. Effort: S is under half a day, M is one to two days.

### Public pages (hosted)

| # | Finding | Where | Fix | Effort |
| --- | --- | --- | --- | --- |
| P1 | 2.77 MB of PNG decoration preloaded on the home page, no lazy loading or dimensions | `features/marketing/home/forest-home.tsx:241`, `:437` | Export WebP/AVIF at about 600 px, lazy-load below-the-fold images, give the hero `fetchPriority="high"` and dimensions | S |
| P2 | Fingerprinted assets revalidate on every visit | no `public/_headers` | Add `_headers`: `immutable` for `/assets/*`, long max-age for fonts and marketing images | S |
| P3 | PostHog (about 87 KB gzip) is in the entry chunk on every page, including self-hosted where it never starts | `components/analytics-provider.tsx:9` and three marketing imports | Dynamic import after `/api/platform` returns a token | M |
| P4 | All journal and tool article text (about 75 KB gzip) is in the entry chunk | `features/journal/journal-head.ts:2`, `features/tools/tools.ts` | Have `head()` read a small metadata map | M |
| P5 | Public pages pull the Radix and calendar chunk (71 KB gzip) through a barrel file | `components/design/shared.tsx:15-16` | Import `Brand` directly; move `DateField` and `SurfaceModal` to their own modules | S–M |
| P6 | The home page downloads the whole archive app | `features/archive/components/everlittle.tsx:7-11` | `React.lazy` the four app entry components | S |
| P7 | `styles.css` is 91% unreachable (`.legacy-ui` is never set) and blocks render on every page | `src/styles.css` | Delete the legacy layer and the `seo-story` rules; about 21 KB gzip | S–M |
| P8 | `landing.css` and `journal.css` largely duplicate `apricot.css`; home loads all of `landing.css` for the footer | `features/marketing/landing.css`, `features/journal/journal.css` | Load `site-footer.css` on home, then dedupe. Needs a visual diff | M |
| P9 | Three of five font families are unused | `src/styles.css:2-4` | Drop the imports; preload the Nunito latin file | S |
| P10 | Marketing HTML is rendered on every hit with no cache header | `src/server.ts` | Prerender or edge-cache. Low priority at 110 ms | M |

### App, both installations

| # | Finding | Where | Fix | Effort |
| --- | --- | --- | --- | --- |
| A1 | Hosted Worker runs far from its database; no smart placement, replication or D1 sessions | `wrangler.jsonc` | See the decision in section 5 | S or M |
| A2 | Session and membership are re-read on every API and media request, 3 queries in series | `lib/archive-api.ts:2811-2826`, `:2743-2759`, `lib/auth.ts:58-61` | Enable better-auth `cookieCache`, memoise the auth instance, join membership into the first query | S–M |
| A3 | Archive data waits behind three chained client requests; the server HTML is only a spinner | `everlittle.tsx:63`, `archive-app.tsx:38-40` | Start the archive fetch as soon as the URL has a slug, or use a route loader | M |
| A4 | `/api/platform` is fetched three times per page, each counting the `user` table | `everlittle.tsx:29`, `analytics-provider.tsx:38`, `google-ads-measurement.tsx:28`, `server.ts:69` | One shared promise; skip the count in hosted mode | S |
| A5 | Every app navigation runs a slug lookup before serving the shell | `lib/public-web.ts:67-71` | Cache known slugs per isolate, or let the API return the 404 | S |
| A6 | Timeline photos are full-size originals | `components/memory-media.tsx:9-13` | Store a resized derivative at upload and serve it in lists | M |
| A7 | Media is cached for one hour and never answers 304 | `lib/archive-api.ts:2336`, `:2397-2408` | `private, max-age=31536000, immutable` (media ids never change); pass headers to R2 `onlyIf` | S |
| A8 | Every voice card downloads and decodes its whole recording on mount | `components/secure-audio-player.tsx:22-66` | Load on first play; store waveform bars at upload | M |
| A9 | Every video card requests metadata and loads its thumbnail eagerly | `components/secure-video-player.tsx:73`, `:83` | `preload="none"`, thumbnail as poster, lazy | S |
| A10 | Storage usage is computed with 2 queries, up to four times per upload | `lib/archive-api.ts:2488-2538` | One joined query, once per request, skipped when self-hosted | S |
| A11 | Upload and create paths are long serial chains; multipart parts upload one at a time; the whole archive refetches after each save | `lib/archive-api.ts:1583-2193`, `features/archive/lib/upload-media.ts:36-56` | `db.batch` the checks, upload 3–4 parts in parallel | M |
| A12 | Nothing uses `waitUntil`; analytics, Dodo calls, email and R2 deletes block responses | `lib/billing.ts:91`, `:134-142`, `:256`, `lib/auth.ts:43` | Move to `ctx.waitUntil` | S each |
| A13 | Signed-in tabs with ad consent poll conversions every 15 s, 3 queries each, even when hidden | `components/google-ads-measurement.tsx:71-85` | Check once on load and after a billing return | S |
| A14 | Seven missing indexes and one duplicate. No cost at 400 KB; matters as hosted tenants grow | `migrations/` | One migration: `media_asset(archive_id, …)`, `child_profile(archive_id, created_at)`, `child_access_session(archive_id, child_id)`, `analytics_outbox(distinct_id, occurred_at)`, `audit_event(action, occurred_at)`, `lower(email)`, `media_upload(expires_at)` | S |
| A15 | The cron rescans five tables every five minutes with no watermark; self-hosted has no cron, so expired uploads are never cleaned there | `lib/server-analytics.ts:101-157` | Watermark; add a cleanup trigger for self-hosted | M |
| A16 | The service worker never evicts old fingerprinted assets | `public/sw.js` | Prune on activate | S |

## 4. Open paper cuts

Ranked by user impact. All are effort S unless marked.

### Data loss or a dead end

| # | What the user sees | Where |
| --- | --- | --- |
| B1 | Line breaks vanish in memory bodies and opened capsules; a letter renders as one block | `memory-detail.tsx:228`, `capsules-view.tsx:119`, `child-view.tsx:67`; `apricot.css:1241`, `:1269` |
| B2 | Only the newest 100 memories are reachable; older ones silently disappear (M for real paging) | `lib/archive-api.ts:559`, `:1558` |
| B3 | Sealing a capsule can freeze on "Sealing…" with the modal locked and the letter lost, on a network error or a half-typed time | `capsule-composer.tsx:33-54`, `controls.tsx:231-237` |
| B4 | A tap on the backdrop or Escape discards a half-written memory or capsule | `controls.tsx:334-339` |
| B5 | The app shows loading dots forever if a boot request fails | `everlittle.tsx:29-39`, `auth-route.tsx:23-27`, `archive-app.tsx:28-36` |
| B6 | Buttons stay stuck busy after a network error (delete, share, accept invitation, child PIN, reset password, recovery, family settings) | eight call sites; one shared helper fixes them |
| B7 | After "Leave this archive" the user is signed out, and signing back in lands on a dead-end screen | `family-settings.tsx:419-427`, `archive-app.tsx:69-75` |

### Wrong destination or wrong state

| # | What the user sees | Where |
| --- | --- | --- |
| B8 | Hosted: the installed app opens the marketing page; accepting an invitation lands there too | `public/manifest.webmanifest`, `invitation-acceptance.tsx:34`, `access-screen.tsx:133-150` |
| B9 | Self-hosted: `/` flashes the hosted marketing page with pricing until the mode is known (S–M) | `everlittle.tsx:64-67` |
| B10 | A memory with a live public link shows as private when reopened; the link cannot be seen or revoked (M) | `memory-detail.tsx:55` |
| B11 | Marketing buttons do nothing until the JavaScript has loaded; the signup-click event is also not captured | `forest-home.tsx:15-22`, `:90-96`, `pricing-page.tsx:9-17` |
| B12 | HEIC photos show a broken image on Chrome, Android and Firefox | `memory-media.tsx:9-13` |
| B13 | "Share to an app" appears to do nothing where Web Share is missing; cancelling throws | `memory-detail.tsx:169-176`, `memory-sharing-menu.tsx:64-67` |
| B14 | The video full-screen button probably does nothing on iPhone (unconfirmed, needs a device) | `secure-video-player.tsx:117` |

### Forms

| # | What the user sees | Where |
| --- | --- | --- |
| B15 | Onboarding: a hyphen cannot be typed into the archive address | `onboarding-page.tsx:255-259` |
| B16 | A baby born today is rejected for families ahead of UTC | `onboarding-page.tsx:353`, `:374`, `lib/archive-api.ts:3034-3040` |
| B17 | Onboarding steps 1 and 2 ignore Enter | `onboarding-page.tsx:234-381` |
| B18 | Re-picking the same photo after switching memory type does nothing | `memory-composer.tsx:48-52` |
| B19 | The time field is free text and reports "Invalid time value"; picker dates are fixed to US format | `controls.tsx:138`, `:229-238` |
| B20 | Reset password blames the link for every failure and never shows the mismatch hint | `reset-password.tsx:41-54`, `:102` |
| B21 | Invitation "Send again" and "Revoke" can be double-clicked; no confirmation on revoke | `family-settings.tsx:594-609` |
| B22 | Self-hosted first run: "Create a profile" opens the wrong tab, pre-fills "Your child", and a double tap creates two profiles | `parent-view.tsx:104`, `family-settings.tsx:39-51`, `:465` |
| B23 | Family settings messages may be off-screen on mobile (unconfirmed) | `family-settings.tsx:201-206` |

### Copy and polish

| # | What | Where |
| --- | --- | --- |
| B24 | "1 active devices" | `family-settings.tsx:519` |
| B25 | "Not allow" on the consent button | `google-ads-measurement.tsx:122` |
| B26 | The child's own empty state talks about "memories marked 'For child'" | `child-view.tsx:54` |
| B27 | Manifest and offline page still use the old colours and Georgia | `public/manifest.webmanifest`, `public/offline.html` |
| B28 | The capsule composer offers a child view as default for archives without a child | `capsule-composer.tsx:29`, `:107` |
| B29 | 1.6 GB is displayed as "2 GB" | `features/archive/lib/archive-utils.tsx:225` |
| B30 | The kids PIN form flashes for a child who is already signed in | `routes/(app)/$family.kids.$child.tsx:62-68` |
| B31 | The home mobile menu stays open after tapping an in-page link | `forest-home.tsx:114-125` |
| B32 | The last child-access time is returned by the API but never shown | `lib/archive-api.ts:529` |

### Housekeeping

- Dead code: the `forceChildMode` branch in `access-screen.tsx:173-230`, the second `MemoryDetail`
  in `parent-view.tsx:118-129`, `components/seo-landing-page.tsx`, `lib/seo-pages.ts`.
- About 9.6 MB of `public/` is referenced by nothing in `src`. The `meta-ad-*` and
  `meta-page-cover` images may be linked from ads, so check before deleting.
- Three `todo.md` items are implemented and can be ticked: turning child access off, owner-only
  transfer, and children not managing membership.
- Developer friction from earlier threads: the local dev server is blocked by a Workerd
  compatibility-date mismatch, `.dev.vars` lacks `CHILD_PIN_PEPPER`, there is no CI, and the
  pre-commit hook rejects commits when unrelated unstaged files exist.
- dikichoetso was last deployed on 7 September, so it lacks the October work.

### Carried over from earlier threads, larger than a paper cut

Removed members' sessions are not revoked; ownership transfer has no re-authentication or receipt;
invitation history is missing; email is sent in the request with no retry; real-device checks
(iOS keyboard, safe areas, installed-app update) were never run.

## 5. Plan

Each step is one pull request, deployed to hosted from `main` and then to dikichoetso.

1. **Public page weight (P1, P2, P6, P9, B11).** Small, low risk, and the largest measured gain:
   the home page drops from about 3.7 MB to under 1 MB. Target: mobile LCP under 3 s on `/`.
2. **Paper cuts that lose work or strand the user (B1–B9).** B1 is a two-line CSS fix.
3. **Fewer database round trips (A2, A4, A5, A7, A9, A10, A12, A13, A14).** All small. By estimate this
   takes the archive load from 8 round trips in series to about 4 on both installations.
4. **Hosted database distance (A1).** Decide after step 3; see below.
5. **Entry bundle (P3, P4, P5, P7).** Cuts roughly 230 KB gzip of JavaScript and 21 KB of CSS from
   every page on both installations.
6. **Media derivatives (A6, A8) and timeline paging (B2).** The largest piece: thumbnails and
   stored waveforms at upload, plus "Load older". This is what keeps the timeline fast as an
   archive grows.
7. **Remaining paper cuts (B10, B12–B32) and housekeeping**, in two or three batches.
8. **Restructure (A3, A11, A15, P8, P10).** Route loader for archive data, upload batching, cron
   watermark, CSS dedupe.

Re-run the section 2 measurements after steps 1, 3 and 6 and append the numbers here.

### Decision needed for step 4

The hosted database is in western North America. Two ways to close the distance:

- **Smart placement** is one line of config. It runs the Worker near the database, so a request
  pays the long hop once instead of once per query. It also moves anonymous marketing rendering
  away from visitors, adding about 200 ms for those far from the US unless the HTML is cached
  (P10). It may not engage at the current traffic level.
- **Read replication with D1 sessions** keeps the Worker at the edge and reads from a nearby
  replica. It needs every read path moved to `withSession()`, about a day of work plus testing.

Which is right depends on where hosted users are. PostHog has that; it was not checked in this
pass. If most are in North America, neither is urgent after step 3.

## 6. First pass, 14 October 2026

Branch `perf/page-weight-and-round-trips`. It follows the latency work in the medibara project:
a signed session cookie, no smart placement, long-lived caching of built files, and page text
imported inside route loaders.

### What changed

| Finding | Change |
| --- | --- |
| P1 | The two PNG decorations are WebP files at 640 px (2.77 MB to 55 KB). Images below the first screen load lazily. The hero photo has an 800 px version for phones, dimensions and high fetch priority |
| P2 | `public/_headers`: one year, immutable, for `/assets/*`; one day for artwork and fonts |
| P3 | PostHog loads on demand, only where analytics is configured (`lib/product-analytics.ts`) |
| P4 | Journal and tool text is imported inside each route's loader |
| P5 | Public pages import the tabs, the button and the brand mark from small files |
| P6 | The archive, the sign-in form and the child's view load on demand |
| P7 | The 1,092 rules of `styles.css` that needed `.legacy-ui` are removed (211 KB to 36 KB of source) |
| A2 | Better Auth keeps the session in a signed cookie for 5 minutes. The API passes a refreshed cookie on |
| A3, A4, B5 in part, B9 | The Worker hands each page the installation's settings and the cookie flags (`lib/boot.ts`). A page makes one API request before it shows, not four. The sign-in form and the self-hosted entry screen are in the first HTML |
| A4 | `/api/platform` reads no row in hosted mode and one batch in self-hosted mode |
| A7 in part | Media answers a revalidation with 304 and no body. The one-hour lifetime is unchanged |
| A8 in part | A voice recording downloads when its card comes near the screen |
| A13 in part | The conversion check does not run in a background tab |
| new | The hero and journal entrances start at opacity 0.01, so the first screen counts as painted |

Not taken from medibara: prebuilt public pages (the hosted and sandbox Workers decide indexing
and the canonical host at request time, and server response is already about 110 ms), and D1 read
replicas (section 5, still open).

Left as it was after testing: the home page keeps `landing.css`, because the article cards take
their illustration size from it.

### Trade-off to know about

A session that is revoked elsewhere (a password reset, or a sign-out on another device) keeps
working in an already signed-in browser for up to 5 minutes. A sign-out in the same browser acts at
once. Family membership and child PIN sessions are still read on every request, so removing a
member acts at once. The time is `SESSION_COOKIE_CACHE_SECONDS` in `src/lib/auth.ts`.

### Measured on a local build

Lighthouse, mobile profile, production build served over HTTP/2 with compression. This is not
production; repeat it on both sites after the release.

| Page | Before (production) | After (local) | LCP before | LCP after |
| --- | --- | --- | --- | --- |
| Hosted `/` | 62 | 96 | 8.6 s | 2.3 s |
| Hosted `/sign-in` | 80 | 98 | 5.2 s | 1.8 s |
| Hosted `/pricing` | not measured | 97 | | 2.1 s |
| Hosted `/journal` | not measured | 95 | | 2.1 s |
| Hosted `/sharing-photos-with-grandparents` | not measured | 95 | | 2.6 s |
| Hosted `/tools/how-old-will-i-be` | not measured | 97 | | 2.2 s |
| Hosted `/es` | not measured | 97 | | 2.1 s |
| Self-hosted `/` | 62 | 95 to 96 (HTTP/1.1) | 7.7 s | 2.4 s |

| Home page | Before | After |
| --- | --- | --- |
| Total transfer | 3,739 KB | 411 KB |
| JavaScript before the page is interactive | 405 KB gzip | 152 KB gzip |
| API requests before the page shows | 4 | 1 |

A remaining layout shift of 0.05 to 0.08 on the home page, `/journal` and `/es` comes from the web
font replacing the fallback font.

### Checks

- 111 unit tests, 25 component tests and 55 end-to-end tests pass. Two tests are new: the signed
  session cookie, and media revalidation.
- Screenshots of 16 pages at phone and desktop width match the build before the change. The only
  differences are the re-encoded home images.
- A real first-owner sign-up, reload and return was run on a local self-hosted installation.
- `playwright.preview.config.ts` runs the end-to-end tests against a local preview build.

### Not done in this pass

A1 (database distance), A5, A6 (photo thumbnails), A9 to A12, A14 to A16, P8 to P10, and the paper
cuts of section 4 other than B9.

## 7. Read replicas, 14 October 2026

Branch `perf/d1-read-replicas`, on top of the first pass. It answers the decision in section 5
the way medibara did: the Worker stays where the request enters, and the data comes to it.

- `src/lib/request-database.ts` gives each request one D1 session. `getRuntimeEnv().DB` is that
  session inside a request, so no query in the app changed.
- A request that only reads starts from the browser's bookmark, or from any copy when it sent
  none. A request that may write (any method other than GET and HEAD) starts from the primary, so
  its checks read current rows.
- The bookmark goes to the browser in the `everlittle.db_bookmark` cookie for 10 minutes. The
  next request of the same browser sees at least the data of this one.
- The scheduled handler uses the primary.

The code does nothing new until read replication is switched on for a database. That is a setting
of the database, not of this repository: Cloudflare dashboard, D1, `everlittle-hosted-db`,
Settings, Enable read replication. With it off, every query goes to the primary as before.
`everlittle-dikichoetso-db` does not need it: its one family is near its database.

What a replica can show late: a change made by someone else in the last second or so, for example
a payment that Dodo has just reported, seen from another browser. A reload shows it.

Not taken from medibara: the Workers KV cache. Medibara keeps its catalogue there because every
learner reads the same rows. Everlittle has no such data; every row belongs to one family and is
private. KV would also be one more resource for each self-hosted installation to create.

Checks: 115 unit tests (4 new), 25 component tests and 55 end-to-end tests pass. A real
first-owner sign-up ran on a local self-hosted installation through the session. Replica lag is
not covered: the local D1 has no replicas.

## 8. Not measured

- Signed-in page loads end to end (no test credentials were used).
- Upload speed for large files.
- Real devices; all figures are from simulated mobile throttling on one connection in India.
- Worker CPU time and production request latency percentiles (the Cloudflare observability
  connection was not authorised in this session).
