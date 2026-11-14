"use client";

import { useState } from "react";
import { cn } from "@/lib/client/utils";
import typography from "./FigmaTypography.module.css";

export function FigmaToggle({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
  mutedDisabled = false,
  className,
  ...props
}) {
  const [internal, setInternal] = useState(defaultChecked);
  const active = checked === undefined ? internal : checked;
  const text = label ?? (disabled ? "غیرفعال" : active ? "فعال" : "غیرفعال");
  return (
    <label
      dir="ltr"
      className={cn(
        typography.root,
        "inline-flex h-6 cursor-pointer items-center gap-2",
        disabled && "cursor-not-allowed",
        className,
      )}
    >
      <span
        dir="rtl"
        className={cn(
          "text-sm leading-[22px]",
          disabled
            ? mutedDisabled
              ? "text-text-muted"
              : "text-text-disabled"
            : active
              ? "text-primary"
              : "text-text-disabled",
        )}
      >
        {text}
      </span>
      <input
        {...props}
        type="checkbox"
        role="switch"
        checked={active}
        disabled={disabled}
        onChange={(event) => {
          if (checked === undefined) setInternal(event.target.checked);
          onChange?.(event);
        }}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "relative h-6 w-10 shrink-0 rounded-full p-[2px] transition-colors",
          active ? "bg-primary" : disabled ? "bg-text-disabled" : "bg-surface-muted",
        )}
      >
        <span
          className={cn(
            "block size-5 rounded-full bg-white transition-transform",
            active && "translate-x-4",
          )}
        />
      </span>
    </label>
  );
}
