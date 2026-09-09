import { KindIcon } from "@/components/design/shared";
import type { Memory } from "@/features/archive/archive-types";
import { formatMediaTime, scopedApiPath } from "@/features/archive/lib/archive-utils";
import { Maximize2, Pause, PlayCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function SecureVideoPlayer({ memory, featured }: { memory: Memory; featured: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const [error, setError] = useState("");
  const source = scopedApiPath(`/api/media/${memory.mediaId}`);
  const thumbnailSource = scopedApiPath(`/api/media/${memory.mediaId}/thumbnail`);

  useEffect(() => {
    setPlaying(false);
    setLoading(false);
    setCurrentTime(0);
    setDuration(0);
    setReady(false);
    setThumbnailFailed(false);
    setError("");
  }, [memory.mediaId]);

  async function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) {
      video.pause();
      return;
    }
    setError("");
    setLoading(true);
    try {
      await video.play();
    } catch {
      setLoading(false);
      setError("This video could not be played on this device.");
    }
  }

  return (
    <div
      className={`memory-video custom-video ${featured ? "featured" : ""} ${ready ? "is-ready" : ""} ${playing ? "is-playing" : ""}`}
    >
      <video
        aria-label={memory.title}
        onCanPlay={() => {
          setLoading(false);
          setReady(true);
        }}
        onDurationChange={(event) => {
          setDuration(event.currentTarget.duration || 0);
          setReady(true);
        }}
        onEnded={() => setPlaying(false)}
        onError={() => {
          setLoading(false);
          setError("This video could not be played on this device.");
        }}
        onLoadedData={() => setReady(true)}
        onPause={() => setPlaying(false)}
        onPlay={() => {
          setLoading(false);
          setPlaying(true);
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        playsInline
        preload="metadata"
        ref={videoRef}
        src={source}
      />
      {!ready &&
        (thumbnailFailed ? (
          <div className="video-fallback">
            <KindIcon kind="Video" size={120} />
          </div>
        ) : (
          <img alt="" onError={() => setThumbnailFailed(true)} src={thumbnailSource} />
        ))}
      <button
        aria-label={playing ? "Pause video" : "Play video"}
        className="video-play"
        onClick={() => void toggle()}
        type="button"
      >
        {loading ? <span className="player-loader" /> : playing ? <Pause /> : <PlayCircle />}
      </button>
      <div className="video-controls">
        <button
          aria-label={playing ? "Pause video" : "Play video"}
          onClick={() => void toggle()}
          type="button"
        >
          {playing ? <Pause /> : <PlayCircle />}
        </button>
        <input
          aria-label="Video position"
          max={duration || 1}
          min={0}
          onChange={(event) => {
            if (videoRef.current) videoRef.current.currentTime = Number(event.target.value);
          }}
          step="0.01"
          type="range"
          value={currentTime}
        />
        <span>
          {formatMediaTime(currentTime)} / {duration ? formatMediaTime(duration) : "—:—"}
        </span>
        <button
          aria-label="Full screen"
          onClick={() => void videoRef.current?.requestFullscreen()}
          type="button"
        >
          <Maximize2 />
        </button>
      </div>
      {error ? <p className="media-error video-error">{error}</p> : null}
    </div>
  );
}
