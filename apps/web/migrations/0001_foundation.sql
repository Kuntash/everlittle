PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS "user" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" INTEGER NOT NULL DEFAULT 0,
  "image" TEXT,
  "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "session" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "expiresAt" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "session" ("userId");

CREATE TABLE IF NOT EXISTS "account" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TEXT,
  "refreshTokenExpiresAt" TEXT,
  "scope" TEXT,
  "password" TEXT,
  "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "account" ("userId");

CREATE TABLE IF NOT EXISTS "verification" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TEXT NOT NULL,
  "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification" ("identifier");

CREATE TABLE IF NOT EXISTS family_archive (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS family_member (
  id TEXT PRIMARY KEY NOT NULL,
  archive_id TEXT NOT NULL REFERENCES family_archive(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'parent', 'contributor', 'viewer')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (archive_id, user_id)
);
CREATE INDEX IF NOT EXISTS family_member_user_idx ON family_member (user_id, archive_id);

CREATE TABLE IF NOT EXISTS child_profile (
  id TEXT PRIMARY KEY NOT NULL,
  archive_id TEXT NOT NULL REFERENCES family_archive(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  avatar_asset_key TEXT,
  access_pin_hash TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS memory (
  id TEXT PRIMARY KEY NOT NULL,
  archive_id TEXT NOT NULL REFERENCES family_archive(id) ON DELETE CASCADE,
  child_id TEXT NOT NULL REFERENCES child_profile(id) ON DELETE CASCADE,
  created_by_user_id TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  kind TEXT NOT NULL CHECK (kind IN ('photo', 'story', 'voice', 'milestone', 'letter')),
  title TEXT NOT NULL,
  body TEXT,
  happened_at TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT 'family' CHECK (audience IN ('parents', 'family', 'child')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS memory_child_time_idx ON memory (child_id, happened_at DESC);

CREATE TABLE IF NOT EXISTS media_asset (
  id TEXT PRIMARY KEY NOT NULL,
  archive_id TEXT NOT NULL REFERENCES family_archive(id) ON DELETE CASCADE,
  memory_id TEXT REFERENCES memory(id) ON DELETE CASCADE,
  object_key TEXT NOT NULL UNIQUE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'audio', 'video')),
  content_type TEXT NOT NULL,
  byte_size INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS time_capsule (
  id TEXT PRIMARY KEY NOT NULL,
  child_id TEXT NOT NULL REFERENCES child_profile(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  unlocks_at TEXT NOT NULL,
  created_by_user_id TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

