import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

import { acceptInvitation, findValidInvitation, handleArchiveApi } from "@/lib/archive-api";
import { createAuth } from "@/lib/auth";
import { getDeploymentConfig } from "@/lib/deployment";
import { getRuntimeEnv } from "@/lib/runtime-env";

type SignUpPayload = { user?: { id?: string; name?: string } };
type SignUpInput = { email?: string };

export default createServerEntry({
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/auth/")) {
      return handleAuthRequest(request);
    }

    const archiveResponse = await handleArchiveApi(request);
    if (archiveResponse) return archiveResponse;

    if (url.pathname === "/api/platform" && request.method === "GET") {
      const runtime = getRuntimeEnv();
      const deployment = getDeploymentConfig(runtime);
      const row = await runtime.DB.prepare('SELECT COUNT(*) AS count FROM "user"').first<{
        count: number;
      }>();
      const child =
        deployment.mode === "self-hosted"
          ? await runtime.DB.prepare(
              `SELECT display_name AS displayName,
                      CASE WHEN access_pin_hash IS NULL THEN 0 ELSE 1 END AS enabled
               FROM child_profile ORDER BY created_at LIMIT 1`,
            ).first<{ displayName: string; enabled: number }>()
          : null;

      return Response.json({
        allowsPublicSignup: deployment.capabilities.allowsPublicSignup,
        deploymentMode: deployment.mode,
        needsSetup:
          deployment.capabilities.allowsInitialOwnerBootstrap && Number(row?.count ?? 0) === 0,
        childAccess: child
          ? { displayName: child.displayName, enabled: Boolean(child.enabled) }
          : null,
      });
    }

    return handler.fetch(request);
  },
});

async function handleAuthRequest(request: Request): Promise<Response> {
  const runtime = getRuntimeEnv();
  const deployment = getDeploymentConfig(runtime);
  const url = new URL(request.url);
  const isEmailSignUp = url.pathname.endsWith("/sign-up/email");
  const signUpInput = isEmailSignUp ? await readSignUpInput(request.clone()) : null;
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
    database: runtime.DB,
    secret: runtime.BETTER_AUTH_SECRET,
    baseURL: deployment.publicAppUrl,
    allowSignUp: isOwnerBootstrap || isHostedSignup || Boolean(invitation),
  });
  const response = await auth.handler(request);

  if (isEmailSignUp && response.ok) {
    const payload = (await response.clone().json()) as SignUpPayload;
    if (payload.user?.id && invitation) {
      await acceptInvitation(runtime.DB, invitation, payload.user.id);
    } else if (payload.user?.id && (isOwnerBootstrap || isHostedSignup)) {
      await bootstrapFamily(runtime.DB, payload.user.id, payload.user.name ?? "Our family");
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

async function bootstrapFamily(database: D1Database, userId: string, ownerName: string) {
  const archiveId = crypto.randomUUID();
  await database.batch([
    database
      .prepare("INSERT INTO family_archive (id, name, slug) VALUES (?, ?, ?)")
      .bind(archiveId, `${ownerName}'s family`, `family-${archiveId.slice(0, 8)}`),
    database
      .prepare(
        "INSERT INTO family_member (id, archive_id, user_id, role) VALUES (?, ?, ?, 'owner')",
      )
      .bind(crypto.randomUUID(), archiveId, userId),
  ]);
}
