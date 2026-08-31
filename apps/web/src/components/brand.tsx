export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? "compact" : ""}`}>
      <span className="brand-mark" aria-hidden="true">
        <img src="/icon-512.png" alt="" />
      </span>
      <div>
        <strong>Everlittle</strong>
        {compact ? null : <small>A place for the memories they’ll grow into.</small>}
      </div>
    </div>
  );
}
