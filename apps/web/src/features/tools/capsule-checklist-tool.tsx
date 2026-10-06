import { ShadButton } from "@/components/design/controls";
import { Button } from "@/components/design/shared";
import { Plus, Printer, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import {
  CAPSULE_GROUPS,
  CAPSULE_OPEN_AGES,
  MAX_CUSTOM_ITEMS,
  capsuleOpenAge,
  capsuleOpenDate,
  capsuleProgress,
  parseCustomItems,
  parsePacked,
  serializeCustomItems,
  togglePacked,
} from "./capsule-checklist";
import { ShareLink } from "./share-link";
import { ageOn, formatDate, ordinal, parseDate } from "./tool-math";
import { useSavedQueryState, useToday } from "./tool-state";

export function CapsuleChecklistTool() {
  const today = useToday();
  const { values, set, clear, shareUrl } = useSavedQueryState("everlittle-tool-capsule-checklist", [
    "name",
    "born",
    "age",
    "done",
    "extra",
  ]);
  const [draft, setDraft] = useState("");
  const name = values.name?.trim();
  const birth = parseDate(values.born ?? "");
  const age = capsuleOpenAge(values.age);
  const opens = birth ? capsuleOpenDate(birth, age) : null;
  const packed = parsePacked(values.done);
  const custom = parseCustomItems(values.extra);
  const progress = capsuleProgress(packed, custom);
  const addCustom = () => {
    if (!draft.trim() || custom.length >= MAX_CUSTOM_ITEMS) return;
    set("extra", serializeCustomItems([...custom, { label: draft, packed: false }]));
    setDraft("");
  };
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
          Their birthday (optional)
          <input
            type="date"
            value={values.born ?? ""}
            onChange={(event) => set("born", event.target.value)}
          />
        </label>
        <fieldset className="tool-person tool-picker">
          <legend>Open it when they turn</legend>
          <div className="tool-chips">
            {CAPSULE_OPEN_AGES.map((option) => (
              <button
                type="button"
                key={option}
                aria-pressed={option === age}
                onClick={() => set("age", String(option))}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="tool-result">
        <p className="tool-headline">{name ? `${name}’s` : "Our"} first birthday time capsule</p>
        <p className="tool-note capsule-meta" aria-live="polite">
          {opens
            ? `Do not open until ${formatDate(opens)}${
                today && birth && ageOn(birth, today) < age
                  ? `, when ${name || "they"} will be ${age}.`
                  : "."
              }`
            : `To be opened on the ${ordinal(age)} birthday. Add the birthday to see the date.`}
        </p>
        <p className="tool-note" aria-live="polite">
          <strong>
            {progress.packed} of {progress.total}
          </strong>{" "}
          packed
        </p>
        {CAPSULE_GROUPS.map((group) => (
          <fieldset className="capsule-group" key={group.id}>
            <legend>{group.title}</legend>
            {group.items.map((item) => (
              <label className="capsule-item" key={item.id}>
                <input
                  type="checkbox"
                  checked={packed.includes(item.id)}
                  onChange={() => set("done", togglePacked(values.done, item.id))}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </fieldset>
        ))}
        <fieldset className="capsule-group">
          <legend>Your own additions</legend>
          {custom.map((item, index) => (
            <div className="capsule-item" key={`${index}-${item.label}`}>
              <label>
                <input
                  type="checkbox"
                  checked={item.packed}
                  onChange={() =>
                    set(
                      "extra",
                      serializeCustomItems(
                        custom.map((entry, at) =>
                          at === index ? { ...entry, packed: !entry.packed } : entry,
                        ),
                      ),
                    )
                  }
                />
                <span>{item.label}</span>
              </label>
              <button
                type="button"
                className="capsule-remove"
                aria-label={`Remove ${item.label}`}
                onClick={() =>
                  set("extra", serializeCustomItems(custom.filter((_, at) => at !== index)))
                }
              >
                <X size={15} />
              </button>
            </div>
          ))}
          {custom.length < MAX_CUSTOM_ITEMS && (
            <form
              className="capsule-add"
              onSubmit={(event) => {
                event.preventDefault();
                addCustom();
              }}
            >
              <label className="tool-field">
                Add something of your own
                <input
                  autoComplete="off"
                  maxLength={80}
                  placeholder="Great-grandma’s recipe card"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                />
              </label>
              <ShadButton variant="quiet" type="submit" disabled={!draft.trim()}>
                <Plus size={15} />
                Add to the list
              </ShadButton>
            </form>
          )}
        </fieldset>
        <div className="tool-actions">
          <Button onClick={() => window.print()}>
            <Printer size={16} />
            Print the checklist
          </Button>
          <ShareLink url={shareUrl} label="Copy link to this list" />
          <ShadButton
            variant="quiet"
            disabled={Object.values(values).every((value) => !value)}
            onClick={() => {
              if (window.confirm("Clear this checklist from this browser?")) clear();
            }}
          >
            <RotateCcw size={15} />
            Start over
          </ShadButton>
        </div>
      </div>
    </>
  );
}
