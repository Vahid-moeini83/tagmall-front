"use client";

import Link from "next/link";
import { ShoppingBagIcon } from "@/icons";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import MobileSearchProductCard from "@/components/modules/search-results/components/MobileSearchProductCard";
import MobileSortFilterRow from "@/components/modules/search-results/components/MobileSortFilterRow";
import FiltersDrawer from "@/components/modules/search-results/components/FiltersDrawer";
import { mockRelatedAccessories } from "@/lib/client/mockRelatedAccessories";
import usePublicStore from "@/app/store/publicStore";
import useMobileProductFilters from "@/hooks/useMobileProductFilters";

function ProductOrderAccessoriesDrawer({ open, onOpenChange, productName }) {
  const cartItemsCount = usePublicStore((s) => s.cartItemsCount);
  const { sortLabel, openFiltersDrawer, filtersDrawerProps } =
    useMobileProductFilters();

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent
          className="z-100! h-[96%]! overflow-hidden flex flex-col"
          overlayClassName="z-100 lg:hidden"
        >
          <h2 className="font-extralight text-center text-primary text-sm mt-4 mb-6 px-[10px] shrink-0">
            <span className="font-bold">لوازم جانبی</span> {productName}
          </h2>

          <MobileSortFilterRow
            sortLabel={sortLabel}
            onClick={openFiltersDrawer}
            className="mt-0! mb-5!"
          />

          <div className="flex-1 overflow-y-auto px-[10px] pb-10">
            <p className="font-iransans text-center text-sm text-gray-600 mb-5 shrink-0">
              با خرید کامل‌تر در زمان صرفه‌جویی کن :)
            </p>

            <div className="space-y-[10px]">
              {mockRelatedAccessories.map((product) => (
                <MobileSearchProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          <div className="shrink-0 py-2 px-[10px]">
            <Link
              href="/cart"
              onClick={() => onOpenChange(false)}
              className="font-semibold text-primary cursor-pointer border-2 border-primary py-2 rounded-full w-full flex items-center justify-center gap-2"
            >
              <span className="relative">
                <ShoppingBagIcon size={20} className="text-primary" />
                {cartItemsCount > 0 ? (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-error-medium" />
                ) : null}
              </span>
              سبد خرید
            </Link>
          </div>
        </DrawerContent>
      </Drawer>

      <FiltersDrawer
        {...filtersDrawerProps}
        overlayClassName="z-110 lg:hidden"
        drawerClassName="z-110!"
        footerClassName="pb-[27px]"
      />
    </>
  );
}

export default ProductOrderAccessoriesDrawer;
