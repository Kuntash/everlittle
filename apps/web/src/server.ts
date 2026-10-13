import { advertisingPolicy } from "@/lib/advertising-policy";
import { flushAnalytics, projectAnalytics, eventStatement } from "@/lib/server-analytics";
import { parseAcquisition } from "@/lib/acquisition";
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { AsyncLocalStorage } from "node:async_hooks";

import { slugify } from "@everlittle/domain";

import {
  acceptInvitation,
  findValidInvitation,
  handleArchiveApi,
  cleanupExpiredMediaUploads,
} from "@/lib/archive-api";
import { createAuth } from "@/lib/auth";
import { sendAuthEmail } from "@/lib/auth-email";
import { handleDodoWebhook } from "@/lib/billing";
import { BOOT_STORE_GLOBAL, type BootState } from "@/lib/boot";
import {
  getCanonicalHostedUrl,
  getDeploymentConfig,
  type DeploymentConfig,
} from "@/lib/deployment";
import type { PlatformState } from "@/features/archive/archive-types";
import {
  isIndexablePath,
  isKnownPagePath,
  notFoundResponse,
  robotsResponse,
  sitemapResponse,
} from "@/lib/public-web";
import { getRuntimeEnv, type RuntimeEnv } from "@/lib/runtime-env";
import { existingAccountSignUpResponse } from "@/lib/signup-guard";

type SignUpPayload = { user?: { id?: string; name?: string } };
type SignUpInput = { email?: string };

/**
 * The boot state of the request that is being rendered. `readBoot` in `@/lib/boot` reads it during the render.
 * It is reached through a global, so the page code needs no server-only import.
 */
const bootStore = new AsyncLocalStorage<BootState>();
(globalThis as unknown as Record<string, unknown>)[BOOT_STORE_GLOBAL] = bootStore;

/** Built files live here. Cloudflare serves the ones that exist before this Worker runs. */
const ASSETS_PATH = "/assets/";
/** Better Auth's session cookie, with the `everlittle` prefix from `createAuth`. Its presence is a hint, not proof. */
const SESSION_COOKIE = "everlittle.session_token=";
const CHILD_SESSION_COOKIE = "everlittle.child_session=";

const serverEntry = createServerEntry({
  async fetch(request) {
    const url = new URL(request.url);
    const runtime = getRuntimeEnv();
    const deployment = getDeploymentConfig(runtime);
    const canonicalUrl =
      request.method === "GET" || request.method === "HEAD"
        ? getCanonicalHostedUrl(deployment, request.url)
        : null;
    if (canonicalUrl) return Response.redirect(canonicalUrl, 308);

    if ((request.method === "GET" || request.method === "HEAD") && url.pathname === "/robots.txt") {
      if (deployment.mode === "hosted" && runtime.DODO_PAYMENTS_ENVIRONMENT !== "live_mode")
        return new Response("User-agent: *\nDisallow: /\n", {
          headers: { "content-type": "text/plain" },
        });
      return robotsResponse(deployment);
    }

    if (
      (request.method === "GET" || request.method === "HEAD") &&
      url.pathname === "/sitemap.xml"
    ) {
      return sitemapResponse(deployment);
    }

    if (url.pathname.startsWith("/api/auth/")) {
      return handleAuthRequest(request);
    }

    if (url.pathname === "/api/webhooks/dodo" && request.method === "POST") {
      return handleDodoWebhook(request, runtime);
    }

    /*
     * A request under `/assets/` that reaches the Worker names a file of an older build. It gets a plain 404
     * without a database query, and no browser keeps it.
     */
    if (url.pathname.startsWith(ASSETS_PATH)) {
      return new Response("Not found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
      });
    }

    const archiveResponse = await handleArchiveApi(request);
    if (archiveResponse) return archiveResponse;

    if (url.pathname === "/api/platform" && request.method === "GET") {
      return Response.json(await platformState(request, runtime, deployment), {
        headers: { "Cache-Control": "private, no-store" },
      });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return notFoundResponse();
    }

    if (!(await isKnownPagePath(url.pathname, runtime.DB))) {
      return notFoundResponse();
    }

    /* The page starts from what the server knows, so its first paint does not wait for `/api/platform`. */
    const cookies = request.headers.get("cookie") ?? "";
    const boot: BootState = {
      platform: await platformState(request, runtime, deployment),
      hasSession: cookies.includes(SESSION_COOKIE),
      hasChildSession: cookies.includes(CHILD_SESSION_COOKIE),
    };
    const response = await bootStore.run(boot, () => handler.fetch(request));
    const isPublicMarketingPage =
      deployment.mode === "hosted" &&
      runtime.DODO_PAYMENTS_ENVIRONMENT === "live_mode" &&
      isIndexablePath(url.pathname);
    if (!isPublicMarketingPage) {
      const headers = new Headers(response.headers);
      headers.set("cache-control", "private, no-store");
      headers.set("x-robots-tag", "noindex, nofollow, noarchive");
      return new Response(response.body, { headers, status: response.status });
    }
    return response;
  },
});

