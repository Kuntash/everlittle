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
          <p className="eyebrow">Your family’s memories</p>
          <h2>
            Photos with a story.
            <br />
            Voices you can hear again.
          </h2>
          <p>One private place to keep them together.</p>
          <div className="auth-footnote">
            <span />
            Only the family you invite.
          </div>
        </aside>
        <main className="auth-form-area">
          <div className="auth-form-inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
