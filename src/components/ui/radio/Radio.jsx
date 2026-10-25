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
  variant = "default",
  ...props
}) {
  if (variant === "segmented") {
    return (
      <label
        className={cn(
          "relative flex h-8 w-[90px] shrink-0 cursor-pointer",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <input
          type="radio"
          checked={checked}
          onChange={(event) => onChange?.(event.target.checked)}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <span className="flex size-full items-center justify-center rounded-md text-small text-text-muted transition-colors peer-checked:bg-primary peer-checked:text-text-on-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary motion-reduce:transition-none">
          {label}
        </span>
      </label>
    );
  }

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
