import { Illustration } from "@/components/design/illustrations";
import { ArrowRight, Check, Lock, Users } from "@/components/design/shared";
export function PrivacySection({ setDialog }: { setDialog: (value: string) => void }) {
  return (
    <section className="privacy-block" id="privacy">
      <div className="shield">
        <Illustration scene="privacy" />
      </div>
      <div className="privacy-copy">
        <h2>Their story belongs with your family.</h2>
        <p>
          Only the people you invite can enter your archive. You decide what appears in your child’s
          view—and what stays sealed for later.
        </p>
        <button className="text-button" onClick={() => setDialog("Your family, your privacy")}>
          Read about privacy <ArrowRight size={18} />
        </button>
      </div>
      <div className="family-voices">
        <h3>Everyone remembers a different part.</h3>
        <dl>
          <dt>Mom</dt>
          <dd>I caught the little things.</dd>
          <dt>Dad</dt>
          <dd>I see the everyday adventures.</dd>
          <dt>Grandpa</dt>
          <dd>I share the stories from long ago.</dd>
        </dl>
        <div className="privacy-points">
          <span>
            <Check size={15} /> No ads
          </span>
          <span>
            <Users size={15} /> No public profile
          </span>
          <span>
            <Lock size={15} /> Export your memories
          </span>
        </div>
      </div>
    </section>
  );
}
