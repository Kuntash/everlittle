import { BrandMark } from "@/components/design/memory-illustrations";
export function Brand({ compact: _compact = false }: { compact?: boolean }) {
  return (
    <span className="brand">
      <BrandMark />
      Everlittle
    </span>
  );
}
