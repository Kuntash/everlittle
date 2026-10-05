import { useEffect, useState } from "react";
import { todayDate, type CalendarDate } from "./tool-math";

// Today's date is only known in the browser; rendering it on the server would not match.
export function useToday() {
  const [today, setToday] = useState<CalendarDate | null>(null);
  useEffect(() => setToday(todayDate()), []);
  return today;
}

// Shared inputs use the fragment, which is not sent with HTTP requests.
export function useQueryState(keys: readonly string[]) {
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const initial: Record<string, string> = {};
    for (const key of keys) {
      const value = params.get(key);
      if (value) initial[key] = value;
    }
    if (Object.keys(initial).length > 0) setValues(initial);
    // The key list is fixed for the lifetime of a tool.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const set = (key: string, value: string) =>
    setValues((current) => ({ ...current, [key]: value }));
  const shareUrl = () => {
    const url = new URL(window.location.href);
    url.search = "";
    const params = new URLSearchParams();
    for (const key of keys) if (values[key]) params.set(key, values[key]);
    url.hash = params.toString();
    return url.toString();
  };
  return { values, set, shareUrl };
}
