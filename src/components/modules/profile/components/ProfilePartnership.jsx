"use client";
import Image from "next/image";
import {
  ArrowRightIcon,
  ArrowUpDownIcon,
  HintIcon,
  StrokeArrowLeftIcon,
} from "@/icons";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PartnershipHintDialog } from "@/components/ui/dialog";
import FilterPartnershipDrawer from "./FilterPartnershipDrawer";

// Mock products data for partnership
const mockProducts = [
  {
    id: 1,
    name: "هدفون بی‌سیم شیائومی مدل 11 pro",
    img: "/assets/images/products/headphone.png",
  },
  {
    id: 2,
    name: "ماوس بی‌سیم لاجیتک",
    img: "/assets/images/products/mouse.png",
  },
  {
    id: 3,
    name: "پاوربانک 20000 میلی‌آمپری",
    img: "/assets/images/products/powerbank.png",
  },
  {
    id: 4,
    name: "پاوربانک 20000 میلی‌آمپری",
    img: "/assets/images/products/powerbank.png",
  },
  {
    id: 5,
    name: "پاوربانک 20000 میلی‌آمپری",
    img: "/assets/images/products/powerbank.png",
  },
  {
    id: 6,
    name: "پاوربانک 20000 میلی‌آمپری",
    img: "/assets/images/products/powerbank.png",
  },
  {
    id: 7,
    name: "پاوربانک 20000 میلی‌آمپری",
    img: "/assets/images/products/powerbank.png",
  },
];

const partnershipOptions = [
  { id: "most-viewed", label: "پربازدیدترین" },
  { id: "best-selling", label: "پرفروش ترین" },
];

export default function ProfilePartnership({ setActiveSection, setIsOpen }) {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("most-viewed");
  const [isHintBoxOpen, setIsHintBoxOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(true);
  const scrollContainerRef = useRef(null);

  // Mobile Drawer States
  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState([]);

  const handleGoBack = () => {
    setIsOpen(false);
  };

  // Mobile Filter Handlers
  const handleFilterToggle = (filterId) => {
    setExpandedFilter((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId],
    );
  };

  const hasFiltersChanged = () => {
    return selectedFilter !== "most-viewed";
  };

  const handleResetFilters = () => {
    setSelectedFilter("most-viewed");
    setExpandedFilter([]);
  };

  const getFilterLabel = () => {
    const option = partnershipOptions.find((o) => o.id === selectedFilter);
    return option ? option.label : "پیشنهادات";
  };

  // Handle scroll to change filter button opacity
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let lastScrollTop = 0;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;

      if (scrollTop > lastScrollTop) {
        setShowFilter(false);
      } else if (scrollTop < lastScrollTop) {
        setShowFilter(true);
      }

      lastScrollTop = scrollTop;
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col justify-between h-full pt-3 pb-20 lg:pt-[50px] lg:pb-24 lg:px-[140px]">
      {/* Header section */}
      <div className="relative flex items-center justify-center lg:justify-start mb-6 lg:mb-8">
        <h3 className="font-bold text-primary text-base lg:text-xl">
          مشارکت در فروش
        </h3>
        <HintIcon
          onClick={() => setIsHintBoxOpen(true)}
          size={20}
          className="absolute left-0 cursor-pointer ml-4 lg:ml-0"
        />
      </div>

      {/* Filter section (Desktop) */}
      <div className="hidden lg:flex items-center gap-5 mb-8">
        <span className="font-bold text-gray-600">پیشنهادات:</span>
        <div className="flex items-center gap-4 border-l border-gray-300 pl-[10px]">
          {partnershipOptions?.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedFilter(option.id)}
              className={`font-extralight transition-colors ${
                selectedFilter === option.id ? "text-primary" : "text-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <button className="text-primary border-2 border-primary rounded-full px-4 py-2 lg:border-0 lg:px-0 lg:py-0 cursor-pointer">
          کالای خاصی در نظر دارید؟
        </button>
      </div>

      {/* Filter button in mobile */}
      <div
        className={`lg:hidden text-sm flex items-center gap-5 mb-8 pr-4 cursor-pointer transition-all duration-300 ${
          true ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
        onClick={() => setIsFiltersDrawerOpen(true)}
      >
        <ArrowUpDownIcon size={20} />
        <p className="text-gray-600 font-bold">
          پیشنهادات: <span className="font-extralight">{getFilterLabel()}</span>
        </p>
      </div>

      {/* Scrollable content area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scroll-hidden"
      >
        {/* Slogan */}
        <p className="lg:hidden font-iransans text-gray-600 text-center mb-5">
          با مشارکت در فروش ما قدرت خرید شما را بیش تر می کنیم
        </p>
        {/* Products list */}
        <div className="space-y-3 lg:space-y-8 pb-4">
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-start gap-2 border-2 border-gray-200 rounded-lg py-[10px] lg:border-0 lg:py-0 lg:grid lg:grid-cols-2 lg:border-b-2 lg:border-gray-200 pb-0 lg:pb-8"
            >
              {/* Product image */}
              <div className="flex justify-center items-center">
                <div className="relative w-20 h-20 lg:w-50 lg:h-50 rounded-lg overflow-hidden">
                  <Image
                    src={product.img || "/assets/images/fallback/no-photo.jpg"}
                    fill
                    alt={product.name}
                    className="object-contain"
                  />
                </div>
              </div>
              {/* Product Info */}
              <div className="w-full space-y-3 lg:space-y-4">
                <p className="font-bold text-gray-600 text-xs lg:text-base line-clamp-1">
                  {product.name}
                </p>
                <div className="font-extralight flex items-center gap-1 text-gray-600 text-xs lg:text-base">
                  <span className="font-bold">سود مشارکت در فروش</span> 1 درصد
                  به ازای فروش هر کالا
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer section */}
      <div className="fixed right-0 left-0 bottom-0 flex items-center justify-center gap-4 lg:items-center lg:justify-center px-[10px] lg:px-[140px] pt-2 pb-7 lg:pb-12 bg-white">
        <StrokeArrowLeftIcon
          size={20}
          className="hidden lg:block absolute bottom-16 right-16 cursor-pointer rotate-180"
          onClick={handleGoBack}
        />
        <div className="w-full flex flex-col items-center gap-4">
          <span className="hidden lg:block font-iransans font-semibold text-gray-600 text-center">
            با مشارکت در فروش، ما قدرت خرید شما را بیش تر می کنیم
          </span>
          <button
            onClick={() => setActiveSection("links")}
            className="w-full lg:w-auto text-primary border-2 border-primary rounded-full px-4 py-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            لینک های دریافت شده
          </button>
        </div>
      </div>

      {/* Hint box */}
      <PartnershipHintDialog
        open={isHintBoxOpen}
        setIsHintBoxOpen={setIsHintBoxOpen}
      />

      {/* Mobile Filters Drawer */}
      <FilterPartnershipDrawer
        isOpen={isFiltersDrawerOpen}
        onClose={() => setIsFiltersDrawerOpen(false)}
        expandedFilter={expandedFilter}
        onFilterToggle={handleFilterToggle}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        hasFiltersChanged={hasFiltersChanged}
        onResetFilters={handleResetFilters}
        options={partnershipOptions}
      />
    </div>
  );
}
