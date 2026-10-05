import { ShadButton } from "@/components/design/controls";
import { Button } from "@/components/design/shared";
import { Printer, Shuffle } from "lucide-react";
import { seededShuffle } from "./tool-math";
import { useQueryState } from "./tool-state";

// Asked in the same words every year so the answers can be compared.
const CORE = [
  "What is your favorite color?",
  "What is your favorite food?",
  "Who is your best friend?",
  "What is your favorite thing to do?",
  "What is your favorite book or show?",
  "What makes you laugh?",
  "What are you really good at?",
  "What do you want to be when you grow up?",
  "What is your favorite thing about our family?",
  "What do you want to do before your next birthday?",
];

const EXTRAS: { label: string; maxAge: number; questions: string[] }[] = [
  {
    label: "2 to 3",
    maxAge: 3,
    questions: [
      "What does a dog say?",
      "Who do you love?",
      "What is your favorite toy?",
      "Can you sing me a song?",
      "What do you like to eat for breakfast?",
      "Where do you like to go?",
      "What is your favorite animal?",
      "What do you do at bedtime?",
      "What is in the sky?",
      "What do you want for your birthday?",
      "Can you show me your favorite dance?",
      "What would you like to play today?",
      "What do you like to do with me?",
      "What is your favorite song?",
      "What do you like at the park?",
    ],
  },
  {
    label: "4 to 6",
    maxAge: 6,
    questions: [
      "How old is Mommy or Daddy?",
      "What do grown-ups do all day?",
      "What is the best thing about being your age?",
      "What are you scared of?",
      "If you had one hundred dollars, what would you buy?",
      "What is the yuckiest food?",
      "Where would you like to go on holiday?",
      "What is your favorite thing to do with your grandparents?",
      "What do you dream about?",
      "What is the funniest word you know?",
      "What would you do if you were in charge for a day?",
      "What is your favorite thing to do outside?",
    ],
  },
  {
    label: "7 to 10",
    maxAge: 10,
    questions: [
      "What is something you learned this year that was hard?",
      "What is the best book you read this year?",
      "Who do you sit with at lunch?",
      "What is one rule you would change at home?",
      "What do you think you will be like at 18?",
      "What is something kind someone did for you?",
      "What do you wish adults understood about kids?",
      "What are you proud of?",
      "What is your favorite memory from this year?",
      "What would you invent if you could?",
      "What is the best thing about your school?",
      "What is something you want to learn?",
    ],
  },
  {
    label: "11 and up",
    maxAge: 99,
    questions: [
      "What three words describe you right now?",
      "What song have you played most this year?",
      "What do you and your friends talk about?",
      "What is something you changed your mind about?",
      "What are you looking forward to?",
      "What worries you?",
      "What would you tell yourself at this age last year?",
      "What do you want me to remember about you at this age?",
      "Who do you admire, and why?",
      "What is the best advice you have been given?",
      "Where do you want to be in five years?",
      "What do you wish we did more often as a family?",
    ],
  },
];

export function InterviewTool() {
  const { values, set } = useQueryState(["name", "age", "count", "seed"]);
  const age = Math.min(18, Math.max(2, Math.floor(Number(values.age) || 5)));
  const count = [10, 15, 20].includes(Number(values.count)) ? Number(values.count) : 15;
  const seed = Number(values.seed) >>> 0 || 1;
  const band = EXTRAS.find((entry) => age <= entry.maxAge) ?? EXTRAS[EXTRAS.length - 1];
  // The youngest children get a shorter core set.
  const core = age <= 3 ? CORE.slice(0, 5) : CORE;
  const extras = seededShuffle(band.questions, seed).slice(0, Math.max(0, count - core.length));
  const name = values.name?.trim();
  return (
    <>
      <div className="tool-fields">
        <label className="tool-field">
          Child’s first name (optional)
          <input
            autoComplete="off"
            maxLength={40}
            value={values.name ?? ""}
            onChange={(event) => set("name", event.target.value)}
          />
        </label>
        <label className="tool-field">
          Age they are turning
          <select value={String(age)} onChange={(event) => set("age", event.target.value)}>
            {Array.from({ length: 17 }, (_, index) => index + 2).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="tool-field wide">
          Number of questions
          <select value={String(count)} onChange={(event) => set("count", event.target.value)}>
            <option value="10">10 (short)</option>
            <option value="15">15</option>
            <option value="20">20 (long)</option>
          </select>
        </label>
      </div>
      <div className="tool-result">
        <p className="tool-headline">
          {name ? `${name}’s` : "My"} birthday interview, age <strong>{age}</strong>
        </p>
        <p className="tool-note interview-meta">Date: ____________________</p>
        <ol className="tool-prompts interview-sheet">
          {[...core, ...extras].map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
        <div className="tool-actions">
          <Button onClick={() => window.print()}>
            <Printer size={16} />
            Print this interview
          </Button>
          {extras.length > 0 && (
            <ShadButton variant="quiet" onClick={() => set("seed", String(seed + 1))}>
              <Shuffle size={15} />
              New extras
            </ShadButton>
          )}
        </div>
      </div>
    </>
  );
}
