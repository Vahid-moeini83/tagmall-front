"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import Image from "next/image";
import { SearchIcon, CloseSquareIcon } from "@/icons";

const SearchInput = forwardRef(function SearchInput(
  {
    placeholder = "برند، کالا، لوازم جانبی، قطعات",
    value: controlledValue,
    onChange: controlledOnChange,
    autoFocus = false,
    showSearchIcon = true,
    hasLogo = false,
    readOnly = false,
    bgColor = "bg-gray-200",
    className = "",
    onClick,
    maxWidth = "max-w-[540px]",
  },
  ref,
) {
  const [internalValue, setInternalValue] = useState("");
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => inputRef.current);

  // Use controlled value if provided, otherwise use internal state
  const searchValue =
    controlledValue !== undefined ? controlledValue : internalValue;
  const handleChange = controlledOnChange || setInternalValue;

  const handleClearSearch = () => {
    handleChange("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={`${maxWidth} relative flex items-center ${bgColor} rounded-lg ${className} ${readOnly && onClick ? "cursor-pointer" : ""}`}
      onClick={readOnly && onClick ? onClick : undefined}
    >
      {hasLogo && (
        <Image
          src="/assets/images/logo/small-logo.svg"
          width={30}
          height={30}
          alt="logo"
          className="absolute right-2.5 pointer-events-none"
        />
      )}
      <input
        ref={inputRef}
        type="text"
        enterKeyHint="search"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => handleChange(e.target.value)}
        readOnly={readOnly}
        // text-base (16px) prevents iOS auto-zoom on focus
        className={`w-full py-3 px-4 text-center text-gray-600 placeholder:text-gray-400 bg-transparent focus:outline-none touch-manipulation ${readOnly && onClick ? "cursor-pointer" : ""}`}
        autoFocus={autoFocus}
        onClick={readOnly && onClick ? onClick : undefined}
      />
      {searchValue && !readOnly ? (
        <button
          type="button"
          onClick={handleClearSearch}
          className="absolute left-2.5 w-5 h-5 cursor-pointer"
          aria-label="پاک کردن جستجو"
        >
          <CloseSquareIcon size={20} />
        </button>
      ) : (
        showSearchIcon && (
          <SearchIcon className="absolute left-2.5 w-5 h-5 pointer-events-none" />
        )
      )}
    </div>
  );
});

export default SearchInput;
