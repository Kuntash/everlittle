// Calendar-date helpers for the free tools. Dates are plain year/month/day values handled in UTC
// so results do not shift with the visitor's time zone or daylight saving changes.

export type CalendarDate = { year: number; month: number; day: number };

const DAY_MS = 86_400_000;

export function parseDate(value: string): CalendarDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const check = new Date(Date.UTC(year, month - 1, day));
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  )
    return null;
  return { year, month, day };
}

export function todayDate(now = new Date()): CalendarDate {
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

export function toIso({ year, month, day }: CalendarDate) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function toUtc({ year, month, day }: CalendarDate) {
  return Date.UTC(year, month - 1, day);
}

function fromUtc(time: number): CalendarDate {
  const date = new Date(time);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

export function daysBetween(from: CalendarDate, to: CalendarDate) {
  return Math.round((toUtc(to) - toUtc(from)) / DAY_MS);
}

export function addDays(date: CalendarDate, days: number) {
  return fromUtc(toUtc(date) + days * DAY_MS);
}

// Month arithmetic that keeps the day of the month, falling back to the month's last day
// (31 January + 1 month is 28 or 29 February).
export function addMonths(date: CalendarDate, months: number): CalendarDate {
  const index = date.year * 12 + (date.month - 1) + months;
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return { year, month, day: Math.min(date.day, lastDay) };
}

export function addYears(date: CalendarDate, years: number) {
  return addMonths(date, years * 12);
}

export function isBefore(a: CalendarDate, b: CalendarDate) {
  return toUtc(a) < toUtc(b);
}

// Completed years between two dates.
export function ageOn(birth: CalendarDate, on: CalendarDate) {
  let age = on.year - birth.year;
  if (isBefore(on, addYears(birth, age))) age -= 1;
  return age;
}

// Completed months and leftover days, as people describe a baby's age.
export function monthsAndDays(birth: CalendarDate, on: CalendarDate) {
  let months = (on.year - birth.year) * 12 + (on.month - birth.month);
  if (isBefore(on, addMonths(birth, months))) months -= 1;
  return { months, days: daysBetween(addMonths(birth, months), on) };
}

export function formatDate(date: CalendarDate, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(toUtc(date)));
}

export type TimeLeft = {
  age: number;
  days: number;
  weekends: number;
  summers: number;
  birthdays: number;
  weeksLived: number;
  turnsEighteen: CalendarDate;
};

export const WEEKS_TO_EIGHTEEN = 936;

// What remains between today and a child's eighteenth birthday. A summer is counted when its
// first day (1 June, or 1 December in the southern hemisphere) is still ahead, plus the current
// one if it is under way.
export function timeUntilEighteen(
  birth: CalendarDate,
  today: CalendarDate,
  southern = false,
): TimeLeft | null {
  const turnsEighteen = addYears(birth, 18);
  if (isBefore(today, birth) || !isBefore(today, turnsEighteen)) return null;
  const days = daysBetween(today, turnsEighteen);
  const age = ageOn(birth, today);
  const startMonth = southern ? 12 : 6;
  let summers = 0;
  for (let year = today.year - 1; year <= turnsEighteen.year; year += 1) {
    const start = { year, month: startMonth, day: 1 };
    const end = addMonths(start, 3);
    if (isBefore(today, end) && isBefore(start, turnsEighteen)) summers += 1;
  }
  return {
    age,
    days,
    weekends: Math.floor(days / 7),
    summers,
    birthdays: 18 - age,
    weeksLived: Math.min(WEEKS_TO_EIGHTEEN, Math.floor(daysBetween(birth, today) / 7)),
    turnsEighteen,
  };
}

export type SchoolTimeline = {
  kindergartenStart: number;
  highSchoolClass: number;
  collegeClass: number;
};

// Typical US timeline: a child starts kindergarten in the autumn of the year they are five on or
// before the cutoff date, then graduates high school thirteen school years later.
export function schoolTimeline(
  birth: CalendarDate,
  cutoff: { month: number; day: number },
): SchoolTimeline {
  const fiveByCutoff =
    birth.month < cutoff.month || (birth.month === cutoff.month && birth.day <= cutoff.day);
  const kindergartenStart = birth.year + (fiveByCutoff ? 5 : 6);
  return {
    kindergartenStart,
    highSchoolClass: kindergartenStart + 13,
    collegeClass: kindergartenStart + 17,
  };
}

export type BabyDate = { label: string; date: CalendarDate; note?: string };

export function babyMilestoneDates(birth: CalendarDate): BabyDate[] {
  const monthly = [1, 2, 3, 4, 5].map((month) => ({
    label: `${month} month${month === 1 ? "" : "s"} old`,
    date: addMonths(birth, month),
  }));
  const later = [7, 8, 9, 10, 11].map((month) => ({
    label: `${month} months old`,
    date: addMonths(birth, month),
  }));
  const golden =
    birth.day <= 31
      ? [
          {
            label: `Golden birthday (turning ${birth.day} on the ${ordinal(birth.day)})`,
            date: addYears(birth, birth.day),
          },
        ]
      : [];
  return [
    ...monthly,
    {
      label: "100 days old",
      date: addDays(birth, 99),
      note: "Counting the day of birth as day 1, as most 100-day celebrations do",
    },
    { label: "Half birthday (6 months)", date: addMonths(birth, 6) },
    ...later,
    { label: "First birthday", date: addYears(birth, 1) },
    { label: "500 days old", date: addDays(birth, 500) },
    { label: "Second birthday", date: addYears(birth, 2) },
    { label: "1,000 days old", date: addDays(birth, 1000) },
    ...golden,
  ].sort((a, b) => toUtc(a.date) - toUtc(b.date));
}

export function ordinal(value: number) {
  const tens = value % 100;
  if (tens >= 11 && tens <= 13) return `${value}th`;
  return `${value}${["th", "st", "nd", "rd"][value % 10] ?? "th"}`;
}

// All-day calendar events for the dates above, as an .ics file body.
export function milestoneCalendar(name: string, dates: BabyDate[]) {
  const stamp = (date: CalendarDate) => toIso(date).replaceAll("-", "");
  const events = dates.map((entry, index) =>
    [
      "BEGIN:VEVENT",
      `UID:everlittle-milestone-${index}-${stamp(entry.date)}@geteverlittle.com`,
      `DTSTAMP:${stamp(entry.date)}T000000Z`,
      `DTSTART;VALUE=DATE:${stamp(entry.date)}`,
      `DTEND;VALUE=DATE:${stamp(addDays(entry.date, 1))}`,
      `SUMMARY:${escapeIcs(`${name}: ${entry.label}`)}`,
      "END:VEVENT",
    ].join("\r\n"),
  );
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Everlittle//Baby milestone dates//EN",
    ...events,
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

function escapeIcs(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/[;,]/g, (char) => `\\${char}`);
}

// Deterministic shuffle so a shared link shows the same set of prompts.
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const result = [...items];
  let state = seed >>> 0 || 1;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swap = state % (index + 1);
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}
