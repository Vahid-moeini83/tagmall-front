"use client";
import { useState } from "react";
import { cn } from "@/lib/client/utils";
export function FigmaCheckbox({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  className,
  ...props
}) {
  const [internal, setInternal] = useState(defaultChecked);
  const active = checked === undefined ? internal : checked;
  return (
    <input
      {...props}
      type="checkbox"
      checked={active}
      disabled={disabled}
      onChange={(e) => {
        if (checked === undefined) setInternal(e.target.checked);
        onChange?.(e);
      }}
      className={cn(
        "size-5 shrink-0 appearance-none rounded-[6px] border border-border-default bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:bg-surface-muted",
        active &&
          !disabled &&
          "border-0 bg-primary bg-[url('/assets/figma-inputs/checkbox-check.svg')] bg-[length:12px_9px] bg-[position:4.3338px_5.5px] bg-no-repeat",
        className,
      )}
    />
  );
}
