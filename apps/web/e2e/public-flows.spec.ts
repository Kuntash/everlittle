import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.route("**/api/platform", (route) =>
    route.fulfill({
      json: {
        allowsPublicSignup: true,
        needsSetup: false,
        deploymentMode: "hosted",
        defaultArchiveSlug: null,
        childAccess: null,
      },
    }),
  );
  await page.route("**/api/auth/get-session*", (route) => route.fulfill({ json: null }));
  await page.route("**/api/child/session", (route) => route.fulfill({ json: { signedIn: false } }));
});
test("landing loads with local artwork and responsive footer", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Their childhood is happening. Keep a little of it." }),
  ).toBeVisible();
  await expect(page.locator(".landing-footer .footer-identity")).toContainText("Everlittle");
  await expect(page.locator(".landing-footer nav")).toHaveCSS(
    "display",
    testInfo.project.name === "mobile" ? "grid" : "flex",
  );
  await expect(page.locator(".landing h1").first()).toHaveCSS("font-family", /Nunito Sans/);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  await page.screenshot({ path: testInfo.outputPath("landing.png"), fullPage: true });
  expect(errors).toEqual([]);
});
test("password recovery uses the real endpoint and keeps reset confirmation private", async ({
  page,
}) => {
  let body: any;
  await page.route("**/api/auth/request-password-reset", async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ json: { status: true } });
  });
  await page.goto("/sign-in");
  await expect(page.getByRole("button", { name: /Forgot your password/i })).toBeVisible();
  await page.getByRole("button", { name: /Forgot your password/i }).click();
  await page.getByLabel("Email address", { exact: true }).fill("demo@example.com");
  await page.getByRole("button", { name: /send.*link|send.*email/i }).click();
  await expect(page.getByText(/If that email belongs to an account/)).toBeVisible();
  expect(body).toEqual({ email: "demo@example.com", redirectTo: "/reset-password" });
});
test("journal has working article navigation and mobile contents", async ({ page }, testInfo) => {
  await page.goto("/baby-memory-journal");
  await expect(
    page.getByRole("heading", { name: "A baby memory journal for real life", exact: true }),
  ).toBeVisible();
  if (testInfo.project.name === "mobile") await page.locator("summary.contents-toggle").click();
  await page.getByRole("navigation", { name: "Article contents" }).getByRole("link").last().click();
  await expect(page.locator("#story-section-2")).toBeInViewport();
  await page.screenshot({ path: testInfo.outputPath("journal.png"), fullPage: true });
});
test("expired password reset does not submit a password", async ({ page }) => {
  let submitted = false;
  await page.route("**/api/auth/reset-password", (route) => {
    submitted = true;
    return route.fulfill({ status: 400, json: { error: "expired" } });
  });
  await page.goto("/reset-password");
  await expect(page.getByText(/invalid or has expired/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Save new password" })).toBeDisabled();
  expect(submitted).toBeFalsy();
});

test("account tabs and password controls follow the shared design", async ({ page }) => {
  await page.goto("/sign-up");
  await expect(page.getByRole("tab", { name: "Create account", exact: true })).toHaveAttribute(
    "data-state",
    "active",
  );
  await page.getByRole("tab", { name: "Sign in", exact: true }).click();
  const forgot = page.getByRole("button", { name: "Forgot your password?", exact: true });
  await forgot.hover();
  await expect(forgot).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(forgot).toHaveCSS("text-decoration-line", "underline");
  const input = page.locator('input[type="password"]');
  const eye = page.getByRole("button", { name: "Show password", exact: true });
  const a = await input.boundingBox(),
    b = await eye.boundingBox();
  expect(Math.abs(a!.y + a!.height / 2 - (b!.y + b!.height / 2))).toBeLessThan(2);
  await eye.click();
  await expect(page.getByRole("button", { name: "Hide password", exact: true })).toBeVisible();
});

test("child entry routes render the child PIN screen", async ({ page }) => {
  await page.route("**/api/families/test-family/children", (r) =>
    r.fulfill({ json: { children: [{ slug: "emma", displayName: "Emma" }] } }),
  );
  await page.route("**/api/families/test-family/children/emma/session", (r) =>
    r.fulfill({ json: { signedIn: false } }),
  );
  await page.goto("/test-family/kids");
  await expect(
    page.getByRole("heading", { name: "Open the story your family kept for you", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Open my story", exact: false })).toBeDisabled();
  await expect(page.locator('input[inputmode="numeric"]')).toBeVisible();
  await expect(page.getByRole("link", { name: "Choose another name" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Welcome back." })).not.toBeVisible();
});

test("landing preview navigation and article baselines stay aligned", async ({ page }, info) => {
  await page.goto("/");
  const primary = page.locator(".hero-copy .raised");
  const secondary = page.getByRole("button", { name: "See how it works", exact: true });
  expect(await secondary.evaluate((el) => getComputedStyle(el).paddingLeft)).toBe(
    await primary.evaluate((el) => getComputedStyle(el).paddingLeft),
  );
  if (info.project.name === "mobile") {
    const tabs = page.getByRole("tablist", { name: "Product preview mobile navigation" });
    await expect(tabs).toBeVisible();
    await tabs.getByRole("tab", { name: "Timeline", exact: true }).click();
    await expect(page.locator(".product-preview").getByText("Every little chapter")).toBeVisible();
    const container = await page.locator(".product-preview").boundingBox();
    const navigation = await tabs.boundingBox();
    expect(navigation!.y + navigation!.height).toBeLessThanOrEqual(
      container!.y + container!.height,
    );
  } else {
    const links = await page
      .locator(".journal-card .article-link")
      .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().bottom));
    expect(Math.max(...links) - Math.min(...links)).toBeLessThan(2);
  }
});
