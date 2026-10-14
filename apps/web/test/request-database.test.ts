import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

import { requestDatabase, withRequestDatabase } from "@/lib/request-database";

const BOOKMARK_COOKIE = /everlittle\.db_bookmark=([0-9a-f-]+)/;

function request(method: string, cookie?: string) {
  return new Request("https://family.example.com/api/archive", {
    headers: cookie ? { cookie } : {},
    method,
  });
}

describe("request database", () => {
  it("uses the binding outside a request", () => {
    expect(requestDatabase(env.DB)).toBe(env.DB);
  });

  it("gives a request one session and sends its bookmark to the browser", async () => {
    let inside: D1Database | null = null;
    const response = await withRequestDatabase(env.DB, request("POST"), async () => {
      inside = requestDatabase(env.DB);
      await inside
        .prepare("INSERT INTO family_archive (id, name, slug) VALUES (?, ?, ?)")
        .bind("session-archive", "Session Family", "session-family")
        .run();
      const [rows] = await inside.batch<{ slug: string }>([
        inside.prepare("SELECT slug FROM family_archive WHERE id = ?").bind("session-archive"),
      ]);
      return Response.json({ slug: rows.results[0]?.slug }, { status: 201 });
    });

    expect(inside).not.toBe(env.DB);
    // The shape that Better Auth checks before it accepts a D1 database.
    expect("prepare" in inside! && "batch" in inside! && "exec" in inside!).toBe(true);
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ slug: "session-family" });
    const cookie = response.headers.get("set-cookie") ?? "";
    expect(cookie).toMatch(BOOKMARK_COOKIE);
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");

    // The next request starts from that bookmark and sees the write.
    const bookmark = BOOKMARK_COOKIE.exec(cookie)![1];
    const next = await withRequestDatabase(
      env.DB,
      request("GET", `other=1; everlittle.db_bookmark=${bookmark}`),
      async () => {
        const row = await requestDatabase(env.DB)
          .prepare("SELECT name FROM family_archive WHERE id = ?")
          .bind("session-archive")
          .first<{ name: string }>();
        return Response.json(row);
      },
    );
    expect(await next.json()).toEqual({ name: "Session Family" });
  });

  it("ignores a cookie value that is not a bookmark", async () => {
    for (const value of ["first-primary", "not-a-bookmark", "'; DROP TABLE family_archive; --"]) {
      const response = await withRequestDatabase(
        env.DB,
        request("GET", `everlittle.db_bookmark=${value}`),
        async () => {
          const row = await requestDatabase(env.DB)
            .prepare("SELECT COUNT(*) AS count FROM family_archive")
            .first<{ count: number }>();
          return Response.json(row);
        },
      );
      expect(response.status).toBe(200);
    }
  });

  it("adds no cookie to a request that ran no query", async () => {
    const response = await withRequestDatabase(env.DB, request("GET"), async () =>
      Response.redirect("https://family.example.com/", 308),
    );
    expect(response.status).toBe(308);
    expect(response.headers.get("set-cookie")).toBeNull();
  });
});
