"use client";

import { useState, useEffect } from "react";
import SearchHistory from "./SearchHistory";
import SearchSuggestions from "./SearchSuggestions";
import SearchInput from "./SearchInput";

function SearchBox({ isOpen, onClose, initialValue = "" }) {
  const [searchValue, setSearchValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) {
      setSearchValue(initialValue);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const showHistory = searchValue.trim().length < 2;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed hidden lg:block inset-0 bg-black/20 backdrop-blur-sm z-60"
        onClick={onClose}
      />

      {/* Mobile Full Screen Layout */}
      <div className="fixed inset-x-0 top-0 bottom-[72px] max-h-[calc(100vh-72px)] overflow-hidden z-60 bg-white flex flex-col lg:hidden">
        {/* Search Input */}
        <div className="px-2.5 mt-8 mb-9">
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            placeholder="برند، کالا، لوازم جانبی، قطعات"
            autoFocus
          />
        </div>

        {/* Content Area with Bottom Box */}
        <div className="flex-1 flex flex-col px-2.5 pb-2.5 overflow-hidden">
          <div className="flex-1 overflow-hidden flex flex-col">
            {showHistory ? (
              <SearchHistory />
            ) : (
              <SearchSuggestions searchQuery={searchValue} />
            )}
          </div>
        </div>
      </div>

      {/* Desktop Positioned Layout */}
      <div className="hidden lg:block">
        <div className="fixed top-[25px] right-[140px] z-60 w-full max-w-[495px] bg-white rounded-t-md shadow-lg">
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            placeholder="برند، کالا، لوازم جانبی، قطعات"
            autoFocus
            bgColor="bg-white"
            className="rounded-t-md py-1"
          />
        </div>

        <div className="fixed top-[calc(25px+60px)] right-[140px] z-60 w-full max-w-[495px] bg-white rounded-b-lg shadow-lg max-h-[600px] overflow-hidden flex flex-col animate-slide-in-down">
          {showHistory ? (
            <SearchHistory />
          ) : (
            <SearchSuggestions searchQuery={searchValue} />
          )}
        </div>
      </div>
    </>
  );
}

export default SearchBox;
