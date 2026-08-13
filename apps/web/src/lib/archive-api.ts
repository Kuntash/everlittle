import { z } from "zod";
import { childSlugSchema, familySlugSchema, slugify } from "@everlittle/domain";

import { createAuth } from "@/lib/auth";
import { getRuntimeEnv } from "@/lib/runtime-env";
import { getDeploymentConfig } from "@/lib/deployment";
import { sendInvitationEmail } from "@/lib/invitation-email";

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
const memorySchema = z.object({
  childId: z.string().uuid(),
  kind: z.enum(["photo", "story", "voice", "video", "milestone", "letter"]),
  title: z.string().trim().min(1).max(160),
  body: z.string().trim().max(20_000).optional(),
  happenedAt: z.iso.datetime(),
  audience: z.enum(["parents", "family", "child", "all"]),
});
const capsuleSchema = z.object({
  childId: z.string().uuid(),
  title: z.string().trim().min(1).max(160),
  body: z.string().trim().min(1).max(20_000),
  unlocksAt: z.iso.datetime(),
  audience: z.enum(["family", "child"]),
});
const childPinSchema = z.object({ pin: z.string().regex(/^\d{6}$/) });
const onboardingDraftSchema = z.object({
  familyName: z.string().trim().min(1).max(100).optional(),
  familySlug: familySlugSchema.optional(),
  childName: z.string().trim().min(1).max(100).optional(),
  childBirthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  timezone: z.string().trim().min(1).max(100).optional(),
});
const onboardingCompletionSchema = z.object({
  familyName: z.string().trim().min(1).max(100),
  familySlug: familySlugSchema,
  childName: z.string().trim().min(1).max(100),
  childBirthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timezone: z.string().trim().min(1).max(100),
  childPin: z.union([z.literal(""), z.string().regex(/^\d{6}$/)]),
});

const MAX_MEDIA_BYTES = 50 * 1024 * 1024;
const CHILD_SESSION_COOKIE = "everlittle.child_session";
const CHILD_SESSION_SECONDS = 60 * 60 * 24 * 7;
const FAMILY_SLUG_HEADER = "x-everlittle-family-slug";
const CHILD_SLUG_HEADER = "x-everlittle-child-slug";
const MEDIA_TYPES: ReadonlyMap<
  string,
  { mediaType: "image" | "audio" | "video"; extension: string }
> = new Map([
  ["image/jpeg", { mediaType: "image", extension: "jpg" }],
  ["image/png", { mediaType: "image", extension: "png" }],
  ["image/webp", { mediaType: "image", extension: "webp" }],
  ["image/gif", { mediaType: "image", extension: "gif" }],
  ["image/heic", { mediaType: "image", extension: "heic" }],
  ["image/heif", { mediaType: "image", extension: "heif" }],
  ["image/heic-sequence", { mediaType: "image", extension: "heic" }],
  ["image/heif-sequence", { mediaType: "image", extension: "heif" }],
  ["audio/mpeg", { mediaType: "audio", extension: "mp3" }],
  ["audio/mp4", { mediaType: "audio", extension: "m4a" }],
  ["audio/x-m4a", { mediaType: "audio", extension: "m4a" }],
  ["audio/aac", { mediaType: "audio", extension: "aac" }],
  ["audio/webm", { mediaType: "audio", extension: "webm" }],
  ["audio/ogg", { mediaType: "audio", extension: "ogg" }],
  ["audio/wav", { mediaType: "audio", extension: "wav" }],
  ["audio/wave", { mediaType: "audio", extension: "wav" }],
  ["audio/x-wav", { mediaType: "audio", extension: "wav" }],
  ["audio/x-caf", { mediaType: "audio", extension: "caf" }],
  ["audio/3gpp", { mediaType: "audio", extension: "3gp" }],
  ["video/mp4", { mediaType: "video", extension: "mp4" }],
  ["video/webm", { mediaType: "video", extension: "webm" }],
  ["video/quicktime", { mediaType: "video", extension: "mov" }],
  ["video/x-m4v", { mediaType: "video", extension: "m4v" }],
  ["video/hevc", { mediaType: "video", extension: "mov" }],
  ["video/h265", { mediaType: "video", extension: "mov" }],
]);

const MEDIA_EXTENSIONS = new Map([
  ["jpg", { mediaType: "image" as const, extension: "jpg", contentType: "image/jpeg" }],
  ["jpeg", { mediaType: "image" as const, extension: "jpg", contentType: "image/jpeg" }],
  ["png", { mediaType: "image" as const, extension: "png", contentType: "image/png" }],
  ["webp", { mediaType: "image" as const, extension: "webp", contentType: "image/webp" }],
  ["gif", { mediaType: "image" as const, extension: "gif", contentType: "image/gif" }],
  ["heic", { mediaType: "image" as const, extension: "heic", contentType: "image/heic" }],
  ["heif", { mediaType: "image" as const, extension: "heif", contentType: "image/heif" }],
  ["mp3", { mediaType: "audio" as const, extension: "mp3", contentType: "audio/mpeg" }],
  ["m4a", { mediaType: "audio" as const, extension: "m4a", contentType: "audio/mp4" }],
  ["aac", { mediaType: "audio" as const, extension: "aac", contentType: "audio/aac" }],
  ["wav", { mediaType: "audio" as const, extension: "wav", contentType: "audio/wav" }],
  ["ogg", { mediaType: "audio" as const, extension: "ogg", contentType: "audio/ogg" }],
  ["caf", { mediaType: "audio" as const, extension: "caf", contentType: "audio/x-caf" }],
  ["mp4", { mediaType: "video" as const, extension: "mp4", contentType: "video/mp4" }],
  ["mov", { mediaType: "video" as const, extension: "mov", contentType: "video/quicktime" }],
  ["m4v", { mediaType: "video" as const, extension: "m4v", contentType: "video/x-m4v" }],
  ["webm", { mediaType: "video" as const, extension: "webm", contentType: "video/webm" }],
  ["3gp", { mediaType: "video" as const, extension: "3gp", contentType: "video/3gpp" }],
]);

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

type ChildAccessContext = {
  sessionId: string;
  childId: string;
  archiveId: string;
  displayName: string;
  birthDate: string;
  childSlug: string;
  familySlug: string;
};

type Invitation = {
  id: string;
  archiveId: string;
  archiveName: string;
  email: string;
  role: Exclude<FamilyRole, "owner">;
  expiresAt: string;
  inviterName: string;
};

type PublicMemory = {
  id: string;
  kind: string;
  title: string;
  body: string | null;
  happenedAt: string;
  childName: string;
  authorName: string | null;
  mediaId: string | null;
  objectKey: string | null;
  mediaType: "image" | "audio" | "video" | null;
  contentType: string | null;
};

