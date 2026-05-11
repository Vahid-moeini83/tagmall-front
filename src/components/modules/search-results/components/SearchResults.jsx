"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AvailableProductsIcon, LocateIcon, ArrowUpDownIcon } from "@/icons";
import { SearchInput, SearchBox } from "@/components/ui/search";
import MainNavigation from "@/components/layout/navigation-menu/MainNavigation";
import BrandFilterDialog from "./BrandFilterDialog";
import PriceRangeDialog from "./PriceRangeDialog";
import SellerTypeDialog from "./SellerTypeDialog";
import SpecsFilterDialog from "./SpecsFilterDialog";
import FiltersDrawer from "./FiltersDrawer";
import FiltersSection from "./FiltersSection";
import ProductsList from "./ProductsList";
import usePublicStore from "@/app/store/publicStore";
import { formatPrice } from "@/lib/client/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";

const mockProducts = [
  {
    id: 1,
    name: "گوشی موبایل سامسونگ Galaxy S24 Ultra",
    img: "/assets/images/fallback/phone.png",
    minPrice: 42000000,
    maxPrice: 45000000,
    seller: {
      name: "فروشگاه دیجی‌کالا",
      profileImage: "/assets/images/fallback/brand.png",
    },
  },
  {
    id: 2,
    name: "گوشی موبایل اپل iPhone 15 Pro Max",
    img: "/assets/images/fallback/phone.png",
    minPrice: 63000000,
    maxPrice: 67000000,
    seller: {
      name: "فروشگاه موبایل سنتر",
      profileImage: "/assets/images/fallback/brand.png",
    },
  },
  {
    id: 3,
    name: "گوشی موبایل شیائومی Redmi Note 13 Pro",
    img: "/assets/images/fallback/phone.png",
    minPrice: 10000000,
    maxPrice: 12500000,
    seller: {
      name: "فروشگاه تکنو",
      profileImage: "/assets/images/fallback/brand.png",
    },
  },
];