export default {
  ...serverEntry,
  async scheduled() {
    const runtime = getRuntimeEnv();
    await cleanupExpiredMediaUploads();
    await projectAnalytics(runtime);
    await flushAnalytics(runtime);
  },
};

/**
 * The installation's settings as the browser needs them. `/api/platform` returns this, and each rendered page
 * carries it. Hosted mode reads no database row. Self-hosted mode reads the account count and the first child
 * profile in one batch.
 */
async function platformState(
  request: Request,
  runtime: RuntimeEnv,
  deployment: DeploymentConfig,
): Promise<PlatformState> {
  type ChildRow = { displayName: string; childSlug: string; familySlug: string; enabled: number };
  let accounts = 1;
  let child: ChildRow | null = null;
  if (deployment.mode === "self-hosted") {
    const [accountRows, childRows] = await runtime.DB.batch([
      runtime.DB.prepare('SELECT COUNT(*) AS count FROM "user"'),
      runtime.DB.prepare(
        `SELECT display_name AS displayName,
                c.slug AS childSlug, a.slug AS familySlug,
                CASE WHEN access_pin_hash IS NULL THEN 0 ELSE 1 END AS enabled
         FROM child_profile c
         JOIN family_archive a ON a.id = c.archive_id
         ORDER BY c.created_at LIMIT 1`,
      ),
    ]);
    accounts = Number((accountRows.results[0] as { count: number } | undefined)?.count ?? 0);
    child = (childRows.results[0] as ChildRow | undefined) ?? null;
  }

  return {
    advertising: advertisingPolicy(request.cf?.country, request.headers.get("Sec-GPC") === "1"),
    allowsPublicSignup: deployment.capabilities.allowsPublicSignup,
    defaultArchiveSlug: deployment.defaultArchiveSlug,
    deploymentMode: deployment.mode,
    needsSetup: deployment.capabilities.allowsInitialOwnerBootstrap && accounts === 0,
    analytics:
      deployment.mode === "hosted" && runtime.POSTHOG_PROJECT_TOKEN && runtime.POSTHOG_HOST
        ? {
            posthog: {
              host: runtime.POSTHOG_HOST,
              environment: runtime.DODO_PAYMENTS_ENVIRONMENT ?? "test_mode",
              token: runtime.POSTHOG_PROJECT_TOKEN,
            },
          }
        : null,
    childAccess: child
      ? {
          displayName: child.displayName,
          childSlug: child.childSlug,
          familySlug: child.familySlug,
          enabled: Boolean(child.enabled),
        }
      : null,
  };
}

