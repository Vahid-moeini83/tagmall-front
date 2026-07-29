"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  VerifyIcon,
  StarIcon,
  NoteIcon,
  PlusIcon,
  MinusIcon,
  ChevronLeftIcon,
  SquarePlusIcon2,
  ChevronDownIcon,
  PanelIcon,
  LocationIcon,
} from "@/icons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { CustomAccordion } from "@/components/ui/accordion";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import ProductImageSlider from "./ProductImageSlider";
import { Radio } from "@/components/ui/radio";
import { formatPrice, formatSecondsToTime } from "@/lib/client/utils";
import Link from "next/link";
import usePublicStore from "@/app/store/publicStore";
import { createConversation } from "@/lib/server/actions/support";
import { buildSellerConversation } from "@/components/modules/support/utils/conversation";
import { addCartItem, getCart } from "@/lib/server/actions/cart";
import { getToken } from "@/lib/server/cookies";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import SellerReviewsContent from "../../seller-reviews/components/SellerReviewsContent";
import { mockSellerReviewsData } from "@/lib/client/mockReviewsData";
import toast from "react-hot-toast";
import SpinnerLoading from "@/components/ui/loading/SpinnerLoading";
import ProductOrderAccessoriesDrawer from "./ProductOrderAccessoriesDrawer";
import ProductRelatedAccessoriesDrawer from "./ProductRelatedAccessoriesDrawer";

