"use client";

import { useState } from "react";
import { SearchIcon, CloseSquareIcon } from "@/icons";
import SearchHistory from "./SearchHistory";
import SearchSuggestions from "./SearchSuggestions";
import Image from "next/image";

function SearchBox({ isOpen, onClose }) {
  const [searchValue, setSearchValue] = useState("");

  if (!isOpen) return null;

  const showHistory = searchValue.trim().length < 2;

  const handleClearSearch = () => {
    setSearchValue("");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed hidden lg:block inset-0 bg-black/20 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Mobile Full Screen Layout */}
      <div className="fixed inset-x-0 top-0 bottom-[72px] max-h-[calc(100vh-72px)] overflow-hidden z-[60] bg-white flex flex-col lg:hidden">
        {/* Logo at top */}
        <div className="flex items-center justify-end p-4">
          <Image
            src="/assets/images/logo/main-logo.svg"
            width={80}
            height={40}
            alt="TagMall Logo"
            className="object-contain"
          />
        </div>

        {/* Search Input */}
        <div className="px-2.5 mb-4">
          <div className="relative flex items-center bg-gray-100 rounded-md">
            <input
              type="text"
              placeholder="برند، کالا، لوازم جانبی، قطعات"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full py-3 px-4 text-center text-sm text-gray-800 placeholder:text-gray-600 bg-transparent focus:outline-none"
              autoFocus
            />
            {searchValue ? (
              <button
                onClick={handleClearSearch}
                className="absolute left-4 w-5 h-5 cursor-pointer"
              >
                <CloseSquareIcon size={20} />
              </button>
            ) : (
              <SearchIcon className="absolute left-4 w-5 h-5 pointer-events-none" />
            )}
          </div>
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
        <div className="fixed top-[25px] right-[140px] z-[60] w-full max-w-[495px] bg-white rounded-t-md shadow-lg">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="برند، کالا، لوازم جانبی، قطعات"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full py-4 px-4 text-center text-gray-800 placeholder:text-gray-400 rounded-t-md focus:outline-none"
              autoFocus
            />
            {searchValue ? (
              <button
                onClick={handleClearSearch}
                className="absolute left-4 w-5 h-5 cursor-pointer"
              >
                <CloseSquareIcon size={20} />
              </button>
            ) : (
              <SearchIcon className="absolute left-4 w-5 h-5 pointer-events-none" />
            )}
          </div>
        </div>

        <div className="fixed top-[calc(25px+60px)] right-[140px] z-[60] w-full max-w-[495px] bg-white rounded-b-lg shadow-lg max-h-[600px] overflow-hidden flex flex-col animate-slide-in-down">
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
