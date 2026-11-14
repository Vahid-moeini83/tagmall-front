"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/client/utils";
import { getFigmaInputSize } from "./FigmaInputSizes";

const icons = {
  search: "/assets/figma-inputs/search-muted.svg",
  searchFilled: "/assets/figma-inputs/search-filled.svg",
  clear: "/assets/figma-inputs/clear-search.svg",
};

/** Based on Figma Input/Search (177:3378). */
export function FigmaSearchInput({
  value,
  defaultValue = "",
  onChange,
  onClear,
  placeholder = "جستجو در تگ مال...",
  size = "large",
  width = 220,
  className,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : internalValue;
  const filled = Boolean(current);

  const clear = () => {
    if (!controlled) setInternalValue("");
    onChange?.({ target: { value: "" } });
    onClear?.();
  };

  const s = getFigmaInputSize(size);
  return (
    <div
      dir="ltr"
      style={{ width }}
      className={cn(
        "box-border flex max-w-full items-center gap-2 border",
        s.height,
        filled ? "border-primary bg-transparent" : "border-border-default bg-surface-subtle",
        size === "large"
          ? filled
            ? "rounded-[15px] px-3"
            : "rounded-[12px] px-3"
          : cn(s.radius, s.padding),
        className,
      )}
    >
      {filled && (
        <button
          type="button"
          aria-label="پاک کردن جستجو"
          onClick={clear}
          className="flex size-5 shrink-0 items-center justify-center border-0 bg-transparent p-0"
        >
          <Image src={icons.clear} alt="" aria-hidden width={20} height={20} unoptimized />
        </button>
      )}
      <input
        {...props}
        type="text"
        role="searchbox"
        inputMode="search"
        enterKeyHint="search"
        value={controlled ? value : undefined}
        defaultValue={controlled ? undefined : defaultValue}
        onChange={(e) => {
          if (!controlled) setInternalValue(e.target.value);
          onChange?.(e);
        }}
        placeholder={placeholder}
        dir="rtl"
        className={cn(
          "min-w-0 flex-1 border-0 bg-transparent p-0 text-right font-[YekanBakh] font-normal text-text-primary outline-none focus:ring-0",
          size === "large"
            ? filled
              ? "text-base leading-[26px] placeholder:text-text-disabled"
              : "text-sm leading-[22px] placeholder:text-text-muted"
            : cn(s.text, "placeholder:text-text-disabled"),
        )}
      />
      <Image
        src={filled ? icons.searchFilled : icons.search}
        alt=""
        aria-hidden
        width={20}
        height={20}
        unoptimized
        className="size-5 shrink-0"
      />
    </div>
  );
}
