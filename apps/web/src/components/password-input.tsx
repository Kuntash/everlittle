import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import type { ComponentProps } from "react";

type PasswordInputProps = Omit<ComponentProps<"input">, "type"> & {
  secretLabel?: "password" | "PIN";
};

export function PasswordInput({ id, secretLabel = "password", ...props }: PasswordInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <span className="secret-input">
      <input {...props} id={inputId} type={visible ? "text" : "password"} />
      <button
        aria-controls={inputId}
        aria-label={`${visible ? "Hide" : "Show"} ${secretLabel}`}
        aria-pressed={visible}
        className="secret-toggle"
        disabled={props.disabled}
        onClick={() => setVisible((current) => !current)}
        onMouseDown={(event) => event.preventDefault()}
        type="button"
      >
        <Icon aria-hidden="true" size={19} strokeWidth={1.7} />
      </button>
    </span>
  );
}
