type Kind = "photo" | "story" | "voice" | "video" | "milestone" | "letter";

const papers = {
  photo: ["peach", "peach-soft"],
  story: ["butter", "butter-soft"],
  voice: ["sky", "sky-soft"],
  video: ["cream", "sage"],
  milestone: ["sage", "sage-soft"],
  letter: ["blush", "cream"],
} as const satisfies Record<Kind, readonly string[]>;

/** Stable across SSR, sorting, pagination and every view of the same memory. */
export function memoryPaper(id: string, kind: Kind) {
  let hash = 0;
  for (const char of id) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0;
  const variants = papers[kind];
  return variants[hash % variants.length];
}
