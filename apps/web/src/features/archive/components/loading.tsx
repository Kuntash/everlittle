import { Brand } from "@/components/brand";

export function Loading() {
  return (
    <main className="loading-shell">
      <Brand />
      <span className="loading-dot" aria-label="Loading" />
    </main>
  );
}
