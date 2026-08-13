ALTER TABLE child_profile ADD COLUMN slug TEXT;

UPDATE child_profile
SET slug = 'child-' || lower(substr(replace(id, '-', ''), 1, 8))
WHERE slug IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS child_profile_archive_slug_idx
ON child_profile (archive_id, slug)
WHERE slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS family_archive_slug_idx ON family_archive (slug);
