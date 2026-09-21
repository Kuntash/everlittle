import { Art, Button } from "@/components/design/shared";
export function ClosingSection({ start }: { start: (mode?: string) => void }) {
  return (
    <section className="final-cta">
      <Art name="box" />
      <h2>
        Start with one photo. <br />
        Keep the story, too.
      </h2>
      <Button onClick={() => start()}>Save your first memory</Button>
    </section>
  );
}
