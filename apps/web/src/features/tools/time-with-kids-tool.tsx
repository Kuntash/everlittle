import { ShareLink } from "./share-link";
import { WEEKS_TO_EIGHTEEN, formatDate, parseDate, timeUntilEighteen } from "./tool-math";
import { useQueryState, useToday } from "./tool-state";

const number = new Intl.NumberFormat("en-US");

export function TimeWithKidsTool() {
  const today = useToday();
  const { values, set, shareUrl } = useQueryState(["name", "born", "south", "visits"]);
  const birth = parseDate(values.born ?? "");
  const name = values.name?.trim() || "your child";
  const result = birth && today ? timeUntilEighteen(birth, today, values.south === "1") : null;
  const visits = Math.min(365, Math.max(0, Number(values.visits) || 0));
  const outOfRange = Boolean(birth && today && !result);
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
          Child’s birthday
          <input
            type="date"
            value={values.born ?? ""}
            onChange={(event) => set("born", event.target.value)}
          />
        </label>
        <label className="tool-field">
          Where you live
          <select value={values.south ?? ""} onChange={(event) => set("south", event.target.value)}>
            <option value="">Northern hemisphere (summer is June to August)</option>
            <option value="1">Southern hemisphere (summer is December to February)</option>
          </select>
        </label>
        <label className="tool-field">
          Grandparent visits per year (optional)
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={365}
            value={values.visits ?? ""}
            onChange={(event) => set("visits", event.target.value)}
          />
        </label>
      </div>
      <div className="tool-result" aria-live="polite" hidden={!result && !outOfRange}>
        {result && (
          <>
            <p className="tool-headline">
              About <strong>{number.format(result.weekends)} weekends</strong> and{" "}
              <strong>
                {result.summers} summer{result.summers === 1 ? "" : "s"}
              </strong>{" "}
              until {name} turns 18.
            </p>
            <p className="tool-note">
              {name === "your child" ? "They turn" : `${name} turns`} 18 on{" "}
              {formatDate(result.turnsEighteen)}.
            </p>
            <ul className="tool-stats">
              <li>
                <strong>{number.format(result.days)}</strong>
                <span>bedtimes</span>
              </li>
              <li>
                <strong>{result.birthdays}</strong>
                <span>birthdays, including the 18th</span>
              </li>
              <li>
                <strong>{number.format(result.weekends)}</strong>
                <span>whole weeks until 18</span>
              </li>
              {visits > 0 && (
                <li>
                  <strong>{number.format(Math.round((visits * result.days) / 365.25))}</strong>
                  <span>grandparent visits at {visits} a year</span>
                </li>
              )}
            </ul>
            <WeekGrid lived={result.weeksLived} />
            <p className="tool-note">
              The grid illustrates 18 years of 52 weeks. {number.format(result.weeksLived)} squares
              are filled; calendar years include a few extra days.
            </p>
            <div className="tool-actions">
              <ShareLink url={shareUrl} />
            </div>
          </>
        )}
        {outOfRange && (
          <p className="tool-note">
            Enter a birthday within the last 18 years. If your child is already grown, the weekends
            are still worth counting; this calculator just stops at 18.
          </p>
        )}
      </div>
    </>
  );
}

function WeekGrid({ lived }: { lived: number }) {
  return (
    <div
      className="week-grid"
      role="img"
      aria-label={`${lived} of ${WEEKS_TO_EIGHTEEN} weeks of childhood have passed`}
    >
      {Array.from({ length: 18 }, (_, year) => (
        <div className="week-row" key={year}>
          {Array.from({ length: 52 }, (_, week) => (
            <i key={week} className={year * 52 + week < lived ? "lived" : undefined} />
          ))}
        </div>
      ))}
    </div>
  );
}
