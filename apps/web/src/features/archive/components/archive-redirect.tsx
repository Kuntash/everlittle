import { Brand } from "@/components/brand";
import type { PlatformState } from "@/features/archive/archive-types";
import { Loading } from "@/features/archive/components/loading";
import { responseError } from "@/features/archive/lib/archive-utils";
import { resolveArchiveEntry } from "@/lib/archive-navigation";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export function ArchiveRedirect({
  defaultArchiveSlug,
  deploymentMode,
}: {
  defaultArchiveSlug: string | null;
  deploymentMode: PlatformState["deploymentMode"];
}) {
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch("/api/archives")
      .then(async (response) => {
        if (!response.ok) throw new Error(await responseError(response));
        return response.json() as Promise<{ archives: Array<{ slug: string }> }>;
      })
      .then(({ archives }) => {
        const destination = resolveArchiveEntry(archives, {
          defaultArchiveSlug,
          deploymentMode,
          rememberedArchiveSlug: localStorage.getItem("everlittle.last-family"),
        });
        if (!destination) {
          void authClient.signOut().finally(() => location.replace("/"));
          return;
        }
        location.replace(destination);
      })
      .catch((reason: Error) => setError(reason.message));
  }, [defaultArchiveSlug, deploymentMode]);

  return error ? (
    <main className="loading-shell">
      <Brand />
      <p className="form-error">{error}</p>
    </main>
  ) : (
    <Loading />
  );
}
