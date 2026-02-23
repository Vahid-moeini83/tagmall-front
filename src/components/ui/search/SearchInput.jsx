"use client";

import { useState } from "react";
import Image from "next/image";
import { SearchIcon, CloseSquareIcon } from "@/icons";

function SearchInput({
  placeholder = "برند، کالا، لوازم جانبی، قطعات",
  value: controlledValue,
  onChange: controlledOnChange,
  autoFocus = false,
  showSearchIcon = true,
  readOnly = false,
  bgColor = "bg-gray-200",
  className = "",
}) {
  const [internalValue, setInternalValue] = useState("");

  // Use controlled value if provided, otherwise use internal state
  const searchValue =
    controlledValue !== undefined ? controlledValue : internalValue;
  const handleChange = controlledOnChange || setInternalValue;

  const handleClearSearch = () => {
    handleChange("");
  };

  return (
    <div
      className={`max-w-[495px] relative flex items-center ${bgColor} rounded-lg ${className}`}
    >
      <Image
        src="/assets/images/logo/small-logo.svg"
        width={30}
        height={30}
        alt="logo"
        className="absolute right-4"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => handleChange(e.target.value)}
        readOnly={readOnly}
        className="w-full py-3 px-4 text-center text-sm lg:text-base text-gray-600 placeholder:text-gray-400 bg-transparent focus:outline-none"
        autoFocus={autoFocus}
      />
      {searchValue && !readOnly ? (
        <button
          onClick={handleClearSearch}
          className="absolute left-4 w-5 h-5 cursor-pointer"
        >
          <CloseSquareIcon size={20} />
        </button>
      ) : (
        showSearchIcon && (
          <SearchIcon className="absolute left-4 w-5 h-5 pointer-events-none" />
        )
      )}
    </div>
  );
}

export default SearchInput;
