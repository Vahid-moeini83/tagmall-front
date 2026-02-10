"use client";

import { CloseSquareIcon } from "@/icons";
import usePublicStore from "@/app/store/publicStore";

function SearchResultBox({ isMobile = false }) {
  const showSearchResultBox = usePublicStore((s) => s.showSearchResultBox);
  const searchResultData = usePublicStore((s) => s.searchResultData);
  const setShowSearchResultBox = usePublicStore(
    (s) => s.setShowSearchResultBox,
  );

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
    <div className="absolute top-4 left-30 xl:left-32 w-96 xl:w-120 z-50 bg-white grid grid-cols-[2.7fr_0.3fr] py-3 px-2 rounded-lg shadow-md animate-slide-in-down">
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
