import { SurfaceModal } from "@/components/design/controls";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Check, Copy, Globe, Lock, MoreHorizontal, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
export function MemorySharingMenu({
  url,
  busy,
  onEnable,
  onDisable,
  onCopy,
  onShare,
}: {
  url: string;
  busy: boolean;
  onEnable: () => Promise<void>;
  onDisable: () => Promise<void>;
  onCopy: () => Promise<void>;
  onShare: () => Promise<void>;
}) {
  const [mobile, setMobile] = useState(false),
    [open, setOpen] = useState(false),
    [copied, setCopied] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(max-width: 700px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);
  const content = (
    <div className="memory-menu-body">
      <div className="visibility-switch">
        <div>
          {url ? <Globe size={17} /> : <Lock size={17} />}
          <span>{url ? "Public link enabled" : "Family archive"}</span>
        </div>
        <Switch
          aria-label="Make memory public"
          checked={Boolean(url)}
          disabled={busy}
          onCheckedChange={(v) => void (v ? onEnable() : onDisable())}
        />
      </div>
      <p>
        {url
          ? "Anyone with this link can view this memory for 30 days."
          : "Enable a public link to share this memory outside your family."}
      </p>
      {url && (
        <div className="sharing-actions">
          <Button
            variant="quiet"
            onClick={async () => {
              await onCopy();
              setCopied(true);
            }}
          >
            <span key={String(copied)} className="copy-status-icon">
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </span>
            {copied ? "Copied" : "Copy link"}
          </Button>
          <Button variant="quiet" onClick={() => void onShare()}>
            <Share2 size={16} />
            Share to an app
          </Button>
        </div>
      )}
    </div>
  );
  const trigger = (
    <Button
      variant="quiet"
      className="memory-more"
      aria-label="Memory sharing options"
      onClick={mobile ? () => setOpen(true) : undefined}
    >
      <MoreHorizontal size={22} />
    </Button>
  );
  return mobile ? (
    <>
      {trigger}
      <SurfaceModal open={open} title="Memory visibility" onClose={() => setOpen(false)}>
        {content}
      </SurfaceModal>
    </>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={9} className="apricot-popover memory-menu">
        <h3>Memory visibility</h3>
        {content}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
