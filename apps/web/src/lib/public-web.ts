import type { DeploymentConfig } from "@/lib/deployment";
import { SEO_PAGE_PATHS } from "@/lib/seo-page-paths";

export const INDEXABLE_PATHS = ["/", "/pricing", ...SEO_PAGE_PATHS] as const;

export function isIndexablePath(pathname: string): boolean {
  return INDEXABLE_PATHS.includes(pathname as (typeof INDEXABLE_PATHS)[number]);
}

export function robotsResponse(deployment: DeploymentConfig): Response {
  const body =
    deployment.mode === "hosted"
      ? [
          "User-agent: *",
          "Allow: /",
          "Disallow: /api/",
          `Sitemap: ${deployment.publicAppUrl}/sitemap.xml`,
          "",
        ].join("\n")
      : ["User-agent: *", "Disallow: /", ""].join("\n");

  return new Response(body, {
    headers: publicTextHeaders("text/plain; charset=utf-8"),
  });
}

export function sitemapResponse(deployment: DeploymentConfig): Response {
  if (deployment.mode !== "hosted") return notFoundResponse();

  const urls = INDEXABLE_PATHS.map((pathname) => {
    const location = new URL(pathname, `${deployment.publicAppUrl}/`).toString();
    return `  <url><loc>${escapeXml(location)}</loc></url>`;
  }).join("\n");
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(body, {
    headers: publicTextHeaders("application/xml; charset=utf-8"),
  });
}

export async function isKnownPagePath(pathname: string, database: D1Database): Promise<boolean> {
  if (isIndexablePath(pathname)) return true;
  if (["/onboarding", "/reset-password", "/sign-in", "/sign-up"].includes(pathname)) {
    return true;
  }

  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "invite") return parts.length === 2 && parts[1].length > 0;
  if (!isArchiveRouteShape(parts)) return false;

  const archive = await database
    .prepare("SELECT 1 FROM family_archive WHERE slug = ? LIMIT 1")
    .bind(parts[0])
    .first();
  return Boolean(archive);
}

export function notFoundResponse(): Response {
  return new Response("Not found", {
    headers: {
      "cache-control": "private, no-store",
      "content-type": "text/plain; charset=utf-8",
      "x-content-type-options": "nosniff",
      "x-robots-tag": "noindex, nofollow, noarchive",
    },
    status: 404,
  });
}

function isArchiveRouteShape(parts: string[]) {
  const slug = parts[0] ?? "";
  if (!/^[a-z0-9](?:[a-z0-9-]{1,46}[a-z0-9])?$/.test(slug)) return false;
  if (parts.length === 1) return true;
  if (parts.length === 2) {
    return ["capsules", "child", "family", "kids", "settings", "timeline"].includes(parts[1]);
  }
  return parts.length === 3 && parts[1] === "kids" && parts[2].length > 0;
}

function publicTextHeaders(contentType: string) {
  return {
    "cache-control": "public, max-age=3600",
    "content-type": contentType,
    "x-content-type-options": "nosniff",
  };
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
