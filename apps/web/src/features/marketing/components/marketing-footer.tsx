import { Brand } from "@/components/design/shared";
export function MarketingFooter({
  start,
  go,
}: {
  start: (mode?: string) => void;
  go: (id: string) => void;
}) {
  return (
    <footer className="landing-footer">
      <div className="footer-identity">
        <Brand />
        <p>A home for your family’s memories.</p>
      </div>
      <nav aria-label="Footer">
        {[
          ["Privacy", "privacy"],
          ["Journal", "journal"],
          ["Pricing", "pricing"],
        ].map(([l, id]) => (
          <button key={id} onClick={() => go(id)}>
            {l}
          </button>
        ))}
        <button onClick={() => start("Sign in")}>Sign in</button>
      </nav>
    </footer>
  );
}
