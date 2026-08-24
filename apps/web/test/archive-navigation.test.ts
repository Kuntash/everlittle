import { describe, expect, it } from "vitest";

import { resolveArchiveEntry } from "@/lib/archive-navigation";

describe("archive entry navigation", () => {
  it("prefers the configured self-hosted archive", () => {
    expect(
      resolveArchiveEntry([{ slug: "another-family" }, { slug: "choetso-family" }], {
        defaultArchiveSlug: "choetso-family",
        deploymentMode: "self-hosted",
        rememberedArchiveSlug: "another-family",
      }),
    ).toBe("/choetso-family");
  });

  it("does not send a membership-less self-hosted account to family creation", () => {
    expect(
      resolveArchiveEntry([], {
        defaultArchiveSlug: "choetso-family",
        deploymentMode: "self-hosted",
        rememberedArchiveSlug: null,
      }),
    ).toBeNull();
  });

  it("keeps onboarding available for a new hosted account", () => {
    expect(
      resolveArchiveEntry([], {
        defaultArchiveSlug: null,
        deploymentMode: "hosted",
        rememberedArchiveSlug: null,
      }),
    ).toBe("/onboarding");
  });
});
