# Baby journal carousels — revised 17 September 2026

Publication update: “Their little language” was published on 17 September 2026 (Asia/Kolkata): https://www.instagram.com/geteverlittle/p/DdW95JUH9hr/. The other two carousels remain local drafts, not scheduled. See publication.json. This revision replaces the visual deliverables from 2026-09-16; the original version is preserved.

## Changes

- One distinct photograph for every slide: 15 different photos across three five-slide carousels. Existing covers retained; all 12 interior photographs newly generated for their specific slide.
- White Nunito headlines increased from 68 to 80 px at Instagram size; supporting text from 35 to 42 px, with automatic line wrapping.
- Removed text shadows and blur; increased the dark backing behind text. All text drawn as vector glyphs at each final output size.
- Lossless PNG exports at 1080 × 1350 for Instagram and native 2160 × 2700 masters. The larger files rerender text at double resolution; they do not enlarge a screenshot or low-resolution text bitmap.
- Lossless previews. Open an individual PNG to inspect sharpness; contact sheets necessarily reduce each slide.

## Deliverables

`instagram-ready.zip`: 15 numbered 1080 × 1350 slide PNGs, captions, and alt text, organized by carousel.

`high-resolution.zip`: 15 numbered 2160 × 2700 slide PNGs, captions, and alt text.

Each carousel folder includes its five upload-ready PNGs, a high-resolution folder, original background photos, caption.txt, and alt-text.txt. `content.json` and `render.mjs` are editable sources; `qa.json` records output dimensions and typography. Regenerate with @napi-rs/canvas via CAROUSEL_CANVAS_MODULE if its local path changes.

The images are illustrative backgrounds created with the built-in image_gen tool, not customer photographs. Prompt and source provenance are retained in image-prompts.json. The user's preference against manually adding an AI-content label remains recorded; automatic platform labeling cannot be controlled. The first carousel was published on the user’s subsequent instruction; the other two were not published.

The Instagram findings in the previous version's INSTAGRAM-REVIEW.md remain the September 16 snapshot. This visual revision does not claim any new performance result.
