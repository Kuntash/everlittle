import { Illustration } from "@/components/design/illustrations";
import { ArrowRight, Check, Lock, Users } from "@/components/design/shared";
export function PrivacySection() {
  return (
    <section className="privacy-block" id="privacy">
      <div className="shield">
        <Illustration scene="privacy" />
      </div>
      <div className="privacy-copy">
        <h2>Your memories stay in the family.</h2>
        <p>Invite the people you trust. Choose what your child can see.</p>
        <a className="text-button" href="/privacy">
          Read about privacy <ArrowRight size={18} />
        </a>
      </div>
      <div className="family-voices">
        <h3>Private by default.</h3>

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
