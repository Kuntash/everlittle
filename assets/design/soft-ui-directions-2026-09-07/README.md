# Everlittle — softer UI directions

September 7, 2026. Three exploratory image-generated concepts requested by the user after reviewing the current Living Scrapbook UI. These are design proposals, not an approved replacement or implemented application.

## Reference and interpretation

Reviewed `../ai-manga/output/design-kit/README.md`, the approved A mobile and desktop references, the A dark theme reference, and the original B and C mobile explorations. Mori selected A's rounded Apricot layouts and fox, with C supplying dark-theme colors only. Its implementation kit specifies Nunito, generous spacing, rounded controls, and restrained dimensional button edges.

For Everlittle, borrow that approachable control language while retaining the existing sprout identity and real family photography. Keep controls predictable and content aligned. Do not import Mori's fox, manga imagery, literal wooden shelf, or game rewards. All depicted family content is fictional.

## Three directions

| Variant | Structure | Visual direction | Main tradeoff |
| --- | --- | --- | --- |
| A — Apricot Moments | Capture-first home | Ivory, apricot, coral; warm rounded controls | Most welcoming entry, but capture panel uses space above existing memories |
| B — Gentle Green | Chronological feed | Sage, forest, white; restrained borders and rounded type | Strongest everyday scanning and predictable mixed-media layout |
| C — Memory Library | Photo-first browsing | Buttercream, sky, amber; consistent media frames | Strong browsing emphasis, with non-photo memories requiring equal care |

Each board compares a desktop home screen and its mobile adaptation using the same archive and memories. Mobile navigation retains five text-only labels. Desktop uses horizontal navigation. The intended structure, palette, and components differ across variants; these are not merely color swaps.

Initial recommendation was B. The user subsequently selected **A — Apricot Moments**, requesting stronger Duolingo-inspired raised buttons and detailed feature screens. See the [selected direction expansion](../apricot-detailed-2026-09-07/README.md).

## Preview files

- [A — Apricot Moments](a-apricot-moments.png)
- [B — Gentle Green](b-gentle-green.png)
- [C — Memory Library](c-memory-library.png)
- [Exact generation prompts](prompts.json)

All three generated boards were visually inspected and saved at 1536 × 1024. A most closely matches Mori's welcoming character; B gives a growing mixed-media archive the clearest structure; C puts photography first. Before implementation, correct generated dates and content labels, including C's capsule/milestone distinction.

## Scope and implementation notes

- Production source, current deployment and approved design remain unchanged by this exploration.
- Search shown in any concept is a proposed capability; the current archive has memory-kind filtering but no general memory search. It must be omitted or explicitly scoped before implementation.
- Image-generated typography, copy, contrast, spacing and navigation are approximations, not verified implementation specifications.
- Future implementation should use semantic controls, measured contrast, at least 44px targets, readable input text, actual data, responsive layout and reduced-motion alternatives.
- Do not transfer Mori's very heavy font weights wholesale: Everlittle's earlier preference for fewer bold weights still matters.
- The user clarified that the six existing editorial/guide routes are the blogs in scope. There is no outstanding need to locate a separate blog implementation.

## Generation

Built-in image generation, one call per variant. Reference inputs: Mori `a-library.png`, Mori `a-desktop.png`, and Everlittle `apps/web/public/icon-512.png`. Exact prompts are stored in `prompts.json`. No CLI image API was used.
