import { AnimatedActionLabel } from "@/features/archive/components/animated-action-label";

export function MemoryStageLabel({ stage }: { stage: "idle" | "saving" | "uploading" }) {
  return (
    <AnimatedActionLabel
      showArrow={false}
      text={
        stage === "saving"
          ? "Saving memory…"
          : stage === "uploading"
            ? "Keeping media private…"
            : "Save memory"
      }
      transitionKey={stage}
    />
  );
}
