ALTER TABLE archive_subscription ADD COLUMN provider_event_at TEXT;

CREATE TABLE billing_webhook_event (
  id TEXT PRIMARY KEY NOT NULL,
  event_type TEXT NOT NULL,
  provider_subscription_id TEXT,
  event_timestamp TEXT NOT NULL,
  received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at TEXT
);

CREATE INDEX billing_webhook_subscription_idx
ON billing_webhook_event (provider_subscription_id);
