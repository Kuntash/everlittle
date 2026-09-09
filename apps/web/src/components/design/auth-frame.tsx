import type { ReactNode } from "react";
import { MemoryIllustration } from "./memory-illustrations";
import { Brand } from "./shared";
export function AuthFrame({ children }: { children: ReactNode }) {
  return (
    <div className="auth-experience">
      <header className="flow-header">
        <Brand />
        <span>A private family archive</span>
      </header>
      <div className="auth-layout">
        <aside className="auth-story">
          <div className="auth-drawing">
            <MemoryIllustration kind="Photo" size={320} />
          </div>
          <p className="eyebrow">Keep what makes them, them.</p>
          <h2>
            Their first joke.
            <br />A familiar voice.
            <br />A day worth remembering.
          </h2>
          <p>Save the details a photo can’t tell, with the people who remember them.</p>
          <div className="auth-footnote">
            <span />
            Private by invitation. Made for your family.
          </div>
        </aside>
        <main className="auth-form-area">
          <div className="auth-form-inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
