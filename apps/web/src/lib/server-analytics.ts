import type { RuntimeEnv } from "./runtime-env";
import { acquisitionProperties, parseAcquisition } from "./acquisition";

type Properties = Record<string, string | number | boolean | null>;
export async function eventStatement(
  runtime: RuntimeEnv,
  input: {
    key: string;
    event: string;
    userId: string;
    archiveId?: string;
    properties?: Properties;
    timestamp?: string;
  },
) {
  const owner = input.archiveId
    ? await runtime.DB.prepare(
        "SELECT user_id FROM family_member WHERE archive_id = ? AND role = 'owner'",
      )
        .bind(input.archiveId)
        .first<{ user_id: string }>()
    : null;
  const snapshot = await runtime.DB.prepare(
    "SELECT snapshot FROM acquisition_snapshot WHERE user_id = ?",
  )
    .bind(owner?.user_id ?? input.userId)
    .first<{ snapshot: string }>();
  const attribution = acquisitionProperties(parseAcquisition(snapshot?.snapshot ?? null));
  return runtime.DB.prepare(
    `INSERT OR IGNORE INTO analytics_outbox(event_key, uuid, event_name, distinct_id, properties, occurred_at) VALUES (?, ?, ?, ?, ?, ?)`,
  ).bind(
    input.key,
    crypto.randomUUID(),
    input.event,
    input.userId,
    JSON.stringify({
      ...attribution,
      environment: runtime.DODO_PAYMENTS_ENVIRONMENT ?? "test_mode",
      ...(input.archiveId ? { archive_id: input.archiveId } : {}),
      ...input.properties,
      is_test: attribution.is_test === true || runtime.DODO_PAYMENTS_ENVIRONMENT !== "live_mode",
    }),
    input.timestamp ?? new Date().toISOString(),
  );
}

