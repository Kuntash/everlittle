import { describe, expect, it, vi } from "vitest";

import type { DeploymentConfig } from "@/lib/deployment";
import {
  INDEXABLE_PATHS,
  isIndexablePath,
  isKnownPagePath,
  notFoundResponse,
  robotsResponse,
  sitemapResponse,
} from "@/lib/public-web";

const hostedDeployment: DeploymentConfig = {
  appName: "Everlittle",
  defaultArchiveSlug: null,
  mode: "hosted",
  publicAppUrl: "https://geteverlittle.com",
  capabilities: {
    allowsInitialOwnerBootstrap: false,
    allowsPublicSignup: true,
    requiresBilling: true,
    showsMarketingSite: true,
    supportsMultipleArchives: true,
  },
};

describe("public web crawler responses", () => {
  it("serves a plain-text robots file with the canonical sitemap", async () => {
    const response = robotsResponse(hostedDeployment);

    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(await response.text()).toContain("Sitemap: https://geteverlittle.com/sitemap.xml");
  });

  it("serves an XML sitemap containing only canonical marketing pages", async () => {
    const response = sitemapResponse(hostedDeployment);
    const body = await response.text();

    expect(response.headers.get("content-type")).toBe("application/xml; charset=utf-8");
    expect(body).toContain("<loc>https://geteverlittle.com/</loc>");
    expect(body).toContain("<loc>https://geteverlittle.com/pricing</loc>");
    expect(body).toContain("<loc>https://geteverlittle.com/family-memory-app</loc>");
    expect(body).toContain("<loc>https://geteverlittle.com/digital-time-capsule-for-kids</loc>");
    expect(body.match(/<url>/g)).toHaveLength(INDEXABLE_PATHS.length);
    expect(body).not.toContain("sign-in");
  });

  it("uses the same indexable-page list for server response headers", () => {
    expect(isIndexablePath("/baby-memory-journal")).toBe(true);
    expect(isIndexablePath("/sign-in")).toBe(false);
  });

  it("keeps self-hosted installations out of public search", async () => {
    const selfHosted = {
      ...hostedDeployment,
      mode: "self-hosted" as const,
    };

    expect(await robotsResponse(selfHosted).text()).toBe("User-agent: *\nDisallow: /\n");
    expect(sitemapResponse(selfHosted).status).toBe(404);
  });

  it("returns a real noindex 404 response", () => {
    const response = notFoundResponse();

    expect(response.status).toBe(404);
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
  });

  it("rejects scanner paths and accepts existing archive routes", async () => {
    const first = vi.fn().mockResolvedValue({ 1: 1 });
    const bind = vi.fn().mockReturnValue({ first });
    const database = { prepare: vi.fn().mockReturnValue({ bind }) } as unknown as D1Database;

    await expect(isKnownPagePath("/wp-login.php", database)).resolves.toBe(false);
    await expect(isKnownPagePath("/.env", database)).resolves.toBe(false);
    await expect(isKnownPagePath("/grandparents-memory-project", database)).resolves.toBe(true);
    await expect(isKnownPagePath("/norbu-family/timeline", database)).resolves.toBe(true);
    expect(bind).toHaveBeenCalledWith("norbu-family");
  });

  it("returns false for an archive-shaped path that does not exist", async () => {
    const first = vi.fn().mockResolvedValue(null);
    const bind = vi.fn().mockReturnValue({ first });
    const database = { prepare: vi.fn().mockReturnValue({ bind }) } as unknown as D1Database;

    await expect(isKnownPagePath("/not-a-real-family", database)).resolves.toBe(false);
  });
});
