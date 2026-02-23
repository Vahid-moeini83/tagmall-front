"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreSquareIcon,
  LocateIcon,
  LookingAvatarIcon,
  StrokeArrowLeftIcon,
} from "@/icons";
import usePublicStore from "@/app/store/publicStore";
import Image from "next/image";

// Mock data - بعداً از API میاد
const mockSearchSuggestions = [
  {
    id: 1,
    type: "category",
    name: "گوشی موبایل",
    brands: [
      { id: 11, name: "سامسونگ" },
      { id: 12, name: "اپل" },
      { id: 13, name: "شیائومی" },
      { id: 14, name: "هوآوی" },
    ],
  },
  {
    id: 2,
    type: "product",
    name: "گوشی سامسونگ گلکسی S24",
  },
  {
    id: 3,
    type: "category",
    name: "گوشواره",
    brands: [
      { id: 31, name: "طلای مهر" },
      { id: 32, name: "گالری زرین" },
    ],
  },
  {
    id: 4,
    type: "product",
    name: "گوشی اپل آیفون 15 پرو",
  },
];

function SearchSuggestions({ searchQuery }) {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const router = useRouter();
  const setShowSearchResultBox = usePublicStore(
    (s) => s.setShowSearchResultBox,
  );
  const setSearchBoxOpen = usePublicStore((s) => s.setSearchBoxOpen);

  const toggleCategory = (categoryId) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const handleLocationClick = (item) => {
    setShowSearchResultBox(true, item);
    setSearchBoxOpen(false);
    router.push("/");
  };

  const filteredSuggestions = mockSearchSuggestions.filter((item) =>
    item.name.includes(searchQuery),
  );

  if (filteredSuggestions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm lg:text-base">
        نتیجه‌ای برای &quot;{searchQuery}&quot; یافت نشد
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto lg:p-4">
      <h3 className="text-primary font-bold mb-6 text-sm lg:text-base">
        پیشنهادات جستجو
      </h3>

      <div className="flex flex-col gap-2">
        {filteredSuggestions.map((item) => (
          <div
            key={item.id}
            className={`overflow-hidden transition-all duration-300 ${
              expandedCategory === item.id
                ? "bg-gray-200 rounded-lg px-[10px] py-4"
                : ""
            }`}
          >
            <div className="flex items-center justify-between py-3 pl-2.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-300 ease-in-out group">
              <div
                className={`flex-1 transition-all duration-300 ${
                  expandedCategory === item.id ? "text-center" : ""
                }`}
              >
                <span className="text-gray-600 hover:text-primary text-sm lg:text-base">
                  {expandedCategory === item.id && item.type === "category" ? (
                    <>
                      <span className="font-black">گروه کالایی</span>{" "}
                      {item.name}
                    </>
                  ) : (
                    item.name
                  )}
                </span>
                <div className="text-xs text-gray-600 mt-1">
                  <span className="font-bold">محدوده قیمت</span> 20,000 تا
                  1,200,000 تومان
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.type === "category" &&
                  (expandedCategory === null ||
                    expandedCategory === item.id) && (
                    <>
                      {expandedCategory !== item.id && (
                        <button
                          onClick={() => handleLocationClick(item)}
                          className="flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110"
                        >
                          <LocateIcon size={20} color="currentColor" />
                        </button>
                      )}
                      <button
                        onClick={() => toggleCategory(item.id)}
                        className="flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110"
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
                    </>
                  )}
              </div>
            </div>

            {item.type === "category" && (
              <div
                className={`flex flex-col gap-1 transition-all duration-300 ease-in-out origin-top ${
                  expandedCategory === item.id
                    ? "max-h-96 opacity-100 mt-1"
                    : "max-h-0 opacity-0"
                }`}
              >
                {item.brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="py-2  hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 ease-in-out"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-10 h-10">
                        <Image
                          src="/assets/images/fallback/brand.png"
                          fill
                          alt="brand"
                          className="object-cover"
                          quality={100}
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-600 hover:text-primary text-sm lg:text-base block">
                          {brand.name}
                        </span>
                        <div className="text-xs text-gray-600 mt-1">
                          محدوده قیمت <span className="font-bold">20,000</span>{" "}
                          تا <span className="font-bold">1,200,000</span> تومان
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchSuggestions;
