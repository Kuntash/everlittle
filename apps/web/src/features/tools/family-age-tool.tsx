import { ShareLink } from "./share-link";
import { addYears, ageOn, isBefore, parseDate, type CalendarDate } from "./tool-math";
import { useQueryState } from "./tool-state";

const ADULTS = [
  { key: "a1", nameKey: "n1", fallback: "You" },
  { key: "a2", nameKey: "n2", fallback: "Partner" },
  { key: "a3", nameKey: "n3", fallback: "Grandparent" },
  { key: "a4", nameKey: "n4", fallback: "Grandparent" },
] as const;

const MILESTONES = [
  { age: 0, label: "Is born" },
  { age: 5, label: "Starts school (5)" },
  { age: 10, label: "Turns 10" },
  { age: 13, label: "Turns 13" },
  { age: 16, label: "Turns 16" },
  { age: 18, label: "Turns 18" },
  { age: 21, label: "Turns 21" },
  { age: 30, label: "Turns 30" },
  { age: 40, label: "Turns 40" },
];

export function FamilyAgeTool() {
  const { values, set, shareUrl } = useQueryState([
    "child",
    "born",
    ...ADULTS.flatMap((adult) => [adult.key, adult.nameKey]),
  ]);
  const birth = parseDate(values.born ?? "");
  const childName = values.child?.trim() || "Your child";
  const adults = ADULTS.map((adult) => ({
    name: values[adult.nameKey]?.trim() || adult.fallback,
    birth: parseDate(values[adult.key] ?? ""),
  })).filter((adult): adult is { name: string; birth: CalendarDate } => adult.birth !== null);
  const invalidAdult = birth && adults.some((adult) => isBefore(birth, adult.birth));
  const first = invalidAdult ? null : adults[0];
  return (
    <>
      <div className="tool-fields">
        <label className="tool-field">
          Child’s first name (optional)
          <input
            autoComplete="off"
            maxLength={40}
            value={values.child ?? ""}
            onChange={(event) => set("child", event.target.value)}
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
        {ADULTS.map((adult, index) => (
          <fieldset className="tool-person" key={adult.key}>
            <legend>{index < 2 ? adult.fallback : `${adult.fallback} (optional)`}</legend>
            <label className="tool-field">
              Name
              <input
                autoComplete="off"
                maxLength={40}
                placeholder={adult.fallback}
                value={values[adult.nameKey] ?? ""}
                onChange={(event) => set(adult.nameKey, event.target.value)}
              />
            </label>
            <label className="tool-field">
              Birthday
              <input
                type="date"
                value={values[adult.key] ?? ""}
                onChange={(event) => set(adult.key, event.target.value)}
              />
            </label>
          </fieldset>
        ))}
      </div>
      <div className="tool-result" aria-live="polite" hidden={!birth || adults.length === 0}>
        {invalidAdult && (
          <p className="tool-note">
            An adult’s birthday must be on or before the child’s birthday.
          </p>
        )}
        {birth && first && (
          <>
            <p className="tool-headline">
              {first.name === "You" ? "You will be" : `${first.name} will be`}{" "}
              <strong>{ageOn(first.birth, addYears(birth, 18))}</strong> when{" "}
              {childName === "Your child" ? "your child" : childName} turns 18.
            </p>
            <div className="tool-table-scroll">
              <table className="tool-table">
                <thead>
                  <tr>
                    <th scope="col">{childName}</th>
                    <th scope="col">Year</th>
                    {adults.map((adult, index) => (
                      <th scope="col" key={index}>
                        {adult.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MILESTONES.map((milestone) => {
                    const date = addYears(birth, milestone.age);
                    return (
                      <tr key={milestone.age}>
                        <td>{milestone.label}</td>
                        <td>{date.year}</td>
                        {adults.map((adult, index) => (
                          <td key={index}>{Math.max(0, ageOn(adult.birth, date))}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="tool-actions">
              <ShareLink url={shareUrl} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
