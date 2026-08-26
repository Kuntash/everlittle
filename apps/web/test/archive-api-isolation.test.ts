import { env, exports } from "cloudflare:workers";
import { beforeAll, describe, expect, it, vi } from "vitest";

const ORIGIN = "http://localhost:3000";
const PASSWORD = "correct-horse-battery-staple";

type TestFamily = {
  archiveId: string;
  childId: string;
  childSlug: string;
  cookie: string;
  mediaId: string;
  memberId: string;
  memoryId: string;
  slug: string;
  userId: string;
};
type TestAccount = { cookie: string; userId: string };

let familyA: TestFamily;
let familyB: TestFamily;
let parent: TestAccount;
let contributor: TestAccount;
let viewer: TestAccount;
let childCookie: string;

beforeAll(async () => {
  familyA = await createFamily("owner-a-api@example.com", "Family Alpha", "family-alpha");
  familyB = await createFamily("owner-b-api@example.com", "Family Beta", "family-beta");
  parent = await signUpAccount("parent-api@example.com", "Parent");
  contributor = await signUpAccount("contributor-api@example.com", "Contributor");
  viewer = await signUpAccount("viewer-api@example.com", "Viewer");

  await env.DB.batch([
    membership("parent-member", parent.userId, "parent"),
    membership("contributor-member", contributor.userId, "contributor"),
    membership("viewer-member", viewer.userId, "viewer"),
  ]);

  const memory = await api(familyB, `/api/families/${familyB.slug}/archive/memories`, {
    body: JSON.stringify({
      audience: "family",
      childId: familyB.childId,
      happenedAt: new Date().toISOString(),
      kind: "story",
      title: "Beta memory",
    }),
    method: "POST",
  });
  expect(memory.status).toBe(201);
  familyB.memoryId = ((await memory.json()) as { id: string }).id;
  familyB.mediaId = crypto.randomUUID();
  const objectKey = `archives/${familyB.archiveId}/${familyB.memoryId}/${familyB.mediaId}.jpg`;
  await env.MEDIA.put(objectKey, new Uint8Array([1, 2, 3]), {
    httpMetadata: { contentType: "image/jpeg" },
  });
  await env.DB.prepare(
    `INSERT INTO media_asset
      (id, archive_id, memory_id, object_key, media_type, content_type, byte_size)
     VALUES (?, ?, ?, ?, 'image', 'image/jpeg', 3)`,
  )
    .bind(familyB.mediaId, familyB.archiveId, familyB.memoryId, objectKey)
    .run();

  const pin = await api(
    familyA,
    `/api/families/${familyA.slug}/archive/children/${familyA.childId}/access-pin`,
    { body: JSON.stringify({ pin: "123456" }), method: "PUT" },
  );
  expect(pin.status).toBe(200);

  for (const audience of ["family", "all"] as const) {
    const response = await api(familyA, `/api/families/${familyA.slug}/archive/memories`, {
      body: JSON.stringify({
        audience,
        childId: familyA.childId,
        happenedAt: new Date().toISOString(),
        kind: "story",
        title: `${audience} memory`,
      }),
      method: "POST",
    });
    expect(response.status).toBe(201);
  }

  const childSignIn = await exports.default.fetch(
    new Request(`${ORIGIN}/api/families/${familyA.slug}/children/${familyA.childSlug}/sign-in`, {
      body: JSON.stringify({ pin: "123456" }),
      headers: { "content-type": "application/json", origin: ORIGIN },
      method: "POST",
    }),
  );
  expect(childSignIn.status).toBe(200);
  childCookie =
    childSignIn.headers.get("set-cookie")?.match(/everlittle\.child_session=[^;]+/)?.[0] ?? "";
  expect(childCookie).toBeTruthy();
});

