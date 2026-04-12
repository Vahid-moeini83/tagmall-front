"use client";

import { CloseSquareIcon } from "@/icons";
import usePublicStore from "@/app/store/publicStore";
import SearchBox from "./SearchBox";

function SearchResultBox({ searchTerm = null, standalone = false }) {
  const showSearchResultBox = usePublicStore((s) => s.showSearchResultBox);
  const searchResultData = usePublicStore((s) => s.searchResultData);
  const setShowSearchResultBox = usePublicStore(
    (s) => s.setShowSearchResultBox,
  );
  const setSearchBoxOpen = usePublicStore((s) => s.setSearchBoxOpen);
  const setSearchValue = usePublicStore((s) => s.setSearchValue);

  // Open search box with default value
  const handleSearchResultBoxClick = () => {
    setSearchValue(searchResultData);
    setSearchBoxOpen(true);
  };

  // Standalone mode for search results page
  if (standalone) {
    return (
      <div className="flex-1 max-w-[495px] bg-white h-[50px] flex items-center justify-center rounded-lg shadow-md">
        <div className="text-gray-600 text-center font-semibold">
          گروه کالایی{" "}
          <span className="font-extralight">{searchTerm || "گوشی موبایل"}</span>
        </div>
      </div>
    );
  }

  if (!showSearchResultBox || !searchResultData) return null;

  return (
    <div
      onClick={handleSearchResultBoxClick}
      className="relative flex items-center justify-center lg:top-7 lg:left-30 xl:left-48 lg:h-[50px] w-full lg:w-96 xl:w-120 z-50 bg-white px-2 py-3 lg:py-0 rounded-lg shadow-md animate-slide-in-down"
    >
      <div className="text-gray-600 text-center font-semibold">
        گروه کالایی{" "}
        <span className="font-extralight">{searchResultData || "نامشخص"}</span>
      </div>
      <button
        onClick={() => setShowSearchResultBox(false)}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-left cursor-pointer hover:scale-110 transition-transform duration-200"
      >
        <CloseSquareIcon size={20} />
      </button>
    </div>
  );
}

export default SearchResultBox;
