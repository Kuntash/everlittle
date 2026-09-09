import { Art, Button } from "@/components/design/shared";
export function ClosingSection({ start }: { start: (mode?: string) => void }) {
  return (
    <section className="final-cta">
      <Art name="box" />
      <h2>
        Keep a moment <br />
        you’ll want to return to.
      </h2>
      <Button onClick={() => start()}>Create your archive</Button>
    </section>
  );
}