export async function handleArchiveApi(request: Request): Promise<Response | null> {
  const url = new URL(request.url);

  if (url.pathname === "/api/onboarding" && request.method === "GET") {
    return getOnboarding(request);
  }
  if (url.pathname === "/api/onboarding" && request.method === "PATCH") {
    return saveOnboardingDraft(request);
  }
  if (url.pathname === "/api/onboarding" && request.method === "POST") {
    return completeOnboarding(request);
  }
  if (url.pathname === "/api/onboarding/slug" && request.method === "GET") {
    return checkOnboardingSlug(request);
  }
  const scopedApiMatch = url.pathname.match(/^\/api\/families\/([^/]+)(\/.*)$/);
  if (scopedApiMatch) {
    const slug = decodeURIComponent(scopedApiMatch[1]);
    if (!familySlugSchema.safeParse(slug).success) return notFound();
    const headers = new Headers(request.headers);
    headers.set(FAMILY_SLUG_HEADER, slug);
    const childMatch = scopedApiMatch[2].match(/^\/children\/([^/]+)(?:\/|$)/);
    if (childMatch) {
      const childSlug = decodeURIComponent(childMatch[1]);
      if (!childSlugSchema.safeParse(childSlug).success) return notFound();
      headers.set(CHILD_SLUG_HEADER, childSlug);
    }
    request = new Request(request, { headers });
    url.pathname = `/api${scopedApiMatch[2]}`;
  }

  if (url.pathname === "/api/children" && request.method === "GET") {
    return listPublicChildren(request);
  }
  if (url.pathname.match(/^\/api\/children\/[^/]+\/sign-in$/) && request.method === "POST") {
    return signInChild(request);
  }
  if (url.pathname.match(/^\/api\/children\/[^/]+\/session$/) && request.method === "GET") {
    return getChildSession(request);
  }
  if (url.pathname.match(/^\/api\/children\/[^/]+\/sign-out$/) && request.method === "POST") {
    return signOutChild(request);
  }
  if (url.pathname.match(/^\/api\/children\/[^/]+\/archive$/) && request.method === "GET") {
    return getChildArchive(request);
  }

  const publicSharePageMatch = url.pathname.match(/^\/share\/([A-Za-z0-9_-]{43})$/);
  if (publicSharePageMatch && request.method === "GET") {
    return servePublicMemoryPage(request, publicSharePageMatch[1]);
  }

  const publicShareMediaMatch = url.pathname.match(
    /^\/api\/public\/shares\/([A-Za-z0-9_-]{43})\/media$/,
  );
  if (publicShareMediaMatch && request.method === "GET") {
    return servePublicMemoryMedia(request, publicShareMediaMatch[1]);
  }

  if (url.pathname === "/api/child/session" && request.method === "GET") {
    return getChildSession(request);
  }
  if (url.pathname === "/api/child/sign-in" && request.method === "POST") {
    return signInChild(request);
  }
  if (url.pathname === "/api/child/sign-out" && request.method === "POST") {
    return signOutChild(request);
  }
  if (url.pathname === "/api/child/archive" && request.method === "GET") {
    return getChildArchive(request);
  }

  if (url.pathname === "/api/invitations/preview" && request.method === "GET") {
    return previewInvitation(request);
  }

  if (url.pathname === "/api/invitations/accept" && request.method === "POST") {
    return acceptInvitationForCurrentUser(request);
  }

  if (url.pathname === "/api/archive" && request.method === "GET") {
    return getArchiveState(request);
  }

  if (url.pathname === "/api/archives" && request.method === "GET") {
    return listUserArchives(request);
  }

  if (url.pathname === "/api/archive/invitations" && request.method === "POST") {
    return createInvitation(request);
  }

  const resendInvitationMatch = url.pathname.match(
    /^\/api\/archive\/invitations\/([^/]+)\/resend$/,
  );
  if (resendInvitationMatch && request.method === "POST") {
    return resendInvitation(request, resendInvitationMatch[1]);
  }

  if (url.pathname === "/api/archive/children" && request.method === "POST") {
    return createChildProfile(request);
  }

  if (url.pathname === "/api/archive/memories" && request.method === "POST") {
    return createMemory(request);
  }

  if (url.pathname === "/api/archive/capsules" && request.method === "POST") {
    return createCapsule(request);
  }

  const mediaViewMatch = url.pathname.match(/^\/api\/media\/([^/]+)$/);
  if (mediaViewMatch && request.method === "GET") {
    return serveMedia(request, mediaViewMatch[1]);
  }

  const memoryMediaMatch = url.pathname.match(/^\/api\/archive\/memories\/([^/]+)\/media$/);
  if (memoryMediaMatch && request.method === "PUT") {
    return uploadMemoryMedia(request, memoryMediaMatch[1]);
  }

  const memoryShareMatch = url.pathname.match(/^\/api\/archive\/memories\/([^/]+)\/share$/);
  if (memoryShareMatch && request.method === "POST") {
    return createPublicMemoryShare(request, memoryShareMatch[1]);
  }
  if (memoryShareMatch && request.method === "DELETE") {
    return revokePublicMemoryShare(request, memoryShareMatch[1]);
  }

  const memoryMatch = url.pathname.match(/^\/api\/archive\/memories\/([^/]+)$/);
  if (memoryMatch && request.method === "PATCH") {
    return updateMemory(request, memoryMatch[1]);
  }
  if (memoryMatch && request.method === "DELETE") {
    return deleteMemory(request, memoryMatch[1]);
  }

  const capsuleMatch = url.pathname.match(/^\/api\/archive\/capsules\/([^/]+)$/);
  if (capsuleMatch && request.method === "DELETE") {
    return deleteCapsule(request, capsuleMatch[1]);
  }

  const childMatch = url.pathname.match(/^\/api\/archive\/children\/([^/]+)$/);
  if (childMatch && request.method === "PUT") {
    return updateChildProfile(request, childMatch[1]);
  }

  const childPinMatch = url.pathname.match(/^\/api\/archive\/children\/([^/]+)\/access-pin$/);
  if (childPinMatch && request.method === "PUT") {
    return setChildAccessPin(request, childPinMatch[1]);
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
              i.expires_at AS expiresAt, inviter.name AS inviterName
       FROM family_invitation i
       JOIN family_archive a ON a.id = i.archive_id
       JOIN "user" inviter ON inviter.id = i.invited_by_user_id
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

  const [archive, members, children, memories, capsules, invitations] = await Promise.all([
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
        `SELECT id, slug, display_name AS displayName, birth_date AS birthDate,
                avatar_asset_key AS avatarAssetKey,
                CASE WHEN access_pin_hash IS NULL THEN 0 ELSE 1 END AS childAccessEnabled
         FROM child_profile WHERE archive_id = ? ORDER BY created_at`,
      )
      .bind(context.archiveId)
      .all(),
    database
      .prepare(
        `SELECT m.id, m.child_id AS childId, m.kind, m.title, m.body,
                m.happened_at AS happenedAt, m.audience, m.created_at AS createdAt,
                m.created_by_user_id AS createdByUserId, u.name AS authorName,
                ma.id AS mediaId, ma.media_type AS mediaType,
                ma.content_type AS contentType, ma.byte_size AS byteSize
         FROM memory m
         LEFT JOIN "user" u ON u.id = m.created_by_user_id
         LEFT JOIN media_asset ma ON ma.id = (
           SELECT first_asset.id FROM media_asset first_asset
           WHERE first_asset.memory_id = m.id ORDER BY first_asset.created_at LIMIT 1
         )
         WHERE m.archive_id = ?
           AND (m.audience != 'parents' OR ? IN ('owner', 'parent'))
         ORDER BY m.happened_at DESC, m.created_at DESC
         LIMIT 100`,
      )
      .bind(context.archiveId, context.role)
      .all(),
    database
      .prepare(
        `SELECT tc.id, tc.child_id AS childId, tc.title, tc.unlocks_at AS unlocksAt,
                tc.audience, tc.created_at AS createdAt,
                tc.created_by_user_id AS createdByUserId, u.name AS authorName,
                CASE WHEN datetime(tc.unlocks_at) <= CURRENT_TIMESTAMP THEN tc.body ELSE NULL END AS body,
                CASE WHEN datetime(tc.unlocks_at) <= CURRENT_TIMESTAMP THEN 0 ELSE 1 END AS locked
         FROM time_capsule tc
         JOIN child_profile c ON c.id = tc.child_id
         LEFT JOIN "user" u ON u.id = tc.created_by_user_id
         WHERE c.archive_id = ?
         ORDER BY datetime(tc.unlocks_at), tc.created_at DESC`,
      )
      .bind(context.archiveId)
      .all(),
    context.role === "owner"
      ? database
          .prepare(
            `SELECT id, email, role, expires_at AS expiresAt, created_at AS createdAt,
                    email_status AS emailStatus, email_sent_at AS emailSentAt,
                    email_attempt_count AS emailAttemptCount
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
    memories: memories.results,
    capsules: capsules.results,
    invitations: invitations.results,
  });
}

async function listUserArchives(request: Request): Promise<Response> {
  const user = await getSessionUser(request);
  if (!user) return unauthorized();
  const archives = await getRuntimeEnv()
    .DB.prepare(
      `SELECT a.id, a.name, a.slug, fm.role
       FROM family_member fm
       JOIN family_archive a ON a.id = fm.archive_id
       WHERE fm.user_id = ?
       ORDER BY fm.created_at, a.name`,
    )
    .bind(user.id)
    .all<{ id: string; name: string; slug: string; role: FamilyRole }>();
  return Response.json({ archives: archives.results });
}

async function getOnboarding(request: Request): Promise<Response> {
  const runtime = getRuntimeEnv();
  if (getDeploymentConfig(runtime).mode !== "hosted") return notFound();
  const user = await getSessionUser(request);
  if (!user) return unauthorized();

  const membership = await runtime.DB.prepare(
    `SELECT a.slug FROM family_member fm
     JOIN family_archive a ON a.id = fm.archive_id
     WHERE fm.user_id = ? ORDER BY fm.created_at LIMIT 1`,
  )
    .bind(user.id)
    .first<{ slug: string }>();
  if (membership) return Response.json({ complete: true, archiveSlug: membership.slug });

  const draft = await runtime.DB.prepare(
    `SELECT family_name AS familyName, family_slug AS familySlug,
            child_name AS childName, child_birth_date AS childBirthDate, timezone
     FROM onboarding_draft WHERE user_id = ?`,
  )
    .bind(user.id)
    .first<{
      familyName: string | null;
      familySlug: string | null;
      childName: string | null;
      childBirthDate: string | null;
      timezone: string | null;
    }>();
  return Response.json({ complete: false, draft: draft ?? null });
}

async function saveOnboardingDraft(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const runtime = getRuntimeEnv();
  if (getDeploymentConfig(runtime).mode !== "hosted") return notFound();
  const user = await getSessionUser(request);
  if (!user) return unauthorized();
  const parsed = onboardingDraftSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return Response.json({ error: "Check the details you entered." }, { status: 400 });
  }
  const current = await runtime.DB.prepare(
    `SELECT family_name AS familyName, family_slug AS familySlug,
            child_name AS childName, child_birth_date AS childBirthDate, timezone
     FROM onboarding_draft WHERE user_id = ?`,
  )
    .bind(user.id)
    .first<Record<string, string | null>>();
  const draft = { ...current, ...parsed.data };
  await runtime.DB.prepare(
    `INSERT INTO onboarding_draft
       (user_id, family_name, family_slug, child_name, child_birth_date, timezone, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(user_id) DO UPDATE SET
       family_name = excluded.family_name,
       family_slug = excluded.family_slug,
       child_name = excluded.child_name,
       child_birth_date = excluded.child_birth_date,
       timezone = excluded.timezone,
       updated_at = CURRENT_TIMESTAMP`,
  )
    .bind(
      user.id,
      draft.familyName ?? null,
      draft.familySlug ?? null,
      draft.childName ?? null,
      draft.childBirthDate ?? null,
      draft.timezone ?? null,
    )
    .run();
  return Response.json({ saved: true });
}

async function checkOnboardingSlug(request: Request): Promise<Response> {
  const runtime = getRuntimeEnv();
  if (getDeploymentConfig(runtime).mode !== "hosted") return notFound();
  if (!(await getSessionUser(request))) return unauthorized();
  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  if (!familySlugSchema.safeParse(slug).success) {
    return Response.json({ available: false, reason: "Choose 3-48 letters, numbers, or hyphens." });
  }
  const existing = await runtime.DB.prepare("SELECT 1 FROM family_archive WHERE slug = ?")
    .bind(slug)
    .first();
  return Response.json({ available: !existing });
}

async function completeOnboarding(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const runtime = getRuntimeEnv();
  if (getDeploymentConfig(runtime).mode !== "hosted") return notFound();
  const user = await getSessionUser(request);
  if (!user) return unauthorized();
  const parsed = onboardingCompletionSchema.safeParse(await readJson(request));
  if (
    !parsed.success ||
    !isValidTimezone(parsed.data.timezone) ||
    !isValidBirthDate(parsed.data.childBirthDate)
  ) {
    return Response.json({ error: "Check your family and child details." }, { status: 400 });
  }
  const existingMembership = await runtime.DB.prepare(
    "SELECT 1 FROM family_member WHERE user_id = ? LIMIT 1",
  )
    .bind(user.id)
    .first();
  if (existingMembership) {
    return Response.json({ error: "This account already belongs to a family." }, { status: 409 });
  }
  const slugTaken = await runtime.DB.prepare("SELECT 1 FROM family_archive WHERE slug = ?")
    .bind(parsed.data.familySlug)
    .first();
  if (slugTaken) {
    return Response.json({ error: "That family address is already taken." }, { status: 409 });
  }

  const archiveId = crypto.randomUUID();
  const childId = crypto.randomUUID();
  const childSlug = await uniqueChildSlug(
    runtime.DB,
    archiveId,
    slugify(parsed.data.childName, `child-${childId.slice(0, 8)}`),
  );
  const pinHash = parsed.data.childPin
    ? await keyedHash(runtime.BETTER_AUTH_SECRET, `${childId}:${parsed.data.childPin}`)
    : null;
  try {
    await runtime.DB.batch([
      runtime.DB.prepare(
        "INSERT INTO family_archive (id, name, slug, timezone) VALUES (?, ?, ?, ?)",
      ).bind(archiveId, parsed.data.familyName, parsed.data.familySlug, parsed.data.timezone),
      runtime.DB.prepare(
        "INSERT INTO family_member (id, archive_id, user_id, role) VALUES (?, ?, ?, 'owner')",
      ).bind(crypto.randomUUID(), archiveId, user.id),
      runtime.DB.prepare(
        `INSERT INTO child_profile
          (id, archive_id, slug, display_name, birth_date, access_pin_hash)
         VALUES (?, ?, ?, ?, ?, ?)`,
      ).bind(
        childId,
        archiveId,
        childSlug,
        parsed.data.childName,
        parsed.data.childBirthDate,
        pinHash,
      ),
      runtime.DB.prepare("DELETE FROM onboarding_draft WHERE user_id = ?").bind(user.id),
    ]);
  } catch {
    return Response.json(
      { error: "We could not create that family. Try another address." },
      { status: 409 },
    );
  }
  return Response.json({ archiveSlug: parsed.data.familySlug }, { status: 201 });
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
    inviterName: invitation.inviterName,
  });
}

async function createInvitation(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const runtime = getRuntimeEnv();
  const database = runtime.DB;
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

  const invitationUrl = new URL(
    `/invite/${encodeURIComponent(rawToken)}`,
    getDeploymentConfig(runtime).publicAppUrl,
  );

  const archive = await database
    .prepare("SELECT name FROM family_archive WHERE id = ?")
    .bind(context.archiveId)
    .first<{ name: string }>();
  const delivery = await deliverInvitation(runtime, {
    archiveId: context.archiveId,
    archiveName: archive?.name ?? "your family archive",
    invitationId,
    invitationUrl: invitationUrl.toString(),
    inviter: context.user,
    recipient: parsed.data.email,
    role: parsed.data.role,
    expiresAt,
  });

  return Response.json(
    { id: invitationId, invitationUrl: invitationUrl.toString(), expiresAt, delivery },
    { status: 201 },
  );
}

async function resendInvitation(request: Request, invitationId: string): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const runtime = getRuntimeEnv();
  const context = await getMembershipContext(request);
  if (!context) return unauthorized();
  if (context.role !== "owner") return forbidden();

  const invitation = await runtime.DB.prepare(
    `SELECT i.id, i.email, i.role, a.name AS archiveName, i.email_last_attempt_at AS lastAttempt
     FROM family_invitation i JOIN family_archive a ON a.id = i.archive_id
     WHERE i.id = ? AND i.archive_id = ? AND i.accepted_at IS NULL AND i.revoked_at IS NULL`,
  )
    .bind(invitationId, context.archiveId)
    .first<{
      id: string;
      email: string;
      role: "parent" | "contributor" | "viewer";
      archiveName: string;
      lastAttempt: string | null;
    }>();
  if (!invitation) return Response.json({ error: "Invitation not found" }, { status: 404 });
  if (
    invitation.lastAttempt &&
    Date.now() - new Date(`${invitation.lastAttempt}Z`).getTime() < 60_000
  ) {
    return Response.json(
      { error: "Wait a minute before sending this invitation again." },
      { status: 429 },
    );
  }

  const rawToken = createSecureToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await runtime.DB.batch([
    runtime.DB.prepare(
      `UPDATE family_invitation SET token_hash = ?, expires_at = ?, email_status = 'not_sent'
       WHERE id = ?`,
    ).bind(await hashToken(rawToken), expiresAt, invitationId),
    auditStatement(runtime.DB, {
      id: crypto.randomUUID(),
      archiveId: context.archiveId,
      actorUserId: context.user.id,
      action: "invitation.replaced",
      entityType: "family_invitation",
      entityId: invitationId,
    }),
  ]);
  const invitationUrl = new URL(
    `/invite/${encodeURIComponent(rawToken)}`,
    getDeploymentConfig(runtime).publicAppUrl,
  );
  const delivery = await deliverInvitation(runtime, {
    archiveId: context.archiveId,
    archiveName: invitation.archiveName,
    invitationId,
    invitationUrl: invitationUrl.toString(),
    inviter: context.user,
    recipient: invitation.email,
    role: invitation.role,
    expiresAt,
  });
  return Response.json({ invitationUrl: invitationUrl.toString(), expiresAt, delivery });
}

async function deliverInvitation(
  runtime: Env,
  input: {
    archiveId: string;
    archiveName: string;
    invitationId: string;
    invitationUrl: string;
    inviter: SessionUser;
    recipient: string;
    role: "parent" | "contributor" | "viewer";
    expiresAt: string;
  },
) {
  try {
    const messageId = await sendInvitationEmail(runtime, {
      archiveName: input.archiveName,
      expiresAt: input.expiresAt,
      invitationUrl: input.invitationUrl,
      inviterEmail: input.inviter.email,
      inviterName: input.inviter.name,
      recipient: input.recipient,
      role: input.role,
    });
    await runtime.DB.batch([
      runtime.DB.prepare(
        `UPDATE family_invitation SET email_status = 'sent', email_message_id = ?,
         email_sent_at = CURRENT_TIMESTAMP, email_last_attempt_at = CURRENT_TIMESTAMP,
         email_attempt_count = email_attempt_count + 1 WHERE id = ?`,
      ).bind(messageId, input.invitationId),
      auditStatement(runtime.DB, {
        id: crypto.randomUUID(),
        archiveId: input.archiveId,
        actorUserId: input.inviter.id,
        action: "invitation.email_sent",
        entityType: "family_invitation",
        entityId: input.invitationId,
      }),
    ]);
    return { status: "sent" as const };
  } catch (error) {
    console.error(
      JSON.stringify({ event: "invitation.email_failed", invitationId: input.invitationId }),
    );
    await runtime.DB.batch([
      runtime.DB.prepare(
        `UPDATE family_invitation SET email_status = 'failed', email_last_attempt_at = CURRENT_TIMESTAMP,
         email_attempt_count = email_attempt_count + 1 WHERE id = ?`,
      ).bind(input.invitationId),
      auditStatement(runtime.DB, {
        id: crypto.randomUUID(),
        archiveId: input.archiveId,
        actorUserId: input.inviter.id,
        action: "invitation.email_failed",
        entityType: "family_invitation",
        entityId: input.invitationId,
        metadata: { reason: error instanceof Error ? error.name : "UnknownError" },
      }),
    ]);
    return { status: "failed" as const };
  }
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
      .bind(targetMemberId, context.archiveId, targetMemberId, context.memberId, context.memberId),
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

async function setChildAccessPin(request: Request, childId: string): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const runtime = getRuntimeEnv();
  const context = await getMembershipContext(request);
  if (!context) return unauthorized();
  if (context.role !== "owner" && context.role !== "parent") return forbidden();

  const parsed = childPinSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return Response.json({ error: "Choose a six-digit PIN." }, { status: 400 });
  }
  const child = await runtime.DB.prepare(
    "SELECT id FROM child_profile WHERE id = ? AND archive_id = ?",
  )
    .bind(childId, context.archiveId)
    .first();
  if (!child) return Response.json({ error: "Child profile not found." }, { status: 404 });

  const pinHash = await keyedHash(runtime.BETTER_AUTH_SECRET, `${childId}:${parsed.data.pin}`);
  await runtime.DB.batch([
    runtime.DB.prepare(
      "UPDATE child_profile SET access_pin_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    ).bind(pinHash, childId),
    runtime.DB.prepare(
      "UPDATE child_access_session SET revoked_at = CURRENT_TIMESTAMP WHERE child_id = ? AND revoked_at IS NULL",
    ).bind(childId),
    auditStatement(runtime.DB, {
      id: crypto.randomUUID(),
      archiveId: context.archiveId,
      actorUserId: context.user.id,
      action: "child_access.pin_changed",
      entityType: "child_profile",
      entityId: childId,
    }),
  ]);
  return Response.json({ updated: true });
}

async function signInChild(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const runtime = getRuntimeEnv();
  const parsed = childPinSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return Response.json({ error: "Enter the six-digit family PIN." }, { status: 400 });
  }

  const familySlug = request.headers.get(FAMILY_SLUG_HEADER);
  const childSlug = request.headers.get(CHILD_SLUG_HEADER);
  if (!familySlug || !childSlug) return notFound();

  const clientIdentity = `${familySlug}|${childSlug}|${request.headers.get("cf-connecting-ip") ?? "local"}|${
    request.headers.get("user-agent") ?? "unknown"
  }`;
  const attemptKey = await keyedHash(runtime.BETTER_AUTH_SECRET, clientIdentity);
  const recent = await runtime.DB.prepare(
    `SELECT COUNT(*) AS count FROM child_access_attempt
     WHERE attempt_key = ? AND attempted_at > datetime('now', '-15 minutes')`,
  )
    .bind(attemptKey)
    .first<{ count: number }>();
  if (Number(recent?.count ?? 0) >= 8) {
    return Response.json(
      { error: "Too many tries. Ask a parent and wait a little." },
      { status: 429 },
    );
  }

  const profile = await runtime.DB.prepare(
    `SELECT c.id, c.archive_id AS archiveId, c.access_pin_hash AS pinHash
     FROM child_profile c
     JOIN family_archive a ON a.id = c.archive_id
     WHERE a.slug = ? AND c.slug = ? AND c.access_pin_hash IS NOT NULL`,
  )
    .bind(familySlug, childSlug)
    .first<{ id: string; archiveId: string; pinHash: string }>();
  const candidate = profile
    ? await keyedHash(runtime.BETTER_AUTH_SECRET, `${profile.id}:${parsed.data.pin}`)
    : "";
  const matched = profile && safeEqual(candidate, profile.pinHash) ? profile : null;

  const attemptId = crypto.randomUUID();
  if (!matched) {
    await runtime.DB.prepare(
      "INSERT INTO child_access_attempt (id, attempt_key, succeeded) VALUES (?, ?, 0)",
    )
      .bind(attemptId, attemptKey)
      .run();
    return Response.json({ error: "That PIN did not open this story." }, { status: 401 });
  }

  const rawToken = createSecureToken();
  const tokenHash = await hashToken(rawToken);
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + CHILD_SESSION_SECONDS * 1000).toISOString();
  await runtime.DB.batch([
    runtime.DB.prepare(
      `INSERT INTO child_access_session (id, child_id, token_hash, expires_at)
       VALUES (?, ?, ?, ?)`,
    ).bind(sessionId, matched.id, tokenHash, expiresAt),
    runtime.DB.prepare(
      "INSERT INTO child_access_attempt (id, attempt_key, succeeded) VALUES (?, ?, 1)",
    ).bind(attemptId, attemptKey),
  ]);

  return Response.json(
    { signedIn: true },
    { headers: { "set-cookie": childSessionCookie(rawToken, request, CHILD_SESSION_SECONDS) } },
  );
}

async function signOutChild(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const runtime = getRuntimeEnv();
  const rawToken = readCookie(request, CHILD_SESSION_COOKIE);
  if (rawToken) {
    const tokenHash = await hashToken(rawToken);
    await runtime.DB.prepare(
      "UPDATE child_access_session SET revoked_at = CURRENT_TIMESTAMP WHERE token_hash = ?",
    )
      .bind(tokenHash)
      .run();
  }
  return Response.json(
    { signedOut: true },
    { headers: { "set-cookie": childSessionCookie("", request, 0) } },
  );
}

async function getChildSession(request: Request): Promise<Response> {
  const context = await getChildAccessContext(request);
  return Response.json(
    context
      ? {
          signedIn: true,
          child: { displayName: context.displayName, slug: context.childSlug },
          familySlug: context.familySlug,
        }
      : { signedIn: false },
  );
}

async function listPublicChildren(request: Request): Promise<Response> {
  const familySlug = request.headers.get(FAMILY_SLUG_HEADER);
  if (!familySlug) return notFound();
  const children = await getRuntimeEnv()
    .DB.prepare(
      `SELECT c.slug, c.display_name AS displayName
       FROM child_profile c
       JOIN family_archive a ON a.id = c.archive_id
       WHERE a.slug = ? AND c.access_pin_hash IS NOT NULL
       ORDER BY c.created_at`,
    )
    .bind(familySlug)
    .all<{ slug: string; displayName: string }>();
  if (children.results.length === 0) return notFound();
  return Response.json({ children: children.results });
}

async function getChildArchive(request: Request): Promise<Response> {
  const runtime = getRuntimeEnv();
  const context = await getChildAccessContext(request);
  if (!context) return Response.json({ error: "Enter the family PIN." }, { status: 401 });

  const [memories, capsules] = await Promise.all([
    runtime.DB.prepare(
      `SELECT m.id, m.child_id AS childId, m.kind, m.title, m.body,
              m.happened_at AS happenedAt, m.audience, m.created_at AS createdAt,
              m.created_by_user_id AS createdByUserId, u.name AS authorName,
              ma.id AS mediaId, ma.media_type AS mediaType,
              ma.content_type AS contentType, ma.byte_size AS byteSize
       FROM memory m
       LEFT JOIN "user" u ON u.id = m.created_by_user_id
       LEFT JOIN media_asset ma ON ma.id = (
         SELECT first_asset.id FROM media_asset first_asset
         WHERE first_asset.memory_id = m.id ORDER BY first_asset.created_at LIMIT 1
       )
       WHERE m.child_id = ? AND m.archive_id = ? AND m.audience IN ('child', 'all')
       ORDER BY m.happened_at DESC, m.created_at DESC LIMIT 100`,
    )
      .bind(context.childId, context.archiveId)
      .all(),
    runtime.DB.prepare(
      `SELECT tc.id, tc.child_id AS childId, tc.title, tc.body,
              tc.unlocks_at AS unlocksAt, tc.audience, tc.created_at AS createdAt,
              tc.created_by_user_id AS createdByUserId, u.name AS authorName, 0 AS locked
       FROM time_capsule tc
       LEFT JOIN "user" u ON u.id = tc.created_by_user_id
       WHERE tc.child_id = ? AND tc.audience = 'child'
         AND datetime(tc.unlocks_at) <= CURRENT_TIMESTAMP
       ORDER BY datetime(tc.unlocks_at) DESC`,
    )
      .bind(context.childId)
      .all(),
  ]);

  return Response.json({
    child: { id: context.childId, displayName: context.displayName, birthDate: context.birthDate },
    memories: memories.results,
    capsules: capsules.results,
  });
}

async function createMemory(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const database = getRuntimeEnv().DB;
  const context = await getMembershipContext(request);
  if (!context) return unauthorized();
  if (context.role === "viewer") return forbidden();

  const parsed = memorySchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return Response.json(
      { error: "Check the memory title, date, and sharing choice." },
      { status: 400 },
    );
  }
  if (new Date(parsed.data.happenedAt).valueOf() > Date.now() + 5 * 60 * 1000) {
    return Response.json({ error: "A memory cannot be dated in the future." }, { status: 400 });
  }
  if (parsed.data.audience === "parents" && context.role !== "owner" && context.role !== "parent") {
    return forbidden();
  }

  const child = await database
    .prepare("SELECT id FROM child_profile WHERE id = ? AND archive_id = ?")
    .bind(parsed.data.childId, context.archiveId)
    .first();
  if (!child) return Response.json({ error: "Child profile not found." }, { status: 404 });

  const memoryId = crypto.randomUUID();
  await database.batch([
    database
      .prepare(
        `INSERT INTO memory
          (id, archive_id, child_id, created_by_user_id, kind, title, body, happened_at, audience)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        memoryId,
        context.archiveId,
        parsed.data.childId,
        context.user.id,
        parsed.data.kind,
        parsed.data.title,
        parsed.data.body || null,
        parsed.data.happenedAt,
        parsed.data.audience,
      ),
    auditStatement(database, {
      id: crypto.randomUUID(),
      archiveId: context.archiveId,
      actorUserId: context.user.id,
      action: "memory.created",
      entityType: "memory",
      entityId: memoryId,
      metadata: { kind: parsed.data.kind, audience: parsed.data.audience },
    }),
  ]);

  return Response.json({ id: memoryId }, { status: 201 });
}

async function createPublicMemoryShare(request: Request, memoryId: string): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const runtime = getRuntimeEnv();
  const context = await getMembershipContext(request);
  if (!context) return unauthorized();

  const memory = await runtime.DB.prepare(
    `SELECT id, created_by_user_id AS createdByUserId
     FROM memory WHERE id = ? AND archive_id = ?`,
  )
    .bind(memoryId, context.archiveId)
    .first<{ id: string; createdByUserId: string | null }>();
  if (!memory) return Response.json({ error: "Memory not found." }, { status: 404 });
  if (memory.createdByUserId !== context.user.id) return forbidden();

  const rawToken = createSecureToken();
  const shareId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  await runtime.DB.batch([
    runtime.DB.prepare(
      `UPDATE memory_public_share SET revoked_at = CURRENT_TIMESTAMP
       WHERE memory_id = ? AND revoked_at IS NULL`,
    ).bind(memoryId),
    runtime.DB.prepare(
      `INSERT INTO memory_public_share
        (id, archive_id, memory_id, token_hash, created_by_user_id, expires_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).bind(
      shareId,
      context.archiveId,
      memoryId,
      await hashToken(rawToken),
      context.user.id,
      expiresAt,
    ),
    auditStatement(runtime.DB, {
      id: crypto.randomUUID(),
      archiveId: context.archiveId,
      actorUserId: context.user.id,
      action: "memory.public_share_created",
      entityType: "memory_public_share",
      entityId: shareId,
      metadata: { memoryId, expiresAt },
    }),
  ]);

  const shareUrl = new URL(
    `/share/${rawToken}`,
    getDeploymentConfig(runtime).publicAppUrl,
  ).toString();
  return Response.json({ shareUrl, expiresAt }, { status: 201 });
}

async function revokePublicMemoryShare(request: Request, memoryId: string): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const runtime = getRuntimeEnv();
  const context = await getMembershipContext(request);
  if (!context) return unauthorized();

  const memory = await runtime.DB.prepare(
    `SELECT id, created_by_user_id AS createdByUserId
     FROM memory WHERE id = ? AND archive_id = ?`,
  )
    .bind(memoryId, context.archiveId)
    .first<{ id: string; createdByUserId: string | null }>();
  if (!memory) return Response.json({ error: "Memory not found." }, { status: 404 });
  if (memory.createdByUserId !== context.user.id) return forbidden();

  await runtime.DB.batch([
    runtime.DB.prepare(
      `UPDATE memory_public_share SET revoked_at = CURRENT_TIMESTAMP
       WHERE memory_id = ? AND archive_id = ? AND revoked_at IS NULL`,
    ).bind(memoryId, context.archiveId),
    auditStatement(runtime.DB, {
      id: crypto.randomUUID(),
      archiveId: context.archiveId,
      actorUserId: context.user.id,
      action: "memory.public_share_revoked",
      entityType: "memory",
      entityId: memoryId,
    }),
  ]);
  return Response.json({ revoked: true });
}

async function getPublicMemory(token: string): Promise<PublicMemory | null> {
  const runtime = getRuntimeEnv();
  return runtime.DB.prepare(
    `SELECT m.id, m.kind, m.title, m.body, m.happened_at AS happenedAt,
            c.display_name AS childName, u.name AS authorName,
            ma.id AS mediaId, ma.object_key AS objectKey,
            ma.media_type AS mediaType, ma.content_type AS contentType
     FROM memory_public_share s
     JOIN memory m ON m.id = s.memory_id
     JOIN child_profile c ON c.id = m.child_id
     LEFT JOIN "user" u ON u.id = m.created_by_user_id
     LEFT JOIN media_asset ma ON ma.id = (
       SELECT first_asset.id FROM media_asset first_asset
       WHERE first_asset.memory_id = m.id ORDER BY first_asset.created_at LIMIT 1
     )
     WHERE s.token_hash = ? AND s.revoked_at IS NULL
       AND datetime(s.expires_at) > CURRENT_TIMESTAMP`,
  )
    .bind(await hashToken(token))
    .first<PublicMemory>();
}

async function servePublicMemoryPage(request: Request, token: string): Promise<Response> {
  const memory = await getPublicMemory(token);
  if (!memory) {
    return new Response(publicShareUnavailablePage(), {
      status: 404,
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
    });
  }

  const shareUrl = new URL(`/share/${token}`, request.url).toString();
  const mediaUrl = memory.mediaId
    ? new URL(`/api/public/shares/${token}/media`, request.url).toString()
    : null;
  return new Response(publicMemoryPage(memory, shareUrl, mediaUrl), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "referrer-policy": "no-referrer",
      "x-robots-tag": "noindex, nofollow, noarchive",
    },
  });
}

async function servePublicMemoryMedia(request: Request, token: string): Promise<Response> {
  const memory = await getPublicMemory(token);
  if (!memory?.objectKey || !memory.contentType) {
    return Response.json({ error: "Shared media not found." }, { status: 404 });
  }
  return streamMediaObject(request, memory.objectKey, memory.contentType, "no-store");
}

async function createCapsule(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const database = getRuntimeEnv().DB;
  const context = await getMembershipContext(request);
  if (!context) return unauthorized();
  if (context.role === "viewer") return forbidden();

  const parsed = capsuleSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return Response.json(
      { error: "Add a title, a note, and a valid unlock date." },
      { status: 400 },
    );
  }
  if (new Date(parsed.data.unlocksAt).valueOf() <= Date.now() + 60_000) {
    return Response.json(
      { error: "Choose an unlock time at least a minute from now." },
      { status: 400 },
    );
  }
  const child = await database
    .prepare("SELECT id FROM child_profile WHERE id = ? AND archive_id = ?")
    .bind(parsed.data.childId, context.archiveId)
    .first();
  if (!child) return Response.json({ error: "Child profile not found." }, { status: 404 });

  const capsuleId = crypto.randomUUID();
  await database.batch([
    database
      .prepare(
        `INSERT INTO time_capsule
          (id, child_id, title, body, unlocks_at, audience, created_by_user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        capsuleId,
        parsed.data.childId,
        parsed.data.title,
        parsed.data.body,
        parsed.data.unlocksAt,
        parsed.data.audience,
        context.user.id,
      ),
    auditStatement(database, {
      id: crypto.randomUUID(),
      archiveId: context.archiveId,
      actorUserId: context.user.id,
      action: "capsule.created",
      entityType: "time_capsule",
      entityId: capsuleId,
      metadata: { unlocksAt: parsed.data.unlocksAt, audience: parsed.data.audience },
    }),
  ]);

  // The sealed body is intentionally not echoed in the response.
  return Response.json({ id: capsuleId, locked: true }, { status: 201 });
}

async function deleteCapsule(request: Request, capsuleId: string): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const database = getRuntimeEnv().DB;
  const context = await getMembershipContext(request);
  if (!context) return unauthorized();

  const capsule = await database
    .prepare(
      `SELECT tc.id, tc.created_by_user_id AS createdByUserId
       FROM time_capsule tc
       JOIN child_profile c ON c.id = tc.child_id
       WHERE tc.id = ? AND c.archive_id = ?`,
    )
    .bind(capsuleId, context.archiveId)
    .first<{ id: string; createdByUserId: string | null }>();
  if (!capsule) return Response.json({ error: "Capsule not found." }, { status: 404 });
  const canDelete =
    context.role === "owner" ||
    context.role === "parent" ||
    (context.role === "contributor" && capsule.createdByUserId === context.user.id);
  if (!canDelete) return forbidden();

  await database.batch([
    database.prepare("DELETE FROM time_capsule WHERE id = ?").bind(capsuleId),
    auditStatement(database, {
      id: crypto.randomUUID(),
      archiveId: context.archiveId,
      actorUserId: context.user.id,
      action: "capsule.deleted",
      entityType: "time_capsule",
      entityId: capsuleId,
    }),
  ]);
  return Response.json({ deleted: true });
}

