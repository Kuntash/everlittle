-- Marks a gifted archive. A lifetime archive keeps its stored allowance, is never offered
-- checkout, and is left untouched by subscription webhooks.
ALTER TABLE archive_subscription
ADD COLUMN lifetime INTEGER NOT NULL DEFAULT 0
CHECK (lifetime IN (0, 1));
