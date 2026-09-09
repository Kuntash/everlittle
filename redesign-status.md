# Everlittle redesign status

Last updated: September 8, 2026.

## Current decision

**Apricot Moments is the selected visual direction.**

The direction keeps Everlittle warm and personal while replacing the previous
scrapbook-heavy presentation with a softer, clearer interface inspired by the
approachability and tactile feedback of Duolingo. It does not copy Duolingo's
brand, mascot, rewards, streaks, points, or other game mechanics.

The redesign is currently a **reviewed visual concept and implementation
reference**. The production React components and CSS still use the existing
scrapbook/heirloom UI and have not yet been migrated.

## Recommended references

- [Interactive design gallery](assets/design/apricot-detailed-2026-09-07/index.html)
- [Detailed app design notes](assets/design/apricot-detailed-2026-09-07/readme.md)
- [Spacious landing-page concept](assets/design/apricot-landing-2026-09-07/landing-spacious-v2.png)
- [Landing-page notes](assets/design/apricot-landing-2026-09-07/readme.md)
- [Initial direction comparison](assets/design/soft-ui-directions-2026-09-07/readme.md)

The gallery contains eleven boards:

1. Parent home
2. Timeline
3. Capsules
4. Child view
5. Family members and invitations
6. Memory composer
7. Capsule composer
8. Child profile, access, and plan
9. Memory detail and playback
10. Button and async states
11. Spacious desktop/mobile landing page

## Visual system

| Role | Value |
| --- | --- |
| Page | Warm ivory `#FFF8ED` |
| Card | Soft white `#FFFCF6` |
| Primary action | Coral `#E96B50` |
| Primary label | Deep cocoa `#2B211E` |
| Button lower edge | Terracotta `#B64C36` |
| Supporting surface | Pale apricot `#FFE8D5` |
| Calm/privacy accent | Muted sage `#DDE4CF` |
| Focus/privacy ink | Forest `#285445` |
| Border | Warm sand `#E8CDB7` |

- Use rounded humanist typography with regular body copy, medium controls, and
  semibold headings.
- Primary buttons have a matte face, 16px corners, a 5px solid lower edge, and
  dark cocoa labels.
- Hover brightens the face; press moves it down 4px and leaves a 1px edge.
- Controls use at least 44px targets; primary button faces are 52px high.
- Use real family photography and the established sprout, camera, microphone,
  and sage keepsake-box language.
- Avoid scrapbook tape, torn paper, rotated notes, editorial serif type, glossy
  gradients, generic dashboard bento grids, mascots, and gamification.

## Product and copy decisions

- Parent is the quick capture/revisit view; Timeline is the complete archive.
- Existing memory types remain Photo, Story, Voice, Video, Milestone, and Letter.
- “Add a voice memory” is an upload action, not an in-app recorder.
- Adult navigation remains Parent, Timeline, Capsules, Child, and Family.
- Actual child sessions do not expose adult navigation or management controls.
- Sealed capsule bodies remain unreadable until their opening date.
- Public links are explicit, memory-specific, author-controlled, and temporary.
- Family settings group People, Child profile, and Plan.
- The landing page and app share the same visual system and product preview.
- Recommended landing headline: **“Their childhood is happening. Keep a little of it.”**
- Recommended landing structure: hero, memory path, privacy/collaboration,
  pricing, journal, final CTA.
- The landing concept replaces the lower self-host promotion with three existing
  editorial guides: Baby memory journal, Letters to your child, and
  Grandparents memory project.
- Do not introduce testimonials, ratings, user counts, AI features, public
  feeds, comments, likes, general search, or notifications.

## Production files to migrate next

Primary app implementation:

- `apps/web/src/routes/index.tsx`
- `apps/web/src/scrapbook.css`
- `apps/web/src/components/archive-tabs.tsx`
- `apps/web/src/components/brand.tsx`

Public landing and pricing:

- `apps/web/src/components/scrapbook-home.tsx`
- `apps/web/src/components/marketing-home.tsx`
- `apps/web/src/styles.css`
- `apps/web/src/lib/seo-page-paths.ts`

Existing production behavior, permissions, billing, media playback, sharing,
and responsive rules should be preserved while presentation changes.

## Suggested implementation sequence

1. Extract Apricot tokens and raised-button primitives without changing behavior.
2. Migrate the authenticated shell and responsive navigation.
3. Implement Parent and Timeline, then memory detail/composer.
4. Implement Capsules, Child, and Family/settings.
5. Replace the public landing page with the spacious v2 structure.
6. Align pricing and the six editorial guide pages with the same system.
7. Verify keyboard focus, reduced motion, loading/error states, permissions,
   child-session isolation, mobile overflow, and color contrast.
8. Capture fresh desktop/mobile screenshots and compare them with the gallery.

## Scope note

The committed PNG boards are visual references. Fine typography, dates, and
generated microcopy must not override the written product constraints or actual
application data. The live button sample in the gallery and the detailed design
notes are authoritative for interaction behavior.
