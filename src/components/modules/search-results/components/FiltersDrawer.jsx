"use client";

import { Drawer, DrawerContent, DrawerFooter } from "@/components/ui/drawer";
import { AvailableProductsIcon, ChevronDownIcon, ChevronUpIcon } from "@/icons";
import SortFilterContent from "./SortFilterContent";
import PriceRangeFilterContent from "./PriceRangeFilterContent";
import BrandFilterContent from "./BrandFilterContent";
import SpecsFilterContent from "./SpecsFilterContent";
import SellerTypeFilterContent from "./SellerTypeFilterContent";

function FiltersDrawer({
  isOpen,
  onClose,
  mobileFilters,
  expandedFilter,
  onFilterToggle,
  getFilterValue,
  sortBy,
  onSortChange,
  priceRange,
  onPriceChange,
  minPrice,
  maxPrice,
  selectedBrands,
  onBrandToggle,
  selectedSpecs,
  onSpecToggle,
  sellerType,
  onSellerTypeChange,
  hasFiltersChanged,
  onResetFilters,
  availableProductsIconActive,
  onAvailableProductsToggle,
  overlayClassName = "lg:hidden",
  drawerClassName = "",
}) {
  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent
        overlayClassName={overlayClassName}
        className={`data-[vaul-drawer-direction=bottom]:h-full! ${drawerClassName}`}
      >
        {/* Content */}
        <div className="relative bg-white rounded-t-2xl px-[10px] mt-4">
          <p className="font-iransans text-center text-sm text-gray-600">
            انتخاب آسان تر براساس اولویت شما
          </p>
          <AvailableProductsIcon
            onClick={onAvailableProductsToggle}
            active={availableProductsIconActive}
            size={20}
            className="absolute top-0 left-5 "
          />
        </div>
        <div className="flex-1 overflow-y-auto bg-white px-[10px] py-4">
          {mobileFilters.map((filter, index) => (
            <div
              key={filter.id}
              className={`${mobileFilters.length - 1 === index ? "" : "border-b-2 border-gray-200"}`}
            >
              <button
                onClick={() => onFilterToggle(filter.id)}
                className={`relative flex items-center justify-between w-full py-4`}
              >
                <div className="flex items-center gap-2">
                  {filter.customLabel ? (
                    filter.customLabel
                  ) : (
                    <>
                      <span className="text-gray-600 font-bold">
                        {filter.label}:
                      </span>
                      {getFilterValue(filter.id) && (
                        <span className="text-sm text-gray-600">
                          {getFilterValue(filter.id)}
                        </span>
                      )}
                    </>
                  )}
                </div>
                {expandedFilter.includes(filter.id) ? (
                  <ChevronUpIcon
                    size={20}
                    color="var(--color-gray-800)"
                    className="absolute left-[14px]"
                  />
                ) : (
                  <ChevronDownIcon
                    size={20}
                    color="var(--color-gray-800)"
                    className="absolute left-[14px]"
                  />
                )}
              </button>

              {/* Filter Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedFilter.includes(filter.id)
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {expandedFilter.includes(filter.id) && (
                  <div className="pb-3">
                    {filter.id === "sort" && (
                      <SortFilterContent
                        sortBy={sortBy}
                        onSortChange={onSortChange}
                      />
                    )}
                    {filter.id === "price" && (
                      <PriceRangeFilterContent
                        priceRange={priceRange}
                        onPriceChange={onPriceChange}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                      />
                    )}
                    {filter.id === "brand" && (
                      <BrandFilterContent
                        selectedBrands={selectedBrands}
                        onBrandToggle={onBrandToggle}
                      />
                    )}
                    {filter.id === "specs" && (
                      <SpecsFilterContent
                        selectedSpecs={selectedSpecs}
                        onSpecToggle={onSpecToggle}
                      />
                    )}
                    {filter.id === "seller" && (
                      <SellerTypeFilterContent
                        sellerType={sellerType}
                        onSellerTypeChange={onSellerTypeChange}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Reset Button */}
        <DrawerFooter className="bg-white pt-4 pb-18">
          <button
            onClick={onResetFilters}
            disabled={!hasFiltersChanged()}
            className={`w-full text-center transition-colors border-2  py-2 rounded-full ${
              hasFiltersChanged()
                ? "text-primary border-primary"
                : "text-gray-400 border-gray-400"
            }`}
          >
            حالت پیش فرض
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default FiltersDrawer;
