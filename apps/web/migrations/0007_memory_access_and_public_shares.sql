-- Add an explicit family + child audience and revocable public memory links.
PRAGMA defer_foreign_keys = on;

CREATE TABLE memory_with_all_access (
  id TEXT PRIMARY KEY NOT NULL,
  archive_id TEXT NOT NULL REFERENCES family_archive(id) ON DELETE CASCADE,
  child_id TEXT NOT NULL REFERENCES child_profile(id) ON DELETE CASCADE,
  created_by_user_id TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  kind TEXT NOT NULL CHECK (kind IN ('photo', 'story', 'voice', 'video', 'milestone', 'letter')),
  title TEXT NOT NULL,
  body TEXT,
  happened_at TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT 'family'
    CHECK (audience IN ('parents', 'family', 'child', 'all')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO memory_with_all_access
SELECT id, archive_id, child_id, created_by_user_id, kind, title, body, happened_at, audience,
       created_at, updated_at
FROM memory;

CREATE TABLE media_asset_with_all_access (
  id TEXT PRIMARY KEY NOT NULL,
  archive_id TEXT NOT NULL REFERENCES family_archive(id) ON DELETE CASCADE,
  memory_id TEXT REFERENCES memory_with_all_access(id) ON DELETE CASCADE,
  object_key TEXT NOT NULL UNIQUE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'audio', 'video')),
  content_type TEXT NOT NULL,
  byte_size INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO media_asset_with_all_access
SELECT id, archive_id, memory_id, object_key, media_type, content_type, byte_size, created_at
FROM media_asset;

DROP TABLE media_asset;
DROP TABLE memory;
ALTER TABLE memory_with_all_access RENAME TO memory;
ALTER TABLE media_asset_with_all_access RENAME TO media_asset;

CREATE INDEX memory_child_time_idx ON memory (child_id, happened_at DESC);
CREATE INDEX memory_archive_time_idx ON memory (archive_id, happened_at DESC, created_at DESC);
CREATE UNIQUE INDEX media_asset_memory_unique_idx ON media_asset (memory_id)
  WHERE memory_id IS NOT NULL;

CREATE TABLE memory_public_share (
  id TEXT PRIMARY KEY NOT NULL,
  archive_id TEXT NOT NULL REFERENCES family_archive(id) ON DELETE CASCADE,
  memory_id TEXT NOT NULL REFERENCES memory(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  created_by_user_id TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX memory_public_share_lookup_idx
  ON memory_public_share (token_hash, expires_at, revoked_at);
CREATE INDEX memory_public_share_memory_idx
  ON memory_public_share (memory_id, created_at DESC);

PRAGMA defer_foreign_keys = off;
