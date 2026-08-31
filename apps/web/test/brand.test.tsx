import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Brand } from "@/components/brand";
import { MarketingHome } from "@/components/marketing-home";

describe("Everlittle brand", () => {
  it("uses the canonical app logo", () => {
    const markup = renderToStaticMarkup(<Brand compact />);

    expect(markup).toContain('src="/icon-512.png"');
    expect(markup).toContain("Everlittle");
  });

  it("renders the canonical logo on the marketing landing page", () => {
    const markup = renderToStaticMarkup(<MarketingHome />);

    expect(markup).toContain('src="/icon-512.png"');
  });
});