export async function flushAnalytics(runtime: RuntimeEnv) {
  if (!runtime.POSTHOG_PROJECT_TOKEN || !runtime.POSTHOG_HOST) return;
  const rows = await runtime.DB.prepare(
    `SELECT * FROM analytics_outbox WHERE delivered_at IS NULL AND datetime(next_attempt_at) <= datetime('now') ORDER BY occurred_at LIMIT 50`,
  ).all<{
    event_key: string;
    uuid: string;
    event_name: string;
    distinct_id: string;
    properties: string;
    occurred_at: string;
    attempts: number;
  }>();
  if (!rows.results.length) return;
  try {
    const response = await fetch(`${runtime.POSTHOG_HOST.replace(/\/$/, "")}/batch/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        api_key: runtime.POSTHOG_PROJECT_TOKEN,
        batch: rows.results.map((row) => ({
          uuid: row.uuid,
          event: row.event_name,
          distinct_id: row.distinct_id,
          timestamp: row.occurred_at,
          properties: { ...JSON.parse(row.properties), $geoip_disable: true },
        })),
      }),
    });
    if (!response.ok) throw new Error("capture_rejected");
    await runtime.DB.batch(
      rows.results.map((row) =>
        runtime.DB.prepare(
          "UPDATE analytics_outbox SET delivered_at = CURRENT_TIMESTAMP WHERE event_key = ?",
        ).bind(row.event_key),
      ),
    );
  } catch {
    await runtime.DB.batch(
      rows.results.map((row) =>
        runtime.DB.prepare(
          "UPDATE analytics_outbox SET attempts = attempts + 1, next_attempt_at = datetime('now', ? || ' seconds') WHERE event_key = ?",
        ).bind(Math.min(3600, 30 * 2 ** Math.min(row.attempts, 7)), row.event_key),
      ),
    );
    console.warn(JSON.stringify({ event: "analytics_delivery_retry", count: rows.results.length }));
  }
}

// Project durable business records, rather than depending on the user's browser
// staying open. The installation cutoff prevents re-counting historical activity.
export async function projectAnalytics(runtime: RuntimeEnv) {
  if (!runtime.POSTHOG_PROJECT_TOKEN) return;
  const rows = await runtime.DB.prepare(`
    WITH ready_memory AS (SELECT m.*, CASE WHEN m.kind IN ('photo','voice','video') THEN max(m.created_at, asset.created_at) ELSE m.created_at END AS ready_at FROM memory m LEFT JOIN media_asset asset ON asset.memory_id=m.id WHERE m.kind NOT IN ('photo','voice','video') OR asset.id IS NOT NULL)
    SELECT * FROM (
    SELECT 'memory:' || m.id AS event_key, 'memory_created' AS event_name, m.created_by_user_id AS user_id, m.archive_id, m.ready_at AS occurred_at, m.kind AS kind
    FROM ready_memory m WHERE m.created_by_user_id IS NOT NULL AND datetime(m.created_at) >= (SELECT started_at FROM analytics_projection WHERE id=1)
      AND (m.kind NOT IN ('photo','voice','video') OR EXISTS(SELECT 1 FROM media_asset a WHERE a.memory_id=m.id))
    UNION ALL
    SELECT 'capsule:' || id, 'capsule_created', created_by_user_id, archive_id, created_at, 'letter' FROM time_capsule WHERE created_by_user_id IS NOT NULL AND datetime(created_at) >= (SELECT started_at FROM analytics_projection WHERE id=1)
    UNION ALL
    SELECT 'onboarding:' || a.id, 'archive_onboarding_completed', f.user_id, a.id, a.created_at, '' FROM family_archive a JOIN family_member f ON f.archive_id=a.id AND f.role='owner' WHERE datetime(a.created_at) >= (SELECT started_at FROM analytics_projection WHERE id=1)
    UNION ALL
    SELECT 'signup:' || user_id, 'account_signup_completed', user_id, NULL, created_at, '' FROM acquisition_snapshot WHERE signup_recorded=1
    UNION ALL
    SELECT 'audit:' || id, CASE action WHEN 'invitation.created' THEN 'invitation_created' ELSE 'invitation_accepted' END, actor_user_id, archive_id, occurred_at, '' FROM audit_event WHERE action IN ('invitation.created','invitation.accepted') AND actor_user_id IS NOT NULL AND datetime(occurred_at) >= (SELECT started_at FROM analytics_projection WHERE id=1)
    ) candidates WHERE NOT EXISTS (SELECT 1 FROM analytics_outbox o WHERE o.event_key=candidates.event_key) ORDER BY occurred_at LIMIT 100
    `).all<{
    event_key: string;
    event_name: string;
    user_id: string;
    archive_id: string | null;
    occurred_at: string;
    kind: string;
  }>();
  const firstMemories = await runtime.DB.prepare(`
    SELECT 'first-memory:' || a.id AS event_key, 'archive_first_memory' AS event_name, f.user_id, a.id AS archive_id,
      min(CASE WHEN m.kind IN ('photo','voice','video') THEN max(m.created_at,asset.created_at) ELSE m.created_at END) AS occurred_at, '' AS kind
    FROM family_archive a JOIN family_member f ON f.archive_id=a.id AND f.role='owner'
    JOIN memory m ON m.archive_id=a.id LEFT JOIN media_asset asset ON asset.memory_id=m.id
    WHERE datetime(a.created_at) >= (SELECT started_at FROM analytics_projection WHERE id=1)
      AND (m.kind NOT IN ('photo','voice','video') OR asset.id IS NOT NULL)
      AND NOT EXISTS(SELECT 1 FROM analytics_outbox o WHERE o.event_key='first-memory:' || a.id)
    GROUP BY a.id,f.user_id LIMIT 100`).all<(typeof rows.results)[number]>();
  for (const row of [...rows.results, ...firstMemories.results]) {
    const exists = await runtime.DB.prepare("SELECT 1 FROM analytics_outbox WHERE event_key=?")
      .bind(row.event_key)
      .first();
    if (exists) continue;
    await (
      await eventStatement(runtime, {
        key: row.event_key,
        event: row.event_name,
        userId: row.user_id,
        archiveId: row.archive_id ?? undefined,
        timestamp: new Date(row.occurred_at + "Z").toISOString(),
        properties: row.kind ? { memory_kind: row.kind } : {},
      })
    ).run();
  }
  const activated =
    await runtime.DB.prepare(`WITH ready_memory AS (SELECT m.*, CASE WHEN m.kind IN ('photo','voice','video') THEN max(m.created_at, asset.created_at) ELSE m.created_at END AS ready_at FROM memory m LEFT JOIN media_asset asset ON asset.memory_id=m.id WHERE m.kind NOT IN ('photo','voice','video') OR asset.id IS NOT NULL) SELECT a.id, f.user_id,
    (SELECT max(ready_at) FROM (SELECT m.ready_at FROM ready_memory m WHERE m.archive_id=a.id ORDER BY m.ready_at LIMIT 3)) AS memory_at,
    (SELECT max(created_at) FROM (SELECT created_at FROM family_member WHERE archive_id=a.id ORDER BY created_at LIMIT 2)) AS member_at
    FROM family_archive a JOIN family_member f ON f.archive_id=a.id AND f.role='owner'
    WHERE datetime(a.created_at) >= (SELECT started_at FROM analytics_projection WHERE id=1)
      AND (SELECT count(*) FROM memory m WHERE m.archive_id=a.id AND datetime(m.created_at) <= datetime(a.created_at,'+7 days') AND (m.kind NOT IN ('photo','voice','video') OR EXISTS(SELECT 1 FROM media_asset asset WHERE asset.memory_id=m.id AND datetime(asset.created_at) <= datetime(a.created_at,'+7 days')))) >= 3
      AND (SELECT count(*) FROM family_member WHERE archive_id=a.id AND datetime(created_at) <= datetime(a.created_at,'+7 days')) >= 2
      AND NOT EXISTS(SELECT 1 FROM analytics_outbox o WHERE o.event_key='activated:' || a.id) LIMIT 100`).all<{
      id: string;
      user_id: string;
      memory_at: string;
      member_at: string;
    }>();
  for (const row of activated.results)
    await (
      await eventStatement(runtime, {
        key: `activated:${row.id}`,
        event: "archive_activated",
        userId: row.user_id,
        archiveId: row.id,
        properties: { activation_definition: "3_memories_2_adults_7_days_v1" },
        timestamp: new Date([row.memory_at, row.member_at].sort().at(-1)! + "Z").toISOString(),
      })
    ).run();
}
