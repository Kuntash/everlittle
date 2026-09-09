import { Illustration } from "@/components/design/illustrations";
import { KindIcon } from "@/components/design/shared";
import { Card } from "@/components/ui/card";
import type { Capsule, Child, Memory } from "@/features/archive/archive-types";
import { MemoryDetail } from "@/features/archive/components/memory-detail";
import { MemoryNote } from "@/features/archive/components/memory-note";
import { useState } from "react";

export function ChildView({
  capsules,
  child,
  memories,
}: {
  capsules: Capsule[];
  child?: Child;
  memories: Memory[];
}) {
  const childMemories = memories.filter(
    (memory) => memory.audience === "child" || memory.audience === "all",
  );
  const featured = childMemories[0];
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const childName = child?.displayName ?? "there";
  if (selectedMemory && child)
    return (
      <MemoryDetail
        child={child}
        currentUserId=""
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
        onChanged={async () => {}}
        role="viewer"
      />
    );
  return (
    <div className="child-view">
      <div className="child-welcome">
        <div>
          <h1>Hi, {childName}.</h1>
          <p className="subtitle">These are the moments your family kept for you.</p>
        </div>
        <Illustration scene="sprout" />
      </div>
      {featured ? (
        <section className="memory-grid" id="child-stories">
          {childMemories.map((memory) => (
            <MemoryNote key={memory.id} memory={memory} onOpen={() => setSelectedMemory(memory)} />
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <KindIcon kind="Story" size={76} />
          <h2>Your family is still gathering your stories.</h2>
          <p>The memories marked “For child” will appear here.</p>
        </section>
      )}
      {capsules.length ? (
        <section className="capsule-section">
          <p className="eyebrow">Opened for you</p>
          <h2>Letters sent from an earlier day</h2>
          {capsules.map((capsule) => (
            <Card className="opened-note" key={capsule.id}>
              <KindIcon kind="Letter" size={76} />
              <div>
                <small>From {capsule.authorName ?? "your family"}</small>
                <h3>{capsule.title}</h3>
                <p>{capsule.body}</p>
              </div>
            </Card>
          ))}
        </section>
      ) : null}
    </div>
  );
}
