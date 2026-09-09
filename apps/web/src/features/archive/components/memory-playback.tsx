import type { Memory } from "@/features/archive/archive-types";
import { SecureAudioPlayer } from "@/features/archive/components/secure-audio-player";
import { PlayCircle } from "lucide-react";

export function MemoryPlayback({ memory }: { memory: Memory }) {
  if (memory.mediaType === "audio" && memory.mediaId) return <SecureAudioPlayer memory={memory} />;
  return (
    <div className="voice-player empty" aria-label="No recording attached">
      <span aria-hidden="true">
        <PlayCircle />
      </span>
      <p>No recording is attached to this memory.</p>
    </div>
  );
}
