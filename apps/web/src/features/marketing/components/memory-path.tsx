import { Illustration } from "@/components/design/illustrations";
import { Art } from "@/components/design/shared";
export function MemoryPath() {
  return (
    <section className="memory-path section-border" id="how">
      <div className="path-intro">
        <h2>
          Photos, voices, stories. <br />
          Kept together.
        </h2>
        <Art name="bike" />
      </div>
      <div className="path-journey">
        <div className="path-step">
          <div className="path-visual illustrated">
            <Illustration scene="capture" />
          </div>
          <span className="path-dot" />
          <h3>Save a memory</h3>
          <p>Add a photo and the words you want to remember.</p>
        </div>
        <div className="path-step">
          <div className="path-visual illustrated">
            <Illustration scene="family" />
          </div>
          <span className="path-dot" />
          <h3>Bring family closer</h3>
          <p>Invite grandparents to see and add memories.</p>
        </div>
        <div className="path-step">
          <div className="path-visual illustrated">
            <Art name="box" />
          </div>
          <span className="path-dot" />
          <h3>Leave a letter for later</h3>
          <p>Write a note that opens on a date you choose.</p>
        </div>
      </div>
    </section>
  );
}
