import type { ChangeEvent, InputHTMLAttributes } from "react";
import { useEffect, useRef } from "react";
import { DateField } from "./controls";
/** Keep native form validity and local date-time values behind a responsive calendar. */
export function DateInput({
  value,
  onChange,
  type,
  min,
  max,
  required,
  disabled,
  "aria-label": label,
}: InputHTMLAttributes<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null);
  const date = String(value ?? "");
  useEffect(() => {
    const field = ref.current;
    if (!field) return;
    field.setCustomValidity(
      date && min && date < String(min)
        ? "Choose a later date."
        : date && max && date > String(max)
          ? "Choose an earlier date."
          : "",
    );
  }, [date, min, max]);
  return (
    <span className="date-input">
      <DateField
        value={date}
        label={label ?? "Choose a date"}
        withTime={type === "datetime-local"}
        disabled={disabled}
        onChange={(next) =>
          onChange?.({
            target: { value: next },
            currentTarget: { value: next },
          } as ChangeEvent<HTMLInputElement>)
        }
      />
      <input
        ref={ref}
        className="date-validation sr-only"
        aria-label={label ?? "Selected date"}
        tabIndex={-1}
        value={date}
        onChange={() => {}}
        required={required}
        disabled={disabled}
      />
    </span>
  );
}
