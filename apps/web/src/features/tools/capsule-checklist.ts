// Contents of the first birthday time capsule checklist. The guide at
// /first-birthday-time-capsule-ideas lists the same items, so edit them here.
import { addYears, type CalendarDate } from "./tool-math";

export type CapsuleGroup = {
  id: "day" | "baby" | "world" | "people";
  title: string;
  items: { id: string; label: string }[];
};

// Item ids are short and permanent: they are stored in saved lists and shared links.
export const CAPSULE_GROUPS: CapsuleGroup[] = [
  {
    id: "day",
    title: "From the day itself",
    items: [
      {
        id: "d1",
        label: "A photograph of everyone who came, with full names written on the back in pencil",
      },
      { id: "d2", label: "The invitation, and a napkin, party hat or candle from the cake" },
      { id: "d3", label: "A card signed by the guests" },
      { id: "d4", label: "The front page of a newspaper from that day, in its own sleeve" },
      {
        id: "d5",
        label: "A note of the weather, what was on the table and what they did with the cake",
      },
    ],
  },
  {
    id: "baby",
    title: "About your baby at one",
    items: [
      {
        id: "b1",
        label: "The outfit they wore, or one they have just outgrown, in a sealed bag",
      },
      { id: "b2", label: "A first pair of shoes or a much-loved sock" },
      { id: "b3", label: "A handprint and a footprint on card" },
      { id: "b4", label: "Their height and weight, and how many teeth" },
      { id: "b5", label: "Words they say and sounds they make, spelled the way they say them" },
      { id: "b6", label: "Favorite food, toy, song and book, and what they are afraid of" },
      { id: "b7", label: "A lock of hair tied with thread" },
      { id: "b8", label: "What a normal day looks like, from waking to bedtime" },
    ],
  },
  {
    id: "world",
    title: "From the world this year",
    items: [
      { id: "w1", label: "A coin minted this year and one current banknote" },
      { id: "w2", label: "A few postage stamps" },
      { id: "w3", label: "A supermarket receipt for an ordinary weekly shop" },
      { id: "w4", label: "A takeaway menu or a ticket from a bus, train or car park" },
      { id: "w5", label: "A list of what a pint of milk, a coffee and a tank of fuel cost" },
      { id: "w6", label: "The song, the film and the toy everyone was talking about" },
      { id: "w7", label: "A photograph of your street and the front of your home" },
    ],
  },
  {
    id: "people",
    title: "From the people who love them",
    items: [
      { id: "p1", label: "A letter from each parent, written separately" },
      { id: "p2", label: "A letter or a few lines from each grandparent" },
      { id: "p3", label: "Notes from guests, godparents and older cousins" },
      { id: "p4", label: "A family tree with everyone’s age this year" },
      { id: "p5", label: "A recipe in a relative’s handwriting" },
      { id: "p6", label: "Your predictions for the year they open it" },
    ],
  },
];

export const CAPSULE_LEAVE_OUT = [
  "Food, sweets and drinks, including the cake",
  "Balloons, rubber bands and anything made of rubber or latex",
  "Batteries, and toys with batteries still inside",
  "Liquids, lotions and candles that can melt",
  "Newspaper touching photographs, because newsprint yellows and marks what it touches",
  "Sticky tape and glue on anything you want to last",
  "A phone, tablet or USB stick as the only copy of a video",
  "Money you would mind losing the value of",
];

export const CAPSULE_OPEN_AGES = [10, 16, 18, 21] as const;
export const MAX_CUSTOM_ITEMS = 12;

const ITEM_IDS = CAPSULE_GROUPS.flatMap((group) => group.items.map((item) => item.id));

export function capsuleItemLabels(groupId: CapsuleGroup["id"]) {
  return CAPSULE_GROUPS.find((group) => group.id === groupId)!.items.map((item) => item.label);
}

// Packed items are kept as a comma-separated id list. Unknown ids from an old or edited link
// are dropped rather than counted.
export function parsePacked(value: string | undefined): string[] {
  const wanted = new Set((value ?? "").split(","));
  return ITEM_IDS.filter((id) => wanted.has(id));
}

export function togglePacked(value: string | undefined, id: string): string {
  const packed = parsePacked(value);
  const next = packed.includes(id) ? packed.filter((entry) => entry !== id) : [...packed, id];
  return ITEM_IDS.filter((entry) => next.includes(entry)).join(",");
}

export type CustomItem = { label: string; packed: boolean };

// A family's own additions: one per line, with a leading "+" once the item is packed.
export function parseCustomItems(value: string | undefined): CustomItem[] {
  return (value ?? "")
    .split("\n")
    .map((line) => ({
      packed: line.startsWith("+"),
      label: line.replace(/^[+-]/, "").trim().slice(0, 80),
    }))
    .filter((item) => item.label.length > 0)
    .slice(0, MAX_CUSTOM_ITEMS);
}

export function serializeCustomItems(items: CustomItem[]): string {
  return items
    .slice(0, MAX_CUSTOM_ITEMS)
    .map((item) => `${item.packed ? "+" : "-"}${item.label.replace(/\s+/g, " ").trim()}`)
    .join("\n");
}

export function capsuleOpenAge(value: string | undefined): (typeof CAPSULE_OPEN_AGES)[number] {
  return CAPSULE_OPEN_AGES.find((age) => String(age) === value) ?? 18;
}

// The capsule opens on a birthday; a 29 February birthday opens on the 28th in other years.
export function capsuleOpenDate(birth: CalendarDate, age: number): CalendarDate {
  return addYears(birth, age);
}

export function capsuleProgress(packed: string[], custom: CustomItem[]) {
  return {
    packed: packed.length + custom.filter((item) => item.packed).length,
    total: ITEM_IDS.length + custom.length,
  };
}
