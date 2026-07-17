"use client";

import { cn } from "@/lib/client/utils";

function Radio({
  checked = false,
  onChange,
  label,
  hasBorder = true,
  className,
  disabled = false,
  radioClassname = "",
  ...props
}) {
  return (
    <label
      className={cn(
        "flex items-center gap-3 cursor-pointer select-none",
        className,
      )}
    >
      <input
        type="radio"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="sr-only"
        disabled={disabled}
        {...props}
      />
      <span
        className={cn(
          "flex shrink-0 order-first items-center justify-center w-5 h-5 rounded-full transition-colors bg-gray-200 border-0",
          disabled && "opacity-50 cursor-not-allowed",
          radioClassname,
        )}
        aria-hidden
      >
        {checked && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
      </span>
      {label && (
        <span className={cn("text-sm text-gray-600", disabled && "opacity-50")}>
          {label}
        </span>
      )}
    </label>
  );
}

export default Radio;
