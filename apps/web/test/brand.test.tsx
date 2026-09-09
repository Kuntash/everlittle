import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Brand } from "@/components/brand";
import { MarketingHome } from "@/components/marketing-home";

describe("Everlittle brand", () => {
  it("uses the approved background-free vector mark", () => {
    const markup = renderToStaticMarkup(<Brand compact />);

    expect(markup).toContain('class="brand-mark"');
    expect(markup).toContain("Everlittle");
  });

  it("renders the same vector mark on the marketing landing page", () => {
    const markup = renderToStaticMarkup(<MarketingHome />);

    expect(markup).toContain('class="brand-mark"');
  });
});
