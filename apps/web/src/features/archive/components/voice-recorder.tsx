import { Button } from "@/components/design/button";
import { formatMediaTime } from "@/features/archive/lib/archive-utils";
import fixWebmDuration from "fix-webm-duration";
import { Mic, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/*
 * Formats the server keeps, in order of preference. AAC in MP4 plays in every browser, so it comes first.
 * Firefox and older Chrome record Opus in WebM instead.
 */
const RECORDING_TYPES = [
  "audio/mp4;codecs=mp4a.40.2",
  "audio/mp4",
  "audio/webm;codecs=opus",
  "audio/webm",
];
const EXTENSIONS: Record<string, string> = {
  "audio/mp4": "m4a",
  "audio/webm": "webm",
};
const LEVEL_BARS = 28;

export function canRecordAudio() {
  return (
    typeof window !== "undefined" &&
    typeof MediaRecorder !== "undefined" &&
    Boolean(navigator.mediaDevices && "getUserMedia" in navigator.mediaDevices)
  );
}

function recordingType() {
  return RECORDING_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
}

function microphoneError(reason: unknown) {
  const name = reason instanceof DOMException ? reason.name : "";
  if (name === "NotAllowedError" || name === "SecurityError")
    return "Microphone access is blocked. Allow it in your browser settings, or choose a file instead.";
  if (name === "NotFoundError" || name === "OverconstrainedError")
    return "No microphone was found. Connect one, or choose a file instead.";
  if (name === "NotReadableError")
    return "Another app is using the microphone. Close it and try again.";
  return "The recording could not start. Try again, or choose a file instead.";
}

/**
 * Records a voice memory with the device microphone. The finished recording is handed back as a file,
 * so it is saved exactly like a chosen audio file. Leaving the form stops the microphone.
 */
export function VoiceRecorder({
  hasRecording = false,
  onRecorded,
  onRecordingChange,
}: {
  /** A recording or file is already chosen, so the button offers to replace it. */
  hasRecording?: boolean;
  onRecorded: (file: File) => void;
  onRecordingChange?: (recording: boolean) => void;
}) {
  const [state, setState] = useState<"idle" | "starting" | "recording">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [levels, setLevels] = useState<number[]>(() => Array(LEVEL_BARS).fill(0));
  const [error, setError] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const stopMicrophoneRef = useRef<() => void>(() => {});
  const discardRef = useRef(false);
  const onRecordedRef = useRef(onRecorded);
  onRecordedRef.current = onRecorded;
  const onRecordingChangeRef = useRef(onRecordingChange);
  onRecordingChangeRef.current = onRecordingChange;

  useEffect(() => {
    onRecordingChangeRef.current?.(state !== "idle");
  }, [state]);

  // Closing the form or switching the memory type mid-recording discards it and releases the microphone.
  useEffect(() => {
    discardRef.current = false;
    return () => {
      discardRef.current = true;
      if (recorderRef.current && recorderRef.current.state !== "inactive")
        recorderRef.current.stop();
      stopMicrophoneRef.current();
    };
  }, []);

  async function start() {
    setError("");
    setState("starting");
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (reason) {
      setError(microphoneError(reason));
      setState("idle");
      return;
    }

    const type = recordingType();
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
    } catch (reason) {
      for (const track of stream.getTracks()) track.stop();
      setError(microphoneError(reason));
      setState("idle");
      return;
    }

    const chunks: Blob[] = [];
    const startedAt = Date.now();
    let context: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    try {
      context = new AudioContext();
      analyser = context.createAnalyser();
      analyser.fftSize = 512;
      context.createMediaStreamSource(stream).connect(analyser);
    } catch {
      // The level meter is decoration. The recording works without it.
    }
    const samples = new Uint8Array(analyser?.fftSize ?? 0);
    const timer = window.setInterval(() => {
      setElapsed((Date.now() - startedAt) / 1000);
      if (!analyser) return;
      analyser.getByteTimeDomainData(samples);
      let energy = 0;
      for (const sample of samples) energy += ((sample - 128) / 128) ** 2;
      const level = Math.min(1, Math.sqrt(energy / samples.length) * 4);
      setLevels((previous) => [...previous.slice(1), level]);
    }, 100);

    stopMicrophoneRef.current = () => {
      window.clearInterval(timer);
      for (const track of stream.getTracks()) track.stop();
      void context?.close().catch(() => {});
      stopMicrophoneRef.current = () => {};
    };

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    recorder.onstop = async () => {
      const duration = Date.now() - startedAt;
      stopMicrophoneRef.current();
      recorderRef.current = null;
      if (discardRef.current) return;
      const baseType = (recorder.mimeType || type || "audio/webm").split(";", 1)[0];
      let blob = new Blob(chunks, { type: baseType });
      /*
       * A browser writes a WebM recording as it goes and never goes back to note its length. Players then show
       * no length and cannot seek. Writing the length in keeps the saved file whole.
       */
      if (baseType === "audio/webm" && blob.size > 0)
        blob = await fixWebmDuration(blob, duration, { logger: false }).catch(() => blob);
      if (discardRef.current) return;
      setState("idle");
      setLevels(Array(LEVEL_BARS).fill(0));
      if (blob.size === 0) {
        setError("Nothing was recorded. Check the microphone and try again.");
        return;
      }
      const now = new Date();
      const pad = (value: number) => String(value).padStart(2, "0");
      const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}.${pad(now.getMinutes())}`;
      onRecordedRef.current(
        new File([blob], `Recording ${stamp}.${EXTENSIONS[baseType] ?? "webm"}`, {
          type: baseType,
        }),
      );
    };
    recorder.onerror = () => {
      setError("The recording stopped unexpectedly. Try again.");
    };

    recorderRef.current = recorder;
    // Chunks every second, so a long recording does not sit in a single buffer until the end.
    recorder.start(1000);
    setElapsed(0);
    setState("recording");
  }

  function stop() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop();
  }

  return (
    <div className="voice-recorder" data-state={state}>
      {state === "recording" ? (
        <>
          <div className="voice-recorder-levels" aria-hidden="true">
            {levels.map((level, index) => (
              <span key={index} style={{ height: `${Math.round(4 + level * 28)}px` }} />
            ))}
          </div>
          <span className="voice-recorder-time" role="timer" aria-live="off">
            <span className="voice-recorder-dot" aria-hidden="true" />
            {formatMediaTime(elapsed)}
          </span>
          <Button type="button" onClick={stop}>
            <Square size={14} fill="currentColor" aria-hidden="true" />
            Stop recording
          </Button>
        </>
      ) : (
        <Button
          type="button"
          secondary={hasRecording}
          disabled={state === "starting"}
          onClick={() => void start()}
        >
          <Mic size={16} aria-hidden="true" />
          {state === "starting"
            ? "Waiting for the microphone…"
            : hasRecording
              ? "Record again"
              : "Record now"}
        </Button>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
