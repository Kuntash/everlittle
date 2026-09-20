# Everlittle — the next ten

Completed draft batch, not published. Open http://localhost:4323/ while the preview server is running, or run `python3 -m http.server 4323 --directory marketing/content/batches/2026-09-next-10` from the repository root.

- Six Google Flow reels: ten seconds each, 1080×1920 H.264/AAC, white captions and original generated ambient audio. Original footage is 720×1280.
- Four carousels: five 1080×1350 PNGs each. Full-frame image covers, large editorial prompt cards, Everlittle green closing slide.
- `publish-ready.zip`: six final MP4s, twenty PNGs, covers, ten captions, content plan, audit and tracker.
- `AUDIT.md` and `insights-raw.json`: observed account results and limitations.
- `content.json`: hooks, angles, complete captions, carousel scripts and suggested publishing order.
- `flow-sources.json`: original Google Flow scene links and download provenance. Scenes are illustrative, not testimonials. Provider watermark remains present.
- `QA.txt`: export validation. `reels-contact.jpg` covers beginning/middle/end of every reel; `carousels-contact.jpg` shows all twenty slides. Both inspected.

All six HyperFrames checks passed without warnings; all final videos decoded successfully and loaded with ten-second duration in the gallery. Gallery filtering and carousel navigation were tested. No music was added. No Instagram content was published or edited for this batch.

Export note: use the browser locator’s `getAttribute('src')` for canvas result images. DOM evaluation serialisation truncates individual strings around 200,000 characters, corrupting photo-heavy PNGs. The final four photo covers were re-exported in full and the twenty-slide contact sheet decoded successfully.
