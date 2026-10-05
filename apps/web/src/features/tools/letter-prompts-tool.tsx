import { ShadButton } from "@/components/design/controls";
import { Button } from "@/components/design/shared";
import { Printer, Shuffle } from "lucide-react";
import { seededShuffle } from "./tool-math";
import { useQueryState } from "./tool-state";

const WRITERS = ["Parent", "Grandparent", "Godparent or family friend"] as const;
const STAGES = [
  "Not born yet",
  "Baby",
  "Toddler or preschooler",
  "School age",
  "Teenager",
] as const;
const OCCASIONS = [
  "An ordinary day",
  "First birthday",
  "A birthday",
  "First day of school",
  "Graduation or 18th birthday",
] as const;

const OPENERS: Record<(typeof OCCASIONS)[number], string> = {
  "An ordinary day": "Nothing special happened today, which is why I want to tell you about it.",
  "First birthday":
    "Today you are one, and you will not remember any of it, so I am writing it down.",
  "A birthday": "Happy birthday. Here is who you are on the day you turn this age.",
  "First day of school":
    "This morning you walked through the school gate, and I stood there longer than I needed to.",
  "Graduation or 18th birthday":
    "I started thinking about this letter years before you could read it.",
};

const BY_STAGE: Record<(typeof STAGES)[number], string[]> = {
  "Not born yet": [
    "Where were you when you found out they were coming, and what did you do next?",
    "What does the room they will sleep in look like today?",
    "What names are on the list, and who suggested each one?",
    "What are you most nervous about?",
    "What do you already know about them from the kicks and the scans?",
    "What is the first thing you want to show them?",
    "Who is waiting to meet them?",
  ],
  Baby: [
    "What do they do with their hands when they are falling asleep?",
    "What sound do they make that you would know anywhere?",
    "What does a normal night look like right now?",
    "Who makes them laugh the hardest, and how?",
    "What have you learned about yourself since they arrived?",
    "What did you get wrong at first that you can laugh about now?",
    "What do they weigh, and how does that feel in your arms?",
  ],
  "Toddler or preschooler": [
    "Which word do they say wrong that you hope they never fix?",
    "What do they insist on doing by themselves?",
    "What do they ask for every single bedtime?",
    "What are they afraid of, and how do you comfort them?",
    "What did they say this week that you repeated to someone else?",
    "What game do they make you play again and again?",
    "What do they carry everywhere?",
  ],
  "School age": [
    "What are they obsessed with this year?",
    "Who are their friends, and what do they do together?",
    "What are they better at than you?",
    "What question did they ask that you could not answer?",
    "What do they do when they think nobody is watching?",
    "What have you argued about lately, and what did you learn from it?",
    "What do you admire in them that they cannot see yet?",
  ],
  Teenager: [
    "What do they care about that you did not at their age?",
    "When did you last see them truly happy, and what were they doing?",
    "What have they taught you?",
    "What do you wish you could say to them out loud?",
    "What were you like at their age, honestly?",
    "What decision of theirs made you proud?",
    "What do you hope they will forgive you for?",
  ],
};

const BY_WRITER: Record<(typeof WRITERS)[number], string[]> = {
  Parent: [
    "What does an ordinary day in your house look like, from waking to bedtime?",
    "What are you working on or worrying about in your own life right now?",
    "What do you want them to know about the family they were born into?",
  ],
  Grandparent: [
    "What was their mother or father like at this same age?",
    "Where did you grow up, and what did your own grandparents call you?",
    "What did you feel the first time you held them?",
    "What family story should not be lost?",
  ],
  "Godparent or family friend": [
    "How do you know their parents, and what were they like before this child arrived?",
    "What is your first memory of meeting them?",
    "What can they always come to you for?",
  ],
};

const CLOSERS = [
  "Whoever you are when you read this, I am on your side.",
  "I do not know what your life looks like now. I know you were loved from the start.",
  "If I am there when you open this, come and find me. If I am not, read it twice.",
  "You never had to earn any of this.",
];

export function LetterPromptsTool() {
  const { values, set } = useQueryState(["writer", "stage", "occasion", "seed"]);
  const writer = WRITERS.find((entry) => entry === values.writer) ?? WRITERS[0];
  const stage = STAGES.find((entry) => entry === values.stage) ?? STAGES[1];
  const occasion = OCCASIONS.find((entry) => entry === values.occasion) ?? OCCASIONS[0];
  const seed = Number(values.seed) >>> 0 || 1;
  const prompts = [
    ...seededShuffle(BY_STAGE[stage], seed).slice(0, 4),
    ...seededShuffle(BY_WRITER[writer], seed).slice(0, 2),
  ];
  return (
    <>
      <div className="tool-fields">
        <Picker
          label="Who is writing?"
          options={WRITERS}
          value={writer}
          onChange={(v) => set("writer", v)}
        />
        <Picker
          label="How old is the child?"
          options={STAGES}
          value={stage}
          onChange={(v) => set("stage", v)}
        />
        <Picker
          label="What is the occasion?"
          options={OCCASIONS}
          value={occasion}
          onChange={(v) => set("occasion", v)}
        />
      </div>
      <div className="tool-result">
        <p className="tool-note">Start with</p>
        <p className="tool-headline letter-line">“{OPENERS[occasion]}”</p>
        <ol className="tool-prompts">
          {prompts.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ol>
        <p className="tool-note">End with</p>
        <p className="tool-headline letter-line">“{CLOSERS[seed % CLOSERS.length]}”</p>
        <div className="tool-actions">
          <Button onClick={() => window.print()}>
            <Printer size={16} />
            Print these prompts
          </Button>
          <ShadButton variant="quiet" onClick={() => set("seed", String(seed + 1))}>
            <Shuffle size={15} />
            Different prompts
          </ShadButton>
        </div>
      </div>
    </>
  );
}

function Picker<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="tool-person tool-picker">
      <legend>{label}</legend>
      <div className="tool-chips">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            aria-pressed={option === value}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
