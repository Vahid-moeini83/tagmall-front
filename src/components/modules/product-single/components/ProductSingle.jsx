"use client";

import { SearchInput, SearchBox } from "@/components/ui/search";
import usePublicStore from "@/app/store/publicStore";
import ProductMain from "./ProductMain";
import ProductRelatedAccessories from "./ProductRelatedAccessories";
import ProductSpecifications from "./ProductSpecifications";
import ProductReviews from "./ProductReviews";
import ProductUserComments from "./ProductUserComments";
import ProductPartnership from "./ProductPartnership";
import ProductNavigation from "./ProductNavigation";
import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingBagIcon } from "@/icons";
import Link from "next/link";
import toast from "react-hot-toast";
import { getCart } from "@/lib/server/actions/cart";
import { getToken } from "@/lib/server/cookies";

function ProductSingle({ product, productError, comments, commentsError }) {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const searchBoxOpen = usePublicStore((s) => s.searchBoxOpen);
  const setSearchBoxOpen = usePublicStore((s) => s.setSearchBoxOpen);
  const cartItemsCount = usePublicStore((s) => s.cartItemsCount);
  const setCartItemsCount = usePublicStore((s) => s.setCartItemsCount);
  const selectedProductAttributes = usePublicStore(
    (s) => s.selectedProductAttributes,
  );
  const clearProductAttributes = usePublicStore(
    (s) => s.clearProductAttributes,
  );
  const [activeSection, setActiveSection] = useState("details");
  const [showComments, setShowComments] = useState(false);

  // Fetch cart count on mount
  useEffect(() => {
    const fetchCartCount = async () => {
      const token = await getToken();
      if (!token) return;

      const { cartRes } = await getCart(token);
      if (cartRes?.summary) {
        setCartItemsCount(cartRes.summary.items_count || 0);
      }
    };

    fetchCartCount();
  }, [setCartItemsCount]);

  // Show product fetch error once (do not call toast during render)
  useEffect(() => {
    if (productError) {
      toast.error("خطا در نمایش محصول. لطفا دوباره تلاش کنید");
    }
  }, [productError]);

  // Product base info
  const productBaseInfo = {
    category: "گوشی موبایل",
    name: product?.name || "نامشخص",
  };

  // Clear attributes on unmount
  useEffect(() => {
    return () => {
      clearProductAttributes();
    };
  }, [clearProductAttributes]);

  // Refs for desktop sections
  const sectionRefs = useRef({
    details: null,
    specsAndComments: null,
    partnership: null,
  });
  const scrollContainerRef = useRef(null);
  const isScrollingProgrammatically = useRef(false);

  const handleGoBack = () => {
    router.back();
  };

  // Scroll to section when clicking navigation (Desktop)
  const handleSectionClick = (sectionId) => {
    if (isDesktop && sectionRefs.current[sectionId]) {
      isScrollingProgrammatically.current = true;
      const element = sectionRefs.current[sectionId];
      const container = scrollContainerRef.current;

      if (container && element) {
        const elementTop = element.offsetTop;
        const offset = elementTop - 20; // 20px offset from top

        container.scrollTo({
          top: offset,
          behavior: "smooth",
        });

        // Reset flag after scroll animation completes
        setTimeout(() => {
          isScrollingProgrammatically.current = false;
        }, 1000);
      }
    }
    setActiveSection(sectionId);
  };

  // Detect active section on scroll (Desktop)
  useEffect(() => {
    if (!isDesktop) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Don't update active section during programmatic scroll
      if (isScrollingProgrammatically.current) return;

      const scrollPosition = container.scrollTop;

      // Check which section is in view
      const sections = [
        { id: "details", ref: sectionRefs.current.details },
        { id: "specsAndComments", ref: sectionRefs.current.specsAndComments },
        { id: "partnership", ref: sectionRefs.current.partnership },
      ];

      // Find the section that is most visible in the viewport
      let activeId = "details";

      for (const section of sections) {
        if (section.ref) {
          const sectionTop = section.ref.offsetTop;

          // Check if section is in viewport (with some threshold)
          // A section is considered active if its top is within the upper half of viewport
          if (scrollPosition >= sectionTop - 150) {
            activeId = section.id;
          }
        }
      }

      setActiveSection(activeId);
    };

    // Initial check
    handleScroll();

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isDesktop]);

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen bg-gray-200 px-10 pt-[25px] pb-[5px] flex-col">
        <div className="flex flex-col gap-[25px] flex-1 min-h-0">
          {/* Top Section - Search Input */}
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-[25px] pr-6">
              <Link href={"/"}>
                <Image
                  src="/assets/images/logo/small-logo.svg"
                  width={40}
                  height={40}
                  alt="لوگو"
                  className="z-70"
                />
              </Link>
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
            <Link
              href={"/cart"}
              className="w-[100px] h-[50px] bg-white rounded-lg flex items-center justify-center gap-[10px]"
            >
              <ShoppingBagIcon size={20} />
              <span className="text-gray-600">{`${cartItemsCount} کالا`}</span>
            </Link>
          </div>

          {/* Main Content */}
          <div
            ref={scrollContainerRef}
            className="relative rounded-lg overflow-y-auto flex-1 min-h-0 scroll-smooth"
          >
            {/* Main Navigation */}
            <div className="fixed right-[65px] bottom-[55px]">
              <ProductNavigation
                activeSection={activeSection}
                setActiveSection={handleSectionClick}
              />
            </div>

            {/* Content */}
            <div className="space-y-1.5 bg-gray-200">
              {/* Section 1: Details (ProductMain + ProductRelatedAccessories) */}
              <div
                className="space-y-1.5"
                ref={(el) => (sectionRefs.current.details = el)}
              >
                <ProductMain product={product} />
                <ProductRelatedAccessories accessories={product?.accessories} />
              </div>

              {/* Section 2: Specs and Comments (ProductSpecifications + ProductReviews + ProductUserComments) */}
              <div
                className="space-y-1.5"
                ref={(el) => (sectionRefs.current.specsAndComments = el)}
              >
                <ProductSpecifications specs={product?.specs} />
                <ProductReviews review={product?.product_review} />
                <ProductUserComments
                  productId={product?.id}
                  productName={product?.name || "نامشخص"}
                  initialComments={comments}
                  commentsError={commentsError}
                />
              </div>

              {/* Section 3: Partnership */}
              <div
                className="space-y-1.5"
                ref={(el) => (sectionRefs.current.partnership = el)}
              >
                <ProductPartnership
                  cooperation={product?.cooperation_in_sale}
                  productName={product?.name || "نامشخص"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      {!isDesktop && (
        <Drawer open={true} onOpenChange={() => router.back()}>
          <DrawerContent className="z-100! h-[96%]!" overlayClassName="z-100">
            <h2 className="font-extralight text-center text-primary text-base lg:text-lg mt-3 mb-1 px-[10px]">
              {product?.name}
            </h2>
            <div className="flex flex-col h-full">
              {/* Content Area */}
              <div className="flex-1 overflow-y-auto scroll-hidden">
                <div className="space-y-1">
                  {activeSection === "details" && (
                    <ProductMain product={product} />
                  )}
                  {activeSection === "specsAndComments" && (
                    <Tabs defaultValue="specs" className="px-[10px]">
                      <TabsList
                        dir="rtl"
                        className="fixed left-[10px]! right-[10px]! bg-gray-200 rounded-xl! max-w-[540px] flex items-center gap-1 h-14! mx-auto!"
                      >
                        <TabsTrigger
                          value="specs"
                          className="data-[state=active]:bg-white rounded-xl! flex-1 shadow-none! text-gray-600 data-[state=active]:text-primary font-bold! h-[48px]"
                        >
                          مشخصات
                        </TabsTrigger>
                        <TabsTrigger
                          value="reviews"
                          className="data-[state=active]:bg-white rounded-xl! flex-1 shadow-none! text-gray-600 data-[state=active]:text-primary font-bold! h-[48px]"
                        >
                          نقد و بررسی
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="specs" dir="rtl">
                        <ProductSpecifications
                          setShowComments={setShowComments}
                          specs={product?.specs}
                        />
                      </TabsContent>
                      <TabsContent value="reviews" dir="rtl">
                        <ProductReviews
                          setShowComments={setShowComments}
                          review={product?.product_review}
                        />
                      </TabsContent>
                    </Tabs>
                  )}
                  {activeSection === "partnership" && (
                    <ProductPartnership
                      cooperation={product?.cooperation_in_sale}
                      productName={product?.name || "نامشخص"}
                    />
                  )}
                </div>
              </div>

              {/* Fixed Bottom Navigation */}
              <div className="bg-white -mx-[10px] px-[10px]">
                <ProductNavigation
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  onGoBack={handleGoBack}
                />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {!isDesktop && (
        <Drawer open={showComments} onOpenChange={() => setShowComments(false)}>
          <DrawerContent
            className="z-100! h-[96%]! overflow-hidden"
            overlayClassName="z-100 lg:hidden"
          >
            <ProductUserComments
              productId={product?.id}
              productName={product?.name || "نامشخص"}
              initialComments={comments}
              commentsError={commentsError}
            />
          </DrawerContent>
        </Drawer>
      )}

      {/* Search Box */}
      <SearchBox
        isOpen={searchBoxOpen}
        onClose={() => setSearchBoxOpen(false)}
      />
    </>
  );
}

export default ProductSingle;