describe("route-scoped tenant isolation", () => {
  it("rejects a second signup for an existing account", async () => {
    const existing = await env.DB.prepare('SELECT id FROM "user" WHERE lower(email) = ?')
      .bind("parent-api@example.com")
      .first<{ id: string }>();
    expect(existing?.id).toBe(parent.userId);

    const response = await exports.default.fetch(
      new Request(`${ORIGIN}/api/auth/sign-up/email`, {
        body: JSON.stringify({
          email: "PARENT-API@example.com",
          name: "Another Parent",
          password: PASSWORD,
        }),
        headers: { "content-type": "application/json", origin: ORIGIN },
        method: "POST",
      }),
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toMatchObject({ code: "ACCOUNT_ALREADY_EXISTS" });
  });

  it("does not let an adult read another family archive", async () => {
    const response = await api(familyA, `/api/families/${familyB.slug}/archive`);
    expect(response.status).toBe(401);
  });

  it("does not accept a child ID from another family", async () => {
    const response = await api(familyA, `/api/families/${familyA.slug}/archive/memories`, {
      body: JSON.stringify({
        audience: "family",
        childId: familyB.childId,
        happenedAt: new Date().toISOString(),
        kind: "story",
        title: "Cross-family write",
      }),
      method: "POST",
    });
    expect(response.status).toBe(404);
  });

  it("does not let an adult upload media to another family's memory", async () => {
    const response = await api(
      familyA,
      `/api/families/${familyA.slug}/archive/memories/${familyB.memoryId}/media`,
      {
        body: new Uint8Array([1, 2, 3]),
        headers: { "content-length": "3", "content-type": "image/jpeg" },
        method: "PUT",
      },
    );
    expect(response.status).toBe(404);
  });

  it("does not let an adult manage another family's invitations", async () => {
    const response = await api(familyA, `/api/families/${familyB.slug}/archive/invitations`, {
      body: JSON.stringify({ email: "relative@example.com", role: "viewer" }),
      method: "POST",
    });
    expect(response.status).toBe(401);
  });

  it("does not let an adult share another family's memory", async () => {
    const response = await api(
      familyA,
      `/api/families/${familyA.slug}/archive/memories/${familyB.memoryId}/share`,
      { method: "POST" },
    );
    expect(response.status).toBe(404);
  });

  it("does not let an owner mutate another family's member ID", async () => {
    const response = await api(
      familyA,
      `/api/families/${familyA.slug}/archive/members/${familyB.memberId}`,
      { body: JSON.stringify({ role: "viewer" }), method: "PATCH" },
    );
    expect(response.status).toBe(404);
  });

  it("authorizes media metadata before opening the R2 object", async () => {
    const response = await api(familyA, `/api/families/${familyA.slug}/media/${familyB.mediaId}`);
    expect(response.status).toBe(404);
  });

  it("streams only the requested byte range for authorized media", async () => {
    const response = await api(familyB, `/api/families/${familyB.slug}/media/${familyB.mediaId}`, {
      headers: { range: "bytes=1-2" },
    });

    expect(response.status).toBe(206);
    expect(response.headers.get("accept-ranges")).toBe("bytes");
    expect(response.headers.get("content-range")).toBe("bytes 1-2/3");
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(new Uint8Array([2, 3]));
  });

  it("stores and privately serves a generated video thumbnail", async () => {
    const memory = await api(familyB, `/api/families/${familyB.slug}/archive/memories`, {
      body: JSON.stringify({
        audience: "family",
        childId: familyB.childId,
        happenedAt: new Date().toISOString(),
        kind: "video",
        title: "Video with thumbnail",
      }),
      method: "POST",
    });
    expect(memory.status).toBe(201);
    const memoryId = ((await memory.json()) as { id: string }).id;

    const video = await api(
      familyB,
      `/api/families/${familyB.slug}/archive/memories/${memoryId}/media`,
      {
        body: new Uint8Array([0, 1, 2, 3]),
        headers: { "content-length": "4", "content-type": "video/mp4" },
        method: "PUT",
      },
    );
    expect(video.status).toBe(201);
    const mediaId = ((await video.json()) as { id: string }).id;

    const thumbnail = await api(
      familyB,
      `/api/families/${familyB.slug}/archive/memories/${memoryId}/media/thumbnail`,
      {
        body: new Uint8Array([4, 5, 6]),
        headers: { "content-length": "3", "content-type": "image/jpeg" },
        method: "PUT",
      },
    );
    expect(thumbnail.status).toBe(201);

    const visible = await api(familyB, `/api/families/${familyB.slug}/media/${mediaId}/thumbnail`);
    expect(visible.status).toBe(200);
    expect(visible.headers.get("content-type")).toBe("image/jpeg");
    expect(new Uint8Array(await visible.arrayBuffer())).toEqual(new Uint8Array([4, 5, 6]));

    const hidden = await api(familyA, `/api/families/${familyA.slug}/media/${mediaId}/thumbnail`);
    expect(hidden.status).toBe(404);

    const archive = await api(familyB, `/api/families/${familyB.slug}/archive`);
    const state = (await archive.json()) as {
      billing: { limitBytes: number; plan: string; status: string; usedBytes: number };
    };
    expect(state.billing).toMatchObject({
      limitBytes: 25 * 1024 * 1024 * 1024,
      plan: "family",
      status: "complimentary",
      usedBytes: 10,
    });
  });

  it("rejects hosted media that would exceed the archive allowance", async () => {
    const usage = await env.DB.prepare(
      "SELECT COALESCE(SUM(byte_size + thumbnail_byte_size), 0) AS bytes FROM media_asset WHERE archive_id = ?",
    )
      .bind(familyB.archiveId)
      .first<{ bytes: number }>();
    await env.DB.prepare(
      "UPDATE archive_subscription SET storage_limit_bytes = ? WHERE archive_id = ?",
    )
      .bind(Number(usage?.bytes ?? 0) + 1, familyB.archiveId)
      .run();

    const memory = await api(familyB, `/api/families/${familyB.slug}/archive/memories`, {
      body: JSON.stringify({
        audience: "family",
        childId: familyB.childId,
        happenedAt: new Date().toISOString(),
        kind: "photo",
        title: "Over quota",
      }),
      method: "POST",
    });
    const memoryId = ((await memory.json()) as { id: string }).id;
    const upload = await api(
      familyB,
      `/api/families/${familyB.slug}/archive/memories/${memoryId}/media`,
      {
        body: new Uint8Array([1, 2]),
        headers: { "content-length": "2", "content-type": "image/jpeg" },
        method: "PUT",
      },
    );
    expect(upload.status).toBe(413);
    expect(await upload.json()).toEqual({
      error: "This upload would exceed your family's 25 GB storage allowance.",
    });

    await env.DB.prepare(
      "UPDATE archive_subscription SET storage_limit_bytes = ? WHERE archive_id = ?",
    )
      .bind(25 * 1024 * 1024 * 1024, familyB.archiveId)
      .run();
  });

  it("resolves every invitation token to one exact archive", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const tokens: string[] = [];
    try {
      for (const family of [familyA, familyB]) {
        const response = await api(family, `/api/families/${family.slug}/archive/invitations`, {
          body: JSON.stringify({ email: "relative@example.com", role: "viewer" }),
          method: "POST",
        });
        expect(response.status).toBe(201);
        const payload = (await response.json()) as { invitationUrl: string };
        tokens.push(new URL(payload.invitationUrl).pathname.split("/").at(-1)!);
      }
      expect(tokens[0]).not.toBe(tokens[1]);

      for (const [index, token] of tokens.entries()) {
        const preview = await exports.default.fetch(
          new Request(`${ORIGIN}/api/invitations/preview?token=${encodeURIComponent(token)}`),
        );
        expect(preview.status).toBe(200);
        const payload = (await preview.json()) as { archiveName: string };
        expect(payload.archiveName).toBe(index === 0 ? "Family Alpha" : "Family Beta");
      }
    } finally {
      consoleError.mockRestore();
    }
  });

  it("exposes only the one memory authorized by a public share", async () => {
    const share = await api(
      familyB,
      `/api/families/${familyB.slug}/archive/memories/${familyB.memoryId}/share`,
      { method: "POST" },
    );
    expect(share.status).toBe(201);
    const { shareUrl } = (await share.json()) as { shareUrl: string };
    const page = await exports.default.fetch(new Request(shareUrl));
    expect(page.status).toBe(200);
    const html = await page.text();
    expect(html).toContain("Beta memory");
    expect(html).not.toContain("Alpha memory");
  });

  it("keeps valid same-family reads and writes working", async () => {
    const state = await api(familyA, `/api/families/${familyA.slug}/archive`);
    expect(state.status).toBe(200);

    const memory = await api(familyA, `/api/families/${familyA.slug}/archive/memories`, {
      body: JSON.stringify({
        audience: "all",
        childId: familyA.childId,
        happenedAt: new Date().toISOString(),
        kind: "story",
        title: "Alpha memory",
      }),
      method: "POST",
    });
    expect(memory.status).toBe(201);
  });
});

