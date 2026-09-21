import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/platform", (r) => r.fulfill({ json: { deploymentMode: "hosted" } }));
  await page.route("**/api/auth/get-session*", (r) =>
    r.fulfill({
      json: {
        session: { id: "setup-session", userId: "setup-user", expiresAt: "2099-01-01" },
        user: { id: "setup-user", name: "Alex", email: "alex@example.com", emailVerified: true },
      },
    }),
  );
  await page.route("**/api/onboarding/slug?*", (r) => r.fulfill({ json: { available: true } }));
});

test("setup stays usable through network failure and completes without a child PIN", async ({
  page,
}, info) => {
  let failNext = true;
  let completed: Record<string, unknown> | undefined;
  await page.route("**/api/onboarding", async (r) => {
    if (r.request().method() === "GET")
      return r.fulfill({ json: { complete: false, draft: null } });
    if (failNext) {
      failNext = false;
      return r.abort();
    }
    if (r.request().method() === "POST") {
      completed = r.request().postDataJSON();
      return r.fulfill({ json: { archiveSlug: "the-river-family" } });
    }
    return r.fulfill({ json: { saved: true } });
  });
  // Stop after navigation so this test doesn't need archive fixtures.
  await page.route("**/the-river-family", (r) =>
    r.fulfill({ contentType: "text/html", body: "<h1>Your memories</h1>" }),
  );
  await page.goto("/onboarding");
  await page.getByLabel("Family name", { exact: true }).fill("The River Family");
  await expect(page.getByText("Available", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Archive address")).toHaveValue("the-river-family");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  await page.screenshot({ path: info.outputPath("onboarding-family.png"), fullPage: true });
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveText("Couldn’t connect. Please try again.");
  await expect(page.getByRole("button", { name: "Continue", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Child’s name", { exact: true }).fill("Emma");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  await page.screenshot({ path: info.outputPath("onboarding-memories.png"), fullPage: true });
  // Choose the family path to verify that no child data or PIN is required.
  await page.getByRole("radio", { name: /Our family/ }).check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Ready for your first memory?" })).toBeVisible();
  await page.screenshot({ path: info.outputPath("onboarding-finish.png"), fullPage: true });
  await page.getByRole("button", { name: "Open my free archive" }).click();
  await expect(page.getByRole("heading", { name: "Your memories" })).toBeVisible();
  expect(completed).toMatchObject({
    profileKind: "vault",
    childPin: "",
    familySlug: "the-river-family",
  });
  expect(completed).not.toHaveProperty("childName");
});

test("restored child setup leaves PIN optional and uses compact controls", async ({
  page,
}, info) => {
  await page.route("**/api/onboarding", (r) =>
    r.fulfill({
      json: {
        complete: false,
        draft: {
          familyName: "River family",
          familySlug: "river-family",
          profileKind: "child",
          childName: "Emma",
          childBirthDate: "2024-04-12",
          timezone: "Asia/Kolkata",
        },
      },
    }),
  );
  await page.goto("/onboarding");
  const pin = page.getByRole("checkbox", { name: /Let my child sign in/ });
  await expect(pin).not.toBeChecked();
  await expect(page.getByRole("button", { name: "Open my free archive" })).toBeEnabled();
  await pin.check();
  await expect(page.getByRole("button", { name: "Open my free archive" })).toBeDisabled();
  const box = await pin.boundingBox();
  expect(box?.height).toBe(18);
  await page.screenshot({ path: info.outputPath("onboarding-child-pin.png"), fullPage: true });
});
