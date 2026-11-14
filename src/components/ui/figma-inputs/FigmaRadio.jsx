"use client";

import { useState } from "react";
import { cn } from "@/lib/client/utils";

export function FigmaRadio({
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
      type="radio"
      checked={active}
      disabled={disabled}
      onChange={(event) => {
        if (checked === undefined) setInternal(true);
        onChange?.(event);
      }}
      className={cn(
        "size-5 shrink-0 appearance-none rounded-full border border-border-default bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 checked:border-primary disabled:bg-surface-muted",
        active && "bg-[radial-gradient(circle,var(--color-primary)_0_5px,transparent_5px)]",
        className,
      )}
    />
  );
}