describe("role permission regressions", () => {
  it("allows owners and parents to create parent-only memories", async () => {
    for (const account of [familyA, parent]) {
      const response = await api(
        { ...familyA, cookie: account.cookie },
        `/api/families/${familyA.slug}/archive/memories`,
        {
          body: memoryBody("parents", `${account === familyA ? "Owner" : "Parent"} memory`),
          method: "POST",
        },
      );
      expect(response.status).toBe(201);
    }
  });

  it("allows contributors to add family memories but not parent-only memories", async () => {
    const contributorFamily = { ...familyA, cookie: contributor.cookie };
    const familyMemory = await api(
      contributorFamily,
      `/api/families/${familyA.slug}/archive/memories`,
      { body: memoryBody("family", "Contributor memory"), method: "POST" },
    );
    expect(familyMemory.status).toBe(201);

    const parentMemory = await api(
      contributorFamily,
      `/api/families/${familyA.slug}/archive/memories`,
      { body: memoryBody("parents", "Blocked contributor memory"), method: "POST" },
    );
    expect(parentMemory.status).toBe(403);
  });

  it("keeps viewers read-only", async () => {
    const response = await api(
      { ...familyA, cookie: viewer.cookie },
      `/api/families/${familyA.slug}/archive/memories`,
      { body: memoryBody("family", "Blocked viewer memory"), method: "POST" },
    );
    expect(response.status).toBe(403);
  });

  it("shows child sessions only memories addressed to the child", async () => {
    const response = await exports.default.fetch(
      new Request(`${ORIGIN}/api/families/${familyA.slug}/children/${familyA.childSlug}/archive`, {
        headers: { cookie: childCookie },
      }),
    );
    expect(response.status).toBe(200);
    const payload = (await response.json()) as { memories: Array<{ audience: string }> };
    expect(payload.memories.length).toBeGreaterThan(0);
    expect(payload.memories.every((memory) => ["all", "child"].includes(memory.audience))).toBe(
      true,
    );
  });
});

