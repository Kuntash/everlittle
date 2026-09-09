# Everlittle — Apricot detailed design

September 7, 2026. The user selected **A — Apricot Moments**, with stronger Duolingo-inspired raised buttons, and authorized copy and layout refinements. This package expands that direction into feature-based screen concepts. Production code and deployments are unchanged.

Open [the review gallery and live button sample](index.html). Generated boards are static visual proposals; the small button sample demonstrates interaction only and does not save data.

## Screen set

1. [Parent](01-parent-refined.png) — quick capture, recent mixed-media memories, next capsule.
2. [Timeline](02-timeline-final.png) — chronological month groups and all six memory-kind filters.
3. [Capsules](03-capsules-refined.png) — sealed metadata separated from opened notes.
4. [Child](04-child-refined.png) — parent preview and the separate read-only child session.
5. [Family](05-family-refined.png) — members, roles, invitations and pending invitation controls.
6. [Memory composer](06-memory-composer-refined.png) — photo form and voice upload state.
7. [Capsule composer](07-capsule-composer.png) — note, opening date, audience and sealing state.
8. [Family settings](08-family-settings.png) — profile, PIN access and subscription options.
9. [Memory detail](09-memory-detail.png) — playback, author controls and explicit public sharing.
10. [Interaction states](10-button-states.png) — default, hover, pressed, focus, loading, disabled, success, error and empty states.
11. [Landing page](../apricot-landing-2026-09-07/landing-spacious-v2.png) — a more spacious public desktop/mobile concept using the same Apricot system as the app, with journal content replacing self-host promotion.

## Product decisions

- Keep the five adult destinations: Parent, Timeline, Capsules, Child, Family. Mobile navigation remains text-only. Hide Child for vault profiles, as the existing app does.
- Parent is the quick place to add and revisit. Timeline is the complete chronological archive. The warm capture panel becomes compact on mobile so memories remain near the top.
- Change the original A concept's “Record a voice” to “Add a voice memory.” The current composer accepts an audio file; it does not implement an in-app recorder. Photo, Story, Voice, Video, Milestone and Letter all exist.
- Use “Emma’s memories” instead of “Emma’s scrapbook”; “Every little chapter” introduces Timeline. Preserve concise action labels: Save memory, Seal capsule, Send invitation.
- Separate Family into People, Child profile and Plan sections. This is a proposed presentation of existing settings, not new backend functionality. The source currently presents these together.
- Child in the adult shell is a preview. Actual child sessions get a simplified header and sign-out, with no adult navigation or management controls.
- Keep sealed notes unreadable until their opening date. Show only their title, date and attribution. Replace implementation jargon with “Once sealed, no one can read this note until [date].”
- Keep public sharing explicit: author chooses Create public link; explain that anyone with the link can view that one memory for 30 days and the link can be disabled.
- Keep risky member actions and deletion visually quiet and behind confirmation. Do not make destructive actions playful coral primary buttons.
- Do not introduce general search, comments, likes, AI features, streaks or points.

## Raised button specification

The live sample is the precise reference for button mechanics; generated pixels are illustrative.

| Property / state | Specification |
| --- | --- |
| Primary face | Apricot coral `#E96B50` |
| Primary label | Deep cocoa `#2B211E`; final contrast adjustment from the prompt's original `#352C29` |
| Bottom edge | Solid terracotta `#B64C36`, 5px; no blurred shadow or glossy gradient |
| Shape | 52px face height, 16px radius, medium label, generous horizontal padding |
| Hover | Face `#F17C63`, unchanged position; only for hover-capable pointers |
| Pressed | Face moves down 4px; edge reduces to 1px; surrounding layout stays still |
| Keyboard focus | Forest `#285445` 2px ring, 3px offset; never remove browser focus without a replacement |
| Loading | Same width; visible verb such as Uploading…, Saving…, Sealing…, Sending…; prevent repeated submission |
| Disabled | Muted sand face and label, no hover or press treatment; explanation near the control when needed |
| Secondary | Ivory face, warm sand 2px border and 3px solid lower edge |
| Destructive | Quiet outlined or text control; clear confirmation explains the consequence |

The initial prompt's cocoa/coral combination measured 4.33:1, so the final button label is darkened to `#2B211E`. Cream/white text on the selected coral does not meet normal-text contrast and should not be copied from any generated board. Body muted `#786459` on page `#FFF8ED` measures 5.28:1. Measure final rendered styles again during implementation.

Use regular body text, medium controls and semibold headings; the reference's heavier generated headings are not a requirement. Minimum touch target is 44px. Keep the primary button's visible face at 52px. No hover dependency on touch. The sample uses immediate state changes with no animation, so reduced motion is inherently supported. If transitions are added later, keep them brief and provide reduced-motion equivalents.

## Async and empty-state behavior

- Memory submission: idle → uploading if media is attached → saving → refreshed archive / success. Do not show a fabricated percentage; the current UI exposes stages, not byte progress.
- Preserve title, body, date, audience and attachment on an error; show a contextual message and allow retry. Do not automatically resubmit.
- Disable duplicate submit and busy-sheet dismissal while the existing mutation is pending. Keep the status perceivable with aria-busy and a live status message.
- Media playback loading is distinct from file upload. Show Loading audio… and a useful retry message when loading fails.
- Archive loading: stable skeleton shapes. Empty archive: a warm explanation with one available next action, respecting role and profile requirements.
- Invitations: Sending… → email/link result. Handle email failure and Retry without implying a successful email merely because an invitation record exists.
- A viewer has no capture or capsule-creation actions. Owners manage invitations, roles and billing; owners/parents edit child settings. Memory editing and public sharing are author-only in the current UI.
- Missing child profile: explain how to create one in Family. Subscription-gated creation opens existing plan options; existing memories remain viewable. Self-hosted installations should retain their existing plan behavior rather than displaying hosted checkout.

## Source grounding

Graphify's existing map was used to locate these components; current source was then read directly. All references below are in `apps/web/src/routes/index.tsx` unless otherwise noted.

| Area | Existing implementation |
| --- | --- |
| Adult destinations | `apps/web/src/components/archive-tabs.tsx` |
| Parent capture and recent content | `ParentView`, line 1028 |
| Child session / preview | `ChildArchiveApp`, line 969; `ChildView`, line 1180 |
| Timeline and filters | `TimelineView`, line 1262 |
| Detail, edit, delete, public links | `MemoryDetail`, line 1373 |
| Composer, file input, audience, submission stages | `MemoryComposer`, line 1631 |
| Audio/video playback | `SecureAudioPlayer`, line 1967; `SecureVideoPlayer`, line 2105 |
| Locked and opened capsules | `CapsulesView`, line 2226 |
| Capsule note/date/audience form | `CapsuleComposer`, line 2383 |
| Creation gate and plans | `SubscriptionSheet`, line 2565 |
| Members, profile, child PIN, storage, billing, invitations | `FamilySettings`, line 2684 |

Hosted plan labels reflect repository copy: $6 monthly / $60 yearly. Treat these as existing app copy, not independently verified billing configuration. Real values, access and state must come from the app. Fictional family content is used throughout.

## Generation and review

Generated with the built-in image tool, one call per board, referencing the selected [A board](../soft-ui-directions-2026-09-07/a-apricot-moments.png). [Base generation prompts](prompts.json) are saved alongside the outputs; several boards then received narrow visual corrections for product accuracy and button contrast. No CLI image API was used.

Screen images are proposals, not executable specifications. Text, color, dates, button depth and small controls must be checked against this document during implementation. Hover, loading and success samples are separate states, not simultaneous production behavior. The gallery and button sample do not connect to the application or send data.
