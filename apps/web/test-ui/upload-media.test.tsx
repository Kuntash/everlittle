import { afterEach, describe, expect, it, vi } from "vitest";
import { uploadMedia } from "@/features/archive/lib/upload-media";
import { apiFetch } from "@/features/archive/lib/archive-utils";

vi.mock("@/features/archive/lib/archive-utils", () => ({
  scopedApiPath: (path: string) => `/api/families/example${path.slice(4)}`,
  apiFetch: vi.fn(),
}));
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("large media uploads", () => {
  it("retries only the failed chunk, preserves replacement identity, and completes after every chunk", async () => {
    const api = vi.mocked(apiFetch).mockReset();
    api
      .mockResolvedValueOnce(Response.json({ id: "upload", partSize: 8 * 1024 * 1024 }))
      .mockResolvedValueOnce(Response.json({ id: "asset" }, { status: 201 }));
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetch);
    const file = new File([new Uint8Array(9 * 1024 * 1024)], "video.mp4", { type: "video/mp4" });
    const progress = vi.fn();
    const response = await uploadMedia("memory", file, "old-asset", progress);
    expect(response.status).toBe(201);
    expect(JSON.parse(api.mock.calls[0][1]?.body as string)).toMatchObject({
      byteSize: file.size,
      replaceId: "old-asset",
    });
    expect(fetch.mock.calls.map(([path]) => path)).toEqual([
      "/api/families/example/archive/memories/memory/media/uploads/upload/parts/1",
      "/api/families/example/archive/memories/memory/media/uploads/upload/parts/1",
      "/api/families/example/archive/memories/memory/media/uploads/upload/parts/2",
    ]);
    expect(fetch.mock.calls.map(([, init]) => init.body.size)).toEqual([
      8 * 1024 * 1024,
      8 * 1024 * 1024,
      1024 * 1024,
    ]);
    expect(progress).toHaveBeenLastCalledWith(100);
    expect(api).toHaveBeenLastCalledWith("/api/archive/memories/memory/media/uploads/upload", {
      method: "POST",
    });
  });

  it("aborts the partial upload after repeated network failures", async () => {
    const api = vi.mocked(apiFetch).mockReset();
    api
      .mockResolvedValueOnce(Response.json({ id: "upload", partSize: 8 * 1024 * 1024 }))
      .mockResolvedValue(Response.json({ ok: true }));
    const fetch = vi.fn().mockRejectedValue(new Error("Connection lost"));
    vi.stubGlobal("fetch", fetch);
    const file = new File([new Uint8Array(9 * 1024 * 1024)], "video.mp4", { type: "video/mp4" });
    await expect(uploadMedia("memory", file)).rejects.toThrow("Connection lost");
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(api).toHaveBeenLastCalledWith("/api/archive/memories/memory/media/uploads/upload", {
      method: "DELETE",
    });
  });
});
