import { z } from "zod";

import { createAuth } from "@/lib/auth";
import { getRuntimeEnv } from "@/lib/runtime-env";

const invitationSchema = z.object({
  email: z.email().transform((value) => value.trim().toLowerCase()),
  role: z.enum(["parent", "contributor", "viewer"]),
});

const invitationTokenSchema = z.object({ token: z.string().min(32).max(256) });
const memberRoleSchema = z.object({ role: z.enum(["parent", "contributor", "viewer"]) });
const childSchema = z.object({
  displayName: z.string().trim().min(1).max(100),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

type FamilyRole = "owner" | "parent" | "contributor" | "viewer";

type SessionUser = {
  id: string;
  name: string;
  email: string;
};

type MembershipContext = {
  memberId: string;
  archiveId: string;
  role: FamilyRole;
  user: SessionUser;
};

type Invitation = {
  id: string;
  archiveId: string;
  archiveName: string;
  email: string;
  role: Exclude<FamilyRole, "owner">;
  expiresAt: string;
};

export async function handleArchiveApi(request: Request): Promise<Response | null> {
  const url = new URL(request.url);

  if (url.pathname === "/api/invitations/preview" && request.method === "GET") {
    return previewInvitation(request);
  }

  if (url.pathname === "/api/invitations/accept" && request.method === "POST") {
    return acceptInvitationForCurrentUser(request);
  }

  if (url.pathname === "/api/archive" && request.method === "GET") {
    return getArchiveState(request);
  }

  if (url.pathname === "/api/archive/invitations" && request.method === "POST") {
    return createInvitation(request);
  }

  if (url.pathname === "/api/archive/children" && request.method === "POST") {
    return createChildProfile(request);
  }

  const childMatch = url.pathname.match(/^\/api\/archive\/children\/([^/]+)$/);
  if (childMatch && request.method === "PUT") {
    return updateChildProfile(request, childMatch[1]);
  }

  const invitationMatch = url.pathname.match(/^\/api\/archive\/invitations\/([^/]+)$/);
  if (invitationMatch && request.method === "DELETE") {
    return revokeInvitation(request, invitationMatch[1]);
  }

  const transferMatch = url.pathname.match(/^\/api\/archive\/members\/([^/]+)\/transfer$/);
  if (transferMatch && request.method === "POST") {
    return transferOwnership(request, transferMatch[1]);
  }

  const memberMatch = url.pathname.match(/^\/api\/archive\/members\/([^/]+)$/);
  if (memberMatch && request.method === "PATCH") {
    return updateMemberRole(request, memberMatch[1]);
  }
  if (memberMatch && request.method === "DELETE") {
    return removeMember(request, memberMatch[1]);
  }

  return null;
}

export async function findValidInvitation(
  database: D1Database,
  token: string,
  email?: string,
): Promise<Invitation | null> {
  const tokenHash = await hashToken(token);
  const invitation = await database
    .prepare(
      `SELECT i.id, i.archive_id AS archiveId, a.name AS archiveName, i.email, i.role,
              i.expires_at AS expiresAt
       FROM family_invitation i
       JOIN family_archive a ON a.id = i.archive_id
       WHERE i.token_hash = ? AND i.accepted_at IS NULL AND i.revoked_at IS NULL
         AND datetime(i.expires_at) > CURRENT_TIMESTAMP`,
    )
    .bind(tokenHash)
    .first<Invitation>();

  if (!invitation) return null;
  if (email && invitation.email !== email.trim().toLowerCase()) return null;
  return invitation;
}

export async function acceptInvitation(
  database: D1Database,
  invitation: Invitation,
  userId: string,
): Promise<void> {
  const memberId = crypto.randomUUID();
  const auditId = crypto.randomUUID();

  await database.batch([
    database
      .prepare(
        `INSERT OR IGNORE INTO family_member (id, archive_id, user_id, role)
         VALUES (?, ?, ?, ?)`,
      )
      .bind(memberId, invitation.archiveId, userId, invitation.role),
    database
      .prepare(
        `UPDATE family_invitation
         SET accepted_by_user_id = ?, accepted_at = CURRENT_TIMESTAMP
         WHERE id = ? AND accepted_at IS NULL AND revoked_at IS NULL`,
      )
      .bind(userId, invitation.id),
    auditStatement(database, {
      id: auditId,
      archiveId: invitation.archiveId,
      actorUserId: userId,
      action: "invitation.accepted",
      entityType: "family_invitation",
      entityId: invitation.id,
      metadata: { role: invitation.role },
    }),
  ]);
}

async function getArchiveState(request: Request): Promise<Response> {
  const database = getRuntimeEnv().DB;
  const context = await getMembershipContext(request);
  if (!context) return unauthorized();

  const [archive, members, children, invitations] = await Promise.all([
    database
      .prepare(
        `SELECT id, name, slug, timezone, created_at AS createdAt
         FROM family_archive WHERE id = ?`,
      )
      .bind(context.archiveId)
      .first(),
    database
      .prepare(
        `SELECT fm.id, fm.user_id AS userId, fm.role, fm.created_at AS joinedAt,
                u.name, u.email, u.image
         FROM family_member fm
         JOIN "user" u ON u.id = fm.user_id
         WHERE fm.archive_id = ?
         ORDER BY CASE fm.role WHEN 'owner' THEN 0 WHEN 'parent' THEN 1
                  WHEN 'contributor' THEN 2 ELSE 3 END, fm.created_at`,
      )
      .bind(context.archiveId)
      .all(),
    database
      .prepare(
        `SELECT id, display_name AS displayName, birth_date AS birthDate,
                avatar_asset_key AS avatarAssetKey
         FROM child_profile WHERE archive_id = ? ORDER BY created_at`,
      )
      .bind(context.archiveId)
      .all(),
    context.role === "owner"
      ? database
          .prepare(
            `SELECT id, email, role, expires_at AS expiresAt, created_at AS createdAt
             FROM family_invitation
             WHERE archive_id = ? AND accepted_at IS NULL AND revoked_at IS NULL
               AND datetime(expires_at) > CURRENT_TIMESTAMP
             ORDER BY created_at DESC`,
          )
          .bind(context.archiveId)
          .all()
      : Promise.resolve({ results: [] }),
  ]);

  return Response.json({
    archive,
    currentMember: {
      id: context.memberId,
      role: context.role,
      userId: context.user.id,
    },
    members: members.results,
    children: children.results,
    invitations: invitations.results,
  });
}

async function previewInvitation(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const parsed = invitationTokenSchema.safeParse({ token });
  if (!parsed.success) return Response.json({ error: "Invalid invitation" }, { status: 400 });

  const invitation = await findValidInvitation(getRuntimeEnv().DB, parsed.data.token);
  if (!invitation)
    return Response.json({ error: "Invitation not found or expired" }, { status: 404 });

  return Response.json({
    archiveName: invitation.archiveName,
    email: invitation.email,
    role: invitation.role,
    expiresAt: invitation.expiresAt,
  });
}

async function createInvitation(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const database = getRuntimeEnv().DB;
  const context = await getMembershipContext(request);
  if (!context) return unauthorized();
  if (context.role !== "owner") return forbidden();

  const parsed = invitationSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return Response.json({ error: "Enter a valid email and family role." }, { status: 400 });
  }

  const existingMember = await database
    .prepare(
      `SELECT fm.id FROM family_member fm JOIN "user" u ON u.id = fm.user_id
       WHERE fm.archive_id = ? AND lower(u.email) = ?`,
    )
    .bind(context.archiveId, parsed.data.email)
    .first();
  if (existingMember)
    return Response.json({ error: "This person is already a member." }, { status: 409 });

  const recent = await database
    .prepare(
      `SELECT COUNT(*) AS count FROM family_invitation
       WHERE archive_id = ? AND invited_by_user_id = ?
         AND created_at > datetime('now', '-1 hour')`,
    )
    .bind(context.archiveId, context.user.id)
    .first<{ count: number }>();
  if (Number(recent?.count ?? 0) >= 20) {
    return Response.json({ error: "Invitation limit reached. Try again later." }, { status: 429 });
  }

  await database
    .prepare(
      `UPDATE family_invitation SET revoked_at = CURRENT_TIMESTAMP
       WHERE archive_id = ? AND email = ? AND accepted_at IS NULL AND revoked_at IS NULL`,
    )
    .bind(context.archiveId, parsed.data.email)
    .run();

  const rawToken = createSecureToken();
  const invitationId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await database.batch([
    database
      .prepare(
        `INSERT INTO family_invitation
          (id, archive_id, email, role, token_hash, invited_by_user_id, expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        invitationId,
        context.archiveId,
        parsed.data.email,
        parsed.data.role,
        await hashToken(rawToken),
        context.user.id,
        expiresAt,
      ),
    auditStatement(database, {
      id: crypto.randomUUID(),
      archiveId: context.archiveId,
      actorUserId: context.user.id,
      action: "invitation.created",
      entityType: "family_invitation",
      entityId: invitationId,
      metadata: { email: parsed.data.email, role: parsed.data.role },
    }),
  ]);

  const invitationUrl = new URL(request.url);
  invitationUrl.pathname = "/";
  invitationUrl.search = "";
  invitationUrl.searchParams.set("invite", rawToken);

  return Response.json(
    { id: invitationId, invitationUrl: invitationUrl.toString(), expiresAt },
    { status: 201 },
  );
}

async function acceptInvitationForCurrentUser(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const database = getRuntimeEnv().DB;
  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  const parsed = invitationTokenSchema.safeParse(await readJson(request));
  if (!parsed.success) return Response.json({ error: "Invalid invitation" }, { status: 400 });
  const invitation = await findValidInvitation(database, parsed.data.token, session.email);
  if (!invitation)
    return Response.json({ error: "Invitation not found or expired" }, { status: 404 });

  await acceptInvitation(database, invitation, session.id);
  return Response.json({ accepted: true });
}

async function revokeInvitation(request: Request, invitationId: string): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const database = getRuntimeEnv().DB;
  const context = await getMembershipContext(request);
  if (!context) return unauthorized();
  if (context.role !== "owner") return forbidden();

  const invitation = await database
    .prepare(
      `SELECT id FROM family_invitation
       WHERE id = ? AND archive_id = ? AND accepted_at IS NULL AND revoked_at IS NULL`,
    )
    .bind(invitationId, context.archiveId)
    .first();
  if (!invitation) return Response.json({ error: "Invitation not found" }, { status: 404 });

  await database.batch([
    database
      .prepare("UPDATE family_invitation SET revoked_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(invitationId),
    auditStatement(database, {
      id: crypto.randomUUID(),
      archiveId: context.archiveId,
      actorUserId: context.user.id,
      action: "invitation.revoked",
      entityType: "family_invitation",
      entityId: invitationId,
    }),
  ]);
  return Response.json({ revoked: true });
}

async function updateMemberRole(request: Request, memberId: string): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const database = getRuntimeEnv().DB;
  const context = await getMembershipContext(request);
  if (!context) return unauthorized();
  if (context.role !== "owner") return forbidden();

  const parsed = memberRoleSchema.safeParse(await readJson(request));
  if (!parsed.success) return Response.json({ error: "Invalid family role" }, { status: 400 });
  const target = await getMember(database, context.archiveId, memberId);
  if (!target) return Response.json({ error: "Member not found" }, { status: 404 });
  if (target.role === "owner") {
    return Response.json(
      { error: "Transfer ownership before changing this role." },
      { status: 409 },
    );
  }

  await database.batch([
    database
      .prepare("UPDATE family_member SET role = ? WHERE id = ?")
      .bind(parsed.data.role, memberId),
    auditStatement(database, {
      id: crypto.randomUUID(),
      archiveId: context.archiveId,
      actorUserId: context.user.id,
      action: "member.role_changed",
      entityType: "family_member",
      entityId: memberId,
      metadata: { from: target.role, to: parsed.data.role },
    }),
  ]);
  return Response.json({ updated: true });
}

async function transferOwnership(request: Request, targetMemberId: string): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const database = getRuntimeEnv().DB;
  const context = await getMembershipContext(request);
  if (!context) return unauthorized();
  if (context.role !== "owner") return forbidden();
  if (targetMemberId === context.memberId) {
    return Response.json({ error: "You already own this archive." }, { status: 409 });
  }

  const target = await getMember(database, context.archiveId, targetMemberId);
  if (!target) return Response.json({ error: "Member not found" }, { status: 404 });

  const results = await database.batch([
    database
      .prepare(
        `UPDATE family_member
         SET role = CASE WHEN id = ? THEN 'owner' ELSE 'parent' END
         WHERE archive_id = ? AND id IN (?, ?)
           AND EXISTS (SELECT 1 FROM family_member WHERE id = ? AND role = 'owner')`,
      )
      .bind(
        targetMemberId,
        context.archiveId,
        targetMemberId,
        context.memberId,
        context.memberId,
      ),
    database
      .prepare(
        `INSERT INTO audit_event
          (id, archive_id, actor_user_id, action, entity_type, entity_id, metadata_json)
         SELECT ?, ?, ?, 'ownership.transferred', 'family_member', ?, ?
         WHERE EXISTS (SELECT 1 FROM family_member WHERE id = ? AND role = 'owner')
           AND EXISTS (SELECT 1 FROM family_member WHERE id = ? AND role = 'parent')`,
      )
      .bind(
        crypto.randomUUID(),
        context.archiveId,
        context.user.id,
        targetMemberId,
        JSON.stringify({ previousOwnerMemberId: context.memberId }),
        targetMemberId,
        context.memberId,
      ),
  ]);

  if (Number(results[0]?.meta.changes ?? 0) !== 2) {
    return Response.json(
      { error: "Ownership changed before this request completed. Refresh and try again." },
      { status: 409 },
    );
  }

  return Response.json({ transferred: true });
}

async function removeMember(request: Request, targetMemberId: string): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const database = getRuntimeEnv().DB;
  const context = await getMembershipContext(request);
  if (!context) return unauthorized();

  const target = await getMember(database, context.archiveId, targetMemberId);
  if (!target) return Response.json({ error: "Member not found" }, { status: 404 });
  const isSelf = targetMemberId === context.memberId;
  if (!isSelf && context.role !== "owner") return forbidden();
  if (target.role === "owner") {
    return Response.json(
      {
        error: isSelf ? "Transfer ownership before leaving." : "Transfer ownership before removal.",
      },
      { status: 409 },
    );
  }

  await database.batch([
    database.prepare("DELETE FROM family_member WHERE id = ?").bind(targetMemberId),
    auditStatement(database, {
      id: crypto.randomUUID(),
      archiveId: context.archiveId,
      actorUserId: context.user.id,
      action: isSelf ? "member.left" : "member.removed",
      entityType: "family_member",
      entityId: targetMemberId,
      metadata: { removedUserId: target.userId, previousRole: target.role },
    }),
  ]);
  return Response.json({ removed: true });
}

async function createChildProfile(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const database = getRuntimeEnv().DB;
  const context = await getMembershipContext(request);
  if (!context) return unauthorized();
  if (context.role !== "owner" && context.role !== "parent") return forbidden();
  const parsed = childSchema.safeParse(await readJson(request));
  if (!parsed.success || !isValidBirthDate(parsed.data.birthDate))
    return Response.json({ error: "Enter a name and birth date." }, { status: 400 });

  const childId = crypto.randomUUID();
  await database.batch([
    database
      .prepare(
        `INSERT INTO child_profile (id, archive_id, display_name, birth_date)
         VALUES (?, ?, ?, ?)`,
      )
      .bind(childId, context.archiveId, parsed.data.displayName, parsed.data.birthDate),
    auditStatement(database, {
      id: crypto.randomUUID(),
      archiveId: context.archiveId,
      actorUserId: context.user.id,
      action: "child.created",
      entityType: "child_profile",
      entityId: childId,
    }),
  ]);
  return Response.json({ id: childId }, { status: 201 });
}

async function updateChildProfile(request: Request, childId: string): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const database = getRuntimeEnv().DB;
  const context = await getMembershipContext(request);
  if (!context) return unauthorized();
  if (context.role !== "owner" && context.role !== "parent") return forbidden();
  const parsed = childSchema.safeParse(await readJson(request));
  if (!parsed.success || !isValidBirthDate(parsed.data.birthDate))
    return Response.json({ error: "Enter a name and birth date." }, { status: 400 });

  const child = await database
    .prepare("SELECT id FROM child_profile WHERE id = ? AND archive_id = ?")
    .bind(childId, context.archiveId)
    .first();
  if (!child) return Response.json({ error: "Child profile not found" }, { status: 404 });

  await database.batch([
    database
      .prepare(
        `UPDATE child_profile SET display_name = ?, birth_date = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
      )
      .bind(parsed.data.displayName, parsed.data.birthDate, childId),
    auditStatement(database, {
      id: crypto.randomUUID(),
      archiveId: context.archiveId,
      actorUserId: context.user.id,
      action: "child.updated",
      entityType: "child_profile",
      entityId: childId,
    }),
  ]);
  return Response.json({ updated: true });
}

async function getMembershipContext(request: Request): Promise<MembershipContext | null> {
  const user = await getSessionUser(request);
  if (!user) return null;
  const membership = await getRuntimeEnv()
    .DB.prepare(
      `SELECT id AS memberId, archive_id AS archiveId, role
     FROM family_member WHERE user_id = ?
     ORDER BY CASE role WHEN 'owner' THEN 0 WHEN 'parent' THEN 1 ELSE 2 END LIMIT 1`,
    )
    .bind(user.id)
    .first<Omit<MembershipContext, "user">>();
  return membership ? { ...membership, user } : null;
}

async function getSessionUser(request: Request): Promise<SessionUser | null> {
  const runtime = getRuntimeEnv();
  const auth = createAuth({
    database: runtime.DB,
    secret: runtime.BETTER_AUTH_SECRET,
    baseURL: new URL(request.url).origin,
    allowSignUp: false,
  });
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user.id || !session.user.email) return null;
  return { id: session.user.id, name: session.user.name, email: session.user.email };
}

