import { Archive, Baby, Clock3, UserRound, Users } from "lucide-react";

type View = "parent" | "timeline" | "capsules" | "child" | "family";
const destinations = [
  { view: "parent", label: "Parent", icon: UserRound },
  { view: "timeline", label: "Timeline", icon: Clock3 },
  { view: "capsules", label: "Capsules", icon: Archive },
  { view: "child", label: "Child", icon: Baby },
  { view: "family", label: "Family", icon: Users },
] as const;

export function ArchiveTabs({
  active,
  onNavigate,
  showChild,
  mobile = false,
}: {
  active: View;
  onNavigate: (view: View) => void;
  showChild: boolean;
  mobile?: boolean;
}) {
  return (
    <nav
      className={mobile ? "scrapbook-mobile-nav" : "folder-tabs"}
      aria-label={mobile ? "Primary mobile" : "Primary"}
    >
      {destinations
        .filter(({ view }) => view !== "child" || showChild)
        .map(({ view, label, icon: Icon }) => (
          <button
            key={view}
            className={`folder-tab folder-${view} ${active === view ? "active" : ""}`}
            aria-current={active === view ? "page" : undefined}
            onClick={() => onNavigate(view)}
            type="button"
          >
            <Icon size={20} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
    </nav>
  );
}
