import { env } from "cloudflare:workers";
import { applyD1Migrations } from "cloudflare:test";
import { expect, it } from "vitest";

const testEnv = env as typeof env & {
  TEST_MIGRATIONS: Parameters<typeof applyD1Migrations>[1];
  UPGRADE_DB: D1Database;
};

it("backfills tenant ownership for existing capsules and child sessions", async () => {
  const isolationIndex = testEnv.TEST_MIGRATIONS.findIndex((migration) =>
    migration.name.includes("0010_tenant_isolation"),
  );
  expect(isolationIndex).toBeGreaterThan(0);
  const earlierMigrations = testEnv.TEST_MIGRATIONS.slice(0, isolationIndex);
  const isolationAndLaterMigrations = testEnv.TEST_MIGRATIONS.slice(isolationIndex);
  await applyD1Migrations(testEnv.UPGRADE_DB, earlierMigrations);

  await testEnv.UPGRADE_DB.batch([
    testEnv.UPGRADE_DB.prepare(
      "INSERT INTO family_archive (id, name, slug) VALUES ('archive', 'Family', 'family')",
    ),
    testEnv.UPGRADE_DB.prepare(
      `INSERT INTO child_profile (id, archive_id, slug, display_name, birth_date)
       VALUES ('child', 'archive', 'child', 'Child', '2020-01-01')`,
    ),
    testEnv.UPGRADE_DB.prepare(
      `INSERT INTO time_capsule (id, child_id, title, unlocks_at, body, audience)
       VALUES ('capsule', 'child', 'Later', datetime('now', '+1 day'), 'Secret', 'child')`,
    ),
    testEnv.UPGRADE_DB.prepare(
      `INSERT INTO child_access_session (id, child_id, token_hash, expires_at)
       VALUES ('session', 'child', 'existing-session-token', datetime('now', '+1 day'))`,
    ),
  ]);

  await applyD1Migrations(testEnv.UPGRADE_DB, isolationAndLaterMigrations);

  const capsule = await testEnv.UPGRADE_DB.prepare(
    "SELECT archive_id AS archiveId FROM time_capsule WHERE id = 'capsule'",
  ).first<{ archiveId: string }>();
  const session = await testEnv.UPGRADE_DB.prepare(
    "SELECT archive_id AS archiveId FROM child_access_session WHERE id = 'session'",
  ).first<{ archiveId: string }>();

  expect(capsule?.archiveId).toBe("archive");
  expect(session?.archiveId).toBe("archive");
});
