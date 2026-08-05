-- Reversible presentation fixtures. Remove with clear-demo-memories.sql.

INSERT OR IGNORE INTO memory
  (id, archive_id, child_id, created_by_user_id, kind, title, body, happened_at, audience)
SELECT
  'demo-memory-photo-v1', a.id, c.id, fm.user_id, 'photo',
  'Tiny fingers in the morning light',
  'You held on to one of Papa’s fingers with your whole hand. For a few quiet minutes, the room felt like the entire world.',
  '2026-08-05T07:42:00.000Z', 'child'
FROM family_archive a
JOIN child_profile c ON c.archive_id = a.id
JOIN family_member fm ON fm.archive_id = a.id AND fm.role = 'owner'
LIMIT 1;

INSERT OR IGNORE INTO memory
  (id, archive_id, child_id, created_by_user_id, kind, title, body, happened_at, audience)
SELECT
  'demo-memory-video-v1', a.id, c.id, fm.user_id, 'video',
  'A sleepy stretch in motion',
  'A few seconds of an ordinary morning—the kind of movement a photograph cannot quite hold.',
  '2026-08-03T05:22:00.000Z', 'child'
FROM family_archive a
JOIN child_profile c ON c.archive_id = a.id
JOIN family_member fm ON fm.archive_id = a.id AND fm.role = 'owner'
LIMIT 1;

INSERT OR IGNORE INTO memory
  (id, archive_id, child_id, created_by_user_id, kind, title, body, happened_at, audience)
SELECT
  'demo-memory-story-v1', a.id, c.id, fm.user_id, 'story',
  'The way you wake up slowly',
  'First one eye, then the other. A long stretch, a serious little frown, and then the softest smile when you recognised us.',
  '2026-08-04T02:18:00.000Z', 'family'
FROM family_archive a
JOIN child_profile c ON c.archive_id = a.id
JOIN family_member fm ON fm.archive_id = a.id AND fm.role = 'owner'
LIMIT 1;

INSERT OR IGNORE INTO time_capsule
  (id, child_id, title, body, unlocks_at, audience, created_by_user_id)
SELECT
  'demo-capsule-open-v1', c.id, 'The home you arrived in',
  'Diki, the rooms felt different after you came home. Everyone moved more softly, listened more closely, and learned that the smallest sounds could gather a whole family.',
  '2026-08-01T00:00:00.000Z', 'child', fm.user_id
FROM family_archive a
JOIN child_profile c ON c.archive_id = a.id
JOIN family_member fm ON fm.archive_id = a.id AND fm.role = 'owner'
LIMIT 1;

INSERT OR IGNORE INTO time_capsule
  (id, child_id, title, body, unlocks_at, audience, created_by_user_id)
SELECT
  'demo-capsule-locked-v1', c.id, 'For your eighteenth birthday',
  'This sample stays sealed. Its contents are deliberately absent from every API response until the unlock date.',
  '2044-07-23T03:30:00.000Z', 'child', fm.user_id
FROM family_archive a
JOIN child_profile c ON c.archive_id = a.id
JOIN family_member fm ON fm.archive_id = a.id AND fm.role = 'owner'
LIMIT 1;

INSERT OR IGNORE INTO memory
  (id, archive_id, child_id, created_by_user_id, kind, title, body, happened_at, audience)
SELECT
  'demo-memory-voice-v1', a.id, c.id, fm.user_id, 'voice',
  'A little sound we keep replaying',
  'Not quite a coo and not quite a sigh. The tiny sound you make when you are warm, full, and almost asleep.',
  '2026-08-02T14:06:00.000Z', 'parents'
FROM family_archive a
JOIN child_profile c ON c.archive_id = a.id
JOIN family_member fm ON fm.archive_id = a.id AND fm.role = 'owner'
LIMIT 1;

INSERT OR IGNORE INTO memory
  (id, archive_id, child_id, created_by_user_id, kind, title, body, happened_at, audience)
SELECT
  'demo-memory-milestone-v1', a.id, c.id, fm.user_id, 'milestone',
  'Two weeks of knowing you',
  'Fourteen days of learning your expressions, your rhythms, and all the ways such a small person can change a home.',
  '2026-08-05T03:30:00.000Z', 'child'
FROM family_archive a
JOIN child_profile c ON c.archive_id = a.id
JOIN family_member fm ON fm.archive_id = a.id AND fm.role = 'owner'
LIMIT 1;

INSERT OR IGNORE INTO memory
  (id, archive_id, child_id, created_by_user_id, kind, title, body, happened_at, audience)
SELECT
  'demo-memory-letter-v1', a.id, c.id, fm.user_id, 'letter',
  'For the days you need reminding',
  'Dear Diki, you were loved before we knew the sound of your voice. Nothing you become will ever make that love smaller.',
  '2026-08-01T11:15:00.000Z', 'child'
FROM family_archive a
JOIN child_profile c ON c.archive_id = a.id
JOIN family_member fm ON fm.archive_id = a.id AND fm.role = 'owner'
LIMIT 1;

INSERT OR IGNORE INTO media_asset
  (id, archive_id, memory_id, object_key, media_type, content_type, byte_size)
SELECT
  'demo-voice-asset-v1', a.id, 'demo-memory-voice-v1',
  'fixtures/demo-voice-sample-v1.m4a', 'audio', 'audio/mp4', 35507
FROM family_archive a
WHERE EXISTS (SELECT 1 FROM memory m WHERE m.id = 'demo-memory-voice-v1' AND m.archive_id = a.id)
LIMIT 1;

INSERT OR IGNORE INTO media_asset
  (id, archive_id, memory_id, object_key, media_type, content_type, byte_size)
SELECT
  'demo-video-asset-v1', a.id, 'demo-memory-video-v1',
  'fixtures/demo-video-sample-v1.mp4', 'video', 'video/mp4', 172051
FROM family_archive a
WHERE EXISTS (SELECT 1 FROM memory m WHERE m.id = 'demo-memory-video-v1' AND m.archive_id = a.id)
LIMIT 1;
