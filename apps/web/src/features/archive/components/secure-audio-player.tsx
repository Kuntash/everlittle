import type { Memory } from "@/features/archive/archive-types";
import {
  formatMediaTime,
  responseError,
  scopedApiPath,
} from "@/features/archive/lib/archive-utils";
import { FALLBACK_WAVEFORM, waveformFromAudio } from "@/lib/audio-waveform";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function SecureAudioPlayer({ memory }: { memory: Memory }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveform, setWaveform] = useState(FALLBACK_WAVEFORM);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setReady(false);
    setError("");
    setWaveform(FALLBACK_WAVEFORM);
    setCurrentTime(0);
    setDuration(0);
    setPlaying(false);
    void (async () => {
      try {
        const response = await fetch(scopedApiPath(`/api/media/${memory.mediaId}`), {
          credentials: "same-origin",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(await responseError(response));
        const blob = await response.blob();
        if (!active) return;
        const objectUrl = URL.createObjectURL(blob);
        objectUrlRef.current = objectUrl;
        if (audioRef.current) audioRef.current.src = objectUrl;
        setReady(true);
        setLoading(false);
        const decodedWaveform = await waveformFromAudio(blob);
        if (active) setWaveform(decodedWaveform);
      } catch (caught) {
        if (active && !controller.signal.aborted) {
          setError(
            caught instanceof Error && caught.message
              ? caught.message
              : "The recording could not be loaded. Check your connection and try again.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
      controller.abort();
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    };
  }, [memory.mediaId]);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio || !ready) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    setError("");
    try {
      await audio.play();
    } catch {
      setError("This recording could not be played on this device.");
    }
  }

  function seek(value: number) {
    if (!audioRef.current || !duration) return;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  }

  const progress = duration ? currentTime / duration : 0;
  return (
    <div className="voice-player custom-player">
      <audio
        aria-label={memory.title}
        onDurationChange={(event) => setDuration(event.currentTarget.duration || 0)}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        ref={audioRef}
      />
      <button
        aria-label={playing ? "Pause recording" : "Play recording"}
        className="media-play"
        disabled={loading || !ready}
        onClick={() => void toggle()}
        type="button"
      >
        {loading ? (
          <span className="player-loader" />
        ) : playing ? (
          <Pause />
        ) : (
          <Play fill="currentColor" />
        )}
      </button>
      <div className="waveform-wrap">
        <div
          className="waveform"
          aria-hidden="true"
          title={waveform.source === "audio" ? "Recording waveform" : "Illustrative waveform"}
        >
          {waveform.bars.map((height, index) => (
            <i
              className={progress > 0 && index / waveform.bars.length < progress ? "played" : ""}
              key={`${height}-${index}`}
              style={{ height }}
            />
          ))}
        </div>
        <input
          aria-label="Recording position"
          max={duration || 1}
          min={0}
          onChange={(event) => seek(Number(event.target.value))}
          step="0.01"
          type="range"
          value={currentTime}
        />
        <div className="player-time">
          <span>{formatMediaTime(currentTime)}</span>
          <span>{duration ? formatMediaTime(duration) : "—:—"}</span>
        </div>
      </div>
      {error ? <p className="media-error">{error}</p> : null}
    </div>
  );
}