async function getMember(database: D1Database, archiveId: string, memberId: string) {
  return database
    .prepare(
      "SELECT id, user_id AS userId, role FROM family_member WHERE id = ? AND archive_id = ?",
    )
    .bind(memberId, archiveId)
    .first<{ id: string; userId: string; role: FamilyRole }>();
}

function auditStatement(
  database: D1Database,
  event: {
    id: string;
    archiveId: string;
    actorUserId: string;
    action: string;
    entityType: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
  },
) {
  return database
    .prepare(
      `INSERT INTO audit_event
        (id, archive_id, actor_user_id, action, entity_type, entity_id, metadata_json)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      event.id,
      event.archiveId,
      event.actorUserId,
      event.action,
      event.entityType,
      event.entityId ?? null,
      event.metadata ? JSON.stringify(event.metadata) : null,
    );
}

function createSecureToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}

async function hashToken(token: string): Promise<string> {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return Boolean(origin && origin === new URL(request.url).origin);
}

async function readJson(request: Request): Promise<unknown> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 16_384) return null;
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function unauthorized() {
  return Response.json({ error: "Sign in to continue." }, { status: 401 });
}

function forbidden() {
  return Response.json({ error: "You do not have permission to do that." }, { status: 403 });
}

function isValidBirthDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00.000Z`);
  const today = new Date().toISOString().slice(0, 10);
  return (
    !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value && value <= today
  );
}
