PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS family_invitation (
  id TEXT PRIMARY KEY NOT NULL,
  archive_id TEXT NOT NULL REFERENCES family_archive(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('parent', 'contributor', 'viewer')),
  token_hash TEXT NOT NULL UNIQUE,
  invited_by_user_id TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  accepted_by_user_id TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  expires_at TEXT NOT NULL,
  accepted_at TEXT,
  revoked_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS family_invitation_archive_idx
  ON family_invitation (archive_id, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS family_invitation_active_email_idx
  ON family_invitation (archive_id, email)
  WHERE accepted_at IS NULL AND revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS audit_event (
  id TEXT PRIMARY KEY NOT NULL,
  archive_id TEXT NOT NULL REFERENCES family_archive(id) ON DELETE CASCADE,
  actor_user_id TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata_json TEXT,
  occurred_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS audit_event_archive_time_idx
  ON audit_event (archive_id, occurred_at DESC);

