"use client";

import { cn } from "@/lib/utils";

function Radio({ checked = false, onChange, label, className, ...props }) {
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
        {...props}
      />
      <span
        className={cn(
          "flex shrink-0 order-first items-center justify-center w-5 h-5 rounded-full border-2 transition-colors",
          checked ? "border-primary bg-white" : "border-gray-400 bg-white",
        )}
        aria-hidden
      >
        {checked && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
      </span>
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </label>
  );
}

export default Radio;
