"use client";

import { CloseSquareIcon } from "@/icons";
import usePublicStore from "@/app/store/publicStore";

function SearchResultBox({
  isMobile = false,
  searchTerm = null,
  standalone = false,
}) {
  const showSearchResultBox = usePublicStore((s) => s.showSearchResultBox);
  const searchResultData = usePublicStore((s) => s.searchResultData);
  const setShowSearchResultBox = usePublicStore(
    (s) => s.setShowSearchResultBox,
  );

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

  if (isMobile) {
    return (
      <div className="bg-white grid grid-cols-[2.7fr_0.3fr] py-3 px-2 rounded-lg shadow-md w-full animate-slide-in-down">
        <div className="text-gray-600 text-center font-semibold">
          گروه کالایی{" "}
          <span className="font-extralight">
            {searchResultData?.name || "گوشی موبایل"}
          </span>
        </div>
        <button
          onClick={() => setShowSearchResultBox(false)}
          className="text-left cursor-pointer hover:scale-110 transition-transform duration-200"
        >
          <CloseSquareIcon size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-7 left-30 xl:left-48 h-[50px] items-center w-96 xl:w-120 z-50 bg-white grid grid-cols-[2.8fr_0.2fr] px-2 rounded-lg shadow-md animate-slide-in-down">
      <div className="text-gray-600 text-center font-semibold">
        گروه کالایی{" "}
        <span className="font-extralight">
          {searchResultData?.name || "گوشی موبایل"}
        </span>
      </div>
      <button
        onClick={() => setShowSearchResultBox(false)}
        className="text-left cursor-pointer hover:scale-110 transition-transform duration-200"
      >
        <CloseSquareIcon size={20} />
      </button>
    </div>
  );
}

export default SearchResultBox;
