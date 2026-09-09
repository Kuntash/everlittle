import { MemoryCard } from "@/components/design/archive-presentations";
import type { Memory } from "../archive-types";
import { formatMemoryDate } from "../lib/archive-utils";
import { MemoryMedia } from "./memory-media";
import { MemoryPlayback } from "./memory-playback";
export function MemoryNote({ memory, onOpen }: { memory: Memory; onOpen: () => void }) {
  return (
    <MemoryCard
      kind={memory.kind}
      title={memory.title}
      body={memory.body ?? undefined}
      author={memory.authorName ?? "Family"}
      date={formatMemoryDate(memory.happenedAt)}
      onOpen={onOpen}
      media={<MemoryMedia memory={memory} />}
      player={memory.kind === "voice" ? <MemoryPlayback memory={memory} /> : undefined}
    />
  );
}
