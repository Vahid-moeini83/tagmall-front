"use client";

import { useState } from "react";
import { Radio } from "@/components/ui/radio";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchIcon } from "@/icons";

const CustomOptions = ({
  type = "radio", // radio | checkbox
  options = [],
  value,
  onChange,
  hasBorder = false,
  searchable = false,
  searchPlaceholder = "",
  bottomButtonText,
  buttonOnClick,
  emptyText,
  containerClassName,
  onItemClick,
  renderLabel,
  centerLabel = false,
  newItemId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const isEmpty = options.length === 0;

  const filteredOptions = searchable
    ? options.filter((item) => item.label?.includes(searchQuery))
    : options;

  const isChecked = (id) =>
    type === "radio" ? value === id : value?.includes(id);

  const handleChange = (id) => {
    if (type === "radio") {
      onChange(id);
    } else {
      onChange(id);
    }
  };

  return (
    <div
      className={`bg-gray-200 rounded-lg overflow-hidden ${containerClassName}`}
    >
      {/* Search */}
      {searchable && !isEmpty && (
        <div className="relative px-2.5 py-3 border-b-2 border-white">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full text-gray-600 text-center placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
          <SearchIcon
            size={20}
            color="var(--color-gray-400)"
            className="absolute left-2.5 top-1/2 -translate-y-1/2"
          />
        </div>
      )}

      {/* Empty state */}
      {isEmpty && emptyText && (
        <p
          className={`text-center text-gray-600 pt-4 px-4 ${bottomButtonText ? "mb-4" : ""}`}
        >
          {emptyText}
        </p>
      )}

      {/* Options */}
      {!isEmpty &&
        filteredOptions.map((item, index) => (
          <div key={item.id}>
            <div className="flex items-start gap-[20px] p-4 relative">
              {type === "radio" ? (
                <Radio
                  checked={isChecked(item.id)}
                  onChange={() => handleChange(item.id)}
                  hasBorder={hasBorder}
                />
              ) : (
                <Checkbox
                  checked={isChecked(item.id)}
                  onChange={() => handleChange(item.id)}
                  hasBorder={hasBorder}
                  className={
                    item.isActive === false
                      ? "bg-gray-400! cursor-not-allowed"
                      : ""
                  }
                />
              )}

              <div
                className={`flex flex-col text-gray-600 flex-1 ${centerLabel ? "items-center" : ""} ${onItemClick ? "cursor-pointer" : ""}`}
                onClick={() => onItemClick?.(item)}
              >
                {renderLabel ? (
                  renderLabel(item)
                ) : (
                  <>
                    <span className={`${centerLabel ? "pl-10!" : ""}`}>
                      {item.label}
                    </span>

                    {item.extra && (
                      <div className="mt-6 flex flex-col gap-6 text-sm">
                        {item.extra.map((ex, i) => (
                          <p
                            key={i}
                            className={`font-light ${ex.className || "text-gray-600"}`}
                          >
                            {ex.label && (
                              <span className="font-bold">{ex.label}:</span>
                            )}{" "}
                            {ex.value}
                          </p>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Red circle for new item */}
              {item.id === newItemId && (
                <span className="block absolute w-[5px] h-[5px] rounded-full bg-error-medium top-1/2 -translate-y-1/2 left-[18px]"></span>
              )}
            </div>

            {index < filteredOptions.length - 1 && (
              <div className="w-full h-px border border-white mr-15" />
            )}
          </div>
        ))}

      {/* Bottom Button */}
      {bottomButtonText && (
        <div className="pb-2 px-[5px]">
          <button
            onClick={buttonOnClick}
            className="text-primary text-center w-full bg-white rounded-lg py-[10px]"
          >
            {bottomButtonText}
          </button>
        </div>
      )}
    </div>
  );
};

export { CustomOptions };
