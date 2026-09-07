# Living Scrapbook visual and interaction review

September 7, 2026. Reviewed the running app directly against [approved desktop B](../assets/design/living-scrapbook-refinement/02-folder-tabs.png) and the [generated mobile reference](../assets/design/living-scrapbook-refinement/03-mobile.png). The latest user instructions supersede the mobile reference's icon-and-text navigation.

| Before                                                              | After                                                                                                           | Why                                                                         |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Generic memory grid and repeated kind/action labels                 | Layered paper, horizontal folder tabs, large photograph beside story/voice/milestone notes and a sealed capsule | Match the approved composition while preserving chronological reading order |
| Mobile tabs with icons and text                                     | Five spacious text-only destinations with a visible selected paper tab                                          | Reduce crowding without ambiguous icon-only controls                        |
| Numerous variable font weights                                      | Geist regular/medium for functional UI; Cormorant for keepsake headings and editorial artwork                   | Quieter hierarchy while retaining the scrapbook character                   |
| Pale text inherited by yellow pricing and guide cards               | Dark ink on pastel paper; cream text on terracotta actions                                                      | Restore readable contrast                                                   |
| Inconsistent hover and press feedback                               | 160ms color transitions, 120ms subtle press, explicit readable hover/active pairs                               | Make controls respond predictably                                           |
| Delayed saving-label swaps and independent entrance/exit animations | Immediate status text and interruptible sheet transitions; focus containment and restoration                    | Avoid stale status and abrupt dismissal                                     |
| Hidden password/PIN contents only                                   | Accessible Show/Hide controls in every password and PIN form                                                    | Let people check their entry without submitting or losing the value         |
| Mobile native date field exceeding its column                       | Explicit bounded width and matching input dimensions                                                            | Full name and birth date align in Chromium and WebKit                       |
| Pricing navigation absent on mobile                                 | Visible brand, Sign in, and archive action                                                                      | Keep public navigation consistent and usable                                |

## Visual evidence

- [Implemented desktop](../assets/design/living-scrapbook-refinement/implementation/everlittle-desktop.png)
- [Implemented mobile](../assets/design/living-scrapbook-refinement/implementation/everlittle-mobile.png)
- [Guide mobile](../assets/design/living-scrapbook-refinement/implementation/guide-mobile.png)
- [Pricing mobile](../assets/design/living-scrapbook-refinement/implementation/pricing-mobile.png)

Screenshots use an isolated fictional archive. Real account names, media, dates, duration and permissions remain data-driven. The existing Everlittle brand is retained. The recording's uniform waveform is from a synthetic local test tone, not simulated real speech. Reference photograph/content and exact ornamental marks are not reproduced.

## Interaction references

Reviewed [Beautiful UI](https://www.beautifului.dev/), [Be UI](https://beui.dev/), and [Transitions](https://transitions.dev/) for clear state feedback, restrained motion and interruptible transitions. Implemented the relevant principles with existing React/CSS rather than adding a UI dependency. `rareui.dev` failed DNS resolution during this review and could not be inspected.

## Verification

- Browser checks at 320/390px: date and full-name inputs both 246/316px in Family settings, in Chromium and WebKit. Hosted onboarding with a browser-only fixture measured 280/350px for both fields.
- Password and PIN reveal/hide preserve values, validation attributes, and autocomplete; reset fields toggle independently. No reset request was submitted during this UI check.
- Mobile navigation has zero visible icons. Parent layout also checked at tablet and desktop sizes.
- Normal/hover/pressed main action keeps cream text on successively darker terracotta. Escape closes sheets; keyboard focus stays within the dialog and returns to the trigger. Reduced-motion transitions are effectively immediate.
- Sampled computed small-text contrast checks across five app destinations, homepage, pricing and all six editorial guide routes found no remaining failures after fixes. This is a targeted check, not an exhaustive WCAG certification; photographs/gradients were visually reviewed.
- Guides/articles share the same styling. No separate blog application or `/blog` route exists in this repository; an externally hosted blog cannot be checked without its source/URL.
- Production smoke checks are read-only. Authenticated behavior was exercised locally; no real family memories, credentials, billing settings or database schemas were changed.

See the [handoff release record](living-scrapbook-redesign-handoff.md) for validation and deployment versions.