describe("child access security", () => {
  it("stores new PINs with the versioned slow derivation", async () => {
    const row = await env.DB.prepare(
      "SELECT access_pin_hash AS pinHash FROM child_profile WHERE id = ? AND archive_id = ?",
    )
      .bind(familyA.childId, familyA.archiveId)
      .first<{ pinHash: string }>();
    expect(row?.pinHash).toMatch(/^pbkdf2-sha256\$120000\$/);
  });

  it("upgrades a valid legacy PIN after sign-in", async () => {
    const legacyPin = "654321";
    const legacyHash = await legacyChildPinHash(familyB.childId, legacyPin);
    await env.DB.prepare(
      "UPDATE child_profile SET access_pin_hash = ? WHERE id = ? AND archive_id = ?",
    )
      .bind(legacyHash, familyB.childId, familyB.archiveId)
      .run();

    const response = await childSignIn(familyB, legacyPin);
    expect(response.status).toBe(200);
    const row = await env.DB.prepare(
      "SELECT access_pin_hash AS pinHash FROM child_profile WHERE id = ? AND archive_id = ?",
    )
      .bind(familyB.childId, familyB.archiveId)
      .first<{ pinHash: string }>();
    expect(row?.pinHash).toMatch(/^pbkdf2-sha256\$120000\$/);
    expect(row?.pinHash).not.toBe(legacyHash);
  });

  it("temporarily locks repeated failures and returns retry guidance", async () => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await exports.default.fetch(
        new Request(`${ORIGIN}/api/families/${familyA.slug}/children/missing-child/sign-in`, {
          body: JSON.stringify({ pin: "000000" }),
          headers: {
            "content-type": "application/json",
            "user-agent": "lockout-test-device",
            origin: ORIGIN,
          },
          method: "POST",
        }),
      );
      expect(response.status).toBe(401);
    }
    const locked = await exports.default.fetch(
      new Request(`${ORIGIN}/api/families/${familyA.slug}/children/missing-child/sign-in`, {
        body: JSON.stringify({ pin: "000000" }),
        headers: {
          "content-type": "application/json",
          "user-agent": "lockout-test-device",
          origin: ORIGIN,
        },
        method: "POST",
      }),
    );
    expect(locked.status).toBe(429);
    expect(Number(locked.headers.get("retry-after"))).toBeGreaterThan(0);
  });

  it("shows session activity and lets a parent disable all child access", async () => {
    const before = await api(familyA, `/api/families/${familyA.slug}/archive`);
    expect(before.status).toBe(200);
    const beforeState = (await before.json()) as {
      children: Array<{
        childAccessEnabled: number;
        childActiveDeviceCount: number;
        childLastAccessAt: string | null;
      }>;
    };
    expect(beforeState.children[0]).toMatchObject({
      childAccessEnabled: 1,
      childActiveDeviceCount: 1,
    });
    expect(beforeState.children[0].childLastAccessAt).toBeTruthy();

    const disabled = await api(
      { ...familyA, cookie: parent.cookie },
      `/api/families/${familyA.slug}/archive/children/${familyA.childId}/access-pin`,
      { method: "DELETE" },
    );
    expect(disabled.status).toBe(200);

    const childArchive = await exports.default.fetch(
      new Request(`${ORIGIN}/api/families/${familyA.slug}/children/${familyA.childSlug}/archive`, {
        headers: { cookie: childCookie },
      }),
    );
    expect(childArchive.status).toBe(401);

    const after = await api(familyA, `/api/families/${familyA.slug}/archive`);
    const afterState = (await after.json()) as {
      children: Array<{ childAccessEnabled: number; childActiveDeviceCount: number }>;
    };
    expect(afterState.children[0]).toMatchObject({
      childAccessEnabled: 0,
      childActiveDeviceCount: 0,
    });
  });
});

