import { SlidingTabs } from "@/components/design/controls";
import { Button, KindIcon } from "@/components/design/shared";
import type { Child, FamilyRole, Memory, MemoryKind } from "@/features/archive/archive-types";
import { MemoryDetail } from "@/features/archive/components/memory-detail";
import { MemoryNote } from "@/features/archive/components/memory-note";
import { Plus } from "lucide-react";
import { useState } from "react";
import { MemoryComposer } from "./memory-composer";
import { MemoryEmptyState } from "./memory-empty-state";

export function TimelineView({
  child,
  currentUserId,
  memories,
  refresh,
  role,
  canCreateContent,
  onSubscriptionRequired,
}: {
  child?: Child;
  currentUserId: string;
  memories: Memory[];
  refresh: () => Promise<void>;
  role: FamilyRole;
  canCreateContent: boolean;
  onSubscriptionRequired: () => void;
}) {
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState<MemoryKind | "all">("all");
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const visible = filter === "all" ? memories : memories.filter((memory) => memory.kind === filter);
  const groups = new Map<string, Memory[]>();
  for (const memory of visible) {
    const key = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(
      new Date(memory.happenedAt),
    );
    groups.set(key, [...(groups.get(key) ?? []), memory]);
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
        backLabel="timeline"
      />
    );
  return (
    <div className="timeline-view">
      <div className="home-heading">
        <div>
          <h1>Every little chapter</h1>
          <p className="subtitle">The moments you’ve kept, in the order they happened.</p>
        </div>
        {role !== "viewer" && (
          <Button
            disabled={!child}
            onClick={() => (canCreateContent ? setCreating(true) : onSubscriptionRequired())}
          >
            <Plus size={18} />
            Add a memory
          </Button>
        )}
      </div>
      <SlidingTabs
        value={filter}
        onChange={(v) => setFilter(v as MemoryKind | "all")}
        items={["all", "photo", "story", "voice", "video", "milestone", "letter"]}
        label="Filter memories"
        className="timeline-filters"
        renderLabel={(v) => (
          <>
            {v !== "all" && <KindIcon kind={v.charAt(0).toUpperCase() + v.slice(1)} size={32} />}
            <span>
              {v === "all"
                ? "All"
                : v === "story"
                  ? "Stories"
                  : v === "voice"
                    ? "Voice"
                    : v.charAt(0).toUpperCase() + v.slice(1) + "s"}
            </span>
          </>
        )}
      />
      {groups.size ? (
        [...groups].map(([label, items]) => (
          <section className="timeline-month" key={label}>
            <h2>{label}</h2>
            <div className="memory-grid">
              {items.map((memory) => (
                <MemoryNote
                  key={memory.id}
                  memory={memory}
                  onOpen={() => setSelectedMemory(memory)}
                />
              ))}
            </div>
          </section>
        ))
      ) : memories.length === 0 ? (
        <MemoryEmptyState
          compact
          isVault={child?.profileKind === "vault"}
          onStart={
            role !== "viewer" && child
              ? () => (canCreateContent ? setCreating(true) : onSubscriptionRequired())
              : undefined
          }
        />
      ) : (
        <div className="empty">
          <KindIcon
            kind={filter === "all" ? "Photo" : filter.charAt(0).toUpperCase() + filter.slice(1)}
            size={100}
          />
          <h2>No memories here yet.</h2>
          <p>There’s room for the next little moment.</p>
        </div>
      )}
      {creating && child && (
        <MemoryComposer
          child={child}
          initialKind="photo"
          role={role}
          onClose={() => setCreating(false)}
          onCreated={refresh}
        />
      )}
    </div>
  );
}
