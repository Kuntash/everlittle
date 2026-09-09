import { test, expect } from "@playwright/test";
import type { ArchiveState } from "../src/features/archive/archive-types";
const state: ArchiveState = {
  archive: {
    id: "e2e-family",
    name: "Test Family",
    slug: "test-family",
    timezone: "Asia/Kolkata",
    createdAt: "2026-01-01",
  },
  currentMember: { id: "member-1", role: "owner", userId: "user-1" },
  members: [
    {
      id: "member-1",
      userId: "user-1",
      role: "owner",
      joinedAt: "2026-01-01",
      name: "Alex",
      email: "alex@example.com",
    },
  ],
  children: [
    {
      id: "child-1",
      slug: "emma",
      displayName: "Emma",
      birthDate: "2020-01-01",
      profileKind: "child",
      childAccessEnabled: 0,
    },
  ],
  memories: [
    {
      id: "memory-1",
      childId: "child-1",
      kind: "story",
      title: "The moon is a night-light",
      body: "A little thing you said today.",
      happenedAt: "2026-09-01",
      audience: "family",
      createdAt: "2026-09-01",
      createdByUserId: "user-1",
      authorName: "Alex",
      mediaId: null,
      mediaType: null,
      contentType: null,
      byteSize: null,
    },
  ],
  capsules: [],
  invitations: [],
  billing: {
    plan: "family",
    status: "active",
    usedBytes: 0,
    limitBytes: 100000000000,
    trialEndsAt: null,
    currentPeriodEndsAt: "2026-10-01",
    interval: "monthly",
    cancelAtPeriodEnd: false,
    checkoutAvailable: true,
    canManage: true,
    canCreateContent: true,
    environment: "live_mode",
  },
};
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("everlittle.pwa-install-dismissed", String(Date.now())),
  );
  await page.route("**/api/platform", (r) =>
    r.fulfill({
      json: {
        allowsPublicSignup: true,
        needsSetup: false,
        deploymentMode: "hosted",
        defaultArchiveSlug: null,
        childAccess: null,
      },
    }),
  );
  await page.route("**/api/auth/get-session*", (r) =>
    r.fulfill({
      json: {
        session: { id: "session-1", userId: "user-1", expiresAt: "2099-01-01" },
        user: {
          id: "user-1",
          name: "Alex",
          email: "alex@example.com",
          emailVerified: true,
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
      },
    }),
  );
  await page.route("**/api/child/session", (r) => r.fulfill({ json: { signedIn: false } }));
  await page.route("**/api/archives", (r) =>
    r.fulfill({
      json: {
        archives: [{ id: "e2e-family", name: "Test Family", slug: "test-family", role: "owner" }],
      },
    }),
  );
  await page.route("**/api/families/test-family/archive", (r) => r.fulfill({ json: state }));
});
test("archive navigation stays fixed while filters change and composer uses borderless fields", async ({
  page,
}, info) => {
  let archiveReads = 0;
  await page.route("**/api/families/test-family/archive", (route) => {
    archiveReads += 1;
    return route.fulfill({ json: state });
  });
  await page.goto("/test-family");
  const nav = page.getByRole("navigation", {
    name: info.project.name === "mobile" ? "Primary mobile" : "Primary",
    exact: true,
  });
  await expect(nav).toBeVisible();
  const add = page.getByRole("button", { name: "Add a memory", exact: true });
  await expect(add).toBeVisible();
  const initialArchiveReads = archiveReads;
  if (info.project.name === "mobile") {
    const width = await add.evaluate((e) => e.getBoundingClientRect().width);
    expect(width).toBeGreaterThan(330);
  }
  await add.click();
  const dialog = page.getByRole("dialog", { name: "Add a memory" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Story", exact: true }).click();
  const title = dialog.getByRole("textbox", { name: "Memory title" });
  await title.fill("An ordinary afternoon");
  await expect(title).toHaveCSS("border-bottom-width", "0px");
  await dialog.locator(".date-trigger").click();
  const datePicker = page.getByRole("dialog").last();
  await expect(datePicker.getByRole("button", { name: "Done", exact: true })).toBeVisible();
  await datePicker.getByRole("button", { name: "Done", exact: true }).click();
  await expect(page.locator(".date-popover")).not.toBeVisible();
  await expect(dialog.getByRole("textbox", { name: "Memory title" })).toBeVisible();
  await page.screenshot({ path: info.outputPath("memory-composer.png"), fullPage: true });
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await nav.getByRole("tab", { name: "Timeline", exact: true }).click();
  const before = await nav.boundingBox();
  await page.getByRole("tab", { name: "Stories", exact: true }).click();
  await expect(page.getByText("The moon is a night-light", { exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "Videos", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No memories here yet." })).toBeVisible();
  const after = await nav.boundingBox();
  expect(after?.height).toBe(before?.height);
  expect(after?.y).toBe(before?.y);
  await nav.getByRole("tab", { name: "Family", exact: true }).click();
  await expect(page.getByRole("tab", { name: "People", exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath("family.png"), fullPage: true });
  await nav.getByRole("tab", { name: "Home", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Emma’s memories", exact: true })).toBeVisible();
  expect(archiveReads).toBe(initialArchiveReads);
});

test("family profile, billing and child views retain their real account states", async ({
  page,
}, info) => {
  await page.goto("/test-family/family");
  await page.getByRole("tab", { name: "Child profile", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Child’s name", exact: true })).toHaveValue(
    "Emma",
  );
  await expect(page.getByText("Child sign-in is off.", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Turn on child sign-in", exact: true }),
  ).toBeDisabled();
  await page.screenshot({ path: info.outputPath("child-profile.png"), fullPage: true });
  await page.getByRole("tab", { name: "Plan", exact: true }).click();
  await expect(page.getByRole("heading", { name: "$6 / month", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Change plan", exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Cancel subscription", exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: info.outputPath("plan.png"), fullPage: true });
  await page.goto("/test-family/child");
  await expect(page.getByRole("heading", { name: "Hi, Emma.", exact: true })).toBeVisible();
  await expect(page.getByText("The moon is a night-light", { exact: true })).not.toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  expect(overflow).toBe(false);
});

test("photo detail keeps bounded media and shows the attachment when editing", async ({
  page,
}, info) => {
  const photo = { ...state.memories[0], kind: "photo", mediaType: "image", mediaId: "photo-1" };
  await page.route("**/api/families/test-family/archive", (r) =>
    r.fulfill({ json: { ...state, memories: [photo] } }),
  );
  await page.route("**/api/families/test-family/media/photo-1", (r) =>
    r.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1600"><rect width="900" height="1600" fill="#ecd8ba"/></svg>',
    }),
  );
  await page.goto("/test-family");
  await page.getByRole("button", { name: `Open memory: ${photo.title}`, exact: true }).click();
  const image = page.locator(".memory-reader .real-photo img");
  await expect(image).toBeVisible();
  expect((await image.boundingBox())!.height).toBeLessThanOrEqual(540);
  await expect(page.locator(".memory-reader .real-photo span")).toHaveCount(0);
  const edit = page.getByRole("button", { name: "Edit memory", exact: true });
  const remove = page.getByRole("button", { name: "Delete memory", exact: true });
  expect((await edit.boundingBox())!.height).toBe((await remove.boundingBox())!.height);
  await edit.click();
  await expect(page.getByRole("dialog").locator(".attached-preview img")).toBeVisible();
  let uploads = 0;
  await page.route("**/api/families/test-family/archive/memories/memory-1/media", (r) => {
    uploads++;
    expect(r.request().headers()["x-everlittle-replace-media-id"]).toBe("photo-1");
    return r.fulfill({ status: 201, json: { id: "replacement-1" } });
  });
  await page.getByRole("button", { name: "Remove attachment", exact: true }).click();
  await expect(page.getByRole("dialog").locator(".attached-preview img")).toHaveCount(0);
  await page.getByLabel("Choose replacement file").setInputFiles({
    name: "replacement.svg",
    mimeType: "image/svg+xml",
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"/>'),
  });
  await expect(page.getByAltText("Replacement attachment")).toBeVisible();
  expect(uploads).toBe(0);
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  expect(uploads).toBe(0);
  await page.getByRole("button", { name: "Memory sharing options" }).click();
  if (info.project.name === "mobile") {
    const sheet = page.getByRole("dialog", { name: "Memory visibility", exact: true });
    await expect(sheet).toBeVisible();
    await expect(sheet).toHaveCSS("bottom", "0px");
  } else await expect(page.getByRole("menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await edit.click();
  await expect(page.getByRole("dialog").locator(".attached-preview img")).toBeVisible();
  await expect(page.getByAltText("Replacement attachment")).toHaveCount(0);
  let saved = false;
  await page.route("**/api/families/test-family/archive/memories/memory-1", (r) => {
    expect(r.request().method()).toBe("PATCH");
    saved = true;
    return r.fulfill({ json: { updated: true } });
  });
  await page.getByLabel("Choose replacement file").setInputFiles({
    name: "replacement.svg",
    mimeType: "image/svg+xml",
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"/>'),
  });
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(uploads).toBe(1);
  expect(saved).toBe(true);
});

test("video cards keep the player inside the image and play inline", async ({ page }) => {
  const video = { ...state.memories[0], kind: "video", mediaType: "video", mediaId: "video-1" };
  await page.route("**/api/families/test-family/archive", (r) =>
    r.fulfill({ json: { ...state, memories: [video] } }),
  );
  await page.route("**/api/families/test-family/media/video-1", (r) =>
    r.fulfill({ contentType: "video/mp4", path: "e2e/fixtures/sample-video.mp4" }),
  );
  await page.route("**/api/families/test-family/media/video-1/thumbnail", (r) =>
    r.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120"><rect width="160" height="120" fill="#ead8ba"/></svg>',
    }),
  );
  await page.goto("/test-family");
  const player = page.locator(".video-card-media video");
  await expect(player).toBeVisible();
  await page.locator(".video-card-media .video-play").click();
  await expect
    .poll(() => player.evaluate((el: HTMLVideoElement) => el.currentTime))
    .toBeGreaterThan(0);
  const bounds = await page.locator(".memory-card").boundingBox(),
    media = await player.boundingBox();
  expect(media!.x).toBeGreaterThanOrEqual(bounds!.x);
  expect(media!.y + media!.height).toBeLessThan(bounds!.y + bounds!.height);
});

test("people keep roles in the first row, actions below and invitations after the list", async ({
  page,
}, info) => {
  await page.route("**/api/families/test-family/archive", (r) =>
    r.fulfill({
      json: {
        ...state,
        members: [
          ...state.members,
          {
            ...state.members[0],
            id: "member-2",
            userId: "user-2",
            name: "Taylor",
            role: "contributor",
          },
        ],
      },
    }),
  );
  await page.goto("/test-family/family");
  const people = page.locator(".people-list");
  const invite = page.locator(".family-invite");
  await expect(invite).toBeVisible();
  const a = await people.boundingBox(),
    b = await invite.boundingBox();
  expect(b!.y).toBeGreaterThanOrEqual(a!.y + a!.height);
  const role = page.getByRole("combobox", { name: "Taylor role" });
  const transfer = page.getByRole("button", { name: "Transfer ownership", exact: true });
  expect((await transfer.boundingBox())!.y).toBeGreaterThan((await role.boundingBox())!.y);
  expect((await transfer.boundingBox())!.height).toBeGreaterThanOrEqual(50);
  const remove = page.getByRole("button", { name: "Remove Taylor", exact: true });
  expect(
    Math.abs((await remove.boundingBox())!.y - (await transfer.boundingBox())!.y),
  ).toBeLessThan(2);
  await invite.getByRole("combobox").click();
  const parent = page.getByRole("option", { name: "Parent", exact: true });
  await parent.hover();
  await expect(parent).toHaveCSS("background-color", "rgb(247, 231, 223)");
  await expect(parent).toHaveCSS("border-radius", "10px");
  await page.keyboard.press("Escape");
  await page.screenshot({ path: info.outputPath("people-layout.png"), fullPage: true });
});
