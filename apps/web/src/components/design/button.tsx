import React from "react";
import { Button as ShadButton } from "../ui/button";

/* In its own file so a public page that needs a button does not download the controls of `./shared`. */
export function Button({
  children,
  secondary = false,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  secondary?: boolean;
  /** Render the one child, for example a link, with the button's look. */
  asChild?: boolean;
}) {
  return (
    <ShadButton
      {...props}
      variant={secondary ? "outline" : "default"}
      className={`raised ${secondary ? "secondary" : ""} ${className}`}
    >
      {children}
    </ShadButton>
  );
}