async function handleAuthRequest(request: Request): Promise<Response> {
  const runtime = getRuntimeEnv();
  const deployment = getDeploymentConfig(runtime);
  const url = new URL(request.url);
  const isEmailSignUp = url.pathname.endsWith("/sign-up/email");
  const signUpInput = isEmailSignUp ? await readSignUpInput(request.clone()) : null;
  const existingAccountResponse = isEmailSignUp
    ? await existingAccountSignUpResponse(runtime.DB, signUpInput?.email)
    : null;
  if (existingAccountResponse) return existingAccountResponse;
  const invitationToken = isEmailSignUp ? request.headers.get("x-everlittle-invitation") : null;
  const invitation =
    invitationToken && signUpInput?.email
      ? await findValidInvitation(runtime.DB, invitationToken, signUpInput.email)
      : null;
  const row = isEmailSignUp
    ? await runtime.DB.prepare('SELECT COUNT(*) AS count FROM "user"').first<{ count: number }>()
    : null;
  const isFirstUser = isEmailSignUp && Number(row?.count ?? 0) === 0;
  const isOwnerBootstrap =
    isFirstUser && deployment.capabilities.allowsInitialOwnerBootstrap && !invitation;
  const isHostedSignup = deployment.capabilities.allowsPublicSignup && !invitation;
  const auth = createAuth({
    appName: deployment.appName,
    database: runtime.DB,
    secret: runtime.BETTER_AUTH_SECRET,
    baseURL: deployment.publicAppUrl,
    allowSignUp: isOwnerBootstrap || isHostedSignup || Boolean(invitation),
    requireEmailVerification: deployment.mode === "hosted",
    sendAuthEmail: (input) => sendAuthEmail(runtime, input),
    onEmailVerified: async (userId) => {
      await (
        await eventStatement(runtime, {
          key: `verified:${userId}`,
          event: "email_verified",
          userId,
        })
      ).run();
    },
  });
  const response = await auth.handler(request);

  if (isEmailSignUp && response.ok) {
    const payload = (await response.clone().json()) as SignUpPayload;
    if (payload.user?.id && isHostedSignup) {
      const acquisition = parseAcquisition(request.headers.get("x-everlittle-acquisition")) ?? {
        first: { campaign_source: "unknown", captured_at: new Date().toISOString() },
        last: { campaign_source: "unknown", captured_at: new Date().toISOString() },
        is_test: false,
      };
      if (acquisition)
        await runtime.DB.prepare(
          "INSERT OR IGNORE INTO acquisition_snapshot(user_id,snapshot,signup_recorded) VALUES (?,?,1)",
        )
          .bind(payload.user.id, JSON.stringify(acquisition))
          .run();
    }
    if (payload.user?.id && invitation) {
      await acceptInvitation(runtime.DB, invitation, payload.user.id);
    } else if (payload.user?.id && isOwnerBootstrap) {
      await bootstrapFamily(
        runtime.DB,
        payload.user.id,
        payload.user.name ?? "Our family",
        deployment.defaultArchiveSlug,
      );
    }
  }

  return response;
}

async function readSignUpInput(request: { json(): Promise<unknown> }): Promise<SignUpInput | null> {
  try {
    return (await request.json()) as SignUpInput;
  } catch {
    return null;
  }
}

async function bootstrapFamily(
  database: D1Database,
  userId: string,
  ownerName: string,
  defaultArchiveSlug: string | null,
) {
  const archiveId = crypto.randomUUID();
  const archiveSlug = await uniqueArchiveSlug(
    database,
    defaultArchiveSlug ?? slugify(`${ownerName}-family`, `family-${archiveId.slice(0, 8)}`),
  );
  await database.batch([
    database
      .prepare("INSERT INTO family_archive (id, name, slug) VALUES (?, ?, ?)")
      .bind(archiveId, `${ownerName}'s family`, archiveSlug),
    database
      .prepare(
        "INSERT INTO family_member (id, archive_id, user_id, role) VALUES (?, ?, ?, 'owner')",
      )
      .bind(crypto.randomUUID(), archiveId, userId),
  ]);
}

async function uniqueArchiveSlug(database: D1Database, requested: string) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const suffix = attempt === 0 ? "" : `-${attempt + 1}`;
    const candidate = `${requested.slice(0, 48 - suffix.length)}${suffix}`;
    const existing = await database
      .prepare("SELECT 1 FROM family_archive WHERE slug = ?")
      .bind(candidate)
      .first();
    if (!existing) return candidate;
  }
  throw new Error("Could not create a unique family address.");
}
