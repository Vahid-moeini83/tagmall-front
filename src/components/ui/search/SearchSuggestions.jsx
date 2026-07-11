"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MoreSquareIcon, LocateIcon, StrokeArrowLeftIcon } from "@/icons";
import usePublicStore from "@/app/store/publicStore";
import Image from "next/image";
import { addToSearchHistory } from "@/lib/server/actions/search";
import { getToken } from "@/lib/server/cookies";
import { v4 as uuidv4 } from "uuid";
import SearchSkeleton from "../loading/search/SearchSkeleton";

// Get or create persistent user search ID
const getUserSearchId = () => {
  if (typeof window === "undefined") return null;

  let userSearchId = localStorage.getItem("userSearchId");
  if (!userSearchId) {
    userSearchId = uuidv4();
    localStorage.setItem("userSearchId", userSearchId);
  }
  return userSearchId;
};

function SearchSuggestions({
  searchQuery,
  suggestions = [],
  isLoading = false,
}) {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [searchIdentifier, setSearchIdentifier] = useState(null);
  const setShowSearchResultBox = usePublicStore(
    (s) => s.setShowSearchResultBox,
  );
  const setSearchBoxOpen = usePublicStore((s) => s.setSearchBoxOpen);

  // Generate search identifier on mount
  useEffect(() => {
    setSearchIdentifier(uuidv4());
  }, []);

  const toggleCategory = (categoryId) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const handleLocationClick = (item) => {
    setShowSearchResultBox(true, item);
    setSearchBoxOpen(false);
  };

  const handleItemClick = async (item) => {
    // Get token and userSearchId
    const token = await getToken();
    const userSearchId = getUserSearchId();

    // Prepare data for API
    const historyData = {
      keyword: searchQuery,
      search_identifier: searchIdentifier,
      category_ids: item.type === "category" ? { [item.id]: [] } : {},
      product_ids: item.type === "product" ? [item.id] : [],
    };

    // Add item to history API
    const { addToSearchHistoryRes, addToSearchHistoryErr } =
      await addToSearchHistory(historyData, token, userSearchId);

    if (addToSearchHistoryRes) {
      console.log("Add to history res: ", addToSearchHistoryRes);
    } else if (addToSearchHistoryErr) {
      console.log("Add to history err: ", addToSearchHistoryErr);
    }

    setSearchBoxOpen(false);
  };

  const handleBrandClick = async (brand, categoryId) => {
    // Get token and userSearchId
    const token = await getToken();
    const userSearchId = getUserSearchId();

    // Prepare data for API
    const historyData = {
      keyword: searchQuery,
      search_identifier: searchIdentifier,
      category_ids: { [categoryId]: [] },
      product_ids: [],
    };

    // Call API
    await addToSearchHistory(historyData, token, userSearchId);

    // Close search box
    setSearchBoxOpen(false);
  };

  const filteredSuggestions = suggestions.filter((item) =>
    item.name.includes(searchQuery),
  );

  return (
    <div className="flex-1 overflow-y-auto lg:py-4 scroll-hidden">
      <h3 className="text-primary font-bold mb-5 text-sm lg:text-base lg:px-4">
        پیشنهادات جستجو
      </h3>

      {isLoading ? (
        <SearchSkeleton />
      ) : filteredSuggestions.length === 0 ? (
        <div className="p-4 text-center text-gray-500 text-sm lg:text-base">
          نتیجه‌ای برای &quot;{searchQuery}&quot; یافت نشد
        </div>
      ) : (
        <div className="flex flex-col gap-2 lg:px-[6px]">
          {filteredSuggestions.map((item) => (
            <>
              <div
                key={item.id}
                className={`overflow-hidden transition-all duration-300 ${
                  expandedCategory === item.id
                    ? "bg-gray-200 rounded-lg px-[10px] lg:pr-[10px] lg:pl-[6px] py-4"
                    : ""
                }`}
              >
                <div
                  className={`flex items-center justify-between py-3 ${expandedCategory === item.id ? "" : "pl-[10px] lg:pr-[10px] lg:pl-[6px]"} transition-all duration-300 ease-in-out group`}
                >
                  <Link
                    href={item.type === "category" ? `/search/${item.id}` : "#"}
                    onClick={() => handleItemClick(item)}
                    className={`flex-1 transition-all duration-300 ${
                      expandedCategory === item.id ? "text-center" : ""
                    }`}
                  >
                    <div className="text-gray-600 hover:text-primary text-sm lg:text-base">
                      <span className="font-black text-gray-700">
                        گروه کالایی
                      </span>{" "}
                      {item.name}
                    </div>
                    {item.price_range && (
                      <div className="text-xs text-gray-600 mt-1">
                        <span className="font-bold">محدوده قیمت</span>{" "}
                        {item.price_range.from?.toLocaleString() || "0"} تا{" "}
                        {item.price_range.to?.toLocaleString() || "0"} تومان
                      </div>
                    )}
                  </Link>
                  <div className="flex items-center gap-2">
                    {item.type === "category" &&
                      (expandedCategory === null ||
                        expandedCategory === item.id) && (
                        <button
                          onClick={() => toggleCategory(item.id)}
                          className="flex items-center justify-center cursor-pointer"
                        >
                          {expandedCategory === item.id ? (
                            <StrokeArrowLeftIcon
                              size={20}
                              className="transition-all duration-300 ease-in-out"
                            />
                          ) : (
                            <MoreSquareIcon
                              size={20}
                              className="transition-all duration-300 ease-in-out"
                            />
                          )}
                        </button>
                      )}
                  </div>
                </div>

                {item.type === "category" && item.brands && (
                  <div
                    className={`flex flex-col gap-1 transition-all duration-300 ease-in-out origin-top overflow-y-auto overscroll-contain ${
                      expandedCategory === item.id
                        ? "max-h-72 opacity-100 mt-1 pb-2"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.brands.map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/search/${brand.id}`}
                        onClick={() => handleBrandClick(brand, item.id)}
                        className="py-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out block"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative w-10 h-10">
                            <Image
                              src={
                                brand.image?.file_path ||
                                "/assets/images/fallback/no-photo.jpg"
                              }
                              fill
                              alt="brand"
                              className="object-cover rounded-md"
                              quality={100}
                            />
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-600 hover:text-primary text-sm lg:text-base block">
                              {brand.name}
                            </span>
                            {brand.price_range && (
                              <div className="text-xs text-gray-600 mt-1">
                                محدوده قیمت{" "}
                                <span className="font-bold">
                                  {brand.price_range.from?.toLocaleString() ||
                                    "0"}
                                </span>{" "}
                                تا{" "}
                                <span className="font-bold">
                                  {brand.price_range.to?.toLocaleString() ||
                                    "0"}
                                </span>{" "}
                                تومان
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {item.type === "category" && (
                <Link
                  key={`${item.id}-location`}
                  href="/"
                  onClick={() => handleLocationClick(item?.name)}
                  className="overflow-hidden transition-all duration-300"
                >
                  <div className="py-3 pl-4 lg:px-[10px] transition-all duration-300 ease-in-out group">
                    <div className="text-gray-600 text-sm lg:text-base">
                      <span className="font-black text-gray-700">
                        موقعیت یابی گروه کالایی
                      </span>{" "}
                      {item.name}
                    </div>
                    {item.price_range && (
                      <div className="text-xs text-gray-600 mt-1">
                        <span className="font-bold">محدوده قیمت</span>{" "}
                        {item.price_range.from?.toLocaleString() || "0"} تا{" "}
                        {item.price_range.to?.toLocaleString() || "0"} تومان
                      </div>
                    )}
                  </div>
                </Link>
              )}
            </>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchSuggestions;
