import { expect, test } from "@playwright/test";
import { buildAuthEmail } from "../src/lib/auth-email";
import { buildInvitationEmail } from "../src/lib/invitation-email";

test("transactional emails have readable actions and fallback links", async ({
  page,
}, testInfo) => {
  const emails = [
    buildAuthEmail({
      email: "parent@example.com",
      name: "Alex",
      type: "verification",
      url: "https://geteverlittle.com/api/auth/verify-email?token=preview-token&callbackURL=%2Fonboarding",
    }),
    buildAuthEmail({
      email: "parent@example.com",
      name: "Alex",
      type: "password-reset",
      url: "https://geteverlittle.com/reset-password?token=preview-token",
    }),
    buildInvitationEmail({
      archiveName: "The Patel family",
      expiresAt: "2026-10-01",
      invitationUrl: "https://geteverlittle.com/?invite=preview-token",
      inviterEmail: "parent@example.com",
      inviterName: "Alex",
      recipient: "grandparent@example.com",
      role: "contributor",
    }),
  ];
  for (const [index, email] of emails.entries()) {
    await page.setContent(email.html);
    await expect(page.getByRole("link", { name: "Everlittle", exact: true })).toHaveAttribute(
      "href",
      "https://geteverlittle.com/",
    );
    await expect(
      page.getByText("Button not working? Copy this link into your browser:"),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy();
    await page.screenshot({ path: testInfo.outputPath(`email-${index}.png`), fullPage: true });
  }
});
