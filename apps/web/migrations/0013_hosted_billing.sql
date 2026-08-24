ALTER TABLE media_asset
ADD COLUMN thumbnail_byte_size INTEGER NOT NULL DEFAULT 0
CHECK (thumbnail_byte_size >= 0);

CREATE TABLE archive_subscription (
  archive_id TEXT PRIMARY KEY NOT NULL REFERENCES family_archive(id) ON DELETE CASCADE,
  plan_key TEXT NOT NULL DEFAULT 'family' CHECK (plan_key IN ('family')),
  status TEXT NOT NULL DEFAULT 'complimentary'
    CHECK (status IN ('active', 'canceled', 'complimentary', 'past_due', 'trialing')),
  storage_limit_bytes INTEGER NOT NULL CHECK (storage_limit_bytes > 0),
  provider_customer_id TEXT,
  provider_subscription_id TEXT,
  trial_ends_at TEXT,
  current_period_ends_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX archive_subscription_provider_customer_idx
ON archive_subscription (provider_customer_id)
WHERE provider_customer_id IS NOT NULL;

CREATE UNIQUE INDEX archive_subscription_provider_subscription_idx
ON archive_subscription (provider_subscription_id)
WHERE provider_subscription_id IS NOT NULL;

-- Existing archives retain uninterrupted access while hosted checkout is connected.
INSERT INTO archive_subscription (archive_id, plan_key, status, storage_limit_bytes)
SELECT id, 'family', 'complimentary', 26843545600 FROM family_archive;
