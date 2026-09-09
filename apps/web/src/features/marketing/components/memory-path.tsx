import { Illustration } from "@/components/design/illustrations";
import { Art } from "@/components/design/shared";
export function MemoryPath() {
  return (
    <section className="memory-path section-border" id="how">
      <div className="path-intro">
        <h2>
          A little at a time <br />
          becomes their story.
        </h2>
        <Art name="bike" />
      </div>
      <div className="path-journey">
        <div className="path-step">
          <div className="path-visual illustrated">
            <Illustration scene="capture" />
          </div>
          <span className="path-dot" />
          <h3>Keep the moment</h3>
          <p>
            Save a photo, a voice or a story in <br />
            whatever way feels natural.
          </p>
        </div>
        <div className="path-step">
          <div className="path-visual illustrated">
            <Illustration scene="family" />
          </div>
          <span className="path-dot" />
          <h3>Invite your people</h3>
          <p>
            The people who love your child <br />
            can add memories, too.
          </p>
        </div>
        <div className="path-step">
          <div className="path-visual illustrated">
            <Art name="box" />
          </div>
          <span className="path-dot" />
          <h3>Give it back one day</h3>
          <p>
            Your child gets their story—and <br />
            the letters and capsules you saved.
          </p>
        </div>
      </div>
    </section>
  );
}
