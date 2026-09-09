import { useCallback, useEffect, useRef, useState } from "react";

export function useSheetTransition(onClose: () => void, blocked: boolean) {
  const [closing, setClosing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const returnFocus = useRef<HTMLElement | null>(
    typeof document === "undefined" ? null : (document.activeElement as HTMLElement | null),
  );

  useEffect(() => {
    const dialog = document.querySelector<HTMLElement>('[role="dialog"][aria-modal="true"]');
    if (!dialog) return;
    const focusable = () =>
      [
        ...dialog.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
        ),
      ].filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);
    if (!dialog.contains(document.activeElement)) focusable()[0]?.focus();
    function containFocus(event: KeyboardEvent) {
      if (
        event.key !== "Tab" ||
        document.querySelectorAll('[role="dialog"]:not([data-state="closed"])').length > 1
      )
        return;
      const elements = focusable();
      const first = elements[0];
      const last = elements.at(-1);
      if (!first || !last) {
        event.preventDefault();
        return;
      }
      if (
        event.shiftKey &&
        (document.activeElement === first || !dialog?.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || !dialog?.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", containFocus);
    const trigger = returnFocus.current;
    return () => {
      document.removeEventListener("keydown", containFocus);
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  const requestClose = useCallback(
    (force = false) => {
      if (closing || (blocked && !force)) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        onClose();
        return;
      }
      setClosing(true);
      timer.current = setTimeout(onClose, 190);
    },
    [blocked, closing, onClose],
  );

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (
        event.key === "Escape" &&
        !event.defaultPrevented &&
        document.querySelectorAll('[role="dialog"]:not([data-state="closed"])').length === 1
      )
        requestClose();
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [requestClose]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return { closing, requestClose };
}
