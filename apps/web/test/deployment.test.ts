import { describe, expect, it } from "vitest";

import { getDeploymentConfig } from "@/lib/deployment";

describe("deployment policy", () => {
  it("accepts a self-hosted installation with a default archive", () => {
    const deployment = getDeploymentConfig({
      APP_NAME: "Family Archive",
      DEFAULT_ARCHIVE_SLUG: "choetso-family",
      DEPLOYMENT_MODE: "self-hosted",
      PUBLIC_APP_URL: "https://dikichoetso.com",
    });

    expect(deployment.appName).toBe("Family Archive");
    expect(deployment.defaultArchiveSlug).toBe("choetso-family");
    expect(deployment.capabilities.allowsInitialOwnerBootstrap).toBe(true);
    expect(deployment.capabilities.requiresBilling).toBe(false);
  });

  it("rejects insecure public origins outside local development", () => {
    expect(() =>
      getDeploymentConfig({
        DEPLOYMENT_MODE: "self-hosted",
        PUBLIC_APP_URL: "http://family.example.com",
      }),
    ).toThrow("PUBLIC_APP_URL must use HTTPS");
  });

  it("does not allow hosted deployments to claim one default archive", () => {
    expect(() =>
      getDeploymentConfig({
        DEFAULT_ARCHIVE_SLUG: "choetso-family",
        DEPLOYMENT_MODE: "hosted",
        PUBLIC_APP_URL: "https://geteverlittle.com",
      }),
    ).toThrow("DEFAULT_ARCHIVE_SLUG is only supported in self-hosted mode");
  });
});
