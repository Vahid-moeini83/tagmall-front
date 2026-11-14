"use client";

import { useState } from "react";
import { cn } from "@/lib/client/utils";
import typography from "./FigmaTypography.module.css";

export function FigmaTextarea({
  value,
  defaultValue = "",
  onChange,
  maxLength = 500,
  placeholder = "توضیحات یا پیام خود را وارد کنید...",
  disabled = false,
  className,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const current = value === undefined ? internalValue : value;
  return (
    <div className={cn(typography.root, "flex w-[500px] max-w-full flex-col gap-2", className)}>
      <textarea
        {...props}
        disabled={disabled}
        maxLength={maxLength}
        value={current}
        onChange={(event) => {
          if (value === undefined) setInternalValue(event.target.value);
          onChange?.(event);
        }}
        placeholder={placeholder}
        className="h-40 w-full resize-none rounded-[15px] border border-border-default bg-transparent p-3 text-right text-base leading-[26px] text-text-primary outline-none placeholder:text-text-disabled disabled:cursor-not-allowed"
      />
      <div dir="ltr" className="h-[22px] w-full text-left text-sm leading-[22px] text-text-muted">
        {String(current.length).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])} /{" "}
        {String(maxLength).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])}
      </div>
    </div>
  );
}
