import { describe, expect, it } from "vitest";
import { FALLBACK_WAVEFORM, waveformFromChannels } from "../src/lib/audio-waveform";

describe("recording waveform", () => {
  it("preserves quiet and loud sections from either stereo channel", () => {
    const signal = new Float32Array(360);
    signal.fill(0.2, 120, 240);
    signal.fill(0.8, 240);
    const result = waveformFromChannels([new Float32Array(360), signal]);
    expect(result.source).toBe("audio");
    expect(result.bars[0]).toBe(8);
    expect(result.bars[15]).toBeGreaterThan(result.bars[0]);
    expect(result.bars[30]).toBeGreaterThan(result.bars[15]);
  });

  it("uses the static illustration for constant audible recordings", () => {
    expect(waveformFromChannels([new Float32Array(360).fill(0.5)])).toBe(FALLBACK_WAVEFORM);
    expect(new Set(FALLBACK_WAVEFORM.bars).size).toBeGreaterThan(10);
  });

  it("keeps silence flat and includes the final samples", () => {
    expect(waveformFromChannels([new Float32Array(360)]).bars).toEqual(Array(36).fill(8));
    const signal = new Float32Array(365);
    signal[364] = 1;
    expect(waveformFromChannels([signal]).bars.at(-1)).toBe(42);
  });
});
