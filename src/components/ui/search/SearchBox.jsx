"use client";

import { useState, useEffect, useRef } from "react";
import SearchHistory from "./SearchHistory";
import SearchSuggestions from "./SearchSuggestions";
import SearchInput from "./SearchInput";
import http from "@/app/api/axiosInstance";
import usePublicStore from "@/app/store/publicStore";

function SearchBox({ isOpen, onClose, isHomePage = true }) {
  const searchDeafaultValue = usePublicStore((s) => s.searchValue);
  const [searchValue, setSearchValue] = useState(searchDeafaultValue);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const mobileInputRef = useRef(null);

  const fetchSuggestions = async (keyword) => {
    if (keyword.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);

    try {
      const response = await http({
        url: "/search",
        method: "POST",
        data: { keyword },
        headers: {
          "Use-Random-Price-Range": 1,
        },
      });
      const { products = [], categories = [] } = response.data.data;

      const combinedData = [
        ...categories.map((cat) => ({ ...cat, type: "category" })),
        ...products.map((prod) => ({ ...prod, type: "product" })),
      ];

      setSuggestions(combinedData);
    } catch (err) {
      console.log("ERRRRRRRRRRR: ", err);
    }

    setIsLoadingSuggestions(false);
  };

  useEffect(() => {
    if (isOpen) {
      setSearchValue(searchDeafaultValue);
      if (searchDeafaultValue.trim().length >= 2) {
        fetchSuggestions(searchDeafaultValue);
      }

      const focusTimer = window.setTimeout(() => {
        mobileInputRef.current?.focus?.();
      }, 50);

      return () => window.clearTimeout(focusTimer);
    }
  }, [isOpen, searchDeafaultValue]);

  useEffect(() => {
    if (searchValue.trim().length >= 2) {
      const timeoutId = setTimeout(() => {
        fetchSuggestions(searchValue);
      }, 300);
      return () => clearTimeout(timeoutId);
    }

    setSuggestions([]);
  }, [searchValue]);

  if (!isOpen) return null;

  const showHistory = searchValue.trim().length < 2;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm ${isHomePage ? "hidden lg:block z-60" : "z-50"}`}
        onClick={onClose}
      />

      <div className="fixed inset-x-0 top-0 bottom-[72px] max-h-[calc(100vh-72px)] overflow-hidden z-60 bg-white flex flex-col lg:hidden">
        <div className="px-2.5 mt-8 mb-9">
          <SearchInput
            ref={mobileInputRef}
            value={searchValue}
            onChange={setSearchValue}
            placeholder="برند، کالا، لوازم جانبی، قطعات"
            hasLogo
            autoFocus
          />
        </div>

        <div className="flex-1 flex flex-col px-2.5 pb-2.5 overflow-hidden">
          <div className="flex-1 overflow-hidden flex flex-col">
            {showHistory ? (
              <SearchHistory />
            ) : (
              <SearchSuggestions
                searchQuery={searchValue}
                suggestions={suggestions}
                isLoading={isLoadingSuggestions}
              />
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        {isHomePage ? (
          <>
            <div className="fixed top-[25px] right-[140px] z-60 w-full max-w-[495px] bg-white rounded-t-md shadow-lg">
              <SearchInput
                value={searchValue}
                onChange={setSearchValue}
                placeholder="برند، کالا، لوازم جانبی، قطعات"
                autoFocus
                hasLogo
                bgColor="bg-white"
                className="rounded-t-md py-1"
              />
            </div>

            <div className="fixed top-[calc(25px+60px)] right-[140px] z-60 w-full max-w-[495px] bg-white rounded-b-lg shadow-lg max-h-[600px] overflow-hidden flex flex-col animate-slide-in-down">
              {showHistory ? (
                <SearchHistory />
              ) : (
                <SearchSuggestions
                  searchQuery={searchValue}
                  suggestions={suggestions}
                  isLoading={isLoadingSuggestions}
                />
              )}
            </div>
          </>
        ) : (
          <>
            <div className="fixed top-[25px] right-[140px] z-60 w-full max-w-[642px] bg-white rounded-t-md shadow-lg">
              <SearchInput
                value={searchValue}
                onChange={setSearchValue}
                placeholder="برند، کالا، لوازم جانبی، قطعات"
                autoFocus
                hasLogo={false}
                bgColor="bg-white"
                className="rounded-t-md py-1"
                maxWidth="w-full"
              />
            </div>

            <div className="fixed top-[calc(25px+60px)] right-[140px] z-60 w-full max-w-[642px] bg-white rounded-b-lg shadow-lg max-h-[600px] overflow-hidden flex flex-col animate-slide-in-down">
              {showHistory ? (
                <SearchHistory />
              ) : (
                <SearchSuggestions
                  searchQuery={searchValue}
                  suggestions={suggestions}
                  isLoading={isLoadingSuggestions}
                />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default SearchBox;
