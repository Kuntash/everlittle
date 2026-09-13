CREATE TABLE acquisition_snapshot (
  user_id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  snapshot TEXT NOT NULL,
  signup_recorded INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE analytics_outbox (
  event_key TEXT PRIMARY KEY,
  uuid TEXT NOT NULL,
  event_name TEXT NOT NULL,
  distinct_id TEXT NOT NULL,
  properties TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  delivered_at TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX analytics_outbox_pending ON analytics_outbox(delivered_at, next_attempt_at);
CREATE TABLE analytics_projection (
  id INTEGER PRIMARY KEY CHECK(id=1),
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO analytics_projection(id) VALUES(1);
CREATE TABLE measured_payment (
  payment_id TEXT NOT NULL,
  environment TEXT NOT NULL,
  archive_id TEXT NOT NULL REFERENCES family_archive(id) ON DELETE CASCADE,
  owner_user_id TEXT NOT NULL,
  amount_minor INTEGER NOT NULL,
  currency TEXT NOT NULL,
  paid_at TEXT NOT NULL,
  PRIMARY KEY(payment_id, environment)
);
