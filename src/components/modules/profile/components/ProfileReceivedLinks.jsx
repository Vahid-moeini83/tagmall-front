"use client";
import Image from "next/image";
import {
  StrokeArrowLeftIcon,
  ArrowUpDownIcon,
  HintIcon,
  SquarePlusIcon2,
} from "@/icons";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import DialogWrapper from "@/components/ui/dialog";
import FilterReceivedLinksDrawer from "./FilterReceivedLinksDrawer";
import { DateRangeFilterContent } from "..";

// Mock products data for received links
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
  {
    id: 8,
    name: "پاوربانک 20000 میلی‌آمپری",
    img: "/assets/images/products/powerbank.png",
  },
];

const sortOptions = [
  { id: "newest", label: "جدیدترین" },
  { id: "most-viewed", label: "پربازدیدترین" },
  { id: "best-selling", label: "پر فروش ترین" },
];

export default function ProfileReceivedLinks({ setActiveSection }) {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("newest");
  const [showAvailable, setShowAvailable] = useState(true);
  const [dateRangeDialogOpen, setDateRangeDialogOpen] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showFilter, setShowFilter] = useState(true);
  const scrollContainerRef = useRef(null);

  // Mobile Drawer States
  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState([]);

  const handleGoBack = () => {
    router.back();
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
    // فعلا فقط چک میکنیم که فیلتر ترتیب نمایش تغییر کرده باشد
    return selectedFilter !== "newest";
  };

  const handleResetFilters = () => {
    setSelectedFilter("newest");
    setExpandedFilter([]);
  };

  const getFilterLabel = () => {
    const option = sortOptions.find((o) => o.id === selectedFilter);
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
        setShowFilter(false); // hide
      } else if (scrollTop < lastScrollTop) {
        setShowFilter(true); // show
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
          لینک های دریافت شده
        </h3>
        <HintIcon
          size={20}
          className="absolute left-0 cursor-pointer ml-4 lg:ml-0"
        />
      </div>

      {/* Filter section (Desktop) */}
      <div className="hidden lg:flex items-center gap-4 mb-8">
        <div className="flex items-center gap-5">
          <span className="font-semibold text-gray-600">پیشنهادات:</span>
          <div className="flex items-center gap-4 border-l-2 border-gray-300 pl-[10px]">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedFilter(option.id)}
                className={`transition-colors ${
                  selectedFilter === option.id
                    ? "text-primary"
                    : "text-gray-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setDateRangeDialogOpen(true)}
          className="text-gray-600 border-l-2 border-gray-300 pl-4 cursor-pointer"
        >
          بازه زمانی
        </button>
        <span className="text-primary border-2 border-primary rounded-full px-4 py-2 lg:border-0 lg:px-0 lg:py-0 cursor-pointer">
          کالای خاصی در نظر دارید؟
        </span>
      </div>

      {/* Filter button in mobile */}
      <div
        className={`lg:hidden inline-flex items-center justify-start gap-5 mb-6 pr-4 transition-all duration-300 ${
          true ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
      >
        <ArrowUpDownIcon size={20} />
        <span
          className="cursor-pointer"
          onClick={() => setIsFiltersDrawerOpen(true)}
        >
          <p className="text-gray-600 font-bold">
            اولویت نمایش:{" "}
            <span className="font-extralight">{getFilterLabel()}</span>
          </p>
        </span>
      </div>

      {/* Scrollable content area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scroll-hidden"
      >
        {/* Partnership button */}
        <button
          onClick={() => setActiveSection("partnership")}
          className="relative lg:hidden w-full max-w-[480px] text-center border-2 border-gray-200 rounded-lg h-10 mb-[10px]"
        >
          <SquarePlusIcon2
            size={20}
            className="absolute top-1/2 -translate-y-1/2 right-4"
          />
          <p className="text-sm text-gray-600">پیشنهادات مشارکت در فروش</p>
        </button>

        {/* Products list */}
        <div className="space-y-[10px] lg:space-y-8 pb-4">
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-start lg:items-center border-2 border-gray-200 rounded-lg lg:border-0 py-[10px] lg:py-0 gap-2 lg:grid lg:grid-cols-2 lg:border-b-2 lg:border-gray-200 lg:pb-8"
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
              <div className="w-full space-y-3 lg:space-y-6">
                <p className="font-bold text-gray-600 text-xs lg:text-base line-clamp-1">
                  {product.name}
                </p>
                {/* <div className="text-gray-600 text-xs lg:text-base">
                  <span className="font-bold">سود مشارکت در فروش</span> 1 درصد به
                  ازای فروش هر کالا
                </div> */}
                <div className="font-extralight text-gray-600 text-xs lg:text-base">
                  <span className="font-bold">وضعیت</span> موجود
                </div>
                <div className="text-gray-400 text-xs lg:text-base">
                  بازدید 1000، خرید موفق 10 بار
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer section */}
      <div className="fixed right-0 left-0 bottom-0 flex items-center gap-4 lg:items-center lg:justify-center px-[10px] lg:px-[140px] pt-2 pb-7 lg:pb-12 bg-white">
        <StrokeArrowLeftIcon
          size={20}
          className="hidden lg:block absolute bottom-16 right-16 cursor-pointer rotate-180"
          onClick={handleGoBack}
        />
        <div className="w-full flex flex-col lg:items-center gap-4">
          <span className="hidden lg:block font-semibold text-gray-600 text-center">
            کاربر محترم سود مشارکت در فروش پس از{" "}
            <span className="text-primary">بازه زمانی مرجوع شدن سفارش</span> به
            کیف پول اعتباری شما واریز می‌شود
          </span>
          <button className="w-full lg:w-auto text-primary text-center border-2 border-primary rounded-full px-4 py-2 cursor-pointer">
            سود مشارکت در فروش
          </button>
        </div>
      </div>

      {/* Date range desktop dialog */}
      <DialogWrapper
        isOpen={dateRangeDialogOpen}
        onClose={() => setDateRangeDialogOpen(false)}
      >
        <DateRangeFilterContent
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
        />
      </DialogWrapper>

      {/* Mobile Filters Drawer */}
      <FilterReceivedLinksDrawer
        isOpen={isFiltersDrawerOpen}
        onClose={() => setIsFiltersDrawerOpen(false)}
        expandedFilter={expandedFilter}
        onFilterToggle={handleFilterToggle}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        hasFiltersChanged={hasFiltersChanged}
        onResetFilters={handleResetFilters}
        options={sortOptions}
        showAvailable={showAvailable}
        setShowAvailable={setShowAvailable}
      />
    </div>
  );
}
