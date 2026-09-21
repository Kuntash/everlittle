import { AnimatedActionLabel } from "@/features/archive/components/animated-action-label";

export function MemoryStageLabel({
  stage,
  progress = 0,
}: {
  stage: "idle" | "saving" | "uploading";
  progress?: number;
}) {
  return (
    <AnimatedActionLabel
      showArrow={false}
      text={
        stage === "saving"
          ? "Saving memory…"
          : stage === "uploading"
            ? progress
              ? `Uploading… ${progress}%`
              : "Uploading…"
            : "Save memory"
      }
      transitionKey={stage}
    />
  );
}
