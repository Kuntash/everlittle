import { AsyncLocalStorage } from "node:async_hooks";

/**
 * One request's view of the database, for D1 read replication.
 * D1 has one primary and, when read replication is on, read replicas in other regions. A replica receives a
 * write a moment after the primary. A session reads from the nearest copy and never goes back in time between
 * its queries. A bookmark marks how current an answer was. A session that starts from a bookmark only reads
 * copies at least that current. The browser keeps the last bookmark in a cookie and sends it with the next
 * request, so a person always sees their own writes: a new sign-in, a saved memory, an accepted invitation.
 * Writes always go to the primary. With read replication off, every query goes to the primary and this code
 * works the same.
 */

/** The cookie that carries a browser's last D1 bookmark to its next request. The value is not a secret. */
const BOOKMARK_COOKIE = "everlittle.db_bookmark";
/**
 * How long a browser keeps the bookmark, in seconds. A replica is behind the primary for about a second at most,
 * so a bookmark is only useful for a short time. A short life also limits the harm of a bookmark that D1 no longer accepts.
 */
const BOOKMARK_COOKIE_SECONDS = 10 * 60;
/**
 * A D1 bookmark, as D1 writes it: groups of hexadecimal digits joined by hyphens.
 * Only a value of this form reaches D1.
 */
const BOOKMARK_FORM = /^[0-9a-f]{8}-[0-9a-f]{8}-[0-9a-f]{8}-[0-9a-f]{32}$/;

/** The database of the request that is running. Each request gets its own store, so requests do not share it. */
const runningDatabase = new AsyncLocalStorage<D1Database>();

/**
 * Return the database for the code that is running: the request's session inside `withRequestDatabase`,
 * the binding itself outside it. The scheduled handler and the tests run outside it and use the primary.
 */
export function requestDatabase(binding: D1Database): D1Database {
  return runningDatabase.getStore() ?? binding;
}

/**
 * Run one request with its own D1 session, then send the session's bookmark back to the browser.
 * A request that only reads starts from the browser's bookmark, or from any copy when it sent none.
 * A request that may write starts from the primary. Its checks, such as the storage limit, the last owner
 * and a single-use invitation, must read the current rows and not a replica's copy.
 */
export async function withRequestDatabase(
  binding: D1Database,
  request: Request,
  respond: () => Promise<Response>,
): Promise<Response> {
  const readOnly = request.method === "GET" || request.method === "HEAD";
  const sent = bookmarkFrom(request.headers.get("cookie"));
  const session = binding.withSession(readOnly ? (sent ?? "first-unconstrained") : "first-primary");
  /*
   * The rest of the app, and Better Auth, expect the binding's shape. A session has `prepare` and `batch`.
   * `exec` and `dump` stay on the binding, which is the primary. Nothing in the app calls them.
   */
  const database = Object.create(binding, {
    prepare: { value: (query: string) => session.prepare(query) },
    batch: { value: (statements: D1PreparedStatement[]) => session.batch(statements) },
  }) as D1Database;
  const response = await runningDatabase.run(database, respond);

  const bookmark = session.getBookmark();
  /* A request that ran no query has no bookmark. An unchanged bookmark needs no new cookie. */
  if (bookmark === null || bookmark === sent || !BOOKMARK_FORM.test(bookmark)) return response;
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  const headers = new Headers(response.headers);
  headers.append(
    "set-cookie",
    `${BOOKMARK_COOKIE}=${bookmark}; Path=/; Max-Age=${BOOKMARK_COOKIE_SECONDS}; HttpOnly; SameSite=Lax${secure}`,
  );
  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

/** Read the bookmark from a `Cookie` header. A value that is not a bookmark is ignored. */
function bookmarkFrom(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [name, value] = part.trim().split("=");
    if (name === BOOKMARK_COOKIE && value && BOOKMARK_FORM.test(value)) return value;
  }
  return null;
}
