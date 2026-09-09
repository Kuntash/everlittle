import { ArrowRight } from "lucide-react";

export function AnimatedActionLabel({
  showArrow,
  text,
  transitionKey,
}: {
  showArrow: boolean;
  text: string;
  transitionKey: string;
}) {
  return (
    <span aria-live="polite" className="stage-label">
      <span key={transitionKey} className="stage-label-text">
        {text}
      </span>
      {showArrow ? <ArrowRight size={17} /> : null}
    </span>
  );
}
