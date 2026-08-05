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
  'demo-memory-story-v1', a.id, c.id, fm.user_id, 'story',
  'The way you wake up slowly',
  'First one eye, then the other. A long stretch, a serious little frown, and then the softest smile when you recognised us.',
  '2026-08-04T02:18:00.000Z', 'family'
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
