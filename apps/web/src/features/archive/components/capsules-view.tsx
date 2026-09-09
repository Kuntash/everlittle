import { SealedCapsuleCard } from "@/components/design/archive-presentations";
import { Button, KindIcon } from "@/components/design/shared";
import { Card } from "@/components/ui/card";
import type { Capsule, Child, FamilyRole } from "@/features/archive/archive-types";
import { CapsuleComposer } from "@/features/archive/components/capsule-composer";
import { useConfirmation } from "@/features/archive/hooks/use-confirmation";
import { apiFetch, formatDate, responseError } from "@/features/archive/lib/archive-utils";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export function CapsulesView({
  capsules,
  child,
  currentUserId,
  refresh,
  role,
  canCreateContent,
  onSubscriptionRequired,
}: {
  capsules: Capsule[];
  child?: Child;
  currentUserId: string;
  refresh: () => Promise<void>;
  role: FamilyRole;
  canCreateContent: boolean;
  onSubscriptionRequired: () => void;
}) {
  const { confirm, confirmation } = useConfirmation();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const locked = capsules.filter((capsule) => capsule.locked);
  const opened = capsules.filter((capsule) => !capsule.locked);
  const canCreate = role !== "viewer";

  function startCreating() {
    if (!child) return;
    if (!canCreateContent) {
      onSubscriptionRequired();
      return;
    }
    setCreating(true);
  }

  async function remove(capsule: Capsule) {
    if (!(await confirm(`Delete the capsule “${capsule.title}”?`))) return;
    const response = await apiFetch(`/api/archive/capsules/${capsule.id}`, { method: "DELETE" });
    if (!response.ok) {
      setError(await responseError(response));
      return;
    }
    await refresh();
  }

  return (
    <div className="capsules-view">
      {confirmation}
      <div className="home-heading">
        <div>
          <h1>A little love for later</h1>
          <p className="subtitle">Write a note now. Let it meet them on a day you choose.</p>
        </div>
        {canCreate && (
          <Button disabled={!child} onClick={startCreating}>
            <Plus size={18} />
            New capsule
          </Button>
        )}
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <section className="capsule-section">
        <h2>Sealed for later</h2>
        {locked.length ? (
          <div className="two-grid">
            {locked.map((capsule) => (
              <SealedCapsuleCard
                key={capsule.id}
                title={capsule.title}
                date={formatDate(capsule.unlocksAt)}
                author={capsule.authorName ?? "Family"}
                audience={
                  capsule.audience === "child"
                    ? `${child?.displayName ?? "Child"}’s view`
                    : "Family archive"
                }
              >
                {(role === "owner" ||
                  role === "parent" ||
                  capsule.createdByUserId === currentUserId) && (
                  <button
                    className="quiet-action capsule-delete"
                    aria-label={`Delete ${capsule.title}`}
                    onClick={() => void remove(capsule)}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </SealedCapsuleCard>
            ))}
          </div>
        ) : (
          <p className="muted">Your sealed notes will appear here.</p>
        )}
      </section>
      <section className="capsule-section">
        <h2>Opened notes</h2>
        {opened.length ? (
          opened.map((capsule) => (
            <Card className="opened-note" key={capsule.id}>
              <KindIcon kind="Letter" size={76} />
              <div>
                <h3>{capsule.title}</h3>
                <small>
                  {capsule.authorName ?? "Family"} · Opened {formatDate(capsule.unlocksAt)}
                </small>
                <p>{capsule.body}</p>
                {(role === "owner" ||
                  role === "parent" ||
                  capsule.createdByUserId === currentUserId) && (
                  <button
                    className="quiet-action capsule-delete"
                    aria-label={`Delete ${capsule.title}`}
                    onClick={() => void remove(capsule)}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </Card>
          ))
        ) : (
          <p className="muted">Notes will open here when their day arrives.</p>
        )}
      </section>
      {creating && child && (
        <CapsuleComposer child={child} onClose={() => setCreating(false)} onCreated={refresh} />
      )}
    </div>
  );
}
