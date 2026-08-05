import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

import { createAuth } from "@/lib/auth";
import { getRuntimeEnv } from "@/lib/runtime-env";

type SignUpPayload = { user?: { id?: string; name?: string } };

export default createServerEntry({
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/auth/")) {
      return handleAuthRequest(request);
    }

    if (url.pathname === "/api/platform" && request.method === "GET") {
      const runtime = getRuntimeEnv();
      const row = await runtime.DB.prepare('SELECT COUNT(*) AS count FROM "user"').first<{
        count: number;
      }>();

      return Response.json({ needsSetup: Number(row?.count ?? 0) === 0 });
    }

    return handler.fetch(request);
  },
});

async function handleAuthRequest(request: Request): Promise<Response> {
  const runtime = getRuntimeEnv();
  const url = new URL(request.url);
  const isEmailSignUp = url.pathname.endsWith("/sign-up/email");
  const row = isEmailSignUp
    ? await runtime.DB.prepare('SELECT COUNT(*) AS count FROM "user"').first<{ count: number }>()
    : null;
  const isFirstUser = isEmailSignUp && Number(row?.count ?? 0) === 0;
  const auth = createAuth({
    database: runtime.DB,
    secret: runtime.BETTER_AUTH_SECRET,
    baseURL: url.origin,
    allowSignUp: isFirstUser,
  });
  const response = await auth.handler(request);

  if (isFirstUser && response.ok) {
    const payload = (await response.clone().json()) as SignUpPayload;
    if (payload.user?.id) {
      await bootstrapFamily(runtime.DB, payload.user.id, payload.user.name ?? "Our family");
    }
  }

  return response;
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
