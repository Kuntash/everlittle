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
          <p className="memory-beginning-kicker">Every story starts somewhere</p>
          <h2>
            A little moment today.
            <br />A treasure for tomorrow.
          </h2>
          <p className="memory-beginning-description">
            {onCreateProfile
              ? "Give your memories a home. Start with a profile, then keep your first little moment."
              : onStart
                ? isVault
                  ? "An ordinary afternoon. An old photograph. A story only you can tell. Start with one small thing."
                  : "A sleepy smile. Their newest word. The sound of your voice. You don’t need a big occasion to begin."
                : "Your family’s photos, voices and stories will gather here, ready to return to whenever you like."}
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
          <p>Not sure where to start? Try one of these.</p>
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
