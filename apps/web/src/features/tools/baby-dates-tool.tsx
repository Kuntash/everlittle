import { ShadButton } from "@/components/design/controls";
import { CalendarPlus } from "lucide-react";
import { ShareLink } from "./share-link";
import {
  babyMilestoneDates,
  daysBetween,
  formatDate,
  isBefore,
  milestoneCalendar,
  monthsAndDays,
  parseDate,
} from "./tool-math";
import { useQueryState, useToday } from "./tool-state";

const number = new Intl.NumberFormat("en-US");

export function BabyDatesTool() {
  const today = useToday();
  const { values, set, shareUrl } = useQueryState(["name", "born"]);
  const birth = parseDate(values.born ?? "");
  const name = values.name?.trim() || "Baby";
  const dates = birth ? babyMilestoneDates(birth) : [];
  const born = birth && today && !isBefore(today, birth);
  const age = born ? monthsAndDays(birth, today) : null;
  const daysOld = born ? daysBetween(birth, today) : 0;
  const download = () => {
    const file = new Blob([milestoneCalendar(name, dates)], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "baby-milestone-dates.ics";
    link.click();
    URL.revokeObjectURL(link.href);
  };
  return (
    <>
      <div className="tool-fields">
        <label className="tool-field">
          Baby’s first name (optional)
          <input
            autoComplete="off"
            maxLength={40}
            value={values.name ?? ""}
            onChange={(event) => set("name", event.target.value)}
          />
        </label>
        <label className="tool-field">
          Birth date or due date
          <input
            type="date"
            value={values.born ?? ""}
            onChange={(event) => set("born", event.target.value)}
          />
        </label>
      </div>
      <div className="tool-result" aria-live="polite" hidden={!birth}>
        {birth && (
          <>
            {age && (
              <>
                <p className="tool-headline">
                  {name} is <strong>{number.format(daysOld)} days</strong> old today.
                </p>
                <ul className="tool-stats">
                  <li>
                    <strong>{Math.floor(daysOld / 7)}</strong>
                    <span>weeks</span>
                  </li>
                  <li>
                    <strong>
                      {age.months} mo {age.days} d
                    </strong>
                    <span>months and days</span>
                  </li>
                  <li>
                    <strong>{number.format(daysOld)}</strong>
                    <span>days you have been their parent</span>
                  </li>
                </ul>
              </>
            )}
            <table className="tool-table">
              <thead>
                <tr>
                  <th scope="col">Milestone</th>
                  <th scope="col">Date</th>
                </tr>
              </thead>
              <tbody>
                {dates.map((entry) => (
                  <tr
                    key={entry.label}
                    className={today && isBefore(entry.date, today) ? "past" : undefined}
                  >
                    <td>{entry.label}</td>
                    <td>{formatDate(entry.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="tool-actions">
              <ShadButton className="raised secondary" variant="outline" onClick={download}>
                <CalendarPlus size={16} />
                Add all dates to my calendar
              </ShadButton>
              <ShareLink url={shareUrl} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
