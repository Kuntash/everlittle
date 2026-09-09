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
import { ArrowRight, PenLine, Plus } from "lucide-react";
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
        {canCreate ? (
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
      {!child ? (
        <p className="capture-note">Create a child profile in Family before adding memories.</p>
      ) : null}
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
        <section className="memory-empty scrapbook-first-note">
          <span aria-hidden="true">
            <PenLine />
          </span>
          <p className="eyebrow">The first page is waiting</p>
          <h2>Keep the small thing you don’t want to forget.</h2>
          <p>
            {isVault
              ? "An ordinary afternoon, a note to each other, or simply what today felt like."
              : "A sleepy expression, a new sound, a photograph, or simply what today felt like."}
          </p>
          {canCreate && child ? (
            <button className="primary-button" onClick={() => openComposer("photo")} type="button">
              Write the first memory <ArrowRight size={17} />
            </button>
          ) : null}
        </section>
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
