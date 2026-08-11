ALTER TABLE family_invitation ADD COLUMN email_status TEXT NOT NULL DEFAULT 'not_sent';
ALTER TABLE family_invitation ADD COLUMN email_message_id TEXT;
ALTER TABLE family_invitation ADD COLUMN email_sent_at TEXT;
ALTER TABLE family_invitation ADD COLUMN email_last_attempt_at TEXT;
ALTER TABLE family_invitation ADD COLUMN email_attempt_count INTEGER NOT NULL DEFAULT 0;

