import {
  FamilyPerson,
  MemoryCard,
  SealedCapsuleCard,
} from "@/components/design/archive-presentations";
import { SlidingTabs } from "@/components/design/controls";
import { ArrowRight, Art, Brand, Button, Play, Wave } from "@/components/design/shared";
export function MarketingHero({
  start,
  go,
  setDialog,
  preview,
  setPreview,
}: {
  start: (mode?: string) => void;
  go: (id: string) => void;
  setDialog: (value: string) => void;
  preview: string;
  setPreview: (value: string) => void;
}) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">A private family archive</p>
        <h1>Their childhood is happening. Keep a little of it.</h1>
        <p className="hero-description">
          Save their photos, voices, stories and letters in a private archive. Invite the people who
          know them best.
        </p>
        <div className="actions">
          <Button onClick={() => start()}>Start your family archive</Button>
          <button className="text-button" onClick={() => go("how")}>
            See how it works <ArrowRight size={18} />
          </button>
        </div>
        <small>Create your account free. Choose a plan before adding memories.</small>
      </div>
      <div className="product-preview" aria-label="Interactive archive preview">
        <div className="preview-header">
          <Brand />
          <SlidingTabs
            value={preview}
            onChange={setPreview}
            items={["Home", "Timeline", "Capsules", "Family"]}
            label="Product preview navigation"
          />
        </div>
        <div className="preview-body" key={preview}>
          {preview === "Home" ? (
            <>
              <h2>Emma’s memories</h2>
              <p>Your family’s moments, kept together.</p>
              <Button onClick={() => setDialog("Add a memory")}>Add a memory</Button>
              <div className="preview-section-heading">
                <h3>Recently added</h3>
                <button className="text-button" onClick={() => setPreview("Timeline")}>
                  View timeline →
                </button>
              </div>
              <div className="preview-memories">
                <MemoryCard
                  kind="photo"
                  title="An afternoon together"
                  author="Sarah"
                  date="Sep 6, 2026"
                  onOpen={() => setDialog("An afternoon together")}
                  media={<Art name="photo" />}
                />
                <MemoryCard
                  kind="voice"
                  title="Grandpa’s bedtime story"
                  author="Daniel"
                  date="Sep 4, 2026"
                  onOpen={() => setDialog("Grandpa’s bedtime story")}
                  player={
                    <button
                      className="preview-audio"
                      aria-label="Open voice memory"
                      onClick={() => setDialog("Grandpa’s bedtime story")}
                    >
                      <Play size={16} />
                      <Wave />
                    </button>
                  }
                />
              </div>
            </>
          ) : preview === "Timeline" ? (
            <>
              <h2>Every little chapter</h2>
              <p>The moments you’ve kept, in the order they happened.</p>
              <section className="timeline-month">
                <h3>September 2026</h3>
                <MemoryCard
                  kind="photo"
                  title="An afternoon together"
                  author="Sarah"
                  date="Sep 6, 2026"
                  onOpen={() => setDialog("An afternoon together")}
                  media={<Art name="photo" />}
                />
              </section>
            </>
          ) : preview === "Capsules" ? (
            <div className="preview-alternate">
              <h2>A little love for later</h2>
              <p>Write a note now. Let it meet them on a day you choose.</p>
              <SealedCapsuleCard
                title="For your 18th birthday"
                date="May 14, 2039"
                author="Sarah"
                audience="Emma’s view"
              />
            </div>
          ) : preview === "Child" ? (
            <div className="preview-alternate">
              <h2>Hi, Emma.</h2>
              <p>These are the moments your family kept for you.</p>
              <Art name="photo" />
              <button className="text-button" onClick={() => setDialog("An afternoon together")}>
                Open your latest memory →
              </button>
            </div>
          ) : (
            <div className="preview-alternate">
              <h2>Your people</h2>
              <p>Invite the people you want to remember with.</p>
              <div className="people-list">
                {[
                  ["Sarah Parker", "Owner · You"],
                  ["Alex Parker", "Parent"],
                  ["Grandpa Daniel", "Contributor"],
                ].map(([name, role]) => (
                  <FamilyPerson key={name} name={name} description={role} />
                ))}
              </div>
              <Button onClick={() => start()}>Start your family archive</Button>
            </div>
          )}
        </div>
        <div className="preview-bottom-tabs">
          <SlidingTabs
            value={preview}
            onChange={setPreview}
            items={["Home", "Timeline", "Capsules", "Family"]}
            label="Product preview mobile navigation"
          />
        </div>
      </div>
    </section>
  );
}
