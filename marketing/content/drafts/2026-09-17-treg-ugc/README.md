# Everlittle — first treg UGC clip

Complete: user chose presenter reference #1, character B and hook 2, and reduced the original batch to one clip. No publishing was requested or performed.

## Deliverables

- final/index.html: playable preview and downloads.
- final/baby-book-captioned.mp4: finished clip with header and phrase captions.
- final/baby-book-clean.mp4: original generated clip, no captions.
- final/baby-book.srt and final/baby-book.vtt: editable timed subtitles.
- final/manifest.json: dimensions, duration, file checksums and cost.
- bill.md: $3.56551 total spend, $7.43449 remaining.

13.04 seconds, 720 × 1280, 24 fps, H.264/AAC. One Seedance 2.5 take through treg. Full approved script is present according to local Whisper; brand transcription “Every little” corrected to “Everlittle” in captions. Audio packet hashes match the clean original. Final caption frames were visually inspected. Voice likeness and precise lip-sync were not independently verified by listening; delivery is brisk, about 270 words per minute over the measured speech span.

## Sources and reproduction

hooks.md and research/ retain the research and source evidence. hook-options.md retains ten proposed scripts. character/ retains both image options, the locked prompt and generation records. production/ retains the selected script, exact Seedance prompt/request, task and cost evidence, reference source timestamps, transcript, words and phrases, caption script, frame checks and QA report.

Reference audio: presenter #1, https://www.instagram.com/reel/DdCDoNNiD6v/, 10.92–20.25 seconds, mono MP3. Reference files hosted and byte-verified through treg’s documented /media endpoint using the existing CLI client; CLI 0.19.1 lacks treg host and the upgrade check found no newer release. All image/video generation used treg. Local whisper.cpp base.en supplied transcription and timestamps because no transcription key was configured and treg catalog searches found no suitable audio-timing endpoint. No extra API transcription charge.

The supplied caption script was adapted for the installed FFmpeg’s filter_complex interface and for a smaller header above the presenter’s head. Use the bundled Python with Pillow to rerender; captions use the saved words.json, so transcription need not be repeated. Source skill: https://raw.githubusercontent.com/superdesigndev/treg/main/.agents/skills/ugc-talking-head-video/SKILL.md.
