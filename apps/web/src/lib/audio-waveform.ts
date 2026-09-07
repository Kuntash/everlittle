export type Waveform = { bars: number[]; source: "audio" | "illustration" };

export const FALLBACK_WAVEFORM: Waveform = {
  bars: [
    9, 15, 21, 13, 27, 35, 22, 17, 31, 39, 25, 14, 20, 33, 42, 29, 18, 24, 36, 30, 16, 12, 26, 38,
    28, 19, 34, 23, 15, 31, 40, 27, 18, 24, 13, 21,
  ],
  source: "illustration",
};

export function waveformFromChannels(channels: Float32Array[]): Waveform {
  const count = FALLBACK_WAVEFORM.bars.length;
  const length = channels[0]?.length ?? 0;
  if (!length) return FALLBACK_WAVEFORM;

  const amplitudes = Array.from({ length: count }, (_, index) => {
    const start = Math.floor((index * length) / count);
    const end = Math.max(start + 1, Math.floor(((index + 1) * length) / count));
    let energy = 0;
    let samples = 0;
    for (const channel of channels) {
      for (let sample = start; sample < Math.min(end, channel.length); sample += 1) {
        energy += channel[sample] ** 2;
        samples += 1;
      }
    }
    return Math.sqrt(energy / Math.max(1, samples));
  });
  const peak = Math.max(...amplitudes);
  // Constant tones otherwise become a solid row of maximum-height bars.
  // Keep silence honest; use the illustrative fallback only for flat audible audio.
  if (peak > 0.001 && (peak - Math.min(...amplitudes)) / peak < 0.05) {
    return FALLBACK_WAVEFORM;
  }
  return {
    bars: amplitudes.map((amplitude) => Math.round(8 + (amplitude / Math.max(peak, 0.01)) * 34)),
    source: "audio",
  };
}

export async function waveformFromAudio(blob: Blob): Promise<Waveform> {
  let context: AudioContext | undefined;
  try {
    context = new AudioContext();
    const buffer = await context.decodeAudioData(await blob.arrayBuffer());
    return waveformFromChannels(
      Array.from({ length: buffer.numberOfChannels }, (_, index) => buffer.getChannelData(index)),
    );
  } catch {
    return FALLBACK_WAVEFORM;
  } finally {
    await context?.close().catch(() => {});
  }
}
