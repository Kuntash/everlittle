# Everlittle launch studio

Three short Reel variants, an Instagram launch image, and five reusable social layouts live here. No external posts were published.

- `renders/01-little-history.mp4` — 16 seconds, story/photo hook.
- `renders/02-little-voice.mp4` — 14 seconds, emotional voice-memory hook.
- `renders/03-every-little-thing.mp4` — 12 seconds, fast kinetic typography.
- `social/exports/00-launch.png` — ready 1080 × 1350 launch image.
- `social/exports/` — full-resolution layout PNGs.
- `social/DESIGN-SYSTEM.md` — layout rules, source editing, captions and posting sequence.
- `review.html` — local comparison gallery.

Run `node scripts/build-social.mjs` to rebuild the three video sources. Each directory under `variants/` is a separate HyperFrames project; assets are shared via relative symlinks. Run `npx hyperframes@0.8.34 check variants/<id>` then `npx hyperframes@0.8.34 render variants/<id> --quality high --output renders/<id>.mp4`.

Run `node scripts/build-posts.mjs` to rebuild social layouts from `social/content.json`. This is an editable HTML/CSS design system, not flattened generated text. The palette matches the live product and uses its actual local font and sprout mark.

The landing screenshot is captured directly from geteverlittle.com. The responsive app is the real ArchiveApp component and styles with fictional local data; the harness no longer substitutes its own app shell. Screenshots are animated with editorial camera motion and a cursor, not a continuous browser-session recording. The earlier silent 30-second draft is retained for history but superseded.

Music A and B are original ElevenLabs Music v2 generations, 30s each, “Everlittle Moments”, generated in the signed-in account (two 30s variants; UI rate was 1,800 credits/minute per variant). Source files are preserved in assets; no ElevenLabs narration appears in the new videos. Click sounds came from media-use's bundled library; provenance is in .media/manifest.jsonl. Exact soundtrack project links and prompt are in AUDIO.md.

Preview: `npx hyperframes@0.8.34 preview --background`, verify with `preview --status`. The default index mirrors Little History. The selected version can replace it after review. For the gallery, run `node scripts/serve-review.mjs` and open http://127.0.0.1:8766/review.html.

Browser compatibility: gallery previews use VP9/Opus WebM at 720×1280 with visible poster frames after the in-app browser showed audio-only MP4 playback. Downloads retain the original 1080×1920 MP4s. Post captions, alt text and revised posting sequence are in social/POST-CAPTIONS.md and social/DESIGN-SYSTEM.md. Each image export has matching text sidecars; the gallery shows copy buttons beside the images.