describe("adult account recovery", () => {
  it("resets a password and revokes existing sessions", async () => {
    const requested = await exports.default.fetch(
      new Request(`${ORIGIN}/api/auth/request-password-reset`, {
        body: JSON.stringify({
          email: "parent-api@example.com",
          redirectTo: "/reset-password",
        }),
        headers: { "content-type": "application/json", origin: ORIGIN },
        method: "POST",
      }),
    );
    expect(requested.status).toBe(200);
    const verification = await env.DB.prepare(
      `SELECT identifier FROM verification
       WHERE identifier LIKE 'reset-password:%' ORDER BY createdAt DESC LIMIT 1`,
    ).first<{ identifier: string }>();
    const token = verification?.identifier.split(":").at(-1);
    expect(token).toBeTruthy();

    const reset = await exports.default.fetch(
      new Request(`${ORIGIN}/api/auth/reset-password`, {
        body: JSON.stringify({ newPassword: "a-new-secure-password", token }),
        headers: { "content-type": "application/json", origin: ORIGIN },
        method: "POST",
      }),
    );
    expect(reset.status).toBe(200);

    const sessions = await env.DB.prepare(
      'SELECT COUNT(*) AS count FROM "session" WHERE "userId" = ?',
    )
      .bind(parent.userId)
      .first<{ count: number }>();
    expect(Number(sessions?.count ?? 0)).toBe(0);
  });
});

describe("onboarding archive focus", () => {
  it("creates child access when a PIN is enabled during onboarding", async () => {
    const account = await signUpAccount("onboarding-pin@example.com", "PIN Parent");
    const response = await exports.default.fetch(
      new Request(`${ORIGIN}/api/onboarding`, {
        body: JSON.stringify({
          childBirthDate: "2021-04-05",
          childName: "Mina",
          childPin: "482913",
          familyName: "PIN Family",
          familySlug: "pin-family",
          profileKind: "child",
          timezone: "UTC",
        }),
        headers: { "content-type": "application/json", cookie: account.cookie, origin: ORIGIN },
        method: "POST",
      }),
    );
    expect(response.status).toBe(201);

    const profile = await env.DB.prepare(
      `SELECT access_pin_hash AS pinHash, profile_kind AS profileKind
       FROM child_profile WHERE archive_id = (
         SELECT archive_id FROM family_member WHERE user_id = ? LIMIT 1
       )`,
    )
      .bind(account.userId)
      .first<{ pinHash: string; profileKind: string }>();
    expect(profile?.profileKind).toBe("child");
    expect(profile?.pinHash).toMatch(/^pbkdf2-sha256\$120000\$/);
  });

  it("creates a usable memory vault without child details", async () => {
    const account = await signUpAccount("couple-vault@example.com", "Vault Owner");
    const response = await exports.default.fetch(
      new Request(`${ORIGIN}/api/onboarding`, {
        body: JSON.stringify({
          childPin: "",
          familyName: "Our Years",
          familySlug: "our-years",
          profileKind: "vault",
          timezone: "UTC",
        }),
        headers: { "content-type": "application/json", cookie: account.cookie, origin: ORIGIN },
        method: "POST",
      }),
    );
    expect(response.status).toBe(201);

    const archiveResponse = await exports.default.fetch(
      new Request(`${ORIGIN}/api/families/our-years/archive`, {
        headers: { cookie: account.cookie },
      }),
    );
    expect(archiveResponse.status).toBe(200);
    const archive = (await archiveResponse.json()) as {
      children: Array<{ id: string; profileKind: string }>;
    };
    expect(archive.children[0]?.profileKind).toBe("vault");

    const memory = await exports.default.fetch(
      new Request(`${ORIGIN}/api/families/our-years/archive/memories`, {
        body: JSON.stringify({
          audience: "family",
          childId: archive.children[0]?.id,
          happenedAt: new Date().toISOString(),
          kind: "story",
          title: "The beginning",
        }),
        headers: { "content-type": "application/json", cookie: account.cookie, origin: ORIGIN },
        method: "POST",
      }),
    );
    expect(memory.status).toBe(201);
  });
});

