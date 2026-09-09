import { SlidingTabs } from "@/components/design/controls";
import type { View } from "@/features/archive/archive-types";
const destinations = [
  { view: "parent", label: "Home" },
  { view: "timeline", label: "Timeline" },
  { view: "capsules", label: "Capsules" },
  { view: "family", label: "Family" },
] as const;
export function ArchiveTabs({
  active,
  onNavigate,
  mobile = false,
}: {
  active: View;
  onNavigate: (view: View) => void;
  showChild?: boolean;
  mobile?: boolean;
}) {
  return (
    <nav
      className={mobile ? "mobile-nav" : "desktop-nav"}
      aria-label={mobile ? "Primary mobile" : "Primary"}
    >
      <SlidingTabs
        value={destinations.find((item) => item.view === active)?.label ?? "Home"}
        items={destinations.map((item) => item.label)}
        label="Archive navigation"
        className="archive-tabs"
        onChange={(label) => {
          const target = destinations.find((item) => item.label === label);
          if (target) onNavigate(target.view);
        }}
      />
    </nav>
  );
}
