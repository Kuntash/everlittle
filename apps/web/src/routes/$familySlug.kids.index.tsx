import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Baby, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";

import { Brand } from "@/routes/index";

export const Route = createFileRoute("/$familySlug/kids/")({ component: ChildChooser });

type PublicChild = { displayName: string; slug: string };

function ChildChooser() {
  const { familySlug } = Route.useParams();
  const [children, setChildren] = useState<PublicChild[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch(`/api/families/${encodeURIComponent(familySlug)}/children`)
      .then(async (response) => {
        if (!response.ok) throw new Error("This child space is not available.");
        return response.json() as Promise<{ children: PublicChild[] }>;
      })
      .then(({ children: profiles }) => {
        if (profiles.length === 1) {
          location.replace(
            `/${encodeURIComponent(familySlug)}/kids/${encodeURIComponent(profiles[0].slug)}`,
          );
          return;
        }
        setChildren(profiles);
      })
      .catch((reason: Error) => setError(reason.message));
  }, [familySlug]);

  return (
    <main className="child-access-shell">
      <Brand />
      <section className="access-card child-chooser-card">
        <div className="access-icon">
          <LockKeyhole size={22} />
        </div>
        <p className="eyebrow">A private family space</p>
        <h2>Whose story are you opening?</h2>
        <p className="card-intro">Choose your name, then enter the PIN your family gave you.</p>
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
        {!children && !error ? <span className="loading-dot" aria-label="Loading" /> : null}
        <div className="child-profile-list">
          {children?.map((child) => (
            <a
              href={`/${encodeURIComponent(familySlug)}/kids/${encodeURIComponent(child.slug)}`}
              key={child.slug}
            >
              <span>
                <Baby size={18} /> {child.displayName}
              </span>
              <ArrowRight size={17} />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
