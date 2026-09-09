import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ChangeEvent, ReactNode, SelectHTMLAttributes } from "react";
import { Children, isValidElement } from "react";

type Option = { value: string; label: ReactNode; disabled?: boolean };
function optionsFrom(children: ReactNode): Option[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement<{ value?: string; children?: ReactNode; disabled?: boolean }>(child))
      return [];
    if (child.type === "option")
      return [
        {
          value:
            child.props.value ??
            (typeof child.props.children === "string" ? child.props.children : ""),
          label: child.props.children,
          disabled: child.props.disabled,
        },
      ];
    return optionsFrom(child.props.children);
  });
}
/** Bridges existing controlled select handlers while retaining Radix keyboard behavior. */
export function DesignSelect({
  children,
  value,
  onChange,
  className,
  id,
  disabled,
  name,
  required,
  "aria-label": label,
}: SelectHTMLAttributes<HTMLSelectElement>) {
  const options = optionsFrom(children);
  return (
    <Select
      value={String(value ?? "")}
      onValueChange={(next) =>
        onChange?.({
          target: { value: next },
          currentTarget: { value: next },
        } as ChangeEvent<HTMLSelectElement>)
      }
      disabled={disabled}
      name={name}
      required={required}
    >
      <SelectTrigger id={id} aria-label={label} className={`choice-trigger ${className ?? ""}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="apricot-popover choice-menu" position="popper">
        {options
          .filter((option) => option.value)
          .map((option) => (
            <SelectItem
              className="choice-item"
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
