import { describe, expect, it } from "vitest";

import { isExistingAccountError } from "@/lib/auth-feedback";

describe("auth feedback", () => {
  it("recognizes Better Auth's existing-account response", () => {
    expect(
      isExistingAccountError({
        code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
        message: "User already exists. Use another email.",
      }),
    ).toBe(true);
  });

  it("does not treat unrelated signup failures as an existing account", () => {
    expect(
      isExistingAccountError({ code: "INVALID_PASSWORD", message: "Password is invalid" }),
    ).toBe(false);
  });
});
