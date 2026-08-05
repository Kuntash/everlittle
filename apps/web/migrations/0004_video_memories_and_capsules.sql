-- Add first-class video memories while preserving every existing memory and media row.
-- D1 keeps foreign keys enabled, so both related tables are rebuilt in one deferred transaction.
PRAGMA defer_foreign_keys = on;

CREATE TABLE memory_next (
  id TEXT PRIMARY KEY NOT NULL,
  archive_id TEXT NOT NULL REFERENCES family_archive(id) ON DELETE CASCADE,
  child_id TEXT NOT NULL REFERENCES child_profile(id) ON DELETE CASCADE,
  created_by_user_id TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  kind TEXT NOT NULL CHECK (kind IN ('photo', 'story', 'voice', 'video', 'milestone', 'letter')),
  title TEXT NOT NULL,
  body TEXT,
  happened_at TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT 'family' CHECK (audience IN ('parents', 'family', 'child')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO memory_next
SELECT id, archive_id, child_id, created_by_user_id, kind, title, body, happened_at, audience,
       created_at, updated_at
FROM memory;

CREATE TABLE media_asset_next (
  id TEXT PRIMARY KEY NOT NULL,
  archive_id TEXT NOT NULL REFERENCES family_archive(id) ON DELETE CASCADE,
  memory_id TEXT REFERENCES memory_next(id) ON DELETE CASCADE,
  object_key TEXT NOT NULL UNIQUE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'audio', 'video')),
  content_type TEXT NOT NULL,
  byte_size INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO media_asset_next
SELECT id, archive_id, memory_id, object_key, media_type, content_type, byte_size, created_at
FROM media_asset;

DROP TABLE media_asset;
DROP TABLE memory;
ALTER TABLE memory_next RENAME TO memory;
ALTER TABLE media_asset_next RENAME TO media_asset;
CREATE INDEX memory_child_time_idx ON memory (child_id, happened_at DESC);

ALTER TABLE time_capsule ADD COLUMN body TEXT;
ALTER TABLE time_capsule ADD COLUMN audience TEXT NOT NULL DEFAULT 'child'
  CHECK (audience IN ('family', 'child'));
ALTER TABLE time_capsule ADD COLUMN updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX time_capsule_child_unlock_idx ON time_capsule (child_id, unlocks_at);

PRAGMA defer_foreign_keys = off;
