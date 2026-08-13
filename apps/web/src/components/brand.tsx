import { Sparkles } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? "compact" : ""}`}>
      <span className="brand-mark" aria-hidden="true">
        <Sparkles size={14} />
        <span />
      </span>
      <div>
        <strong>Everlittle</strong>
        {compact ? null : <small>A place for the memories they’ll grow into.</small>}
      </div>
    </div>
  );
}
