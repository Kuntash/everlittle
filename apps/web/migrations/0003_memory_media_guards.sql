PRAGMA foreign_keys = ON;

CREATE INDEX IF NOT EXISTS memory_archive_time_idx
  ON memory (archive_id, happened_at DESC, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS media_asset_memory_unique_idx
  ON media_asset (memory_id)
  WHERE memory_id IS NOT NULL;
