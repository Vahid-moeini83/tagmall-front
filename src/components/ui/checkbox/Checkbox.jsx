"use client";

import { cn } from "@/lib/client/utils";

function Checkbox({
  checked = false,
  hasBorder = true,
  onChange,
  label,
  className,
  variant = "default",
  ...props
}) {
  return (
    <label
      className={`flex items-center gap-5 cursor-pointer select-none ${variant === "seller" ? "relative has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary" : ""}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="sr-only"
        {...props}
      />
      <span
        className={cn(
          variant === "seller"
            ? `flex size-5 shrink-0 order-first items-center justify-center rounded border transition-colors ${checked ? "border-primary bg-primary text-text-on-primary" : "border-border-default bg-surface text-transparent"}`
            : "flex shrink-0 order-first items-center justify-center w-5 h-5 rounded-[6px] bg-white transition-colors",
          variant !== "seller" && (hasBorder ? "border-2" : "border-none"),
          variant !== "seller" &&
            (checked
              ? "border-primary text-primary"
              : "border-gray-400 text-transparent"),
          className,
        )}
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden
        >
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      </span>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}

export default Checkbox;
