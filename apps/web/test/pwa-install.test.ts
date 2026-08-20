import { describe, expect, it } from "vitest";

import { shouldOfferPwaInstall } from "@/lib/pwa-install";

const eligibleContext = {
  dismissed: false,
  hasInstallPrompt: true,
  isAuthenticated: true,
  isIos: false,
  standalone: false,
};

describe("PWA install offer", () => {
  it("never appears for a signed-out visitor", () => {
    expect(shouldOfferPwaInstall({ ...eligibleContext, isAuthenticated: false })).toBe(false);
  });

  it("appears for an eligible signed-in visitor", () => {
    expect(shouldOfferPwaInstall(eligibleContext)).toBe(true);
  });

  it("stays hidden when dismissed or already installed", () => {
    expect(shouldOfferPwaInstall({ ...eligibleContext, dismissed: true })).toBe(false);
    expect(shouldOfferPwaInstall({ ...eligibleContext, standalone: true })).toBe(false);
  });

  it("supports the signed-in iOS install guide without a browser prompt", () => {
    expect(
      shouldOfferPwaInstall({
        ...eligibleContext,
        hasInstallPrompt: false,
        isIos: true,
      }),
    ).toBe(true);
  });
});
