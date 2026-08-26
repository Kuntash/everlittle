ALTER TABLE archive_subscription
ADD COLUMN billing_interval TEXT CHECK (billing_interval IN ('monthly', 'yearly'));

ALTER TABLE archive_subscription
ADD COLUMN cancel_at_period_end INTEGER NOT NULL DEFAULT 0
CHECK (cancel_at_period_end IN (0, 1));
