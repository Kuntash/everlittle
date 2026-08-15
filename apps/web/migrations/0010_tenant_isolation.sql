-- Make fragile tenant relationships explicit and reject cross-archive records at the database edge.
PRAGMA defer_foreign_keys = on;

CREATE TABLE time_capsule_scoped (
  id TEXT PRIMARY KEY NOT NULL,
  archive_id TEXT NOT NULL REFERENCES family_archive(id) ON DELETE CASCADE,
  child_id TEXT NOT NULL REFERENCES child_profile(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  unlocks_at TEXT NOT NULL,
  created_by_user_id TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  body TEXT,
  audience TEXT NOT NULL DEFAULT 'child' CHECK (audience IN ('family', 'child')),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO time_capsule_scoped
  (id, archive_id, child_id, title, unlocks_at, created_by_user_id, created_at, body, audience,
   updated_at)
SELECT tc.id, c.archive_id, tc.child_id, tc.title, tc.unlocks_at, tc.created_by_user_id,
       tc.created_at, tc.body, tc.audience, tc.updated_at
FROM time_capsule tc
JOIN child_profile c ON c.id = tc.child_id;

DROP TABLE time_capsule;
ALTER TABLE time_capsule_scoped RENAME TO time_capsule;
CREATE INDEX time_capsule_archive_child_unlock_idx
  ON time_capsule (archive_id, child_id, unlocks_at);

CREATE TABLE child_access_session_scoped (
  id TEXT PRIMARY KEY NOT NULL,
  archive_id TEXT NOT NULL REFERENCES family_archive(id) ON DELETE CASCADE,
  child_id TEXT NOT NULL REFERENCES child_profile(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at TEXT
);

INSERT INTO child_access_session_scoped
  (id, archive_id, child_id, token_hash, expires_at, created_at, last_seen_at, revoked_at)
SELECT cas.id, c.archive_id, cas.child_id, cas.token_hash, cas.expires_at, cas.created_at,
       cas.last_seen_at, cas.revoked_at
FROM child_access_session cas
JOIN child_profile c ON c.id = cas.child_id;

DROP TABLE child_access_session;
ALTER TABLE child_access_session_scoped RENAME TO child_access_session;
CREATE INDEX child_access_session_token_idx
  ON child_access_session (token_hash, archive_id, child_id, expires_at, revoked_at);

CREATE TRIGGER memory_archive_child_insert
BEFORE INSERT ON memory
WHEN NOT EXISTS (
  SELECT 1 FROM child_profile c WHERE c.id = NEW.child_id AND c.archive_id = NEW.archive_id
)
BEGIN
  SELECT RAISE(ABORT, 'memory archive does not match child');
END;

CREATE TRIGGER memory_archive_child_update
BEFORE UPDATE OF archive_id, child_id ON memory
WHEN NOT EXISTS (
  SELECT 1 FROM child_profile c WHERE c.id = NEW.child_id AND c.archive_id = NEW.archive_id
)
BEGIN
  SELECT RAISE(ABORT, 'memory archive does not match child');
END;

CREATE TRIGGER media_asset_archive_memory_insert
BEFORE INSERT ON media_asset
WHEN NEW.memory_id IS NOT NULL AND NOT EXISTS (
  SELECT 1 FROM memory m WHERE m.id = NEW.memory_id AND m.archive_id = NEW.archive_id
)
BEGIN
  SELECT RAISE(ABORT, 'media archive does not match memory');
END;

CREATE TRIGGER media_asset_archive_memory_update
BEFORE UPDATE OF archive_id, memory_id ON media_asset
WHEN NEW.memory_id IS NOT NULL AND NOT EXISTS (
  SELECT 1 FROM memory m WHERE m.id = NEW.memory_id AND m.archive_id = NEW.archive_id
)
BEGIN
  SELECT RAISE(ABORT, 'media archive does not match memory');
END;

CREATE TRIGGER media_asset_archive_key_insert
BEFORE INSERT ON media_asset
WHEN NEW.object_key NOT LIKE 'archives/' || NEW.archive_id || '/%'
BEGIN
  SELECT RAISE(ABORT, 'media object key is outside archive prefix');
END;

CREATE TRIGGER time_capsule_archive_child_insert
BEFORE INSERT ON time_capsule
WHEN NOT EXISTS (
  SELECT 1 FROM child_profile c WHERE c.id = NEW.child_id AND c.archive_id = NEW.archive_id
)
BEGIN
  SELECT RAISE(ABORT, 'capsule archive does not match child');
END;

CREATE TRIGGER time_capsule_archive_child_update
BEFORE UPDATE OF archive_id, child_id ON time_capsule
WHEN NOT EXISTS (
  SELECT 1 FROM child_profile c WHERE c.id = NEW.child_id AND c.archive_id = NEW.archive_id
)
BEGIN
  SELECT RAISE(ABORT, 'capsule archive does not match child');
END;

CREATE TRIGGER child_session_archive_child_insert
BEFORE INSERT ON child_access_session
WHEN NOT EXISTS (
  SELECT 1 FROM child_profile c WHERE c.id = NEW.child_id AND c.archive_id = NEW.archive_id
)
BEGIN
  SELECT RAISE(ABORT, 'child session archive does not match child');
END;

CREATE TRIGGER child_session_archive_child_update
BEFORE UPDATE OF archive_id, child_id ON child_access_session
WHEN NOT EXISTS (
  SELECT 1 FROM child_profile c WHERE c.id = NEW.child_id AND c.archive_id = NEW.archive_id
)
BEGIN
  SELECT RAISE(ABORT, 'child session archive does not match child');
END;

CREATE TRIGGER public_share_archive_memory_insert
BEFORE INSERT ON memory_public_share
WHEN NOT EXISTS (
  SELECT 1 FROM memory m WHERE m.id = NEW.memory_id AND m.archive_id = NEW.archive_id
)
BEGIN
  SELECT RAISE(ABORT, 'public share archive does not match memory');
END;

CREATE TRIGGER public_share_archive_memory_update
BEFORE UPDATE OF archive_id, memory_id ON memory_public_share
WHEN NOT EXISTS (
  SELECT 1 FROM memory m WHERE m.id = NEW.memory_id AND m.archive_id = NEW.archive_id
)
BEGIN
  SELECT RAISE(ABORT, 'public share archive does not match memory');
END;

PRAGMA defer_foreign_keys = off;
