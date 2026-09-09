import { ArchiveTabs } from "@/components/archive-tabs";
import { Brand } from "@/components/brand";
import { DesignSelect } from "@/components/design/design-select";
import type { ArchiveMembership, ArchiveState, View } from "@/features/archive/archive-types";
import { CapsulesView } from "@/features/archive/components/capsules-view";
import { ChildView } from "@/features/archive/components/child-view";
import { FamilySettings } from "@/features/archive/components/family-settings";
import { Loading } from "@/features/archive/components/loading";
import { ParentView } from "@/features/archive/components/parent-view";
import { SubscriptionSheet } from "@/features/archive/components/subscription-sheet";
import { TimelineView } from "@/features/archive/components/timeline-view";
import {
  apiFetch,
  currentArchiveView,
  currentFamilySlug,
  responseError,
} from "@/features/archive/lib/archive-utils";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";

export function ArchiveApp() {
  const [view, setView] = useState<View>(currentArchiveView);
  const [state, setState] = useState<ArchiveState | null>(null);
  const [archives, setArchives] = useState<ArchiveMembership[]>([]);
  const [error, setError] = useState("");
  const [showSubscription, setShowSubscription] = useState(false);

  async function refresh() {
    const response = await apiFetch("/api/archive");
    if (!response.ok) {
      setError(await responseError(response));
      return;
    }
    setState((await response.json()) as ArchiveState);
    setError("");
  }

  useEffect(() => {
    void refresh();
    void fetch("/api/archives")
      .then(async (response) => {
        if (!response.ok) throw new Error(await responseError(response));
        return response.json() as Promise<{ archives: ArchiveMembership[] }>;
      })
      .then(({ archives: memberships }) => setArchives(memberships))
      .catch(() => setArchives([]));
  }, []);

  useEffect(() => {
    const slug = currentFamilySlug();
    if (slug) localStorage.setItem("everlittle.last-family", slug);
    const syncView = () => setView(currentArchiveView());
    window.addEventListener("popstate", syncView);
    return () => window.removeEventListener("popstate", syncView);
  }, []);

  useEffect(() => {
    if (state?.children[0]?.profileKind === "vault" && view === "child") setView("parent");
  }, [state?.children, view]);

  function navigateView(next: View) {
    const slug = currentFamilySlug();
    if (!slug) return;
    const segment = next === "parent" ? "" : `/${next}`;
    window.history.pushState({}, "", `/${encodeURIComponent(slug)}${segment}`);
    setView(next);
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
        <div className="archive-header-identity">
          <Brand compact />
          <span className="archive-name">
            <Users size={18} aria-hidden="true" /> {state.archive.name}
          </span>
          {archives.length > 1 ? (
            <label className="family-switcher">
              <span>Family</span>
              <DesignSelect
                aria-label="Switch family archive"
                onChange={(event) => location.assign(`/${encodeURIComponent(event.target.value)}`)}
                value={state.archive.slug}
              >
                {archives.map((archive) => (
                  <option key={archive.id} value={archive.slug}>
                    {archive.name}
                  </option>
                ))}
              </DesignSelect>
            </label>
          ) : null}
        </div>
        {view === "child" ? (
          <button className="exit-child-view" type="button" onClick={() => navigateView("family")}>
            Exit child view
          </button>
        ) : (
          <ArchiveTabs
            active={view}
            onNavigate={navigateView}
            showChild={state.children[0]?.profileKind !== "vault"}
          />
        )}
      </header>
      <div className="app-main">
        {view === "parent" ? (
          <ParentView
            child={state.children[0]}
            currentUserId={state.currentMember.userId}
            memories={state.memories}
            capsules={state.capsules}
            onNavigate={navigateView}
            refresh={refresh}
            role={state.currentMember.role}
            canCreateContent={state.billing.canCreateContent}
            onSubscriptionRequired={() => setShowSubscription(true)}
          />
        ) : null}
        {view === "timeline" ? (
          <TimelineView
            child={state.children[0]}
            currentUserId={state.currentMember.userId}
            memories={state.memories}
            refresh={refresh}
            role={state.currentMember.role}
            canCreateContent={state.billing.canCreateContent}
            onSubscriptionRequired={() => setShowSubscription(true)}
          />
        ) : null}
        {view === "capsules" ? (
          <CapsulesView
            capsules={state.capsules}
            child={state.children[0]}
            currentUserId={state.currentMember.userId}
            refresh={refresh}
            role={state.currentMember.role}
            canCreateContent={state.billing.canCreateContent}
            onSubscriptionRequired={() => setShowSubscription(true)}
          />
        ) : null}
        {view === "child" ? (
          <ChildView
            capsules={state.capsules.filter(
              (capsule) => !capsule.locked && capsule.audience === "child",
            )}
            child={state.children[0]}
            memories={state.memories}
          />
        ) : null}
        {view === "family" ? (
          <FamilySettings
            state={state}
            refresh={refresh}
            onOpenChild={() => navigateView("child")}
          />
        ) : null}
      </div>
      {view !== "child" && (
        <ArchiveTabs
          mobile
          active={view}
          onNavigate={navigateView}
          showChild={state.children[0]?.profileKind !== "vault"}
        />
      )}
      {showSubscription ? (
        <SubscriptionSheet
          billing={state.billing}
          isOwner={state.currentMember.role === "owner"}
          onClose={() => setShowSubscription(false)}
        />
      ) : null}
    </main>
  );
}
