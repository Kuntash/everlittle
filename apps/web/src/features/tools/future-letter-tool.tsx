import { ShadButton } from "@/components/design/controls";
import { Button } from "@/components/design/shared";
import { CalendarPlus, Check, Copy, Download, Printer, RotateCcw } from "lucide-react";
import { useState } from "react";
import {
  LETTER_PRESET_YEARS,
  LETTER_RECIPIENTS,
  MAX_LETTER_LENGTH,
  eighteenthBirthday,
  isFutureDate,
  letterFileName,
  letterGreeting,
  letterHeading,
  letterReminder,
  letterText,
  waitDescription,
  wordCount,
  type Letter,
} from "./future-letter";
import { addYears, formatDate, parseDate, toIso } from "./tool-math";
import { useSavedQueryState, useToday } from "./tool-state";

function saveFile(name: string, type: string, body: string) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([body], { type }));
  link.download = name;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function FutureLetterTool() {
  const today = useToday();
  const { values, set, clear } = useSavedQueryState("everlittle-tool-future-letter", [
    "to",
    "name",
    "born",
    "from",
    "opens",
    "body",
  ]);
  const [copied, setCopied] = useState(false);
  const recipient = LETTER_RECIPIENTS.find((entry) => entry === values.to) ?? LETTER_RECIPIENTS[0];
  const name = values.name ?? "";
  const body = values.body ?? "";
  const birth = recipient === "My child" ? parseDate(values.born ?? "") : null;
  const chosen = parseDate(values.opens ?? "");
  const opens = today && isFutureDate(today, chosen) ? chosen : null;
  const eighteenth = birth && today && isFutureDate(today, eighteenthBirthday(birth));
  const letter: Letter | null =
    today && opens && body.trim()
      ? { recipient, name, from: values.from ?? "", body, written: today, opens }
      : null;
  const missing = !body.trim()
    ? "Write your letter to print or download it."
    : !chosen
      ? "Choose an opening date to print or download it."
      : !opens
        ? "Choose an opening date after today."
        : "";
  const copy = async () => {
    if (!letter) return;
    try {
      await navigator.clipboard.writeText(letterText(letter));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy your letter", letterText(letter));
    }
  };
  return (
    <>
      <div className="tool-fields">
        <fieldset className="tool-person tool-picker">
          <legend>Who is the letter for?</legend>
          <div className="tool-chips">
            {LETTER_RECIPIENTS.map((option) => (
              <button
                type="button"
                key={option}
                aria-pressed={option === recipient}
                onClick={() => set("to", option)}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="tool-field">
          {recipient === "Myself" ? "Your first name (optional)" : "Their first name (optional)"}
          <input
            autoComplete="off"
            maxLength={40}
            value={name}
            onChange={(event) => set("name", event.target.value)}
          />
        </label>
        {recipient === "My child" ? (
          <label className="tool-field">
            Their birthday (optional)
            <input
              type="date"
              value={values.born ?? ""}
              onChange={(event) => set("born", event.target.value)}
            />
          </label>
        ) : (
          <label className="tool-field">
            How you sign off (optional)
            <input
              autoComplete="off"
              maxLength={60}
              placeholder={recipient === "Myself" ? "Me, today" : "With love, …"}
              value={values.from ?? ""}
              onChange={(event) => set("from", event.target.value)}
            />
          </label>
        )}
        {recipient === "My child" && (
          <label className="tool-field wide">
            How you sign off (optional)
            <input
              autoComplete="off"
              maxLength={60}
              placeholder="Love, Mom"
              value={values.from ?? ""}
              onChange={(event) => set("from", event.target.value)}
            />
          </label>
        )}
        <div className="tool-field wide">
          <label htmlFor="future-letter-body">Your letter</label>
          <textarea
            id="future-letter-body"
            aria-describedby="future-letter-count"
            rows={12}
            maxLength={MAX_LETTER_LENGTH}
            placeholder={`${letterGreeting(recipient, name)}\n\nToday is an ordinary day, and here is what it looks like…`}
            value={body}
            onChange={(event) => set("body", event.target.value)}
          />
          <small id="future-letter-count">
            {wordCount(body)} {wordCount(body) === 1 ? "word" : "words"}. Half a page is plenty.
          </small>
        </div>
        <fieldset className="tool-person tool-picker">
          <legend>When should it be opened?</legend>
          <div className="tool-chips">
            {LETTER_PRESET_YEARS.map((years) => {
              const date = today ? toIso(addYears(today, years)) : "";
              return (
                <button
                  type="button"
                  key={years}
                  disabled={!today}
                  aria-pressed={Boolean(date) && values.opens === date}
                  onClick={() => set("opens", date)}
                >
                  In {years} {years === 1 ? "year" : "years"}
                </button>
              );
            })}
            {birth && eighteenth && (
              <button
                type="button"
                aria-pressed={values.opens === toIso(eighteenthBirthday(birth))}
                onClick={() => set("opens", toIso(eighteenthBirthday(birth)))}
              >
                On their 18th birthday
              </button>
            )}
          </div>
        </fieldset>
        <label className="tool-field wide">
          Or choose the exact date
          <input
            type="date"
            min={today ? toIso(today) : undefined}
            value={values.opens ?? ""}
            onChange={(event) => set("opens", event.target.value)}
          />
        </label>
      </div>
      <div className="tool-result letter-result" aria-live="polite">
        {opens && today ? (
          <>
            <p className="tool-headline">
              Open on <strong>{formatDate(opens)}</strong>
            </p>
            <p className="tool-note">
              That is {waitDescription(today, opens)} from today. This page cannot deliver the
              letter for you, so keep a copy now.
            </p>
          </>
        ) : (
          <p className="tool-note">{missing || "Choose an opening date."}</p>
        )}
        {opens && missing && <p className="tool-note">{missing}</p>}
        <div className="tool-actions">
          <Button disabled={!letter} onClick={() => window.print()}>
            <Printer size={16} />
            Print the letter
          </Button>
          <ShadButton
            className="raised secondary"
            variant="outline"
            disabled={!letter}
            onClick={() =>
              letter && saveFile(letterFileName(letter), "text/plain", letterText(letter))
            }
          >
            <Download size={16} />
            Download as a text file
          </ShadButton>
          <ShadButton variant="quiet" disabled={!letter} onClick={copy}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            <span aria-live="polite">{copied ? "Letter copied" : "Copy the letter"}</span>
          </ShadButton>
          <ShadButton
            variant="quiet"
            disabled={!opens || !today}
            onClick={() =>
              opens &&
              today &&
              saveFile(
                "open-my-letter.ics",
                "text/calendar",
                letterReminder({ recipient, name, opens, written: today }),
              )
            }
          >
            <CalendarPlus size={15} />
            Add the date to my calendar
          </ShadButton>
          <ShadButton
            variant="quiet"
            disabled={Object.values(values).every((value) => !value)}
            onClick={() => {
              if (window.confirm("Erase this letter from this browser?")) clear();
            }}
          >
            <RotateCcw size={15} />
            Start over
          </ShadButton>
        </div>
      </div>
      {letter && (
        <div className="letter-sheet">
          <p className="letter-sheet-seal">Do not open until {formatDate(letter.opens)}</p>
          <p className="letter-sheet-meta">
            {letterHeading(letter)} · Written on {formatDate(letter.written)}
          </p>
          <p>{letterGreeting(recipient, name)}</p>
          <p className="letter-sheet-body">{body.trim()}</p>
          {letter.from.trim() && <p>{letter.from.trim()}</p>}
        </div>
      )}
    </>
  );
}
