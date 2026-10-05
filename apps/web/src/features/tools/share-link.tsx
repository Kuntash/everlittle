import { ShadButton } from "@/components/design/controls";
import { Check, Link2 } from "lucide-react";
import { useState } from "react";

export function ShareLink({
  url,
  label = "Copy link to this result",
}: {
  url: () => string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <ShadButton
      variant="quiet"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url());
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          window.prompt("Copy this link", url());
        }
      }}
    >
      {copied ? <Check size={15} /> : <Link2 size={15} />}
      <span aria-live="polite">{copied ? "Link copied" : label}</span>
    </ShadButton>
  );
}
