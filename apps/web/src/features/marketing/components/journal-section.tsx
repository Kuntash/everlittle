import { Illustration } from "@/components/design/illustrations";
import { ArrowRight } from "@/components/design/shared";
export function JournalSection() {
  return (
    <section className="journal-section section-border" id="journal">
      <div className="journal-section-intro">
        <p className="eyebrow">From the Everlittle journal</p>
        <h2>
          Ideas for the memories <br />
          you want to keep.
        </h2>
        <button className="text-button" onClick={() => window.location.assign("/journal")}>
          Browse all guides <ArrowRight size={18} />
        </button>
      </div>
      {[
        {
          category: "Baby memory journal",
          title: "A baby memory journal for real life",
          icon: "Story",
        },
        {
          category: "Writing guide",
          title: "Letters to your future child",
          icon: "Letter",
        },
        {
          category: "Grandparents",
          title: "Keep the stories only your grandparents can tell.",
          icon: "Voice",
        },
      ].map((a) => (
        <button
          className="journal-card"
          key={a.title}
          onClick={() =>
            window.location.assign(
              a.icon === "Story"
                ? "/baby-memory-journal"
                : a.icon === "Letter"
                  ? "/letters-to-your-future-child"
                  : "/grandparents-memory-project",
            )
          }
        >
          <span className="journal-art">
            <Illustration
              scene={a.icon === "Story" ? "baby" : a.icon === "Letter" ? "letter" : "family"}
            />
          </span>
          <div>
            <small>{a.category}</small>
            <h3>{a.title}</h3>
            <span className="article-link">
              Read article <ArrowRight size={16} />
            </span>
          </div>
        </button>
      ))}
    </section>
  );
}
