import { describe, expect, it } from "vitest";

import {
  addMonths,
  ageOn,
  babyMilestoneDates,
  milestoneCalendar,
  monthsAndDays,
  parseDate,
  schoolTimeline,
  seededShuffle,
  timeUntilEighteen,
  toIso,
} from "@/features/tools/tool-math";

const date = (value: string) => parseDate(value)!;

describe("free tool date arithmetic", () => {
  it("rejects impossible dates", () => {
    expect(parseDate("2026-02-30")).toBeNull();
    expect(parseDate("not-a-date")).toBeNull();
  });

  it("clamps month arithmetic to the end of shorter months", () => {
    expect(toIso(addMonths(date("2026-01-31"), 1))).toBe("2026-02-28");
    expect(toIso(addMonths(date("2024-02-29"), 12))).toBe("2025-02-28");
  });

  it("counts completed years and months", () => {
    expect(ageOn(date("2020-06-15"), date("2026-06-14"))).toBe(5);
    expect(ageOn(date("2020-06-15"), date("2026-06-15"))).toBe(6);
    expect(monthsAndDays(date("2026-01-31"), date("2026-03-02"))).toEqual({ months: 1, days: 2 });
  });

  it("counts what remains before an eighteenth birthday", () => {
    const left = timeUntilEighteen(date("2020-10-05"), date("2026-10-05"))!;
    expect(left.age).toBe(6);
    expect(left.birthdays).toBe(12);
    expect(left.summers).toBe(12);
    expect(left.weekends).toBe(626);
    expect(left.weeksLived).toBe(313);
    expect(toIso(left.turnsEighteen)).toBe("2038-10-05");
  });

  it("includes a summer that is already under way and stops at eighteen", () => {
    expect(timeUntilEighteen(date("2008-08-20"), date("2026-07-01"))!.summers).toBe(1);
    expect(timeUntilEighteen(date("2008-07-01"), date("2026-07-01"))).toBeNull();
    expect(timeUntilEighteen(date("2027-01-01"), date("2026-07-01"))).toBeNull();
  });

  it("places a child in a class year from the kindergarten cutoff", () => {
    const cutoff = { month: 9, day: 1 };
    expect(schoolTimeline(date("2026-03-10"), cutoff)).toEqual({
      kindergartenStart: 2031,
      highSchoolClass: 2044,
      collegeClass: 2048,
    });
    expect(schoolTimeline(date("2026-09-01"), cutoff).highSchoolClass).toBe(2044);
    expect(schoolTimeline(date("2026-09-02"), cutoff).highSchoolClass).toBe(2045);
  });

  it("lists baby milestone dates in order with the birth day as day one", () => {
    const dates = babyMilestoneDates(date("2026-01-01"));
    const find = (label: string) => toIso(dates.find((entry) => entry.label === label)!.date);
    expect(find("100 days old")).toBe("2026-04-10");
    expect(find("Half birthday (6 months)")).toBe("2026-07-01");
    expect(find("1,000 days old")).toBe("2028-09-27");
    expect(dates.map((entry) => toIso(entry.date))).toEqual(
      dates.map((entry) => toIso(entry.date)).sort(),
    );
  });

  it("exports milestone dates as all-day calendar events", () => {
    const calendar = milestoneCalendar("Maya, Jr", babyMilestoneDates(date("2026-01-01")));
    expect(calendar).toContain("DTSTART;VALUE=DATE:20260410");
    expect(calendar).toContain("SUMMARY:Maya\\, Jr: 100 days old");
    expect(calendar.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    const withNewline = milestoneCalendar(
      "Maya\nBEGIN:VEVENT",
      babyMilestoneDates(date("2026-01-01")),
    );
    expect(withNewline).toContain("SUMMARY:Maya\\nBEGIN:VEVENT:");
    expect(withNewline).not.toContain("SUMMARY:Maya\r\nBEGIN:VEVENT");
  });

  it("shuffles repeatably for a shared link", () => {
    const items = ["a", "b", "c", "d", "e", "f"];
    expect(seededShuffle(items, 4)).toEqual(seededShuffle(items, 4));
    expect(seededShuffle(items, 4).sort()).toEqual(items);
  });
});
