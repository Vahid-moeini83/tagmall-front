"use client";

import { SearchInput, SearchBox } from "@/components/ui/search";
import MainNavigation from "@/components/layout/navigation-menu/MainNavigation";
import usePublicStore from "@/app/store/publicStore";
import ProductMain from "./ProductMain";
import ProductRelatedAccessories from "./ProductRelatedAccessories";
import ProductSpecifications from "./ProductSpecifications";
import ProductReviews from "./ProductReviews";
import ProductUserComments from "./ProductUserComments";
import ProductPartnership from "./ProductPartnership";
import ProductNavigation from "./ProductNavigation";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function ProductSingle() {
  const searchBoxOpen = usePublicStore((s) => s.searchBoxOpen);
  const setSearchBoxOpen = usePublicStore((s) => s.setSearchBoxOpen);
  const [activeSection, setActiveSection] = useState("details");
  const [previousSection, setPreviousSection] = useState(null);
  const [showComments, setShowComments] = useState(false);

  const handleSearchInputClick = () => {
    setSearchBoxOpen(true);
  };

  const handleGoBack = () => {
    if (showComments) {
      setShowComments(false);
    }
  };

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen bg-gray-200 px-10 pt-[25px] pb-[5px] flex-col">
        <div className="flex flex-col gap-[25px] flex-1 min-h-0">
          {/* Top Section - Search Input */}
          <div className="flex items-center gap-[25px] pr-5">
            <div className="w-[50px] h-[50px] bg-gray-400 rounded-lg shrink-0" />
            <div
              onClick={handleSearchInputClick}
              className="flex-1 cursor-pointer"
            >
              <SearchInput
                value=""
                onChange={() => {}}
                placeholder="برند، کالا، لوازم جانبی، قطعات"
                showSearchIcon={false}
                readOnly
                bgColor="bg-white"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="relative rounded-lg overflow-y-auto flex-1 min-h-0">
            {/* Main Navigation */}
            <div className="fixed right-[65px] bottom-[55px]">
              <ProductNavigation />
            </div>

            {/* Content */}
            <div className="space-y-1.5 bg-gray-200">
              <ProductMain />
              <ProductRelatedAccessories />
              <ProductSpecifications />
              <ProductReviews />
              <ProductUserComments />
              <ProductPartnership />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-screen bg-white">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 bg-white z-50 px-[10px] pt-[20px] pb-4">
          <div onClick={handleSearchInputClick} className="cursor-pointer">
            <SearchInput
              value=""
              onChange={() => {}}
              placeholder="برند، کالا، لوازم جانبی، قطعات"
              showSearchIcon={false}
              readOnly
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 pt-[80px] bg-gray-200">
          <div className="px-[10px] space-y-1">
            {activeSection === "details" && <ProductMain />}
            {activeSection === "specsAndComments" && (
              <>
                {!showComments ? (
                  <Tabs defaultValue="specs">
                    <TabsList
                      dir="rtl"
                      className="w-full max-w-[540px] flex items-center gap-1 px-0! mt-2"
                    >
                      <TabsTrigger
                        value="specs"
                        className="bg-white rounded-md! flex-1 shadow-none! text-gray-600 data-[state=active]:text-primary font-bold! h-[48px]"
                      >
                        مشخصات
                      </TabsTrigger>
                      <TabsTrigger
                        value="reviews"
                        className="bg-white rounded-md! flex-1 shadow-none! text-gray-600 data-[state=active]:text-primary font-bold! h-[48px]"
                      >
                        نقد و بررسی
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="specs" dir="rtl">
                      <ProductSpecifications />
                    </TabsContent>
                    <TabsContent value="reviews" dir="rtl">
                      <ProductReviews setShowComments={setShowComments} />
                    </TabsContent>
                  </Tabs>
                ) : (
                  <ProductUserComments />
                )}
              </>
            )}
            {activeSection === "partnership" && <ProductPartnership />}
          </div>
        </div>

        {/* Fixed Bottom Navigation */}
        <ProductNavigation
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onGoBack={handleGoBack}
        />
      </div>

      {/* Search Box */}
      <SearchBox
        isOpen={searchBoxOpen}
        onClose={() => setSearchBoxOpen(false)}
      />
    </>
  );
}

export default ProductSingle;
