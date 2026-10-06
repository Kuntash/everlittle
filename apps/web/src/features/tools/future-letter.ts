// Logic for the letter-to-the-future tool: when the letter opens, how long that is, and the
// plain-text and calendar files the visitor can keep. Nothing here talks to a server.
import {
  addDays,
  addYears,
  escapeIcs,
  formatDate,
  isBefore,
  monthsAndDays,
  toIso,
  type CalendarDate,
} from "./tool-math";

export const LETTER_RECIPIENTS = ["Myself", "My child", "Someone else"] as const;
export type LetterRecipient = (typeof LETTER_RECIPIENTS)[number];

export const LETTER_PRESET_YEARS = [1, 5, 10] as const;
export const MAX_LETTER_LENGTH = 20_000;

export function letterGreeting(recipient: LetterRecipient, name: string) {
  const trimmed = name.trim();
  if (recipient === "Myself") return trimmed ? `Dear future ${trimmed},` : "Dear future me,";
  return trimmed ? `Dear ${trimmed},` : "Dear you,";
}

// A date only counts as an opening date if it is after the day of writing.
export function isFutureDate(
  today: CalendarDate,
  opens: CalendarDate | null,
): opens is CalendarDate {
  return opens !== null && isBefore(today, opens);
}

export function eighteenthBirthday(birth: CalendarDate) {
  return addYears(birth, 18);
}

const plural = (count: number, unit: string) => `${count} ${unit}${count === 1 ? "" : "s"}`;

// How long the letter waits, in the two largest units: "10 years", "2 years and 3 months",
// "5 months and 12 days", "9 days".
export function waitDescription(today: CalendarDate, opens: CalendarDate): string | null {
  if (!isBefore(today, opens)) return null;
  const { months: totalMonths, days } = monthsAndDays(today, opens);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts = [
    years > 0 ? plural(years, "year") : "",
    months > 0 ? plural(months, "month") : "",
    days > 0 ? plural(days, "day") : "",
  ].filter(Boolean);
  return parts.slice(0, 2).join(" and ");
}

export function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export type Letter = {
  recipient: LetterRecipient;
  name: string;
  from: string;
  body: string;
  written: CalendarDate;
  opens: CalendarDate;
};

export function letterHeading(letter: Pick<Letter, "recipient" | "name">) {
  const name = letter.name.trim();
  if (letter.recipient === "Myself")
    return name ? `A letter to future ${name}` : "A letter to my future self";
  return name ? `A letter to ${name}` : "A letter for later";
}

// The letter as a plain-text file that will still open in decades.
export function letterText(letter: Letter) {
  return [
    letterHeading(letter),
    `Do not open until ${formatDate(letter.opens)}`,
    `Written on ${formatDate(letter.written)}`,
    "",
    letterGreeting(letter.recipient, letter.name),
    "",
    letter.body.trim(),
    ...(letter.from.trim() ? ["", letter.from.trim()] : []),
    "",
  ].join("\n");
}

export function letterFileName(letter: Pick<Letter, "recipient" | "name" | "opens">) {
  const who =
    letter.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30) || (letter.recipient === "Myself" ? "my-future-self" : "later");
  return `letter-to-${who}-open-${toIso(letter.opens)}.txt`;
}

// An all-day calendar event on the opening date. It carries no letter text: a calendar is
// synced to other services, and the reminder only needs to say that a letter is waiting.
export function letterReminder(letter: Pick<Letter, "recipient" | "name" | "opens" | "written">) {
  const stamp = (date: CalendarDate) => toIso(date).replaceAll("-", "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Everlittle//Letter to the future//EN",
    "BEGIN:VEVENT",
    `UID:everlittle-letter-${stamp(letter.written)}-${stamp(letter.opens)}@geteverlittle.com`,
    `DTSTAMP:${stamp(letter.written)}T000000Z`,
    `DTSTART;VALUE=DATE:${stamp(letter.opens)}`,
    `DTEND;VALUE=DATE:${stamp(addDays(letter.opens, 1))}`,
    `SUMMARY:${escapeIcs(`Open today: ${letterHeading(letter)}`)}`,
    `DESCRIPTION:${escapeIcs(
      `Written on ${formatDate(letter.written)}. Find the printed letter or the saved file and open it today.`,
    )}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
