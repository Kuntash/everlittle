import { BrandMark } from "@/components/design/memory-illustrations";
export function Brand({
  compact: _compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <a
      className={`brand ${className}`}
      href="/"
      aria-label="Everlittle home"
      style={{ color: "inherit", textDecoration: "none" }}
    >
      <BrandMark />
      Everlittle
    </a>
  );
}
