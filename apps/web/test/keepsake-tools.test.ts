import { describe, expect, it } from "vitest";

import { comparisonArticles } from "@/features/journal/journal-comparisons";
import { findArticle } from "@/features/journal/journal-articles";
import {
  CAPSULE_GROUPS,
  CAPSULE_LEAVE_OUT,
  capsuleOpenAge,
  capsuleOpenDate,
  capsuleProgress,
  parseCustomItems,
  parsePacked,
  serializeCustomItems,
  togglePacked,
} from "@/features/tools/capsule-checklist";
import {
  eighteenthBirthday,
  isFutureDate,
  letterFileName,
  letterGreeting,
  letterReminder,
  letterText,
  waitDescription,
  wordCount,
} from "@/features/tools/future-letter";
import { parseDate, toIso } from "@/features/tools/tool-math";
import { INDEXABLE_PATHS } from "@/lib/public-web";

const date = (value: string) => parseDate(value)!;

describe("letter to the future", () => {
  it("accepts only opening dates after the day of writing", () => {
    const today = date("2026-10-06");
    expect(isFutureDate(today, date("2026-10-07"))).toBe(true);
    expect(isFutureDate(today, today)).toBe(false);
    expect(isFutureDate(today, date("2020-01-01"))).toBe(false);
    expect(isFutureDate(today, null)).toBe(false);
  });

  it("describes the wait in its two largest units", () => {
    const today = date("2026-10-06");
    expect(waitDescription(today, date("2036-10-06"))).toBe("10 years");
    expect(waitDescription(today, date("2029-01-06"))).toBe("2 years and 3 months");
    expect(waitDescription(today, date("2027-03-18"))).toBe("5 months and 12 days");
    expect(waitDescription(today, date("2026-10-07"))).toBe("1 day");
    expect(waitDescription(today, date("2044-03-20"))).toBe("17 years and 5 months");
    expect(waitDescription(today, today)).toBeNull();
  });

  it("opens a leap-day child's letter on 28 February of the eighteenth year", () => {
    expect(toIso(eighteenthBirthday(date("2024-02-29")))).toBe("2042-02-28");
    expect(toIso(eighteenthBirthday(date("2025-10-06")))).toBe("2043-10-06");
  });

  it("greets the reader by who the letter is for", () => {
    expect(letterGreeting("Myself", "")).toBe("Dear future me,");
    expect(letterGreeting("Myself", " Sam ")).toBe("Dear future Sam,");
    expect(letterGreeting("My child", "Maya")).toBe("Dear Maya,");
    expect(letterGreeting("Someone else", "")).toBe("Dear you,");
  });

  it("builds a text file with the opening date first and nothing but the letter", () => {
    const letter = {
      recipient: "My child" as const,
      name: "Maya",
      from: "Love, Mom",
      body: "  You said “bapple” today.\n\nWe laughed.  ",
      written: date("2026-10-06"),
      opens: date("2043-10-06"),
    };
    expect(letterText(letter)).toBe(
      [
        "A letter to Maya",
        "Do not open until Tue, Oct 6, 2043",
        "Written on Tue, Oct 6, 2026",
        "",
        "Dear Maya,",
        "",
        "You said “bapple” today.\n\nWe laughed.",
        "",
        "Love, Mom",
        "",
      ].join("\n"),
    );
    expect(letterFileName(letter)).toBe("letter-to-maya-open-2043-10-06.txt");
    expect(letterFileName({ ...letter, recipient: "Myself", name: " ../" })).toBe(
      "letter-to-my-future-self-open-2043-10-06.txt",
    );
    expect(wordCount(letter.body)).toBe(6);
    expect(wordCount("   ")).toBe(0);
  });

  it("puts a reminder on the opening day without the letter's text", () => {
    const reminder = letterReminder({
      recipient: "My child",
      name: "Maya; Jr\nBEGIN:VEVENT",
      written: date("2026-10-06"),
      opens: date("2043-10-06"),
    });
    expect(reminder.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(reminder).toContain("DTSTART;VALUE=DATE:20431006");
    expect(reminder).toContain("DTEND;VALUE=DATE:20431007");
    expect(reminder).toContain("SUMMARY:Open today: A letter to Maya\\; Jr\\nBEGIN:VEVENT");
    expect(reminder.split("\r\n").filter((line) => line === "BEGIN:VEVENT")).toHaveLength(1);
  });
});

describe("first birthday time capsule checklist", () => {
  const ids = CAPSULE_GROUPS.flatMap((group) => group.items.map((item) => item.id));

  it("gives every item a unique id that survives in a link", () => {
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z]\d$/);
  });

  it("ticks and unticks items, ignoring ids it does not know", () => {
    expect(parsePacked("w1,zz,d1,<script>")).toEqual(["d1", "w1"]);
    expect(togglePacked("", "p2")).toBe("p2");
    expect(togglePacked("p2,d1", "b3")).toBe("d1,b3,p2");
    expect(togglePacked("d1,b3,p2", "b3")).toBe("d1,p2");
    expect(togglePacked(undefined, "nope")).toBe("");
  });

  it("round-trips a family's own additions and caps their number and length", () => {
    const saved = serializeCustomItems([
      { label: "  Grandma’s   recipe card ", packed: true },
      { label: "Hospital bracelet", packed: false },
    ]);
    expect(saved).toBe("+Grandma’s recipe card\n-Hospital bracelet");
    expect(parseCustomItems(saved)).toEqual([
      { label: "Grandma’s recipe card", packed: true },
      { label: "Hospital bracelet", packed: false },
    ]);
    expect(parseCustomItems("\n-\n+ \n")).toEqual([]);
    const many = Array.from({ length: 30 }, (_, index) => `-${"x".repeat(200)}${index}`);
    const parsed = parseCustomItems(many.join("\n"));
    expect(parsed).toHaveLength(12);
    expect(parsed[0].label).toHaveLength(80);
  });

  it("counts packed items across the list and the additions", () => {
    const custom = parseCustomItems("+One\n-Two");
    expect(capsuleProgress(["d1", "b3"], custom)).toEqual({ packed: 3, total: ids.length + 2 });
    expect(capsuleProgress([], [])).toEqual({ packed: 0, total: ids.length });
  });

  it("opens on the chosen birthday and defaults to eighteen", () => {
    expect(capsuleOpenAge("21")).toBe(21);
    expect(capsuleOpenAge("7")).toBe(18);
    expect(capsuleOpenAge(undefined)).toBe(18);
    expect(toIso(capsuleOpenDate(date("2025-10-06"), 18))).toBe("2043-10-06");
    expect(toIso(capsuleOpenDate(date("2024-02-29"), 10))).toBe("2034-02-28");
  });

  it("shares its items with the guide", () => {
    const guide = findArticle("capsule-contents")!;
    expect(guide.lists?.["1"]).toEqual(CAPSULE_GROUPS[0].items.map((item) => item.label));
    expect(guide.lists?.["5"]).toBe(CAPSULE_LEAVE_OUT);
  });
});

describe("app comparisons", () => {
  it("dates every comparison and links a source for each section that cites one", () => {
    expect(comparisonArticles).toHaveLength(5);
    for (const article of comparisonArticles) {
      expect(article.comparison?.caption, article.id).toContain("checked on 6 October 2026");
      expect(article.comparison?.columns, article.id).toHaveLength(3);
      expect(article.sources?.length, article.id).toBeGreaterThan(3);
      for (const source of article.sources!) expect(source.href, article.id).toMatch(/^https:\/\//);
      const cited = new Set(Object.values(article.sectionSources ?? {}).flat());
      expect(cited.size, article.id).toBe(article.sources!.length);
      expect(article.intro.length, article.id).toBeLessThanOrEqual(165);
    }
  });

  it("publishes the new guides and tools in the sitemap list", () => {
    for (const path of [
      "/tinybeans-alternatives",
      "/qeepsake-alternatives",
      "/storyworth-alternatives",
      "/familyalbum-vs-google-photos-vs-tinybeans",
      "/best-baby-book-apps",
      "/first-birthday-time-capsule-ideas",
      "/tools/letter-to-future-self",
      "/tools/first-birthday-time-capsule-checklist",
    ])
      expect(INDEXABLE_PATHS, path).toContain(path);
  });
});
