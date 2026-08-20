ALTER TABLE child_profile
ADD COLUMN profile_kind TEXT NOT NULL DEFAULT 'child'
CHECK (profile_kind IN ('child', 'vault'));

ALTER TABLE onboarding_draft
ADD COLUMN profile_kind TEXT NOT NULL DEFAULT 'child'
CHECK (profile_kind IN ('child', 'vault'));