async function createFamily(email: string, name: string, slug: string): Promise<TestFamily> {
  const account = await signUpAccount(email, name);

  const onboarding = await exports.default.fetch(
    new Request(`${ORIGIN}/api/onboarding`, {
      body: JSON.stringify({
        childBirthDate: "2020-01-01",
        childName: `${name} child`,
        childPin: "",
        familyName: name,
        familySlug: slug,
        timezone: "UTC",
      }),
      headers: { "content-type": "application/json", cookie: account.cookie, origin: ORIGIN },
      method: "POST",
    }),
  );
  expect(onboarding.status).toBe(201);

  const child = await env.DB.prepare(
    `SELECT a.id AS archiveId, c.id, c.slug, fm.id AS memberId FROM child_profile c
     JOIN family_archive a ON a.id = c.archive_id
     JOIN family_member fm ON fm.archive_id = a.id AND fm.user_id = ?
     WHERE a.slug = ?`,
  )
    .bind(account.userId, slug)
    .first<{ archiveId: string; id: string; memberId: string; slug: string }>();
  expect(child?.id).toBeTruthy();

  return {
    archiveId: child!.archiveId,
    childId: child!.id,
    childSlug: child!.slug,
    cookie: account.cookie,
    mediaId: "",
    memberId: child!.memberId,
    memoryId: "",
    slug,
    userId: account.userId,
  };
}

async function signUpAccount(email: string, name: string): Promise<TestAccount> {
  const signUp = await exports.default.fetch(
    new Request(`${ORIGIN}/api/auth/sign-up/email`, {
      body: JSON.stringify({ email, name, password: PASSWORD }),
      headers: { "content-type": "application/json", origin: ORIGIN },
      method: "POST",
    }),
  );
  expect(signUp.status).toBe(200);
  const payload = (await signUp.json()) as { user: { id: string } };
  const cookie = signUp.headers.get("set-cookie")?.match(/everlittle\.session_token=[^;]+/)?.[0];
  expect(cookie).toBeTruthy();
  return { cookie: cookie!, userId: payload.user.id };
}

function membership(id: string, userId: string, role: "parent" | "contributor" | "viewer") {
  return env.DB.prepare(
    "INSERT INTO family_member (id, archive_id, user_id, role) VALUES (?, ?, ?, ?)",
  ).bind(id, familyA.archiveId, userId, role);
}

function memoryBody(audience: "parents" | "family", title: string) {
  return JSON.stringify({
    audience,
    childId: familyA.childId,
    happenedAt: new Date().toISOString(),
    kind: "story",
    title,
  });
}

function api(
  family: TestFamily,
  path: string,
  init: Omit<RequestInit, "headers"> & { headers?: Record<string, string> } = {},
) {
  return exports.default.fetch(
    new Request(`${ORIGIN}${path}`, {
      ...init,
      headers: {
        cookie: family.cookie,
        origin: ORIGIN,
        ...(typeof init.body === "string" ? { "content-type": "application/json" } : {}),
        ...init.headers,
      },
    }),
  );
}

function childSignIn(family: TestFamily, pin: string) {
  return exports.default.fetch(
    new Request(`${ORIGIN}/api/families/${family.slug}/children/${family.childSlug}/sign-in`, {
      body: JSON.stringify({ pin }),
      headers: { "content-type": "application/json", origin: ORIGIN },
      method: "POST",
    }),
  );
}

async function legacyChildPinHash(childId: string, pin: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode("test-secret-at-least-32-characters-long"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`${childId}:${pin}`));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}
