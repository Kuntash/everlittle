CREATE TABLE IF NOT EXISTS onboarding_draft (
  user_id TEXT PRIMARY KEY NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  family_name TEXT,
  family_slug TEXT,
  child_name TEXT,
  child_birth_date TEXT,
  timezone TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
