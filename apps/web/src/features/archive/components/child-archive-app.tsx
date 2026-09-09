import { Brand } from "@/components/brand";
import type { Capsule, Child, Memory } from "@/features/archive/archive-types";
import { ChildView } from "@/features/archive/components/child-view";
import { Loading } from "@/features/archive/components/loading";
import { apiFetch, responseError } from "@/features/archive/lib/archive-utils";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export function ChildArchiveApp({
  apiPrefix = "/api/child",
  leaveTo = "/",
}: {
  apiPrefix?: string;
  leaveTo?: string;
}) {
  const [state, setState] = useState<{
    child: Child;
    memories: Memory[];
    capsules: Capsule[];
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch(`${apiPrefix}/archive`)
      .then(async (response) => {
        if (!response.ok) throw new Error(await responseError(response));
        return response.json() as Promise<{
          child: Child;
          memories: Memory[];
          capsules: Capsule[];
        }>;
      })
      .then(setState)
      .catch((reason: Error) => setError(reason.message));
  }, [apiPrefix]);

  async function leave() {
    await apiFetch(`${apiPrefix}/sign-out`, { method: "POST" });
    location.assign(leaveTo);
  }

  if (!state) {
    return error ? (
      <main className="loading-shell">
        <Brand />
        <p className="form-error">{error}</p>
      </main>
    ) : (
      <Loading />
    );
  }

  return (
    <main className="apricot app-v4">
      <header className="app-header">
        <Brand compact />
        <button className="exit-child-view" onClick={() => void leave()} type="button">
          <LogOut size={16} /> Leave {state.child.displayName}’s space
        </button>
      </header>
      <div className="app-main">
        <ChildView capsules={state.capsules} child={state.child} memories={state.memories} />
      </div>
    </main>
  );
}
