"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@/icons";

function CustomAccordion({
  id,
  expandedItems,
  onToggle,
  alwaysOpen = false,
  label,
  customLabel,
  containerClassName,
  triggerClassName,
  iconClassName,
  labelClassName,
  contentClassName,
  children,
}) {
  const isOpen = alwaysOpen || expandedItems.includes(id);

  return (
    <div className={`${containerClassName}`}>
      <button
        onClick={() => onToggle(id)}
        className={`relative flex items-center justify-between w-full py-3 ${triggerClassName}`}
      >
        <div className="flex items-center gap-2">
          {customLabel ? (
            customLabel
          ) : (
            <span className={`text-primary font-bold! ${labelClassName}`}>
              {label}
            </span>
          )}
        </div>

        {isOpen ? (
          <ChevronUpIcon
            size={20}
            color="var(--color-gray-800)"
            className={`absolute left-[14px] ${iconClassName}`}
          />
        ) : (
          <ChevronDownIcon
            size={20}
            color="var(--color-gray-800)"
            className={`absolute left-[14px] ${iconClassName}`}
          />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {isOpen && <div>{children}</div>}
      </div>
    </div>
  );
}

export { CustomAccordion };
