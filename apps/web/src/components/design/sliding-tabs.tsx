import React, { useLayoutEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

/*
 * In its own file so a public page that needs tabs does not download the calendar,
 * the dialog and the other controls of `./controls`.
 */
export function SlidingTabs({
  value,
  onChange,
  items,
  label,
  className = "",
  renderLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  items: string[];
  label: string;
  className?: string;
  renderLabel?: (v: string) => React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState({
    x: 0,
    w: 0,
  });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const active = el.querySelector<HTMLElement>('[data-state="active"]');
      if (active)
        setRect({
          x: active.offsetLeft,
          w: active.offsetWidth,
        });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [value, items.join("|")]);
  return (
    <Tabs value={value} onValueChange={onChange} className={`sliding-tabs ${className}`}>
      <TabsList ref={ref} aria-label={label} className="sliding-list">
        <span
          className="sliding-pill"
          style={{
            width: rect.w,
            transform: `translateX(${rect.x}px)`,
          }}
        />
        {items.map((i) => (
          <TabsTrigger className="sliding-trigger" key={i} value={i}>
            {renderLabel ? renderLabel(i) : i}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
