import { CalendarDays, ChevronDown } from "lucide-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button as ShadButton } from "../ui/button";
import { Calendar as ShadCalendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
export { Checkbox, Input, RadioGroup, RadioGroupItem, ShadButton, Textarea };
export function Choice({
  value,
  onChange,
  options,
  label,
  disabled = false,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger aria-label={label} className={`choice-trigger ${className}`}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className="apricot-popover choice-menu" position="popper">
        {options.map((o) => (
          <SelectItem key={o} value={o} className="choice-item">
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
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
function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function DateField({
  value,
  onChange,
  label = "Add a date",
  withTime = false,
  future = false,
  preset,
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  withTime?: boolean;
  future?: boolean;
  preset?: {
    label: string;
    value: string;
  };
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false),
    [month, setMonth] = useState(
      value ? new Date(value.length === 10 ? `${value}T00:00:00` : value) : new Date(),
    );
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const change = () => setMobile(mq.matches);
    change();
    mq.addEventListener("change", change);
    return () => mq.removeEventListener("change", change);
  }, []);
  const selected = value ? new Date(value.length === 10 ? `${value}T00:00:00` : value) : undefined;
  const time = value.includes("T") ? value.split("T")[1].slice(0, 5) : "09:00";
  const formatted =
    selected && !Number.isNaN(+selected)
      ? selected.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : label;
  const trigger = (
    <ShadButton
      variant="ghost"
      type="button"
      disabled={disabled}
      className="date-trigger"
      aria-label={`${label}: ${formatted}`}
    >
      <CalendarDays size={17} />
      <span>
        {formatted}
        {withTime && selected ? ` · ${time}` : ""}
      </span>
      <ChevronDown size={14} />
    </ShadButton>
  );
  const calendar = (
    <>
      <div className="date-popover-title">{label}</div>
      <div className="date-navigation">
        <Choice
          value={month.toLocaleDateString("en-US", {
            month: "long",
          })}
          label="Month"
          options={Array.from(
            {
              length: 12,
            },
            (_, i) =>
              new Date(2026, i, 1).toLocaleDateString("en-US", {
                month: "long",
              }),
          )}
          onChange={(v) =>
            setMonth(
              new Date(
                month.getFullYear(),
                [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].indexOf(v),
                1,
              ),
            )
          }
          className="month-number"
        />
        <Choice
          value={String(month.getFullYear())}
          label="Year"
          options={Array.from(
            {
              length: future ? 100 : new Date().getFullYear() - 1900 + 1,
            },
            (_, i) => String((future ? new Date().getFullYear() : 1900) + i),
          )}
          onChange={(v) => setMonth(new Date(+v, month.getMonth(), 1))}
        />
      </div>
      <ShadCalendar
        mode="single"
        month={month}
        onMonthChange={setMonth}
        selected={selected}
        onSelect={(d: Date | undefined) => {
          if (d) {
            onChange(iso(d) + (withTime ? "T" + time : ""));
            if (!withTime) setOpen(false);
          }
        }}
        disabled={future ? (d: Date) => d < new Date(new Date().setHours(0, 0, 0, 0)) : undefined}
        className="ap-calendar"
      />
      {withTime && (
        <div className="time-row">
          <span>Time</span>
          <Input
            aria-label="Time in 24-hour format"
            value={time}
            placeholder="09:00"
            pattern="([01][0-9]|2[0-3]):[0-5][0-9]"
            onChange={(e) => onChange((value.split("T")[0] || iso(month)) + "T" + e.target.value)}
          />
        </div>
      )}
      {preset && (
        <ShadButton
          variant="quiet"
          className="date-preset"
          type="button"
          onClick={() => {
            onChange(preset.value);
            setMonth(
              new Date(preset.value.length === 10 ? `${preset.value}T00:00:00` : preset.value),
            );
            setOpen(false);
          }}
        >
          {preset.label}
          <span>
            {new Date(
              preset.value.length === 10 ? `${preset.value}T00:00:00` : preset.value,
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </ShadButton>
      )}
      <ShadButton className="raised date-done" onClick={() => setOpen(false)} type="button">
        Done
      </ShadButton>
    </>
  );
  if (mobile)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="apricot apricot-modal date-sheet">
          <DialogTitle className="sr-only">{label}</DialogTitle>
          <DialogDescription className="sr-only">
            Choose a date for this memory or profile.
          </DialogDescription>
          <div className="date-popover">{calendar}</div>
        </DialogContent>
      </Dialog>
    );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className="apricot-popover date-popover"
        align="start"
        sideOffset={8}
        collisionPadding={16}
      >
        {calendar}
      </PopoverContent>
    </Popover>
  );
}
export function SurfaceModal({
  open = true,
  title,
  children,
  onClose,
  busy = false,
}: {
  open?: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  busy?: boolean;
}) {
  const [height, setHeight] = useState<number | undefined>();
  const [layout, setLayout] = useState<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    if (!layout || !open) return;
    const measure = () => {
      const parent = layout.parentElement;
      if (!parent) return;
      const style = getComputedStyle(parent);
      setHeight(
        Math.ceil(
          layout.getBoundingClientRect().height +
            parseFloat(style.paddingTop) +
            parseFloat(style.paddingBottom) +
            parseFloat(style.borderTopWidth) +
            parseFloat(style.borderBottomWidth),
        ),
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(layout);
    return () => observer.disconnect();
  }, [layout, open]);
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v && !busy) onClose();
      }}
    >
      <DialogContent
        className="apricot apricot-modal animated-size"
        style={{
          height,
        }}
        onEscapeKeyDown={(e) => {
          if (busy) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (busy) e.preventDefault();
        }}
      >
        <div ref={setLayout} className="modal-layout">
          <DialogTitle className="ap-modal-title">{title}</DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
          <div className="ap-modal-body">{children}</div>
          {busy && (
            <span className="sr-only" role="status">
              Working
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
