import { env } from "cloudflare:workers";
import { beforeAll, describe, expect, it } from "vitest";

const ARCHIVE_A = "00000000-0000-4000-8000-00000000000a";
const ARCHIVE_B = "00000000-0000-4000-8000-00000000000b";
const CHILD_A = "10000000-0000-4000-8000-00000000000a";
const CHILD_B = "10000000-0000-4000-8000-00000000000b";
const MEMORY_A = "20000000-0000-4000-8000-00000000000a";
const MEMORY_B = "20000000-0000-4000-8000-00000000000b";
const USER_A = "30000000-0000-4000-8000-00000000000a";
const USER_B = "30000000-0000-4000-8000-00000000000b";

beforeAll(async () => {
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO "user" (id, name, email, "emailVerified") VALUES (?, ?, ?, 1)`,
    ).bind(USER_A, "Owner A", "owner-a@example.com"),
    env.DB.prepare(
      `INSERT INTO "user" (id, name, email, "emailVerified") VALUES (?, ?, ?, 1)`,
    ).bind(USER_B, "Owner B", "owner-b@example.com"),
    env.DB.prepare(
      "INSERT INTO family_archive (id, name, slug) VALUES (?, 'Family A', 'family-a')",
    ).bind(ARCHIVE_A),
    env.DB.prepare(
      "INSERT INTO family_archive (id, name, slug) VALUES (?, 'Family B', 'family-b')",
    ).bind(ARCHIVE_B),
    env.DB.prepare(
      `INSERT INTO family_member (id, archive_id, user_id, role)
       VALUES ('member-a', ?, ?, 'owner')`,
    ).bind(ARCHIVE_A, USER_A),
    env.DB.prepare(
      `INSERT INTO family_member (id, archive_id, user_id, role)
       VALUES ('member-b', ?, ?, 'owner')`,
    ).bind(ARCHIVE_B, USER_B),
    env.DB.prepare(
      `INSERT INTO child_profile (id, archive_id, slug, display_name, birth_date)
       VALUES (?, ?, 'child-a', 'Child A', '2020-01-01')`,
    ).bind(CHILD_A, ARCHIVE_A),
    env.DB.prepare(
      `INSERT INTO child_profile (id, archive_id, slug, display_name, birth_date)
       VALUES (?, ?, 'child-b', 'Child B', '2021-01-01')`,
    ).bind(CHILD_B, ARCHIVE_B),
    env.DB.prepare(
      `INSERT INTO memory
        (id, archive_id, child_id, created_by_user_id, kind, title, happened_at, audience)
       VALUES (?, ?, ?, ?, 'story', 'Memory A', CURRENT_TIMESTAMP, 'family')`,
    ).bind(MEMORY_A, ARCHIVE_A, CHILD_A, USER_A),
    env.DB.prepare(
      `INSERT INTO memory
        (id, archive_id, child_id, created_by_user_id, kind, title, happened_at, audience)
       VALUES (?, ?, ?, ?, 'story', 'Memory B', CURRENT_TIMESTAMP, 'family')`,
    ).bind(MEMORY_B, ARCHIVE_B, CHILD_B, USER_B),
  ]);
});

describe("tenant consistency guards", () => {
  it("rejects memories attached to a child in another archive", async () => {
    await expect(
      env.DB.prepare(
        `INSERT INTO memory
          (id, archive_id, child_id, kind, title, happened_at, audience)
         VALUES ('cross-memory', ?, ?, 'story', 'Blocked', CURRENT_TIMESTAMP, 'family')`,
      )
        .bind(ARCHIVE_A, CHILD_B)
        .run(),
    ).rejects.toThrow(/archive does not match child/);
  });

  it("rejects media metadata and object keys outside the owning archive", async () => {
    await expect(
      env.DB.prepare(
        `INSERT INTO media_asset
          (id, archive_id, memory_id, object_key, media_type, content_type, byte_size)
         VALUES ('cross-media', ?, ?, ?, 'image', 'image/jpeg', 12)`,
      )
        .bind(ARCHIVE_A, MEMORY_B, `archives/${ARCHIVE_A}/${MEMORY_B}/cross-media.jpg`)
        .run(),
    ).rejects.toThrow(/archive does not match memory/);

    await expect(
      env.DB.prepare(
        `INSERT INTO media_asset
          (id, archive_id, memory_id, object_key, media_type, content_type, byte_size)
         VALUES ('bad-key', ?, ?, 'legacy/key.jpg', 'image', 'image/jpeg', 12)`,
      )
        .bind(ARCHIVE_A, MEMORY_A)
        .run(),
    ).rejects.toThrow(/outside archive prefix/);
  });

  it("rejects capsules and child sessions attached across archives", async () => {
    await expect(
      env.DB.prepare(
        `INSERT INTO time_capsule
          (id, archive_id, child_id, title, unlocks_at, body, audience)
         VALUES ('cross-capsule', ?, ?, 'Blocked', datetime('now', '+1 day'), 'Secret', 'child')`,
      )
        .bind(ARCHIVE_A, CHILD_B)
        .run(),
    ).rejects.toThrow(/archive does not match child/);

    await expect(
      env.DB.prepare(
        `INSERT INTO child_access_session
          (id, archive_id, child_id, token_hash, expires_at)
         VALUES ('cross-session', ?, ?, 'cross-session-token', datetime('now', '+1 day'))`,
      )
        .bind(ARCHIVE_A, CHILD_B)
        .run(),
    ).rejects.toThrow(/archive does not match child/);
  });

  it("rejects public shares for a memory in another archive", async () => {
    await expect(
      env.DB.prepare(
        `INSERT INTO memory_public_share
          (id, archive_id, memory_id, token_hash, expires_at)
         VALUES ('cross-share', ?, ?, 'cross-share-token', datetime('now', '+1 day'))`,
      )
        .bind(ARCHIVE_A, MEMORY_B)
        .run(),
    ).rejects.toThrow(/archive does not match memory/);
  });

  it("accepts correctly scoped tenant records", async () => {
    const results = await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO time_capsule
          (id, archive_id, child_id, title, unlocks_at, body, audience)
         VALUES ('valid-capsule', ?, ?, 'Later', datetime('now', '+1 day'), 'Secret', 'child')`,
      ).bind(ARCHIVE_A, CHILD_A),
      env.DB.prepare(
        `INSERT INTO child_access_session
          (id, archive_id, child_id, token_hash, expires_at)
         VALUES ('valid-session', ?, ?, 'valid-session-token', datetime('now', '+1 day'))`,
      ).bind(ARCHIVE_A, CHILD_A),
      env.DB.prepare(
        `INSERT INTO media_asset
          (id, archive_id, memory_id, object_key, media_type, content_type, byte_size)
         VALUES ('valid-media', ?, ?, ?, 'image', 'image/jpeg', 12)`,
      ).bind(ARCHIVE_A, MEMORY_A, `archives/${ARCHIVE_A}/${MEMORY_A}/valid-media.jpg`),
      env.DB.prepare(
        `INSERT INTO memory_public_share
          (id, archive_id, memory_id, token_hash, expires_at)
         VALUES ('valid-share', ?, ?, 'valid-share-token', datetime('now', '+1 day'))`,
      ).bind(ARCHIVE_A, MEMORY_A),
    ]);

    expect(results.every((result) => result.success)).toBe(true);
  });
});