function SearchResults() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const searchParams = useSearchParams();
  const viewType = searchParams.get("view"); // "accessories" or null for normal

  const [sortBy, setSortBy] = useState("newest");
  const [showAvailable, setShowAvailable] = useState(true);
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);
  const [isSpecsDialogOpen, setIsSpecsDialogOpen] = useState(false);
  const [isSellerTypeDialogOpen, setIsSellerTypeDialogOpen] = useState(false);

  // Mobile filter states
  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSpecs, setSelectedSpecs] = useState([]);
  const [sellerType, setSellerType] = useState("all");
  const [searchValue, setSearchValue] = useState("گوشی موبایل");
  const minPrice = 500;
  const maxPrice = 100000000;
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  const setShowSearchResultBox = usePublicStore(
    (s) => s.setShowSearchResultBox,
  );
  const searchBoxOpen = usePublicStore((s) => s.searchBoxOpen);
  const setSearchBoxOpen = usePublicStore((s) => s.setSearchBoxOpen);
  const setDefaultSearchValue = usePublicStore((s) => s.setSearchValue);

  const handleLocateClick = () => {
    setSearchBoxOpen(false);
    setShowSearchResultBox(true, { name: "گوشی موبایل" });
  };

  const handleSearchInputClick = () => {
    setDefaultSearchValue(searchValue);
    setSearchBoxOpen(true);
  };

  const sellerTypeOptions = [
    { id: "all", label: "همه فروشندگان" },
    { id: "special", label: "فروشندگان ویژه" },
    { id: "official", label: "فروشندگان رسمی" },
    { id: "local", label: "فروشندگان بومی" },
  ];

  const sortOptions = [
    { id: "newest", label: "جدیدترین" },
    { id: "mostViewed", label: "پربازدیدترین" },
    { id: "cheapest", label: "ارزان ترین" },
    { id: "expensive", label: "گران ترین" },
  ];

  const handleBrandToggle = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId],
    );
  };

  const handleSpecToggle = (optionId) => {
    setSelectedSpecs((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    );
  };

  const handleFilterToggle = (filterId) => {
    setExpandedFilter(
      (prev) =>
        prev.includes(filterId)
          ? prev.filter((id) => id !== filterId) // حذف از لیست
          : [...prev, filterId], // افزودن به لیست
    );
  };

  const hasFiltersChanged = () => {
    return (
      sortBy !== "newest" ||
      selectedBrands.length > 0 ||
      selectedSpecs.length > 0 ||
      sellerType !== "all" ||
      priceRange[0] !== minPrice ||
      priceRange[1] !== maxPrice
    );
  };

  const handleResetFilters = () => {
    setSortBy("newest");
    setSelectedBrands([]);
    setSelectedSpecs([]);
    setSellerType("all");
    setPriceRange([minPrice, maxPrice]);
    setExpandedFilter([]);
  };

  const getFilterValue = (filterId) => {
    switch (filterId) {
      case "sort":
        return sortOptions.find((o) => o.id === sortBy)?.label || "";
      case "price":
        return `${formatPrice(priceRange[0])} تا ${formatPrice(priceRange[1])} تومان`;
      case "brand":
        return selectedBrands.length > 0 ? `${selectedBrands.length} برند` : "";
      case "specs":
        return selectedSpecs.length > 0 ? `${selectedSpecs.length} مورد` : "";
      case "seller":
        return sellerTypeOptions.find((o) => o.id === sellerType)?.label || "";
      default:
        return "";
    }
  };

  const mobileFilters = [
    { id: "sort", label: "اولویت نمایش" },
    { id: "price", label: "محدوده قیمت" },
    { id: "brand", label: "برند" },
    { id: "specs", label: "مشخصات" },
    { id: "seller", label: "نوع فروشنده" },
  ];

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen bg-gray-200 px-10 pt-[25px] pb-[5px] flex-col">
        <BrandFilterDialog
          isOpen={isBrandDialogOpen}
          onClose={() => setIsBrandDialogOpen(false)}
        />
        <PriceRangeDialog
          isOpen={isPriceDialogOpen}
          onClose={() => setIsPriceDialogOpen(false)}
        />
        <SellerTypeDialog
          isOpen={isSellerTypeDialogOpen}
          onClose={() => setIsSellerTypeDialogOpen(false)}
        />
        <SpecsFilterDialog
          isOpen={isSpecsDialogOpen}
          onClose={() => setIsSpecsDialogOpen(false)}
          selectedSpecs={selectedSpecs}
          onSpecToggle={handleSpecToggle}
        />

        <div className="flex flex-col gap-[25px] flex-1 min-h-0">
          {/* Top Section - Search Input */}
          <div className="flex items-center gap-[25px] pr-6">
            <Image
              src="/assets/images/logo/small-logo.svg"
              width={40}
              height={40}
              alt="لوگو"
              className="z-70"
            />
            <div className="flex-1">
              <SearchInput
                value=""
                onChange={() => {}}
                placeholder="برند، کالا، لوازم جانبی، قطعات"
                readOnly
                hasLogo={!isDesktop}
                bgColor="bg-white"
                className="max-w-[642px]"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="relative rounded-lg overflow-y-auto flex-1 min-h-0">
            {/* Main Navigation */}
            <div className="fixed right-[65px] bottom-[55px]">
              <MainNavigation isHomePage={false} hasSearchBox />
            </div>

            {viewType === "accessories" ? (
              /* Accessories View with Two Separate Boxes */
              <div className="space-y-1.5 bg-gray-200">
                {/* Second White Box - Accessories */}
                <div className="bg-white rounded-t-lg py-[10px] px-[10px] lg:py-[50px] lg:px-[100px]">
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue="accessories"
                  >
                    <AccordionItem value="accessories">
                      <AccordionTrigger className="hidden lg:flex font-bold! text-base lg:text-xl text-primary justify-between hover:no-underline cursor-pointer">
                        <span>
                          <span className="font-bold">لوازم جانبی</span>{" "}
                          <span className="font-light">
                            مرتبط با گوشی موبایل
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="lg:mt-4">
                        <FiltersSection
                          sortOptions={sortOptions}
                          sortBy={sortBy}
                          setSortBy={setSortBy}
                          setIsSpecsDialogOpen={setIsSpecsDialogOpen}
                          setIsBrandDialogOpen={setIsBrandDialogOpen}
                          setIsPriceDialogOpen={setIsPriceDialogOpen}
                          setIsSellerTypeDialogOpen={setIsSellerTypeDialogOpen}
                        />
                        <ProductsList products={mockProducts} isDesktop />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                {/* First White Box - Parts */}
                <div className="bg-white rounded-b-lg py-[10px] px-[10px] lg:py-[50px] lg:px-[100px]">
                  <Accordion type="single" collapsible defaultValue="parts">
                    <AccordionItem value="parts">
                      <AccordionTrigger className="hidden lg:flex font-bold! text-base lg:text-xl text-primary justify-between hover:no-underline cursor-pointer">
                        <span>
                          <span className="font-bold">قطعات</span>{" "}
                          <span className="font-light">
                            مرتبط با گوشی موبایل
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="lg:mt-4">
                        <FiltersSection
                          sortOptions={sortOptions}
                          sortBy={sortBy}
                          setSortBy={setSortBy}
                          setIsSpecsDialogOpen={setIsSpecsDialogOpen}
                          setIsBrandDialogOpen={setIsBrandDialogOpen}
                          setIsPriceDialogOpen={setIsPriceDialogOpen}
                          setIsSellerTypeDialogOpen={setIsSellerTypeDialogOpen}
                        />
                        <ProductsList products={mockProducts} isDesktop />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            ) : (
              /* Normal View */
              <div className="bg-white rounded-lg px-[100px] pt-[54px] pb-8">
                {/* Header */}
                <div className="flex items-center justify-between pr-[10px]">
                  <h1 className="text-[20px] text-primary">
                    <span className="font-bold">دسته بندی</span> گوشی موبایل
                  </h1>
                  <div className="flex items-center gap-[30px]">
                    <AvailableProductsIcon
                      onClick={() => setShowAvailable(!showAvailable)}
                      active={showAvailable}
                      size={20}
                    />
                    <Link
                      href="/"
                      onClick={handleLocateClick}
                      className="transition-colors"
                      aria-label="بازگشت به صفحه اصلی"
                    >
                      <LocateIcon size={20} className="text-black" />
                    </Link>
                  </div>
                </div>

                <FiltersSection
                  sortOptions={sortOptions}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  setIsSpecsDialogOpen={setIsSpecsDialogOpen}
                  setIsBrandDialogOpen={setIsBrandDialogOpen}
                  setIsPriceDialogOpen={setIsPriceDialogOpen}
                  setIsSellerTypeDialogOpen={setIsSellerTypeDialogOpen}
                />
                <ProductsList products={mockProducts} isDesktop />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-screen bg-white">
        {viewType === "accessories" ? (
          /* Accessories View with Tabs */
          <div className="px-[10px]">
            {/* Fixed Header with Search */}
            <div className="fixed top-0 left-0 right-0 bg-white z-50 px-[10px] pt-[20px] pb-4">
              <div className="relative">
                <div
                  onClick={handleSearchInputClick}
                  className="cursor-pointer"
                >
                  <SearchInput
                    value=""
                    onChange={() => {}}
                    hasLogo
                    placeholder="برند، کالا، لوازم جانبی، قطعات"
                    showSearchIcon={false}
                    readOnly
                  />
                </div>
                <button
                  onClick={() => setIsFiltersDrawerOpen(true)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2"
                >
                  <ArrowUpDownIcon size={20} color="#000000" />
                </button>
              </div>
            </div>

            <Tabs defaultValue="parts">
              <TabsList
                dir="rtl"
                className="fixed top-[80px] right-0 left-0 bg-white! z-20 w-full max-w-[540px] flex items-center px-0! py-0! h-12!"
              >
                <TabsTrigger
                  value="parts"
                  className="flex-1 shadow-none! rounded-none! h-full! text-gray-600 data-[state=active]:text-primary border-b-2 border-gray-200 data-[state=active]:border-primary font-bold!"
                >
                  قطعات
                </TabsTrigger>
                <TabsTrigger
                  value="accessories"
                  className="flex-1 shadow-none! rounded-none! h-full! text-gray-600 data-[state=active]:text-primary border-b-2 border-gray-200 data-[state=active]:border-primary font-bold!"
                >
                  لوازم جانبی
                </TabsTrigger>
              </TabsList>
              <TabsContent className="pt-[140px]" value="parts" dir="rtl">
                <ProductsList products={mockProducts} />
              </TabsContent>
              <TabsContent className="pt-[140px]" value="accessories" dir="rtl">
                <ProductsList products={mockProducts} />
              </TabsContent>
            </Tabs>

            {/* Filters Drawer */}
            <FiltersDrawer
              isOpen={isFiltersDrawerOpen}
              onClose={() => setIsFiltersDrawerOpen(false)}
              mobileFilters={mobileFilters}
              expandedFilter={expandedFilter}
              onFilterToggle={handleFilterToggle}
              getFilterValue={getFilterValue}
              sortBy={sortBy}
              onSortChange={setSortBy}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              minPrice={minPrice}
              maxPrice={maxPrice}
              selectedBrands={selectedBrands}
              onBrandToggle={handleBrandToggle}
              selectedSpecs={selectedSpecs}
              onSpecToggle={handleSpecToggle}
              sellerType={sellerType}
              onSellerTypeChange={setSellerType}
              hasFiltersChanged={hasFiltersChanged}
              onResetFilters={handleResetFilters}
              availableProductsIconActive={showAvailable}
              onAvailableProductsToggle={() => setShowAvailable(!showAvailable)}
            />

            {/* Main Navigation */}
            <MainNavigation isHomePage={false} />
          </div>
        ) : (
          /* Normal View */
          <>
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 right-0 bg-white z-50 px-[10px] pt-[20px] pb-4">
              <div className="relative">
                <div
                  onClick={handleSearchInputClick}
                  className="cursor-pointer"
                >
                  <SearchInput
                    value=""
                    onChange={() => {}}
                    hasLogo
                    placeholder="برند، کالا، لوازم جانبی، قطعات"
                    showSearchIcon={false}
                    readOnly
                  />
                </div>
                <button
                  onClick={() => setIsFiltersDrawerOpen(true)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2"
                >
                  <ArrowUpDownIcon size={20} color="#000000" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-y-auto py-[80px]">
              {/* Products List */}
              <div className="flex-1 py-3 px-[10px]">
                {mockProducts.map((product) => (
                  <div key={product.id} className="flex gap-[10px] pb-4 mb-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={product.img || "/assets/images/fallback/phone.png"}
                        fill
                        alt={product.name}
                        className="object-contain"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col flex-1 gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-error-medium font-bold">
                          فروش ویژه
                        </span>
                        <span className="text-xs text-error-medium font-bold">
                          00:00:00
                        </span>
                      </div>

                      <p className="text-xs font-bold text-gray-600 line-clamp-2">
                        {product.name}
                      </p>

                      <div className="flex gap-1">
                        <span className="text-xs text-gray-600 font-bold">
                          محدوده قیمت
                        </span>
                        <span className="text-xs text-gray-600">
                          {formatPrice(product.minPrice)} تا{" "}
                          {formatPrice(product.maxPrice)} تومان
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Location Text */}
              <div className="bg-white px-[10px] mt-auto py-3">
                <Link href="/" onClick={handleLocateClick}>
                  <p className="text-primary text-center cursor-pointer">
                    موقعیت یابی گروه کالایی &quot; گوشی موبایل &quot;
                  </p>
                </Link>
              </div>
            </div>

            {/* Filters Drawer */}
            <FiltersDrawer
              isOpen={isFiltersDrawerOpen}
              onClose={() => setIsFiltersDrawerOpen(false)}
              mobileFilters={mobileFilters}
              expandedFilter={expandedFilter}
              onFilterToggle={handleFilterToggle}
              getFilterValue={getFilterValue}
              sortBy={sortBy}
              onSortChange={setSortBy}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              minPrice={minPrice}
              maxPrice={maxPrice}
              selectedBrands={selectedBrands}
              onBrandToggle={handleBrandToggle}
              selectedSpecs={selectedSpecs}
              onSpecToggle={handleSpecToggle}
              sellerType={sellerType}
              onSellerTypeChange={setSellerType}
              hasFiltersChanged={hasFiltersChanged}
              onResetFilters={handleResetFilters}
              availableProductsIconActive={showAvailable}
              onAvailableProductsToggle={() => setShowAvailable(!showAvailable)}
            />

            {/* Fixed Bottom Navigation */}
            <MainNavigation isHomePage={false} />
          </>
        )}
      </div>

      {/* Search Box */}
      <SearchBox
        isOpen={searchBoxOpen}
        onClose={() => setSearchBoxOpen(false)}
      />
    </>
  );
}

export default SearchResults;
