import { ShareLink } from "./share-link";
import { parseDate, schoolTimeline } from "./tool-math";
import { useQueryState } from "./tool-state";

const CUTOFFS = [
  { value: "9-1", label: "1 September (default)" },
  { value: "7-31", label: "31 July" },
  { value: "8-1", label: "1 August" },
  { value: "8-15", label: "15 August" },
  { value: "8-31", label: "31 August" },
  { value: "9-30", label: "30 September" },
  { value: "10-1", label: "1 October" },
  { value: "12-1", label: "1 December" },
  { value: "12-31", label: "31 December" },
];

const GRADES = ["Kindergarten", ...Array.from({ length: 12 }, (_, index) => `Grade ${index + 1}`)];

export function GraduationTool() {
  const { values, set, shareUrl } = useQueryState(["born", "cutoff", "parent"]);
  const birth = parseDate(values.born ?? "");
  const cutoffValue = CUTOFFS.find((cutoff) => cutoff.value === values.cutoff)?.value ?? "9-1";
  const [month, day] = cutoffValue.split("-").map(Number);
  const timeline = birth ? schoolTimeline(birth, { month, day }) : null;
  const parentYear = Number(values.parent);
  const parentAge =
    timeline && parentYear > 1900 && parentYear < timeline.kindergartenStart
      ? timeline.highSchoolClass - parentYear
      : null;
  return (
    <>
      <div className="tool-fields">
        <label className="tool-field">
          Child’s birthday
          <input
            type="date"
            value={values.born ?? ""}
            onChange={(event) => set("born", event.target.value)}
          />
        </label>
        <label className="tool-field">
          Kindergarten cutoff date
          <select value={cutoffValue} onChange={(event) => set("cutoff", event.target.value)}>
            {CUTOFFS.map((cutoff) => (
              <option key={cutoff.value} value={cutoff.value}>
                {cutoff.label}
              </option>
            ))}
          </select>
        </label>
        <label className="tool-field wide">
          Your birth year (optional)
          <input
            type="number"
            inputMode="numeric"
            min={1920}
            max={2030}
            placeholder="1992"
            value={values.parent ?? ""}
            onChange={(event) => set("parent", event.target.value)}
          />
        </label>
      </div>
      <div className="tool-result" aria-live="polite" hidden={!timeline}>
        {timeline && birth && (
          <>
            <p className="tool-headline">
              High school <strong>Class of {timeline.highSchoolClass}</strong>
            </p>
            <p className="tool-note">
              Typical path for a US child with this birthday and cutoff. Check the cutoff with your
              school district.
            </p>
            <ul className="tool-stats">
              <li>
                <strong>Fall {timeline.kindergartenStart}</strong>
                <span>starts kindergarten</span>
              </li>
              <li>
                <strong>
                  {timeline.highSchoolClass - birth.year - 1} or{" "}
                  {timeline.highSchoolClass - birth.year}
                </strong>
                <span>age at high school graduation</span>
              </li>
              <li>
                <strong>Class of {timeline.collegeClass}</strong>
                <span>four-year college degree</span>
              </li>
              {parentAge !== null && (
                <li>
                  <strong>
                    {parentAge - 1} or {parentAge}
                  </strong>
                  <span>your age on graduation day</span>
                </li>
              )}
            </ul>
            <table className="tool-table">
              <thead>
                <tr>
                  <th scope="col">Grade</th>
                  <th scope="col">School year</th>
                </tr>
              </thead>
              <tbody>
                {GRADES.map((grade, index) => (
                  <tr key={grade}>
                    <td>{grade}</td>
                    <td>
                      {timeline.kindergartenStart + index}–
                      {String(timeline.kindergartenStart + index + 1).slice(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="tool-actions">
              <ShareLink url={shareUrl} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
