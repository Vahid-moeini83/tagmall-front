"use client";

import { useState, useEffect } from "react";
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
import ProductImageSlider from "./ProductImageSlider";
import { Radio } from "@/components/ui/radio";
import { formatPrice, formatSecondsToTime } from "@/lib/client/utils";
import Link from "next/link";
import usePublicStore from "@/app/store/publicStore";
import { createConversation } from "@/lib/server/actions/support";
import { getToken } from "@/lib/server/cookies";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProductMain({ product }) {
  const [selectedColor, setSelectedColor] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [quantity, setQuantity] = useState(1);
  const [expanded, setExpanded] = useState([]);
  const [addressOpen, setAddressOpen] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(
    product?.featured_sale_remainings_seconds,
  );

  // Get store actions
  const setProductAttribute = usePublicStore((s) => s.setProductAttribute);
  const setLoginOpen = usePublicStore((s) => s.setLoginOpen);

  const router = useRouter();

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

  const toggleExpand = (id) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // Extract data from product
  const sellerData = {
    sellerName: product?.seller_info?.name || "دیجیتال استور بهار",
    sellerAvatar:
      product?.seller_info?.image || "/assets/images/fallback/avatar.png",
    rating: product?.feedback_info?.rating || 4.6,
    totalReviews: product?.feedback_info?.comments_count || 128,
    hasBlueTick: product?.seller_info?.has_blue_tick || false,
  };

  // Transform attributes to colors format
  const colorAttribute = product?.attributes?.find(
    (attr) => attr.attribute_type === "color",
  );
  const colors =
    colorAttribute?.items?.map((item) => ({
      id: item.id.toString(),
      name: item.value,
      colorCode: item.meta?.hex || "#000000",
      price:
        parseInt(product?.base_price || 0) + parseInt(item.added_price || 0),
      image: item.thumbnail || "/assets/images/fallback/phone.png",
      stock: item.stock,
    })) || [];

  // Transform delivery methods
  const deliveryMethodsData = product?.delivery_methods || [];
  const deliveryMethods = {};
  deliveryMethodsData.forEach((method) => {
    if (method.type === "shipping") {
      deliveryMethods.delivery = method.name;
    } else if (method.type === "pickup") {
      deliveryMethods.pickup = method.name;
    }
  });

  const selectedColorData = colors.find((c) => c.id === selectedColor);

  const handleQuantityChange = (type) => {
    if (type === "increase") {
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
      console.log(createConversationRes);
      const conversationId = createConversationRes.data?.id;

      if (conversationId) {
        router.push(`/support?conversationId=${conversationId}`);
      } else {
        toast.error("خطا در برقراری ارتباط با فروشنده");
      }
    } else if (createConversationErr) {
      toast.error("خطا در برقراری ارتباط با فروشنده");
    }
  };

  return (
    <div className="lg:bg-white lg:rounded-lg pb-64 lg:pb-0 lg:py-[50px] lg:px-[100px]">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        {/* Seller details and Images Section */}
        <div className="lg:w-1/2 border-b-2 border-white lg:border-0 lg:px-0">
          {/* Seller profile and rating */}
          <div className="flex items-start justify-between px-[10px]">
            <div className="flex items-start flex-col gap-1 lg:mb-6">
              {/* Seller profile section */}
              <div className="flex items-center gap-2">
                <Image
                  src={
                    sellerData.sellerAvatar ||
                    "/assets/images/fallback/avatar.png"
                  }
                  width={48}
                  height={48}
                  alt="seller avatar"
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
              <div className="flex flex-col gap-1 lg:gap-0">
                <div className="flex items-start gap-1">
                  <span className="text-sm lg:text-base">
                    {sellerData.rating}
                    <span className="text-xs text-gray-400">/5</span>
                  </span>
                  <StarIcon className="w-[10px] h-[10px] lg:w-[15px] lg:h-[15px] text-yellow-600" />
                </div>
                <span className="text-center text-xs lg:text-sm text-gray-400">
                  آرا {sellerData.totalReviews}
                </span>
              </div>
            </div>
            <Link href={"#"} className="rotate-90 mt-6 ml-4 lg:hidden">
              <ChevronDownIcon size={20} />
            </Link>
          </div>

          {/* Product Image Slider */}
          <div className="-translate-y-10 lg:-translate-y-20">
            <ProductImageSlider
              gallery={product?.gallery}
              dotCLassName="bg-gray-200!"
            />
          </div>

          {/* Mobile only: Update text and divider */}
          <div className="lg:hidden px-[10px] mb-4 -translate-y-11">
            {/* Update text with 12px gap from divider */}
            <p className="text-gray-400 text-center font-extralight">
              <span className="font-bold">بروزرسانی</span> 1 دقیقه پیش
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:w-1/2 lg:space-y-4">
          <div className="fixed right-[10px] left-[10px] bottom-18 rounded-lg bg-white lg:bg-none lg:static z-10">
            <div className="bg-gray-200 lg:bg-[unset] rounded-lg p-[10px] pt-3 lg:pr-0 lg:pt-4">
              {/* Special Sale & Timer */}
              {(product?.is_featured_sale || product?.discount_percent) && (
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
                  {product?.is_featured_sale && timeRemaining > 0 && (
                    <span className="text-error-medium font-bold lg:text-[20px]">
                      {formatSecondsToTime(timeRemaining)}
                    </span>
                  )}
                </div>
              )}

              {/* Product Name & Price */}
              <div className="flex flex-col items-center gap-2 lg:gap-4 pb-4">
                <p className="text-gray-600 text-xs lg:text-lg">
                  {parseInt(product?.base_price || 55000000).toLocaleString(
                    "fa-IR",
                  )}{" "}
                  تومان
                </p>
                {product?.discount_percent && (
                  <p className="text-gray-400 line-through text-xs lg:text-lg">
                    {Math.round(
                      parseInt(product?.base_price || 0) /
                        (1 - parseInt(product?.discount_percent || 0) / 100),
                    ).toLocaleString("fa-IR")}{" "}
                    تومان
                  </p>
                )}
              </div>
              {/* Add button */}
              <button className="lg:hidden w-full flex items-center justify-center gap-4 text-primary bg-white rounded-lg h-12 cursor-pointer">
                <SquarePlusIcon2 size={20} />
                ثبت سفارش
              </button>
            </div>
          </div>

          <div className="lg:space-y-4 -translate-y-10 lg:translate-y-0">
            {/* Color Accordion */}
            <div className="px-[10px] lg:px-0">
              {/* Mobile: CustomAccordion */}
              <div className="lg:hidden">
                <CustomAccordion
                  id="color"
                  expandedItems={expanded}
                  onToggle={toggleExpand}
                  customLabel={
                    <div>
                      <span className="text-gray-600 font-bold">رنگ: </span>
                      <span
                        className={`font-extralight ${selectedColor ? "text-gray-600" : "text-gray-400"}`}
                      >
                        {selectedColor
                          ? selectedColorData?.name
                          : `(${colors.length} رنگ موجود است)`}
                      </span>
                    </div>
                  }
                  iconClassName="left-[18px]"
                >
                  <div className="space-y-0 mb-[10px]">
                    {colors.map((color, index) => (
                      <div key={color.id}>
                        <button
                          onClick={() => {
                            setSelectedColor(color.id);
                            setProductAttribute("color", color.name);
                          }}
                          className={`w-full flex items-center justify-between cursor-pointer p-3 rounded-lg transition-colors ${
                            selectedColor === color.id ? "bg-gray-300" : ""
                          }`}
                        >
                          {/* Right side: Image and text */}
                          <div className="flex items-center gap-3">
                            <Image
                              src={color.image}
                              width={24}
                              height={36}
                              alt={color.name}
                              className="object-contain"
                            />
                            <div className="flex flex-col gap-3 items-start">
                              <span className="text-gray-600 text-xs font-extralight">
                                <span className="font-bold">رنگ</span>{" "}
                                {color.name}
                              </span>
                              <span className="text-gray-600 text-xs font-extralight">
                                <span className="font-bold">از</span>{" "}
                                {color.price.toLocaleString("fa-IR")} تومان
                              </span>
                            </div>
                          </div>

                          {/* Left side: Color circle */}
                          <div
                            className="w-5 h-5 rounded-full"
                            style={{ backgroundColor: color.colorCode }}
                          />
                        </button>
                        {index < colors.length - 1 && (
                          <div className="border-t-2 border-gray-200 mr-14" />
                        )}
                      </div>
                    ))}
                  </div>
                </CustomAccordion>
              </div>

              {/* Desktop: Original Accordion */}
              <div className="hidden lg:block">
                <Accordion type="single" collapsible>
                  <AccordionItem value="color">
                    <AccordionTrigger className="text-gray-600 pl-[11px] justify-between hover:no-underline cursor-pointer">
                      <div>
                        <span className="font-bold text-gray-600 text-base">
                          رنگ
                        </span>{" "}
                        <span
                          className={`${selectedColor ? "" : "text-gray-400"}`}
                        >
                          {selectedColor
                            ? selectedColorData?.name
                            : `(${colors.length} رنگ موجود است)`}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="mt-4">
                      <div className="space-y-4">
                        {colors.map((color, index) => (
                          <div key={color.id}>
                            <button
                              onClick={() => {
                                setSelectedColor(color.id);
                                setProductAttribute("color", color.name);
                              }}
                              className={`w-full flex items-start justify-between cursor-pointer p-3 rounded-lg transition-colors ${
                                selectedColor === color.id ? "bg-gray-200" : ""
                              }`}
                            >
                              {/* Right side: Image and text */}
                              <div className="flex items-start gap-3">
                                <Image
                                  src={color.image}
                                  width={24}
                                  height={36}
                                  alt={color.name}
                                  className="object-contain"
                                />
                                <div className="flex flex-col gap-[24px] items-start">
                                  <span className="text-gray-600 text-base">
                                    <span className="font-bold">رنگ</span>{" "}
                                    {color.name}
                                  </span>
                                  <span className="text-gray-600 text-base">
                                    <span className="font-bold">قیمت از</span>{" "}
                                    {color.price.toLocaleString("fa-IR")} تومان
                                  </span>
                                </div>
                              </div>

                              {/* Left side: Color circle */}
                              <div
                                className="w-5 h-5 rounded-full"
                                style={{ backgroundColor: color.colorCode }}
                              />
                            </button>
                            {index < colors.length - 1 && (
                              <div className="border-t-2 border-gray-200 mr-14" />
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[4px] bg-gray-200 lg:hidden" />

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
                      <span className="text-primary font-bold">
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
                      <div className="pr-2">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <Radio
                            name="delivery"
                            value="delivery"
                            checked={deliveryMethod === "delivery"}
                            onChange={() => setDeliveryMethod("delivery")}
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
                                {formatPrice(
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
                    {deliveryMethodsData.length > 1 && (
                      <div className="border-t-2 border-gray-200 mr-9" />
                    )}

                    {/* In-person pickup */}
                    {deliveryMethodsData.find((m) => m.type === "pickup") && (
                      <div className="pr-2">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <Radio
                            name="delivery"
                            value="pickup"
                            checked={deliveryMethod === "pickup"}
                            onChange={() => setDeliveryMethod("pickup")}
                          />
                          <div className="flex flex-col gap-[20px] w-full mb-3 lg:mb-0">
                            <span className="text-gray-600 text-xs">
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
                    <div className="my-[10px] border-2 border-gray-200 lg:border-white p-[10px] rounded-lg">
                      {/* Top part - Trigger */}
                      <div
                        onClick={() => setAddressOpen(!addressOpen)}
                        className="flex justify-between items-center cursor-pointer"
                      >
                        <span className="text-gray-800 font-medium">آدرس:</span>
                      </div>

                      <div>
                        {/* 12px space */}
                        <div className="mt-3"></div>

                        {/* Address text */}
                        <p className="text-justify text-gray-600 leading-7">
                          {deliveryMethodsData.find((m) => m.type === "pickup")
                            ?.meta?.city?.name || "آدرس فروشگاه"}
                        </p>

                        {/* 12px space */}
                        <div className="mt-3"></div>

                        {/* Centered button */}
                        <div className="flex justify-center">
                          <button className="flex items-center gap-2 text-primary">
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
                    <AccordionTrigger className="text-gray-600 pl-[11px] justify-between hover:no-underline">
                      <div>
                        <span className="font-bold text-gray-600 text-base">
                          روش تحویل سفارش
                        </span>{" "}
                        <span>{deliveryMethods[deliveryMethod]}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="mt-4">
                      <div className="space-y-4">
                        {/* Delivery by seller */}
                        {deliveryMethodsData.find(
                          (m) => m.type === "shipping",
                        ) && (
                          <div className="pr-2">
                            <label className="flex items-start gap-3 cursor-pointer">
                              <Radio
                                name="delivery"
                                value="delivery"
                                checked={deliveryMethod === "delivery"}
                                onChange={() => setDeliveryMethod("delivery")}
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
                                    {formatPrice(
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
                        {deliveryMethodsData.length > 1 && (
                          <div className="border-t-2 border-gray-200 mr-8" />
                        )}

                        {/* In-person pickup */}
                        {deliveryMethodsData.find(
                          (m) => m.type === "pickup",
                        ) && (
                          <div className="pr-2">
                            <label className="flex items-start gap-3 cursor-pointer">
                              <Radio
                                name="delivery"
                                value="pickup"
                                checked={deliveryMethod === "pickup"}
                                onChange={() => setDeliveryMethod("pickup")}
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
                              <button className="flex items-center gap-2 text-primary">
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
            <div className="lg:border-t-2 lg:border-gray-200 lg:pt-4 px-[10px] lg:px-0">
              <div className="flex items-center justify-between py-3 lg:py-0">
                <span className="text-primary font-bold">تعداد سفارش</span>
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
              className="flex items-center justify-between lg:bg-gray-200 lg:rounded-lg lg:p-4 my-3 lg:my-0 px-[10px] cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <NoteIcon size={20} className="mr-4 lg:mr-0" />
                <span className="text-primary font-bold">یادداشت</span>
              </div>
              <ChevronLeftIcon size={20} className="ml-4 lg:hidden" />
            </div>

            {/* Divider */}
            <div className="w-full h-[4px] bg-gray-200 lg:hidden" />

            {/* Mobile specs link */}
            <Link
              href={"/search/1?view=accessories"}
              className="lg:hidden my-3 flex items-center justify-between px-[10px]"
            >
              <div className="flex items-center gap-4">
                <PanelIcon size={20} className="mr-4" />
                <span className="text-primary font-bold">
                  لوازم جانبی و قطعات مرتبط
                </span>
              </div>
              <ChevronLeftIcon size={20} className="ml-4 lg:hidden" />
            </Link>

            {/* Order button */}
            <div className="hidden lg:block text-center mt-4">
              <button className="text-primary text-[20px] lg:pb-6 cursor-pointer hover:text-primary transition-colors">
                ثبت سفارش
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
