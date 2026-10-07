"use client";

import Link from "next/link";
import { LocationIcon } from "@/icons";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsList from "@/components/modules/search-results/components/ProductsList";
import MobileSortFilterRow from "@/components/modules/search-results/components/MobileSortFilterRow";
import FiltersDrawer from "@/components/modules/search-results/components/FiltersDrawer";
import { mockSearchProducts } from "@/lib/client/mockRelatedAccessories";
import usePublicStore from "@/app/store/publicStore";
import useMobileProductFilters from "@/hooks/useMobileProductFilters";
import { useState } from "react";

function ProductRelatedAccessoriesDrawer({ open, onOpenChange, productName }) {
  const [activeAccessoryTab, setActiveAccessoryTab] = useState("accessories");
  const setShowSearchResultBox = usePublicStore(
    (s) => s.setShowSearchResultBox,
  );
  const { sortLabel, openFiltersDrawer, filtersDrawerProps } =
    useMobileProductFilters();

  const accessoryTabLabel =
    activeAccessoryTab === "parts" ? "قطعات" : "لوازم جانبی";

  const accessoryLocateLabel =
    activeAccessoryTab === "parts"
      ? "موقعیت یابی قطعات مرتبط"
      : "موقعیت یابی لوازم جانبی مرتبط";

  const handleAccessoryLocateClick = () => {
    const categoryName =
      activeAccessoryTab === "parts" ? "قطعات مرتبط" : "لوازم جانبی مرتبط";
    setShowSearchResultBox(true, { name: categoryName });
    onOpenChange(false);
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent
          className="z-100! h-[96%]! overflow-hidden flex flex-col"
          overlayClassName="z-100 lg:hidden"
        >
          <Tabs
            value={activeAccessoryTab}
            onValueChange={setActiveAccessoryTab}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="shrink-0 px-[10px] pt-4 pb-3">
              <h2 className="text-center text-sm text-primary">
                <span className="font-bold">{accessoryTabLabel}</span>{" "}
                {productName}
              </h2>

              <TabsList
                dir="rtl"
                className="mt-4 bg-gray-200 rounded-lg! max-w-[540px] flex items-center gap-1 h-14! mx-auto! w-full"
              >
                <TabsTrigger
                  value="accessories"
                  className="data-[state=active]:bg-white rounded-lg! flex-1 shadow-none! text-gray-600 data-[state=active]:text-primary font-bold! h-[48px]"
                >
                  لوازم جانبی
                </TabsTrigger>
                <TabsTrigger
                  value="parts"
                  className="data-[state=active]:bg-white rounded-lg! flex-1 shadow-none! text-gray-600 data-[state=active]:text-primary font-bold! h-[48px]"
                >
                  قطعات
                </TabsTrigger>
              </TabsList>

              <MobileSortFilterRow
                sortLabel={sortLabel}
                onClick={openFiltersDrawer}
              />
            </div>

            <TabsContent
              className="flex-1 overflow-y-auto px-[10px] mt-0 pb-4"
              value="parts"
              dir="rtl"
            >
              <ProductsList products={mockSearchProducts} />
            </TabsContent>

            <TabsContent
              className="flex-1 overflow-y-auto px-[10px] mt-0 pb-4"
              value="accessories"
              dir="rtl"
            >
              <ProductsList products={mockSearchProducts} />
            </TabsContent>
          </Tabs>

          <div className="shrink-0 pt-3 pb-2 px-[10px]">
            <Link
              href="/"
              onClick={handleAccessoryLocateClick}
              className="border-2 border-primary rounded-full px-4 py-2 flex items-center justify-center gap-2 w-full"
            >
              <LocationIcon size={20} className="text-primary" />
              <p className="text-primary text-center text-sm">
                {accessoryLocateLabel}
              </p>
            </Link>
          </div>
        </DrawerContent>
      </Drawer>

      <FiltersDrawer
        {...filtersDrawerProps}
        overlayClassName="z-110 lg:hidden"
        drawerClassName="z-110!"
        footerClassName="pb-2"
      />
    </>
  );
}

export default ProductRelatedAccessoriesDrawer;