export default function ProductMain({ product }) {
  console.log(product);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [deliveryMethod, setDeliveryMethod] = useState("shipping");
  const [quantity, setQuantity] = useState(1);
  const [expanded, setExpanded] = useState([]);
  const [addressOpen, setAddressOpen] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(
    product?.featured_sale_remainings_seconds,
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showOtherSellers, setShowOtherSellers] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [showOrderAccessoriesDrawer, setShowOrderAccessoriesDrawer] =
    useState(false);
  const [showRelatedAccessoriesDrawer, setShowRelatedAccessoriesDrawer] =
    useState(false);
  const orderCardRef = useRef(null);
  const [orderCardHeight, setOrderCardHeight] = useState(0);
  const [isScrollAtTop, setIsScrollAtTop] = useState(true);

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const hasMobileFeaturedSale =
    product?.is_featured_sale || product?.discount_percent;
  const MOBILE_VIEWPORT_CHROME = 180;

  // Get store actions
  const setProductAttribute = usePublicStore((s) => s.setProductAttribute);
  const setLoginOpen = usePublicStore((s) => s.setLoginOpen);
  const setCartItemsCount = usePublicStore((s) => s.setCartItemsCount);
  const openConversation = usePublicStore((s) => s.openConversation);

  const toggleExpand = (id) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const attributes = product?.attributes || [];

  // Seller data
  const sellerData = {
    sellerName:
      product?.seller_info?.name || product?.store_info?.name || "نامشخص",
    sellerAvatar:
      product?.seller_info?.avatar ||
      product?.store_info?.avatar ||
      "/assets/images/fallback/avatar.png",
    rating: product?.seller_info?.rating || 0,
    totalReviews: product?.seller_info?.reviews_count || 0,
  };

  // Transform delivery methods
  const deliveryMethodsData = product?.delivery_methods || [];
  const deliveryMethods = {};
  deliveryMethodsData.forEach((method) => {
    if (method.type === "shipping") {
      deliveryMethods.shipping = method.name;
    } else if (method.type === "pickup") {
      deliveryMethods.pickup = method.name;
    }
  });

  const handleSelectAttribute = (attributeId, item) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeId]: item,
    }));

    setProductAttribute(item.attribute_type || attributeId, item.value);
  };

  const getSelectedAttributeItem = (attributeId) => {
    return selectedAttributes?.[attributeId] || null;
  };

  // Get selected attribute value IDs from all selected attributes
  const selectedAttributeValueIds = Object.values(selectedAttributes)
    .map((item) => item.id)
    .filter(Boolean);

  // Find matching variant from variant_combinations
  const findMatchingVariant = () => {
    if (selectedAttributeValueIds.length === 0) return null;

    const variantCombinations = product?.variant_combinations || [];

    const matchedVariant = variantCombinations.find((combo) => {
      const comboIds = combo.attribute_value_ids || [];
      if (comboIds.length !== selectedAttributeValueIds.length) return false;

      return comboIds.every((id) => selectedAttributeValueIds.includes(id));
    });

    return matchedVariant || null;
  };

  const matchedVariant = findMatchingVariant();
  const selectedVariantId = matchedVariant?.variant_id || null;
  const isVariantValid = !!selectedVariantId;

  // Get selected inventory based on variant and delivery method
  const getSelectedInventory = () => {
    if (!selectedVariantId) return null;

    // Find the selected attribute item that has inventories
    for (const attr of attributes) {
      for (const item of attr.items || []) {
        // Check if this item's variant_id matches
        if (item.variant_id === selectedVariantId) {
          // Find inventory that matches delivery method
          const matchedInventory = item.inventories?.find(
            (inv) =>
              inv.delivery_type === "both" ||
              inv.delivery_type === deliveryMethod,
          );

          if (matchedInventory) {
            return matchedInventory;
          }
        }
      }
    }

    return null;
  };

  const selectedInventory = getSelectedInventory();

  // Check qty
  const isAvailable = selectedInventory
    ? selectedInventory.available_qty > 0
    : true;

  const availableQty = selectedInventory?.available_qty || 0;

  // Calculate dynamic price based on selected variant or attributes
  const calculatePrice = () => {
    // If we have a matched variant with price, use it
    if (matchedVariant?.price) {
      return parseFloat(matchedVariant.price);
    }

    // Otherwise calculate from base price + added prices
    const basePrice = parseFloat(product?.base_price || 0);
    const addedPrice = Object.values(selectedAttributes).reduce(
      (sum, item) => sum + (parseFloat(item.added_price) || 0),
      0,
    );
    return basePrice + addedPrice;
  };

  const currentPrice = calculatePrice();

  // Check if delivery method is supported for selected variant
  const isDeliveryMethodSupported = (methodType) => {
    if (!selectedVariantId) return true;

    for (const attr of attributes) {
      for (const item of attr.items || []) {
        if (item.variant_id === selectedVariantId) {
          if (item.inventories && item.inventories.length > 0) {
            return item.inventories.some(
              (inv) =>
                inv.delivery_type === "both" ||
                inv.delivery_type === methodType,
            );
          }
        }
      }
    }

    return true;
  };

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      // Check qty before increasing
      if (availableQty > 0 && quantity >= availableQty) {
        toast.error(`حداکثر ${availableQty} عدد موجود است`);
        return;
      }
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleConversation = async () => {
    const token = await getToken();

    if (!token) {
      setLoginOpen(true);
      return;
    }

    const bodyData = {
      department: 1, // For seller chat
      recipient_id: product?.seller_info?.id,
    };

    const { createConversationRes, createConversationErr } =
      await createConversation(token, bodyData);

    if (createConversationRes) {
      const conversationId = createConversationRes.data?.id;

      if (conversationId) {
        openConversation(
          buildSellerConversation(conversationId, product?.seller_info),
        );
      } else {
        toast.error("خطا در برقراری ارتباط با فروشنده");
      }
    } else if (createConversationErr) {
      toast.error("خطا در برقراری ارتباط با فروشنده");
    }
  };

  const handleAddToCart = async () => {
    if (isAddingToCart) return;

    if (!isAvailable) {
      toast.error("محصول موجود نیست");
      return;
    }

    // Check all required attributes are selected
    const requiredAttributes = attributes.filter(
      (attr) => attr.items?.length > 0,
    );

    const unselectedAttribute = requiredAttributes.find(
      (attr) => !selectedAttributes[attr.id],
    );

    if (unselectedAttribute) {
      toast.error(`لطفا ${unselectedAttribute.attribute_name} را انتخاب کنید`);
      return;
    }

    // Check if variant is valid
    if (!isVariantValid) {
      toast.error("ترکیب انتخاب شده معتبر نیست");
      return;
    }

    // Check if inventory exists
    if (!selectedInventory?.inventory_id) {
      toast.error("محصول موجود نیست");
      return;
    }

    const token = await getToken();
    if (!token) {
      setLoginOpen(true);
      return;
    }

    setIsAddingToCart(true);

    const bodyData = {
      inventory_id: selectedInventory.inventory_id,
      quantity: quantity,
      delivery_type: deliveryMethod,
    };

    const { addCartItemRes, addCartItemErr } = await addCartItem(
      token,
      bodyData,
    );

    if (addCartItemRes) {
      toast.success("محصول به سبد خرید اضافه شد");

      // Update cart items number
      const token = await getToken();
      if (token) {
        const { cartRes } = await getCart(token);
        if (cartRes?.summary) {
          setCartItemsCount(cartRes.summary.items_count || 0);
        }
      }

      if (!isDesktop) {
        setShowOrderAccessoriesDrawer(true);
      }
    } else if (addCartItemErr) {
      toast.error(addCartItemErr);
    }

    setIsAddingToCart(false);
  };

  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Reset quantity when attributes or delivery method changes
  useEffect(() => {
    if (availableQty > 0 && quantity > availableQty) {
      setQuantity(1);
    }
  }, [selectedAttributes, deliveryMethod, availableQty]);

  // Reset delivery method if current method becomes unsupported
  useEffect(() => {
    if (selectedVariantId && !isDeliveryMethodSupported(deliveryMethod)) {
      if (isDeliveryMethodSupported("shipping")) {
        setDeliveryMethod("shipping");
      } else if (isDeliveryMethodSupported("pickup")) {
        setDeliveryMethod("pickup");
      }
    }
  }, [selectedVariantId]);

  useEffect(() => {
    if (isDesktop || !orderCardRef.current) return;

    const updateOrderCardHeight = () => {
      setOrderCardHeight(orderCardRef.current?.offsetHeight ?? 0);
    };

    updateOrderCardHeight();

    const resizeObserver = new ResizeObserver(updateOrderCardHeight);
    resizeObserver.observe(orderCardRef.current);

    return () => resizeObserver.disconnect();
  }, [
    isDesktop,
    hasMobileFeaturedSale,
    timeRemaining,
    isAddingToCart,
    isAvailable,
  ]);

  // Hide content under the fixed order card only while scrolled to top
  useEffect(() => {
    if (isDesktop) return;

    const scrollParent = orderCardRef.current?.closest(".overflow-y-auto");
    if (!scrollParent) return;

    const handleScroll = () => {
      setIsScrollAtTop(scrollParent.scrollTop < 8);
    };

    handleScroll();
    scrollParent.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollParent.removeEventListener("scroll", handleScroll);
  }, [isDesktop]);

  const mobileHeroMinHeight = !isDesktop
    ? orderCardHeight
      ? `calc(100svh - ${MOBILE_VIEWPORT_CHROME + orderCardHeight}px)`
      : "calc(100svh - 15rem)"
    : undefined;

  return (
    <div className="lg:bg-white lg:rounded-lg pb-62 lg:pb-0 lg:py-[50px] lg:px-[100px]">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        {/* Seller details and Images Section */}
        <div
          className="lg:w-1/2 border-b-2 border-white lg:border-0 lg:px-0 flex flex-col lg:block"
          style={
            mobileHeroMinHeight
              ? { minHeight: mobileHeroMinHeight, height: mobileHeroMinHeight }
              : undefined
          }
        >
          {/* Seller profile and rating */}
          <div className="flex items-start justify-between px-[10px] shrink-0">
            <div className="flex items-start flex-col gap-1 lg:mb-6">
              {/* Seller profile section */}
              <div className="flex items-center gap-2">
                <Image
                  src={
                    sellerData.sellerAvatar ||
                    "/assets/images/fallback/no-photo.jpg"
                  }
                  width={48}
                  height={48}
                  alt="پروفایل فروشنده"
                  className="bg-white rounded-lg"
                />
                <div className="flex items-center gap-1">
                  <span className="text-sm lg:text-base text-gray-600">
                    {sellerData.sellerName}
                  </span>
                  <VerifyIcon size={20} />
                </div>
              </div>

              {/* Overall rating section */}
              <div className="flex flex-col gap-1 lg:gap-0 pr-3">
                <div className="flex items-center gap-1">
                  <span className="text-base text-gray-600">
                    {sellerData.rating}
                    <span className="text-xs text-gray-400">/5</span>
                  </span>
                  <StarIcon className="w-[10px] h-[10px] lg:w-[15px] lg:h-[15px] text-yellow-600 mb-1" />
                </div>
                <span className="text-center font-bold text-gray-600 pl-2 lg:pl-4">
                  آرا{" "}
                  <span className="font-extralight">
                    {sellerData.totalReviews}
                  </span>
                </span>
              </div>
            </div>
            <ChevronDownIcon
              size={20}
              className="rotate-90 mt-6 ml-4 lg:hidden cursor-pointer"
              onClick={() => setShowOtherSellers(true)}
            />
          </div>

          {/* Product Image Slider */}
          <div className="-translate-y-4 lg:-translate-y-20 flex-1 min-h-0">
            <ProductImageSlider
              gallery={product?.gallery}
              dotBgColor="bg-gray-200"
              mobileFillHeight={!isDesktop}
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:w-1/2 lg:space-y-4">
          <div
            ref={orderCardRef}
            className="fixed right-[10px] left-[10px] bottom-19 rounded-lg bg-white lg:bg-none lg:static z-10"
          >
            {/* Opaque cover so content under/above the card is hidden at page top */}
            {!isDesktop && isScrollAtTop && (
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-x-[10px] -top-12 bottom-[-5.5rem] bg-white -z-10 rounded-none"
              />
            )}
            <div className="bg-gray-200 lg:bg-[unset] rounded-lg p-[10px] pt-3 lg:pr-0 lg:pt-4">
              {/* Special Sale & Timer */}
              {product?.is_featured_sale || product?.discount_percent ? (
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-start gap-3">
                    <span className="text-error-medium font-bold lg:text-[20px]">
                      فروش ویژه
                    </span>
                    {product?.discount_percent && (
                      <span className="bg-error-medium text-white rounded-full pt-1 px-2">
                        {product.discount_percent}%
                      </span>
                    )}
                  </div>
                  {product?.is_featured_sale && timeRemaining > 0 ? (
                    <span className="text-error-medium font-bold lg:text-[20px]">
                      {formatSecondsToTime(timeRemaining)}
                    </span>
                  ) : null}
                </div>
              ) : null}

              {/* Product Name & Price */}
              <div className="flex flex-col items-center lg:items-start gap-2 lg:gap-4 pb-4">
                <p className="hidden lg:block text-gray-600 text-lg">
                  {product?.name || "نامشخص"}
                </p>
                <p className="text-gray-600 lg:text-lg">
                  {currentPrice.toLocaleString("fa-IR")} تومان
                </p>
                {product?.discount_percent ? (
                  <p className="text-gray-400 line-through text-xs lg:text-lg">
                    {matchedVariant?.compare_price
                      ? parseFloat(matchedVariant.compare_price).toLocaleString(
                          "fa-IR",
                        )
                      : Math.round(
                          currentPrice /
                            (1 -
                              parseInt(product?.discount_percent || 0) / 100),
                        ).toLocaleString("fa-IR")}{" "}
                    تومان
                  </p>
                ) : null}
              </div>
              {/* Add button */}
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !isAvailable}
                className="lg:hidden w-full flex items-center justify-center gap-4 text-primary bg-white rounded-lg h-12 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!isAddingToCart ? (
                  <SquarePlusIcon2 size={20} />
                ) : (
                  <SpinnerLoading size={20} />
                )}
                {!isAvailable
                  ? "ناموجود"
                  : isAddingToCart
                    ? "در حال افزودن"
                    : "ثبت سفارش"}
              </button>
            </div>
          </div>

          <div className="lg:space-y-4">
            {/* Dynamic Attributes Accordions — wrapped in "تنوع کالا" */}
            {attributes.length > 0 && (
              <div>
                {/* Mobile: CustomAccordion wrapper */}
                <div className="lg:hidden border-b-4 border-gray-200 px-[10px]">
                  <CustomAccordion
                    id="variety"
                    expandedItems={expanded}
                    onToggle={toggleExpand}
                    customLabel={
                      <div>
                        <span className="text-primary text-base font-bold">
                          تنوع کالا:
                        </span>
                      </div>
                    }
                    iconClassName="left-[18px]"
                  >
                    {attributes.map((attribute, attrIndex) => {
                      const selectedItem = getSelectedAttributeItem(
                        attribute.id,
                      );
                      const isColorAttribute = attribute.id === 3;
                      const prevAttributeId =
                        attrIndex > 0 ? attributes[attrIndex - 1]?.id : null;
                      const isPrevOpen =
                        prevAttributeId !== null &&
                        expanded.includes(`attribute-${prevAttributeId}`);
                      return (
                        <div key={attribute.id}>
                          <div
                            className={`px-0 ${attrIndex < attributes.length - 1 ? "border-b-2 border-gray-200" : ""}`}
                          >
                            <CustomAccordion
                              id={`attribute-${attribute.id}`}
                              expandedItems={expanded}
                              onToggle={toggleExpand}
                              triggerClassName={isPrevOpen ? "pt-3" : ""}
                              customLabel={
                                <div>
                                  <span className="text-gray-600 text-base font-bold">
                                    {attribute.attribute_name}:{" "}
                                  </span>
                                  <span
                                    className={`font-extralight ${selectedItem ? "text-gray-600" : "text-gray-400"}`}
                                  >
                                    {selectedItem
                                      ? selectedItem.value
                                      : `(${attribute.items?.length || 0} ${attribute.attribute_name})`}
                                  </span>
                                </div>
                              }
                              iconClassName="left-[18px]"
                            >
                              <div
                                className={`space-y-0${selectedItem && attribute.items?.length > 0 && selectedItem.id === attribute.items[attribute.items.length - 1].id ? " mb-[10px]" : ""}`}
                              >
                                {attribute.items?.map((item, index) => (
                                  <div key={item.id}>
                                    <button
                                      onClick={() => {
                                        handleSelectAttribute(
                                          attribute.id,
                                          item,
                                        );
                                      }}
                                      className={`w-full flex items-center justify-between cursor-pointer px-[5px] py-[6px] rounded-lg transition-colors ${
                                        selectedItem?.id === item.id
                                          ? "bg-gray-200"
                                          : ""
                                      }`}
                                    >
                                      <div className="flex items-center gap-[5px]">
                                        <Image
                                          src={
                                            item.image ||
                                            "/assets/images/fallback/no-photo.jpg"
                                          }
                                          width={40}
                                          height={40}
                                          alt={item.value}
                                          className="object-contain"
                                        />
                                        <div className="flex flex-col gap-1 items-start">
                                          <span className="text-gray-600 text-sm font-extralight">
                                            <span className="font-bold">
                                              {attribute.attribute_name}
                                            </span>{" "}
                                            {item.value}
                                          </span>
                                          <span className="text-gray-600 text-sm font-extralight">
                                            <span className="font-bold">
                                              از
                                            </span>{" "}
                                            {(
                                              parseInt(
                                                product?.base_price || 0,
                                              ) +
                                              parseFloat(item.added_price || 0)
                                            ).toLocaleString("fa-IR")}{" "}
                                            تومان
                                          </span>
                                        </div>
                                      </div>
                                      {isColorAttribute && item.meta?.hex && (
                                        <div
                                          className="w-5 h-5 rounded-full border-2 border-gray-200 ml-2"
                                          style={{
                                            backgroundColor: item.meta.hex,
                                          }}
                                        />
                                      )}
                                    </button>
                                    {index < attribute.items.length - 1 &&
                                      selectedItem?.id !== item.id &&
                                      selectedItem?.id !==
                                        attribute.items[index + 1]?.id && (
                                        <div className="border-t-2 border-gray-200 mr-13" />
                                      )}
                                  </div>
                                ))}
                              </div>
                            </CustomAccordion>
                          </div>
                        </div>
                      );
                    })}
                  </CustomAccordion>
                </div>

                {/* Desktop: Accordion wrapper */}
                <div className="hidden lg:block">
                  <div className="space-y-4">
                    {attributes.map((attribute, attrIndex) => {
                      const selectedItem = getSelectedAttributeItem(
                        attribute.id,
                      );
                      const isColorAttribute = attribute.id === 3;
                      return (
                        <div key={attribute.id}>
                          {attrIndex > 0 && (
                            <div className="border-t-2 border-gray-200 mb-4" />
                          )}
                          <Accordion type="single" collapsible>
                            <AccordionItem value={`attribute-${attribute.id}`}>
                              <AccordionTrigger className="text-gray-600 px-[11px] justify-between hover:no-underline cursor-pointer">
                                <div>
                                  <span className="font-bold text-gray-600 text-base">
                                    {attribute.attribute_name}:
                                  </span>{" "}
                                  <span
                                    className={`text-base ${selectedItem ? "" : "text-gray-400"}`}
                                  >
                                    {selectedItem
                                      ? selectedItem.value
                                      : `(${attribute.items?.length || 0} ${attribute.attribute_name})`}
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="mt-4 pb-0!">
                                <div className="space-y-4">
                                  {attribute.items?.map((item, index) => (
                                    <div key={item.id}>
                                      <button
                                        onClick={() => {
                                          handleSelectAttribute(
                                            attribute.id,
                                            item,
                                          );
                                        }}
                                        className={`w-full flex items-start justify-between cursor-pointer p-[10px] rounded-lg transition-colors ${
                                          selectedItem?.id === item.id
                                            ? "bg-gray-200"
                                            : ""
                                        }`}
                                      >
                                        <div className="flex items-start gap-3">
                                          <div className="relative w-10 h-10">
                                            <Image
                                              src={
                                                item.image ||
                                                "/assets/images/fallback/no-photo.jpg"
                                              }
                                              fill
                                              alt={item.value}
                                              className="object-cover rounded-md"
                                            />
                                          </div>
                                          <div className="flex flex-col gap-[24px] items-start">
                                            <span className="text-gray-600 text-base">
                                              <span className="font-bold">
                                                {attribute.attribute_name}
                                              </span>{" "}
                                              {item.value}
                                            </span>
                                            <span className="text-gray-600 text-base">
                                              <span className="font-bold">
                                                از
                                              </span>{" "}
                                              {(
                                                parseFloat(
                                                  product?.base_price || 0,
                                                ) +
                                                parseFloat(
                                                  item.added_price || 0,
                                                )
                                              ).toLocaleString("fa-IR")}{" "}
                                              تومان
                                            </span>
                                          </div>
                                        </div>
                                        {isColorAttribute && item.meta?.hex && (
                                          <div
                                            className="w-5 h-5 border border-gray-400 rounded-full"
                                            style={{
                                              backgroundColor: item.meta.hex,
                                            }}
                                          />
                                        )}
                                      </button>
                                      {index < attribute.items.length - 1 &&
                                        selectedItem?.id !== item.id &&
                                        selectedItem?.id !==
                                          attribute.items[index + 1]?.id && (
                                          <div className="border-t-2 border-gray-200 mr-14" />
                                        )}
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Method Accordion */}
            <div className="lg:border-t-2 lg:border-gray-200 lg:pt-4 px-[10px] lg:px-0">
              {/* Mobile: CustomAccordion */}
              <div className="lg:hidden">
                <CustomAccordion
                  id="delivery"
                  expandedItems={expanded}
                  onToggle={toggleExpand}
                  customLabel={
                    <div>
                      <span className="text-primary text-base font-bold">
                        روش تحویل سفارش:{" "}
                      </span>
                      <span className="text-primary font-extralight">
                        {deliveryMethods[deliveryMethod]}
                      </span>
                    </div>
                  }
                  iconClassName="left-[18px]"
                >
                  <div className="space-y-4">
                    {/* Delivery by seller */}
                    {deliveryMethodsData.find((m) => m.type === "shipping") && (
                      <div
                        className={`pr-2 ${deliveryMethodsData.length > 1 ? "" : "pb-4"}`}
                      >
                        <label
                          className={`flex items-start gap-3 ${!isDeliveryMethodSupported("shipping") ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <Radio
                            name="delivery"
                            value="shipping"
                            checked={deliveryMethod === "shipping"}
                            onChange={() => {
                              if (isDeliveryMethodSupported("shipping")) {
                                setDeliveryMethod("shipping");
                              }
                            }}
                            disabled={!isDeliveryMethodSupported("shipping")}
                          />
                          <div className="flex flex-col gap-[20px]">
                            <span className="text-gray-600 font-bold text-xs">
                              {deliveryMethodsData.find(
                                (m) => m.type === "shipping",
                              )?.name || "ارسال توسط فروشنده"}
                            </span>
                            <div className="flex flex-col gap-1">
                              <span className="text-gray-600 text-xs">
                                <span className="font-bold">هزینه ارسال:</span>
                                {selectedInventory?.shipping_cost
                                  ? formatPrice(selectedInventory.shipping_cost)
                                  : formatPrice(
                                      deliveryMethodsData.find(
                                        (m) => m.type === "shipping",
                                      )?.price || 0,
                                    )}{" "}
                                تومان
                              </span>
                              <span className="text-gray-600 text-xs">
                                <span className="font-bold">
                                  تعهد در زمان ارسال:
                                </span>
                                {
                                  deliveryMethodsData.find(
                                    (m) => m.type === "shipping",
                                  )?.meta?.delivery_max_days
                                }{" "}
                                روز کاری
                              </span>
                            </div>
                          </div>
                        </label>
                      </div>
                    )}

                    {/* Line */}
                    {deliveryMethodsData?.length > 1 && (
                      <div className="border-t-2 border-gray-200 mr-9" />
                    )}

                    {/* In-person pickup */}
                    {deliveryMethodsData.find((m) => m.type === "pickup") && (
                      <div className="pr-3.5">
                        <label
                          className={`flex items-start gap-3 ${!isDeliveryMethodSupported("pickup") ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <Radio
                            name="delivery"
                            value="pickup"
                            checked={deliveryMethod === "pickup"}
                            onChange={() => {
                              if (isDeliveryMethodSupported("pickup")) {
                                setDeliveryMethod("pickup");
                              }
                            }}
                            disabled={!isDeliveryMethodSupported("pickup")}
                          />
                          <div className="flex flex-col gap-[20px] w-full mb-3 lg:mb-0">
                            <span className="font-bold text-gray-600 text-sm">
                              {deliveryMethodsData.find(
                                (m) => m.type === "pickup",
                              )?.name || "مراجعه به فروشگاه"}
                            </span>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                  {deliveryMethodsData.find((m) => m.type === "pickup") && (
                    <div className="mb-[10px] mt-1 border-2 border-gray-200 lg:border-white rounded-lg">
                      {/* Top part - Trigger */}
                      <div
                        onClick={() => setAddressOpen(!addressOpen)}
                        className="flex justify-between items-center cursor-pointer px-[10px] pt-[10px]"
                      >
                        <span className="text-gray-600 font-bold">
                          آدرس فروشگاه:
                        </span>
                      </div>

                      <div>
                        {/* 12px space */}
                        <div className="mt-3"></div>

                        {/* Address text */}
                        <p className="font-extralight text-justify text-gray-600 leading-7 px-[10px]">
                          {deliveryMethodsData.find((m) => m.type === "pickup")
                            ?.meta?.city?.name || "نامشخص"}
                        </p>

                        {/* Centered button */}
                        <div className="flex justify-center p-[5px]">
                          <button className="flex items-center justify-center gap-4 text-primary border-2 border-primary rounded-full py-2 w-full">
                            <LocationIcon size={20} />
                            <span>موقعیت یابی فروشگاه</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </CustomAccordion>
              </div>

              {/* Desktop: Original Accordion */}
              <div className="hidden lg:block">
                <Accordion type="single" collapsible>
                  <AccordionItem value="delivery">
                    <AccordionTrigger className="text-gray-600 px-[11px] justify-between hover:no-underline">
                      <div>
                        <span className="font-bold text-gray-600 text-base">
                          روش تحویل سفارش
                        </span>{" "}
                        <span>{deliveryMethods[deliveryMethod]}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="mt-4 pb-0!">
                      <div className="space-y-4">
                        {/* Delivery by seller */}
                        {deliveryMethodsData.find(
                          (m) => m.type === "shipping",
                        ) && (
                          <div className="pr-4">
                            <label
                              className={`flex items-start gap-4 ${!isDeliveryMethodSupported("shipping") ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                              <Radio
                                name="delivery"
                                value="shipping"
                                checked={deliveryMethod === "shipping"}
                                onChange={() => {
                                  if (isDeliveryMethodSupported("shipping")) {
                                    setDeliveryMethod("shipping");
                                  }
                                }}
                                disabled={
                                  !isDeliveryMethodSupported("shipping")
                                }
                              />
                              <div className="flex flex-col gap-[20px]">
                                <span className="text-gray-600 font-bold text-base">
                                  {deliveryMethodsData.find(
                                    (m) => m.type === "shipping",
                                  )?.name || "ارسال توسط فروشنده"}
                                </span>
                                <div className="flex flex-col gap-1">
                                  <span className="text-gray-600 text-sm">
                                    <span className="font-bold">
                                      هزینه ارسال:
                                    </span>
                                    {selectedInventory?.shipping_cost
                                      ? formatPrice(
                                          selectedInventory.shipping_cost,
                                        )
                                      : formatPrice(
                                          deliveryMethodsData.find(
                                            (m) => m.type === "shipping",
                                          )?.price || 0,
                                        )}{" "}
                                    تومان
                                  </span>
                                  <span className="text-gray-600 text-sm">
                                    <span className="font-bold">
                                      تعهد در زمان ارسال:
                                    </span>
                                    {deliveryMethodsData.find(
                                      (m) => m.type === "shipping",
                                    )?.meta?.delivery_max_days || 2}{" "}
                                    روز کاری
                                  </span>
                                </div>
                              </div>
                            </label>
                          </div>
                        )}

                        {/* Line */}
                        {deliveryMethodsData?.length > 1 && (
                          <div className="border-t-2 border-gray-200 mr-8" />
                        )}

                        {/* In-person pickup */}
                        {deliveryMethodsData.find(
                          (m) => m.type === "pickup",
                        ) && (
                          <div className="pr-4">
                            <label
                              className={`flex items-start gap-4 ${!isDeliveryMethodSupported("pickup") ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                              <Radio
                                name="delivery"
                                value="pickup"
                                checked={deliveryMethod === "pickup"}
                                onChange={() => {
                                  if (isDeliveryMethodSupported("pickup")) {
                                    setDeliveryMethod("pickup");
                                  }
                                }}
                                disabled={!isDeliveryMethodSupported("pickup")}
                              />
                              <div className="flex flex-col gap-[20px] w-full">
                                <span className="text-gray-600 text-base">
                                  {deliveryMethodsData.find(
                                    (m) => m.type === "pickup",
                                  )?.name || "مراجعه به فروشگاه"}
                                </span>
                              </div>
                            </label>
                          </div>
                        )}
                      </div>
                      {deliveryMethodsData.find((m) => m.type === "pickup") && (
                        <div className="mt-4 border-2 border-gray-200 p-[10px] rounded-lg">
                          {/* Top part - Trigger */}
                          <div
                            onClick={() => setAddressOpen(!addressOpen)}
                            className="flex justify-between items-center cursor-pointer"
                          >
                            <span className="text-gray-800 font-medium">
                              آدرس:
                            </span>
                          </div>

                          <div>
                            {/* 12px space */}
                            <div className="mt-3"></div>

                            {/* Address text */}
                            <p className="text-justify text-gray-600 leading-7">
                              {deliveryMethodsData.find(
                                (m) => m.type === "pickup",
                              )?.meta?.city?.name || "آدرس فروشگاه"}
                            </p>

                            {/* 12px space */}
                            <div className="mt-3"></div>

                            {/* Centered button */}
                            <div className="flex justify-center">
                              <button className="flex justify-center items-center gap-2 text-primary border-2 border-primary rounded-full py-2 w-full">
                                <LocationIcon size={20} />
                                <span>موقعیت یابی فروشگاه</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[4px] bg-gray-200 lg:hidden" />

            {/* Quantity Selector */}
            <div className="lg:border-t-2 lg:border-gray-200 lg:pt-4 px-[10px] lg:pl-0">
              <div className="flex items-center justify-between py-3 lg:py-0">
                <span className="text-primary text-base font-bold">
                  تعداد سفارش:
                </span>
                <div className="flex items-center gap-1 pl-3">
                  <MinusIcon
                    size={20}
                    onClick={() => handleQuantityChange("decrease")}
                    className={`${quantity <= 1 ? "text-gray-400" : "text-gray-800"}`}
                  />
                  <span className="text-gray-600 min-w-[30px] text-center select-none">
                    {quantity}
                  </span>
                  <PlusIcon
                    size={20}
                    onClick={() => handleQuantityChange("increase")}
                    className="text-primary"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[4px] bg-gray-200 lg:hidden" />

            {/* Note Section */}
            <div
              onClick={handleConversation}
              className="flex items-center justify-between my-3 lg:my-0 px-[10px] lg:pl-0 lg:border-t-2 lg:border-gray-200 lg:pt-4 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <NoteIcon size={20} className="mr-4 lg:mr-0" />
                <span className="text-primary text-base font-bold">
                  یادداشت
                </span>
              </div>
              <ChevronLeftIcon size={20} className="ml-4" />
            </div>

            {/* Divider */}
            <div className="w-full h-[4px] bg-gray-200 lg:hidden" />

            {/* Mobile related accessories */}
            <button
              type="button"
              onClick={() => setShowRelatedAccessoriesDrawer(true)}
              className="lg:hidden my-3 flex items-center justify-between px-[10px] w-full"
            >
              <div className="flex items-center justify-between w-full gap-4">
                <div className="flex items-center gap-4">
                  <SquarePlusIcon2 size={20} className="mr-4" />
                  <span className="text-primary text-base font-bold">
                    لوازم جانبی و قطعات مرتبط
                  </span>
                </div>
                <ChevronLeftIcon size={20} className="ml-4 lg:hidden" />
              </div>
            </button>

            {/* Order button */}
            <div className="hidden lg:block text-center mt-4">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !isAvailable}
                className="flex items-center justify-center w-full gap-4 border-2 border-primary rounded-full text-primary text-[20px] lg:py-2 lg:mb-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!isAddingToCart ? (
                  <SquarePlusIcon2 size={20} />
                ) : (
                  <SpinnerLoading size={20} />
                )}
                {!isAvailable
                  ? "ناموجود"
                  : isAddingToCart
                    ? "در حال افزودن"
                    : "ثبت سفارش"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Other Sellers Drawer - Mobile Only */}
      <Drawer open={showOtherSellers} onOpenChange={setShowOtherSellers}>
        <DrawerContent
          className="z-100! h-[96%]! overflow-hidden flex flex-col"
          overlayClassName="z-100 lg:hidden"
        >
          <h2 className="font-extralight text-center text-primary text-base lg:text-lg mt-4 mb-4 px-[10px] shrink-0">
            {product?.name || "نامشخص"}
          </h2>

          <div className="flex-1 overflow-y-auto px-[10px] pb-28">
            <div className="space-y-[10px]">
              {/* Mock Sellers List - Replace with real data later */}
              {[1, 2, 3, 4, 5].map((seller, index) => {
                const isFeaturedSale = index === 0 || index === 2; // Mock featured sale

                return (
                  <div key={seller} className="block">
                    {/* Seller Header */}
                    <div className="flex items-center justify-between mb-2">
                      {/* Right side - Avatar, name, verify icon */}
                      <Link href="#" className="flex items-center gap-2">
                        <Image
                          src={
                            sellerData.sellerAvatar ||
                            "/assets/images/fallback/avatar.png"
                          }
                          width={48}
                          height={48}
                          alt="پروفایل فروشنده"
                          className="bg-white rounded-lg"
                        />
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-600">
                            {sellerData.sellerName} {index + 1}
                          </span>
                          <VerifyIcon size={20} />
                        </div>
                      </Link>

                      {/* Left side - Rating */}
                      <button
                        type="button"
                        onClick={() => setIsReviewsModalOpen(true)}
                        className="flex items-center gap-2 text-gray-600"
                      >
                        <span className="text-gray-400">
                          آرا {sellerData.totalReviews}
                        </span>
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-[10px] h-[10px] text-yellow-600" />
                          <span className="text-lg">
                            {sellerData.rating}
                            <span className="text-xs text-gray-400">/5</span>
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* Seller Info Box */}
                    <Link href="#" className="block">
                      {/* Featured Sale or Update Time */}
                      {isFeaturedSale ? (
                        <div className="border-2 border-gray-200 rounded-lg p-[10px]">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-error-medium font-bold text-sm">
                              فروش ویژه
                            </span>
                            <span className="text-error-medium font-bold text-sm">
                              {formatSecondsToTime(3600)}
                            </span>
                          </div>

                          {/* Price Box */}
                          <div className="border-2 border-gray-200 rounded-lg py-2 text-center">
                            <span className="text-gray-700 text-sm">
                              از{" "}
                              {(100000 + index * 5000).toLocaleString("fa-IR")}{" "}
                              تومان
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-gray-200 rounded-lg p-[10px]">
                          <div className="text-center mb-4">
                            <span className="text-gray-600 text-sm">
                              <span className="font-bold">بروزرسانی</span> 1
                              دقیقه پیش
                            </span>
                          </div>

                          {/* Price Box */}
                          <div className="border-2 border-gray-200 rounded-lg py-2 text-center">
                            <span className="text-gray-700 text-sm">
                              از{" "}
                              {(100000 + index * 5000).toLocaleString("fa-IR")}{" "}
                              تومان
                            </span>
                          </div>
                        </div>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white fixed bottom-0 py-6 right-0 left-0 px-[10px] flex items-center justify-center">
            <button
              type="button"
              className="w-full rounded-full text-primary border-2 border-primary py-2 flex items-center justify-center gap-2"
            >
              <LocationIcon size={20} />
              موقعیت یابی فروشندگان کالا
            </button>
          </div>
        </DrawerContent>
      </Drawer>

      {isDesktop ? (
        isReviewsModalOpen && (
          <div className="fixed inset-0 z-1000 bg-white h-screen">
            <SellerReviewsContent
              onClose={() => setIsReviewsModalOpen(false)}
              sellerData={mockSellerReviewsData}
            />
          </div>
        )
      ) : (
        <Drawer
          open={isReviewsModalOpen}
          onOpenChange={() => setIsReviewsModalOpen(false)}
        >
          <DrawerContent
            className="z-100! h-[96%]!"
            overlayClassName="z-100 lg:hidden"
          >
            <SellerReviewsContent sellerData={mockSellerReviewsData} />
          </DrawerContent>
        </Drawer>
      )}

      {!isDesktop ? (
        <ProductOrderAccessoriesDrawer
          open={showOrderAccessoriesDrawer}
          onOpenChange={setShowOrderAccessoriesDrawer}
          productName={product?.name || "نامشخص"}
        />
      ) : null}

      {!isDesktop ? (
        <ProductRelatedAccessoriesDrawer
          open={showRelatedAccessoriesDrawer}
          onOpenChange={setShowRelatedAccessoriesDrawer}
          productName={product?.name || "نامشخص"}
        />
      ) : null}
    </div>
  );
}
