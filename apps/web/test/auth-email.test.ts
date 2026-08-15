import { describe, expect, it } from "vitest";

import { buildAuthEmail } from "@/lib/auth-email";

describe("adult authentication emails", () => {
  it("builds a verification email without trusting display-name HTML", () => {
    const email = buildAuthEmail({
      email: "parent@example.com",
      name: "<Parent>",
      type: "verification",
      url: "https://geteverlittle.com/api/auth/verify-email?token=private",
    });
    expect(email.subject).toBe("Verify your Everlittle email");
    expect(email.html).toContain("&lt;Parent&gt;");
    expect(email.html).not.toContain("<Parent>");
    expect(email.text).toContain("Verify email:");
  });

  it("explains password-reset session revocation", () => {
    const email = buildAuthEmail({
      email: "parent@example.com",
      name: "Parent",
      type: "password-reset",
      url: "https://geteverlittle.com/api/auth/reset-password/token",
    });
    expect(email.subject).toBe("Reset your Everlittle password");
    expect(email.text).toContain("signs out your other sessions");
  });
});
