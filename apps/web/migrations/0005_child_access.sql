CREATE TABLE child_access_session (
  id TEXT PRIMARY KEY NOT NULL,
  child_id TEXT NOT NULL REFERENCES child_profile(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at TEXT
);
CREATE INDEX child_access_session_token_idx
  ON child_access_session (token_hash, expires_at, revoked_at);

CREATE TABLE child_access_attempt (
  id TEXT PRIMARY KEY NOT NULL,
  attempt_key TEXT NOT NULL,
  attempted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  succeeded INTEGER NOT NULL DEFAULT 0 CHECK (succeeded IN (0, 1))
);
CREATE INDEX child_access_attempt_key_time_idx
  ON child_access_attempt (attempt_key, attempted_at DESC);
