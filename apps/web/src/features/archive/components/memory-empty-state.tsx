import { MemoryIllustration } from "@/components/design/memory-illustrations";
import { Button } from "@/components/design/shared";
import type { MemoryKind } from "@/features/archive/archive-types";
import { ArrowRight, LockKeyhole } from "lucide-react";

const prompts = [
  { kind: "photo", art: "Photo", title: "A little moment", copy: "A photo from an ordinary day." },
  {
    kind: "voice",
    art: "Voice",
    title: "A familiar voice",
    copy: "A laugh, a story, a few words.",
  },
  {
    kind: "story",
    art: "Story",
    title: "Something they said",
    copy: "The words you want to remember.",
  },
] as const;

export function MemoryEmptyState({
  onStart,
  onCreateProfile,
  isVault = false,
  compact = false,
}: {
  onStart?: (kind: MemoryKind) => void;
  onCreateProfile?: () => void;
  isVault?: boolean;
  compact?: boolean;
}) {
  return (
    <section className={`memory-beginning${compact ? " memory-beginning-compact" : ""}`}>
      <div className="memory-beginning-intro">
        <div className="memory-beginning-art" aria-hidden="true">
          <MemoryIllustration kind="Keepsake" size={230} />
        </div>
        <div className="memory-beginning-copy">
          <h2>Save your first memory.</h2>
          <p className="memory-beginning-description">
            {onCreateProfile
              ? "Add a profile to start saving memories."
              : onStart
                ? isVault
                  ? "Choose a photo and add its story."
                  : "A photo, their newest word, or a voice recording."
                : "Memories your family shares will appear here."}
          </p>
          {onStart ? (
            <Button onClick={() => onStart("photo")}>
              Add your first memory <ArrowRight size={17} />
            </Button>
          ) : onCreateProfile ? (
            <Button onClick={onCreateProfile}>
              Create a profile <ArrowRight size={17} />
            </Button>
          ) : null}
          <p className="memory-beginning-private">
            <LockKeyhole size={13} /> Private to your family until you choose to share.
          </p>
        </div>
      </div>
      {onStart && !compact ? (
        <div className="memory-beginning-prompts">
          <p>Or start with…</p>
          <div className="memory-beginning-options">
            {prompts.map(({ kind, art, title, copy }) => (
              <button type="button" key={kind} onClick={() => onStart(kind)}>
                <MemoryIllustration kind={art} size={64} />
                <span>
                  <strong>{title}</strong>
                  <span>{copy}</span>
                </span>
                <ArrowRight size={16} className="memory-beginning-arrow" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
