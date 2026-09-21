CREATE TABLE media_upload (
  id TEXT PRIMARY KEY,
  archive_id TEXT NOT NULL REFERENCES family_archive(id) ON DELETE CASCADE,
  memory_id TEXT NOT NULL REFERENCES memory(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  object_key TEXT NOT NULL,
  upload_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  byte_size INTEGER NOT NULL,
  part_size INTEGER NOT NULL,
  replace_id TEXT,
  state TEXT NOT NULL DEFAULT 'uploading',
  expires_at INTEGER NOT NULL
);
CREATE INDEX media_upload_memory_idx ON media_upload(memory_id);
CREATE TABLE media_upload_part (
  session_id TEXT NOT NULL REFERENCES media_upload(id) ON DELETE CASCADE,
  part_number INTEGER NOT NULL,
  etag TEXT NOT NULL,
  PRIMARY KEY(session_id, part_number)
);
