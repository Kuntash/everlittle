import { apiFetch, scopedApiPath } from "./archive-utils";

/** Upload small chunks so a large video never exceeds the edge request limit. */
export async function uploadMedia(
  memoryId: string,
  file: File,
  replaceId?: string,
  onProgress?: (percent: number) => void,
): Promise<Response> {
  const path = `/api/archive/memories/${memoryId}/media`;
  if (file.size <= 8 * 1024 * 1024) {
    return fetch(scopedApiPath(path), {
      method: "PUT",
      headers: {
        "content-type": file.type || "application/octet-stream",
        "x-everlittle-file-name": encodeURIComponent(file.name),
        ...(replaceId ? { "x-everlittle-replace-media-id": replaceId } : {}),
      },
      body: file,
    });
  }
  const start = await apiFetch(`${path}/uploads`, {
    method: "POST",
    body: JSON.stringify({
      byteSize: file.size,
      contentType: file.type || "application/octet-stream",
      fileName: file.name,
      replaceId,
    }),
  });
  if (!start.ok) return start;
  const session = (await start.json()) as { id: string; partSize: number };
  const sessionPath = `${path}/uploads/${session.id}`;
  let completed = false;
  try {
    for (let offset = 0, number = 1; offset < file.size; offset += session.partSize, number++) {
      const chunk = file.slice(offset, offset + session.partSize);
      let response: Response | undefined;
      // A repeated part number replaces the failed attempt, so transient failures are safe to retry.
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          response = await fetch(scopedApiPath(`${sessionPath}/parts/${number}`), {
            method: "PUT",
            body: chunk,
          });
          if (response.status < 500) break;
        } catch (error) {
          if (attempt === 2) throw error;
        }
      }
      if (!response?.ok)
        return (
          response ?? Response.json({ error: "Upload interrupted. Try again." }, { status: 503 })
        );
      onProgress?.(Math.round((Math.min(offset + chunk.size, file.size) / file.size) * 100));
    }
    const result = await apiFetch(sessionPath, { method: "POST" });
    completed = result.ok;
    return result;
  } finally {
    if (!completed) await apiFetch(sessionPath, { method: "DELETE" }).catch(() => undefined);
  }
}