async function uploadMemoryMedia(request: Request, memoryId: string): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const runtime = getRuntimeEnv();
  const context = await getMembershipContext(request);
  if (!context) return unauthorized();
  if (context.role === "viewer") return forbidden();

  const memory = await runtime.DB.prepare(
    `SELECT id, kind, created_by_user_id AS createdByUserId
     FROM memory WHERE id = ? AND archive_id = ?`,
  )
    .bind(memoryId, context.archiveId)
    .first<{ id: string; kind: string; createdByUserId: string | null }>();
  if (!memory) return Response.json({ error: "Memory not found." }, { status: 404 });
  if (memory.createdByUserId !== context.user.id) return forbidden();

  const suppliedContentType = (request.headers.get("content-type") ?? "")
    .split(";", 1)[0]
    .toLowerCase();
  const fileName = decodeFileName(request.headers.get("x-everlittle-file-name"));
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  const inferred = MEDIA_EXTENSIONS.get(extension);
  const media = MEDIA_TYPES.get(suppliedContentType) ?? inferred;
  const contentType = MEDIA_TYPES.has(suppliedContentType)
    ? suppliedContentType
    : (inferred?.contentType ?? suppliedContentType);
  const byteSize = Number(request.headers.get("content-length") ?? "0");
  if (!media || !request.body || !Number.isSafeInteger(byteSize) || byteSize < 1) {
    return Response.json(
      { error: "Choose a supported photo, audio, or video file." },
      { status: 400 },
    );
  }
  if (byteSize > MAX_MEDIA_BYTES) {
    return Response.json({ error: "Media files must be 50 MB or smaller." }, { status: 413 });
  }
  if (
    (memory.kind === "photo" && media.mediaType !== "image") ||
    (memory.kind === "voice" && media.mediaType !== "audio") ||
    (memory.kind === "video" && media.mediaType !== "video") ||
    (memory.kind !== "photo" && memory.kind !== "voice" && memory.kind !== "video")
  ) {
    return Response.json({ error: "This file does not match the memory type." }, { status: 400 });
  }

  const existing = await runtime.DB.prepare(
    "SELECT id FROM media_asset WHERE memory_id = ? LIMIT 1",
  )
    .bind(memoryId)
    .first();
  if (existing) return Response.json({ error: "This memory already has media." }, { status: 409 });

  const assetId = crypto.randomUUID();
  const objectKey = `${context.archiveId}/${memoryId}/${assetId}.${media.extension}`;
  await runtime.MEDIA.put(objectKey, request.body, {
    httpMetadata: { contentType },
    customMetadata: {
      archiveId: context.archiveId,
      memoryId,
      uploadedByUserId: context.user.id,
    },
  });

  try {
    await runtime.DB.batch([
      runtime.DB.prepare(
        `INSERT INTO media_asset
          (id, archive_id, memory_id, object_key, media_type, content_type, byte_size)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ).bind(
        assetId,
        context.archiveId,
        memoryId,
        objectKey,
        media.mediaType,
        contentType,
        byteSize,
      ),
      auditStatement(runtime.DB, {
        id: crypto.randomUUID(),
        archiveId: context.archiveId,
        actorUserId: context.user.id,
        action: "media.uploaded",
        entityType: "media_asset",
        entityId: assetId,
        metadata: { memoryId, mediaType: media.mediaType, byteSize },
      }),
    ]);
  } catch (error) {
    await runtime.MEDIA.delete(objectKey);
    console.error(
      JSON.stringify({ event: "media_metadata_write_failed", memoryId, assetId, error }),
    );
    return Response.json({ error: "The media upload could not be saved." }, { status: 500 });
  }

  return Response.json({ id: assetId, url: `/api/media/${assetId}` }, { status: 201 });
}

async function updateMemory(request: Request, memoryId: string): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const database = getRuntimeEnv().DB;
  const context = await getMembershipContext(request);
  if (!context) return unauthorized();

  const existing = await database
    .prepare(
      `SELECT id, child_id AS childId, created_by_user_id AS createdByUserId
       FROM memory WHERE id = ? AND archive_id = ?`,
    )
    .bind(memoryId, context.archiveId)
    .first<{ id: string; childId: string; createdByUserId: string | null }>();
  if (!existing) return Response.json({ error: "Memory not found." }, { status: 404 });
  if (existing.createdByUserId !== context.user.id) return forbidden();

  const parsed = memorySchema.safeParse(await readJson(request));
  if (!parsed.success || parsed.data.childId !== existing.childId) {
    return Response.json(
      { error: "Check the memory title, date, and sharing choice." },
      { status: 400 },
    );
  }
  if (new Date(parsed.data.happenedAt).valueOf() > Date.now() + 5 * 60 * 1000) {
    return Response.json({ error: "A memory cannot be dated in the future." }, { status: 400 });
  }
  if (parsed.data.audience === "parents" && context.role !== "owner" && context.role !== "parent") {
    return forbidden();
  }

  await database.batch([
    database
      .prepare(
        `UPDATE memory
         SET kind = ?, title = ?, body = ?, happened_at = ?, audience = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND archive_id = ?`,
      )
      .bind(
        parsed.data.kind,
        parsed.data.title,
        parsed.data.body || null,
        parsed.data.happenedAt,
        parsed.data.audience,
        memoryId,
        context.archiveId,
      ),
    auditStatement(database, {
      id: crypto.randomUUID(),
      archiveId: context.archiveId,
      actorUserId: context.user.id,
      action: "memory.updated",
      entityType: "memory",
      entityId: memoryId,
      metadata: { kind: parsed.data.kind, audience: parsed.data.audience },
    }),
  ]);
  return Response.json({ updated: true });
}

async function serveMedia(request: Request, assetId: string): Promise<Response> {
  const runtime = getRuntimeEnv();
  const adult = await getMembershipContext(request);
  const child = adult ? null : await getChildAccessContext(request);
  if (!adult && !child) return unauthorized();

  const asset = adult
    ? await runtime.DB.prepare(
        `SELECT ma.object_key AS objectKey, ma.content_type AS contentType
         FROM media_asset ma
         JOIN memory m ON m.id = ma.memory_id
         WHERE ma.id = ? AND ma.archive_id = ?
           AND (m.audience != 'parents' OR ? IN ('owner', 'parent'))`,
      )
        .bind(assetId, adult.archiveId, adult.role)
        .first<{ objectKey: string; contentType: string }>()
    : await runtime.DB.prepare(
        `SELECT ma.object_key AS objectKey, ma.content_type AS contentType
         FROM media_asset ma
         JOIN memory m ON m.id = ma.memory_id
         WHERE ma.id = ? AND m.child_id = ? AND m.archive_id = ?
           AND m.audience IN ('child', 'all')`,
      )
        .bind(assetId, child?.childId, child?.archiveId)
        .first<{ objectKey: string; contentType: string }>();
  if (!asset) return Response.json({ error: "Media not found." }, { status: 404 });

  return streamMediaObject(request, asset.objectKey, asset.contentType, "private, max-age=3600");
}

async function streamMediaObject(
  request: Request,
  objectKey: string,
  contentType: string,
  cacheControl: string,
): Promise<Response> {
  const runtime = getRuntimeEnv();
  const requestedRange = request.headers.has("range");
  const object = requestedRange
    ? await runtime.MEDIA.get(objectKey, { range: request.headers })
    : await runtime.MEDIA.get(objectKey);
  if (!object) return Response.json({ error: "Media not found." }, { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("content-type", contentType);
  headers.set("content-disposition", "inline");
  headers.set("cache-control", cacheControl);
  headers.set("accept-ranges", "bytes");
  headers.set("etag", object.httpEtag);

  let status = 200;
  if (requestedRange && object.range) {
    const offset =
      "suffix" in object.range ? object.size - object.range.suffix : (object.range.offset ?? 0);
    const length =
      "suffix" in object.range
        ? object.range.suffix
        : (object.range.length ?? object.size - offset);
    headers.set("content-range", `bytes ${offset}-${offset + length - 1}/${object.size}`);
    headers.set("content-length", String(length));
    status = 206;
  } else {
    headers.set("content-length", String(object.size));
  }

  return new Response(object.body, { headers, status });
}

async function deleteMemory(request: Request, memoryId: string): Promise<Response> {
  if (!isSameOrigin(request)) return forbidden();
  const runtime = getRuntimeEnv();
  const context = await getMembershipContext(request);
  if (!context) return unauthorized();

  const memory = await runtime.DB.prepare(
    `SELECT id, created_by_user_id AS createdByUserId
     FROM memory WHERE id = ? AND archive_id = ?`,
  )
    .bind(memoryId, context.archiveId)
    .first<{ id: string; createdByUserId: string | null }>();
  if (!memory) return Response.json({ error: "Memory not found." }, { status: 404 });
  if (memory.createdByUserId !== context.user.id) return forbidden();

  const assets = await runtime.DB.prepare(
    "SELECT object_key AS objectKey FROM media_asset WHERE memory_id = ?",
  )
    .bind(memoryId)
    .all<{ objectKey: string }>();
  const objectKeys = assets.results.map((asset) => asset.objectKey);
  if (objectKeys.length) await runtime.MEDIA.delete(objectKeys);

  await runtime.DB.batch([
    runtime.DB.prepare("DELETE FROM memory WHERE id = ? AND archive_id = ?").bind(
      memoryId,
      context.archiveId,
    ),
    auditStatement(runtime.DB, {
      id: crypto.randomUUID(),
      archiveId: context.archiveId,
      actorUserId: context.user.id,
      action: "memory.deleted",
      entityType: "memory",
      entityId: memoryId,
    }),
  ]);
  return Response.json({ deleted: true });
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
  const childSlug = await uniqueChildSlug(
    database,
    context.archiveId,
    slugify(parsed.data.displayName, `child-${childId.slice(0, 8)}`),
  );
  await database.batch([
    database
      .prepare(
        `INSERT INTO child_profile (id, archive_id, slug, display_name, birth_date)
         VALUES (?, ?, ?, ?, ?)`,
      )
      .bind(childId, context.archiveId, childSlug, parsed.data.displayName, parsed.data.birthDate),
    auditStatement(database, {
      id: crypto.randomUUID(),
      archiveId: context.archiveId,
      actorUserId: context.user.id,
      action: "child.created",
      entityType: "child_profile",
      entityId: childId,
    }),
  ]);
  return Response.json({ id: childId, slug: childSlug }, { status: 201 });
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
  const runtime = getRuntimeEnv();
  const deployment = getDeploymentConfig(runtime);
  const requestedSlug = request.headers.get(FAMILY_SLUG_HEADER);
  if (requestedSlug && !familySlugSchema.safeParse(requestedSlug).success) return null;
  if (deployment.mode === "hosted" && !requestedSlug) return null;

  const membership = requestedSlug
    ? await runtime.DB.prepare(
        `SELECT fm.id AS memberId, fm.archive_id AS archiveId, fm.role
         FROM family_member fm
         JOIN family_archive a ON a.id = fm.archive_id
         WHERE fm.user_id = ? AND a.slug = ?
         LIMIT 1`,
      )
        .bind(user.id, requestedSlug)
        .first<Omit<MembershipContext, "user">>()
    : await runtime.DB.prepare(
        `SELECT id AS memberId, archive_id AS archiveId, role
         FROM family_member WHERE user_id = ?
         ORDER BY CASE role WHEN 'owner' THEN 0 WHEN 'parent' THEN 1 ELSE 2 END LIMIT 1`,
      )
        .bind(user.id)
        .first<Omit<MembershipContext, "user">>();
  return membership ? { ...membership, user } : null;
}

async function uniqueChildSlug(database: D1Database, archiveId: string, requested: string) {
  const base = childSlugSchema.parse(requested);
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const suffix = attempt === 0 ? "" : `-${attempt + 1}`;
    const candidate = `${base.slice(0, 48 - suffix.length)}${suffix}`;
    const existing = await database
      .prepare("SELECT 1 FROM child_profile WHERE archive_id = ? AND slug = ?")
      .bind(archiveId, candidate)
      .first();
    if (!existing) return candidate;
  }
  throw new Error("Could not create a unique child address.");
}

async function getChildAccessContext(request: Request): Promise<ChildAccessContext | null> {
  const rawToken = readCookie(request, CHILD_SESSION_COOKIE);
  if (!rawToken) return null;
  const tokenHash = await hashToken(rawToken);
  return getRuntimeEnv()
    .DB.prepare(
      `SELECT cas.id AS sessionId, c.id AS childId, c.archive_id AS archiveId,
              c.display_name AS displayName, c.birth_date AS birthDate,
              c.slug AS childSlug, a.slug AS familySlug
       FROM child_access_session cas
       JOIN child_profile c ON c.id = cas.child_id
       JOIN family_archive a ON a.id = c.archive_id
       WHERE cas.token_hash = ? AND cas.revoked_at IS NULL
         AND datetime(cas.expires_at) > CURRENT_TIMESTAMP`,
    )
    .bind(tokenHash)
    .first<ChildAccessContext>()
    .then((context) => {
      if (!context) return null;
      const familySlug = request.headers.get(FAMILY_SLUG_HEADER);
      const childSlug = request.headers.get(CHILD_SLUG_HEADER);
      if (familySlug && familySlug !== context.familySlug) return null;
      if (childSlug && childSlug !== context.childSlug) return null;
      return context;
    });
}

async function getSessionUser(request: Request): Promise<SessionUser | null> {
  const runtime = getRuntimeEnv();
  const auth = createAuth({
    database: runtime.DB,
    secret: runtime.BETTER_AUTH_SECRET,
    baseURL: getDeploymentConfig(runtime).publicAppUrl,
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

function publicMemoryPage(memory: PublicMemory, shareUrl: string, mediaUrl: string | null) {
  const title = escapeHtml(memory.title);
  const childName = escapeHtml(memory.childName);
  const authorName = escapeHtml(memory.authorName ?? "Family");
  const description = escapeHtml(
    memory.body?.slice(0, 180) || `A ${memory.kind} memory kept for ${memory.childName}.`,
  );
  const safeShareUrl = escapeHtml(shareUrl);
  const safeMediaUrl = mediaUrl ? escapeHtml(mediaUrl) : null;
  const happenedAt = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(memory.happenedAt));
  const media =
    safeMediaUrl && memory.mediaType === "image"
      ? `<img class="memory-media" src="${safeMediaUrl}" alt="">`
      : safeMediaUrl && memory.mediaType === "video"
        ? `<video class="memory-media" src="${safeMediaUrl}" controls playsinline preload="metadata"></video>`
        : safeMediaUrl && memory.mediaType === "audio"
          ? `<audio class="memory-audio" src="${safeMediaUrl}" controls preload="metadata"></audio>`
          : `<div class="memory-mark" aria-hidden="true">♡</div>`;
  const ogMedia =
    safeMediaUrl && memory.mediaType === "image"
      ? `<meta property="og:image" content="${safeMediaUrl}">`
      : "";
  const story = memory.body
    ? `<p class="story">${escapeHtml(memory.body).replaceAll("\n", "<br>")}</p>`
    : "";
  const whatsappText = encodeURIComponent(`${memory.title} — ${shareUrl}`);

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${title} — Everlittle</title><meta name="description" content="${description}">
<meta property="og:type" content="article"><meta property="og:title" content="${title}">
<meta property="og:description" content="${description}"><meta property="og:url" content="${safeShareUrl}">${ogMedia}
<meta name="robots" content="noindex,nofollow,noarchive"><meta name="theme-color" content="#f7f1e7">
<style>*{box-sizing:border-box}body{margin:0;background:#f7f1e7;color:#23332d;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.shell{min-height:100svh;padding:clamp(1rem,4vw,2.5rem)}.brand{color:#294f3c;font-family:Georgia,serif;font-size:1.2rem}.card{background:#fffdf8;border:1px solid #ddd6c8;border-radius:24px;box-shadow:0 24px 70px rgb(22 43 34/.12);margin:clamp(2rem,8vh,5rem) auto;max-width:720px;overflow:hidden}.copy{padding:clamp(1.4rem,6vw,3.5rem)}.eyebrow{color:#6b7c73;font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase}h1{color:#294f3c;font-family:Georgia,serif;font-size:clamp(2.5rem,10vw,5rem);font-weight:500;letter-spacing:-.04em;line-height:.95;margin:.65rem 0 1rem}.story{font-family:Georgia,serif;font-size:1.2rem;line-height:1.65}.byline{color:#6b7c73;font-size:.8rem;margin-top:1.5rem}.memory-media{background:#e9e1d3;display:block;max-height:72svh;object-fit:cover;width:100%}.memory-audio{margin:1rem 0;width:100%}.memory-mark{align-items:center;background:#e8d8bd;color:#9b613e;display:flex;font-family:Georgia,serif;font-size:8rem;justify-content:center;min-height:280px}.actions{display:flex;flex-wrap:wrap;gap:.65rem;margin-top:1.5rem}.actions a,.actions button{background:#294f3c;border:0;border-radius:12px;color:#fffdf8;font:inherit;font-size:.82rem;font-weight:700;min-height:46px;padding:.75rem 1rem;text-decoration:none}.actions .secondary{background:#edf0eb;color:#294f3c}.privacy{color:#6b7c73;font-size:.7rem;line-height:1.5;margin-top:1rem}@media(max-width:600px){.shell{padding:0}.brand{display:block;padding:1rem 1.1rem}.card{border-radius:24px 24px 0 0;margin:1rem 0 0;min-height:calc(100svh - 4rem)}}
</style></head><body><main class="shell"><span class="brand">everlittle</span><article class="card">${media}<div class="copy"><p class="eyebrow">A memory for ${childName} · ${escapeHtml(happenedAt)}</p><h1>${title}</h1>${story}<p class="byline">Kept with love by ${authorName}</p><div class="actions"><button id="share" type="button">Share to an app</button><a href="https://wa.me/?text=${whatsappText}" target="_blank" rel="noreferrer">WhatsApp</a><button class="secondary" id="copy" type="button">Copy link</button></div><p class="privacy">This private family chose to share this single memory. The rest of the archive remains protected.</p></div></article></main><script>const share=document.querySelector('#share'),copy=document.querySelector('#copy');share.addEventListener('click',async()=>{if(navigator.share){await navigator.share({url:location.href})}else{await navigator.clipboard.writeText(location.href);share.textContent='Link copied'}});copy.addEventListener('click',async()=>{await navigator.clipboard.writeText(location.href);copy.textContent='Copied'});</script></body></html>`;
}

function publicShareUnavailablePage() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Memory unavailable — Everlittle</title><style>body{align-items:center;background:#f7f1e7;color:#294f3c;display:flex;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;justify-content:center;margin:0;min-height:100svh;padding:2rem;text-align:center}h1{font-family:Georgia,serif;font-size:2.6rem;font-weight:500;margin:.5rem}p{color:#6b7c73;line-height:1.6}</style></head><body><main><small>everlittle</small><h1>This memory is no longer shared.</h1><p>The link may have expired or been disabled by its author.</p></main></body></html>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function decodeFileName(value: string | null) {
  if (!value) return "";
  try {
    return decodeURIComponent(value).slice(0, 255);
  } catch {
    return "";
  }
}

async function hashToken(token: string): Promise<string> {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function keyedHash(secret: string, value: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

function safeEqual(left: string, right: string): boolean {
  const encoder = new TextEncoder();
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  const subtle = crypto.subtle as SubtleCrypto & {
    timingSafeEqual(left: ArrayBufferView, right: ArrayBufferView): boolean;
  };
  return (
    leftBytes.byteLength === rightBytes.byteLength && subtle.timingSafeEqual(leftBytes, rightBytes)
  );
}

function readCookie(request: Request, name: string): string | null {
  const cookie = request.headers.get("cookie") ?? "";
  for (const part of cookie.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return null;
}

function childSessionCookie(value: string, request: Request, maxAge: number): string {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${CHILD_SESSION_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
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

function notFound() {
  return Response.json({ error: "Not found." }, { status: 404 });
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

function isValidTimezone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}
