# Everlittle content archive

Start with `catalog.json` for published posts and `STRATEGY.md` for upcoming content. Each published folder preserves the uploaded media, exact caption, cover/alt text where available, and metadata. Source compositions remain in apps/hyperframes so the review gallery and editable projects keep working.

`library/` holds copies of unposted finished artwork/video variants; these are not published. `metrics.csv` is an append-only measurement log. Empty measurements mean unavailable, never zero. Append observations at comparable ages (24h, 72h, 7d); preserve previous observations. No automatic collection or scheduling is configured.

Record Instagram views, reach, likes, comments, saves, shares, watch time, and follows from Insights. For every snapshot record the observation time, post age, and source/evidence. Do not infer missing metrics from public counters. Save screenshots/exports in the corresponding post's evidence folder.

Compare saves/reach and shares/reach where reach > 0. Compare average watch time relative to clip length, noting looping can inflate it. Separate format, topic, hook, duration and CTA effects; these three initial posts are not a controlled test.

The shared bio UTM attributes Instagram bio traffic, not individual Reels. Track PostHog sessions/signups separately in channel-metrics.csv. Only assign post-level conversions when a distinct clickable Story/campaign URL provides evidence. Do not credit each post with the entire bio total.

Published files are historical snapshots: create a new version rather than overwriting them when content changes. Checksums in metadata identify the exact upload file. Dates are local Asia/Kolkata; exact publication timestamps are unknown unless separately recorded from Instagram.
