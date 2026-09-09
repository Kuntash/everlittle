import type { Memory } from "@/features/archive/archive-types";
import { SecureVideoPlayer } from "@/features/archive/components/secure-video-player";
import { memoryIcon, scopedApiPath } from "@/features/archive/lib/archive-utils";

export function MemoryMedia({ memory, featured = false }: { memory: Memory; featured?: boolean }) {
  if (memory.mediaType === "image" && memory.mediaId) {
    return (
      <div className={`memory-photo real-photo ${featured ? "featured" : ""}`}>
        <img
          alt={memory.title}
          loading={featured ? "eager" : "lazy"}
          src={scopedApiPath(`/api/media/${memory.mediaId}`)}
        />
      </div>
    );
  }
  if (memory.mediaType === "video" && memory.mediaId) {
    return <SecureVideoPlayer featured={featured} memory={memory} />;
  }
  return (
    <div className={`memory-photo memory-symbol ${memory.kind}`}>{memoryIcon(memory.kind)}</div>
  );
}
