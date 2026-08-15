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
