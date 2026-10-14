import { useEffect, useState } from "react";

import type { PlatformState } from "@/features/archive/archive-types";
import { readBoot } from "@/lib/boot";

let request: Promise<PlatformState> | null = null;

/**
 * The installation's settings. A page that the server rendered already carries them, so this reads no network.
 * Without them it asks `/api/platform`. Callers that ask at the same time share one request.
 * @throws when the request fails.
 */
export function loadPlatform(): Promise<PlatformState> {
  const boot = readBoot();
  if (boot) return Promise.resolve(boot.platform);
  request ??= fetch("/api/platform", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("The platform settings could not be read.");
      return response.json() as Promise<PlatformState>;
    })
    .finally(() => {
      request = null;
    });
  return request;
}

/** The installation's settings, or null until they are known. With a server-rendered page they are known at once. */
export function usePlatform(): PlatformState | null {
  const [platform, setPlatform] = useState<PlatformState | null>(
    () => readBoot()?.platform ?? null,
  );
  useEffect(() => {
    if (platform) return;
    let active = true;
    void loadPlatform()
      .then((loaded) => {
        if (active) setPlatform(loaded);
      })
      .catch(() => {
        // The caller keeps its loading state. A reload asks again.
      });
    return () => {
      active = false;
    };
  }, [platform]);
  return platform;
}
