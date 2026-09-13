import { Button } from "@/components/design/shared";
import type {
  Capsule,
  Child,
  FamilyRole,
  Memory,
  MemoryKind,
  View,
} from "@/features/archive/archive-types";
import { MemoryComposer } from "@/features/archive/components/memory-composer";
import { MemoryDetail } from "@/features/archive/components/memory-detail";
import { MemoryNote } from "@/features/archive/components/memory-note";
import { MemoryEmptyState } from "@/features/archive/components/memory-empty-state";
import { ArrowRight, Plus } from "lucide-react";
import { useState } from "react";

export function ParentView({
  child,
  currentUserId,
  memories,
  onNavigate,
  refresh,
  role,
  canCreateContent,
  onSubscriptionRequired,
}: {
  capsules: Capsule[];
  child?: Child;
  currentUserId: string;
  memories: Memory[];
  onNavigate: (view: View) => void;
  refresh: () => Promise<void>;
  role: FamilyRole;
  canCreateContent: boolean;
  onSubscriptionRequired: () => void;
}) {
  const [composerKind, setComposerKind] = useState<MemoryKind | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const canCreate = role !== "viewer";
  const isVault = child?.profileKind === "vault";
  const childName = child?.displayName ?? "your child";

  function openComposer(kind: MemoryKind) {
    if (!child) return;
    if (!canCreateContent) {
      onSubscriptionRequired();
      return;
    }
    setComposerKind(kind);
  }

  if (selectedMemory && child)
    return (
      <MemoryDetail
        child={child}
        currentUserId={currentUserId}
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
        onChanged={refresh}
        role={role}
        backLabel="home"
      />
    );
  return (
    <div className="home-page">
      <header className="home-heading">
        <div>
          <h1>{isVault ? "Our memory vault" : `${childName}’s memories`}</h1>
          <p className="subtitle">Your family’s moments, kept together.</p>
        </div>
        {canCreate && memories.length > 0 ? (
          <Button
            className="scrapbook-add"
            disabled={!child}
            onClick={() => openComposer("photo")}
            type="button"
          >
            <Plus size={18} /> Add a memory
          </Button>
        ) : null}
      </header>
      {memories.length ? (
        <>
          <div className="section-heading">
            <h2>Recently added</h2>
            <button className="text-button" onClick={() => onNavigate("timeline")}>
              View timeline <ArrowRight size={16} />
            </button>
          </div>
          <div className="memory-grid home-grid" aria-label="Recent memories">
            {memories.slice(0, 6).map((memory) => (
              <MemoryNote
                key={memory.id}
                memory={memory}
                onOpen={() => setSelectedMemory(memory)}
              />
            ))}
          </div>
        </>
      ) : (
        <MemoryEmptyState
          isVault={isVault}
          onStart={canCreate && child ? openComposer : undefined}
          onCreateProfile={canCreate && !child ? () => onNavigate("family") : undefined}
        />
      )}
      {composerKind && child ? (
        <MemoryComposer
          child={child}
          initialKind={composerKind}
          onClose={() => setComposerKind(null)}
          onCreated={async () => {
            await refresh();
          }}
          role={role}
        />
      ) : null}
      {selectedMemory && child ? (
        <MemoryDetail
          child={child}
          currentUserId={currentUserId}
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
          onChanged={async () => {
            await refresh();
          }}
          role={role}
        />
      ) : null}
    </div>
  );
}
