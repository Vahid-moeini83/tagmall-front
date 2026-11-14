"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/client/utils";
import { getFigmaInputSize } from "./FigmaInputSizes";

const chevrons = {
  selected: "/assets/figma-inputs/chevron-selected.svg",
  default: "/assets/figma-inputs/chevron-default.svg",
};

const optionWidthClasses = {
  102: "w-[102px]",
  107: "w-[107px]",
  109: "w-[109px]",
  117: "w-[117px]",
};

/** Based on Figma Input/Dropdown (325:2654), including its selected menu state. */
export function FigmaDropdown({
  value,
  defaultValue = "",
  onChange,
  placeholder = "استان خود را انتخاب کنید",
  options = [],
  size = "large",
  className,
  triggerClassName,
  selectedLabelClassName,
  selectedLabelDir = "rtl",
  selectedLabelLang,
  menuClassName,
  menuPlacement = "below",
  optionClassName,
  optionLabelClassName,
  optionLabelDir = "ltr",
  optionLabelLang,
  radioClassName,
  name,
  ...props
}) {
  const [internal, setInternal] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const controlled = value !== undefined;
  const selected = controlled ? value : internal;
  const selectedLabel =
    options.find((item) => (item.value ?? item.label) === selected)?.label ?? selected;
  const setValue = (next) => {
    if (!controlled) setInternal(next);
    onChange?.(next);
    setOpen(false);
  };
  const sizeTokens = getFigmaInputSize(size);

  return (
    <div className={cn("relative", className || "w-[280px]")}>
      <button
        {...props}
        type="button"
        name={name}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        dir="ltr"
        className={cn(
          "flex w-full items-center gap-2 border border-border-default bg-transparent",
          sizeTokens.height,
          sizeTokens.radius,
          sizeTokens.padding,
          triggerClassName,
        )}
      >
        <Image
          src={selected ? chevrons.selected : chevrons.default}
          alt=""
          aria-hidden
          width={20}
          height={20}
          unoptimized
          className="size-5 shrink-0"
        />
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-right font-[YekanBakh] [font-weight:325]",
            sizeTokens.text,
            selected ? "text-text-primary" : "text-text-disabled",
            selectedLabelClassName,
          )}
          dir={selectedLabelDir}
          lang={selectedLabelLang}
        >
          {selected ? selectedLabel : placeholder}
        </span>
      </button>
      {open && options.length > 0 && (
        <ul
          role="listbox"
          className={cn(
            `absolute right-0 z-10 m-0 flex h-[151px] w-full list-none flex-col gap-[2px] rounded-[8px] border border-border-default bg-white p-0 pl-[11px] pr-[14px] pt-[11px] shadow-figma-dropdown ${menuPlacement === "above" ? "bottom-full mb-3" : "top-full mt-3"}`,
            menuClassName,
          )}
        >
          {options.map((item) => {
            const checked = selected === (item.value ?? item.label);
            return (
              <li
                key={item.value ?? item.label}
                role="option"
                aria-selected={checked}
                className={cn(
                  "flex h-[30px] items-center justify-end gap-2",
                  optionClassName,
                )}
                dir="ltr"
              >
                <span
                  dir="ltr"
                  className={cn(
                    "shrink-0 whitespace-nowrap text-right text-[16px] leading-[24px] tracking-[0.5px] font-[Roboto,system-ui,sans-serif] font-normal text-figma-input-option",
                    optionWidthClasses[item.width],
                    optionLabelClassName,
                  )}
                  dir={item.dir ?? optionLabelDir}
                  lang={item.lang ?? optionLabelLang}
                >
                  {item.label}
                </span>
                <input
                  type="radio"
                  checked={checked}
                  onChange={() => setValue(item.value ?? item.label)}
                  aria-label={item.label}
                  className={cn(
                    "size-5 appearance-none rounded-full border bg-white",
                    checked
                      ? "border-primary bg-[radial-gradient(circle,var(--color-primary)_0_5px,transparent_5px)]"
                      : "border-border-default",
                    radioClassName,
                  )}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
