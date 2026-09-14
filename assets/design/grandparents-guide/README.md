# Grandparents guide mobile assets — 15 September 2026

These are screenshots of the existing `ArchiveApp`, `ParentView`, `MemoryDetail`, and `FamilySettings` components at mobile viewports. They are not generated UI mockups. All family data is fictional; the photograph is the existing illustrative marketing asset `/design/apricot-a7c926732061.webp`. No live account or customer content was used, and no invitations or other API writes were performed.

Public assets live in `apps/web/public/journal/`:

- `grandparents-mobile-home.png`: 390 × 844, Home feed.
- `grandparents-mobile-memory.png`: 390 × 844, author's photo detail with audience and editing controls.
- `grandparents-mobile-family.png`: 390 × 1000, owner's family roles and invitation form.
- `grandparents-mobile-overview.png`: 1200 × 720, cover composed from the three screenshots, also used for social sharing.

The article displays the owner/author context in captions, so viewers do not mistake editing controls for grandparent Viewer permissions. Full-width screenshots accompany the relevant instructions; the composite is a visual introduction.

`fixture.ts` preserves the typed sample archive. Capture it in a local Vite frontend harness with the normal root styles (`styles`, `apricot`, `integration`, `parity`, archive `primary-button`, and `pwa`). Render `ArchiveApp` at `/test-family`; return the fixture for `/api/families/test-family/archive`, an empty array for `/api/archives`, and the illustrative photo for `/api/families/test-family/media/demo-photo`. Reject all non-GET API requests. Never enable a remote binding for this capture.

Capture Home, open the photo to capture its detail, and open Family to capture invitations. Wait for existing entrance motion to complete. Use viewport screenshots, not full-page stitching. `overview.html` is the cover source; serve the three PNGs at `/journal/` and resolve its font to the installed Nunito Sans Latin variable font. Capture at 1200 × 720.

The normal dev server has a pre-existing local Workerd compatibility-date mismatch, so these captures used an isolated frontend harness. Type checking and production builds validate the application separately.
