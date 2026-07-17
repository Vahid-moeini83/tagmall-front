"use client";

import { useRef, useState, useEffect } from "react";
import { SearchInput, SearchBox } from "@/components/ui/search";
import MainNavigation from "@/components/layout/navigation-menu/MainNavigation";
import CartItems from "./CartItems";
import OrderSummary from "./OrderSummary";
import OrderItems from "./OrderItems";
import CartReceiverStepMobile from "./CartReceiverStepMobile";
import CartPaymentStepMobile from "./CartPaymentStepMobile";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getCart, getCartInvoice } from "@/lib/server/actions/cart";
import { getToken } from "@/lib/server/cookies";
import toast from "react-hot-toast";
import usePublicStore from "@/app/store/publicStore";
import { useRouter } from "next/navigation";

function CartPageContent({ initialCartData }) {
  const [isOrderItemsOpen, setIsOrderItemsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [openAccordion, setOpenAccordion] = useState("");
  const [cartData, setCartData] = useState(initialCartData);
  const [invoiceData, setInvoiceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const setCartItemsCount = usePublicStore((s) => s.setCartItemsCount);
  const searchBoxOpen = usePublicStore((s) => s.searchBoxOpen);
  const setSearchBoxOpen = usePublicStore((s) => s.setSearchBoxOpen);

  const orderSummaryRef = useRef(null);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const router = useRouter();

  // Fetch cart data
  const fetchCart = async () => {
    const token = await getToken();
    if (!token) return;

    const { cartRes, cartErr } = await getCart(token);
    if (cartRes) {
      setCartData(cartRes);
      // به‌روزرسانی تعداد آیتم‌های سبد خرید
      if (cartRes?.summary) {
        setCartItemsCount(cartRes.summary.items_count || 0);
      }
    } else if (cartErr) {
      toast.error("خطا در دریافت سبد خرید");
    }
  };

  // Fetch invoice data
  const fetchInvoice = async () => {
    const token = await getToken();
    if (!token) return;

    const { invoiceRes, invoiceErr } = await getCartInvoice(token);
    if (invoiceRes) {
      console.log(invoiceRes);
      setInvoiceData(invoiceRes);
    } else if (invoiceErr) {
      toast.error("خطا در دریافت صورت‌حساب");
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleOrderSubmit = async () => {
    setIsLoading(true);
    await fetchInvoice();
    setIsOrderSubmitted(true);
    setOpenAccordion("order-summary");

    if (!isDesktop) {
      setCurrentStep(2);
    }

    setTimeout(() => {
      orderSummaryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
    setIsLoading(false);
  };

  const handlePayment = () => {
    setIsPaid(true);
  };

  const handleSuccessPayment = () => {
    router.push("/");
  };

  const handlePreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  // Set initial cart count
  useEffect(() => {
    if (initialCartData?.summary) {
      setCartItemsCount(initialCartData.summary.items_count || 0);
    }
  }, [initialCartData, setCartItemsCount]);

  const invoice = invoiceData?.data?.invoice || {};
  const address = invoiceData?.data?.address || {};
  const user = invoiceData?.data?.user || {};
  const wallet = invoiceData?.data?.wallet || {};
  const receiverInfo = {
    fullName: user.full_name || "نامشخص",
    phone: user.mobile || "نامشخص",
    address: address.address || "آدرسی ثبت نشده است",
    postalCode: address.postal_code || "نامشخص",
    city: address.city || "",
    province: address.province || "",
  };
  const billSummary = {
    orders: invoice.subtotal || 0,
    shipping: invoice.shipping || 0,
    vat: invoice.vat || 0,
    discount: invoice.discount || 0,
    total: invoice.total || 0,
  };

  return (
    <>
      <SearchBox
        isOpen={searchBoxOpen}
        onClose={() => setSearchBoxOpen(false)}
        isHomePage={false}
      />

      {/* Mobile Layout */}
      <div className="flex lg:hidden h-screen bg-white flex-col">
        {/* Main Content */}
        <div className="px-[10px] pt-25 pb-52">
          {/* Steps */}
          <div className="fixed top-0 right-0 left-0 bg-white py-[30px] px-[10px] flex items-center justify-center z-50">
            <div
              onClick={handlePreviousStep}
              className={`rounded-2xl w-25 h-10 flex flex-1  items-center justify-center bg-gray-200 ${
                currentStep === 1 ? "text-primary" : "text-gray-600"
              }`}
            >
              سبد خرید
            </div>
            <div className="w-7 h-[3px] bg-gray-200" />
            <div
              className={`rounded-2xl w-25 h-10 flex flex-1  items-center justify-center bg-gray-200 ${currentStep === 2 ? "text-primary" : currentStep > 2 ? "text-gray-600" : "text-gray-400"}`}
            >
              تحویل گیرنده
            </div>
            <div className="w-7 h-[3px] bg-gray-200" />
            <div
              className={`rounded-2xl w-25 h-10 flex flex-1  items-center justify-center bg-gray-200  ${currentStep === 3 ? "text-primary" : "text-gray-400"}`}
            >
              پرداخت
            </div>
          </div>

          {/* Content based on step */}
          {currentStep === 1 && (
            <CartItems
              handleNextStep={handleOrderSubmit}
              isMobile={true}
              cartData={cartData}
              onCartUpdate={fetchCart}
              isSubmitting={isLoading}
            />
          )}

          {currentStep === 2 && (
            <CartReceiverStepMobile
              receiverInfo={receiverInfo}
              onConfirm={() => setCurrentStep(3)}
              onEdit={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <CartPaymentStepMobile
              walletBalance={wallet.balance || 0}
              isWalletSufficient={(wallet.balance || 0) >= (invoice.total || 0)}
              billSummary={billSummary}
              totalAmount={invoice.total || 0}
              addressId={address.id}
              onPaymentSuccess={handleSuccessPayment}
              setOrderId={setOrderId}
            />
          )}
        </div>

        {/* Main Navigation */}
        <MainNavigation isHomePage={false} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen bg-gray-200 px-10 pt-[25px] pb-[5px] flex-col">
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
              <MainNavigation hasSearchBox isHomePage={false} />
            </div>

            {/* Content */}
            <div className="space-y-1.5 bg-gray-200">
              {/* Show Cart and Order Summary only if not paid */}
              {!isPaid && (
                <>
                  {/* First White Box - Cart Items */}
                  <div className="bg-white rounded-t-lg py-[10px] px-[10px] lg:py-[50px] lg:px-[100px]">
                    <CartItems
                      handleNextStep={handleOrderSubmit}
                      isMobile={false}
                      cartData={cartData}
                      onCartUpdate={fetchCart}
                      isSubmitting={isLoading}
                    />
                  </div>

                  {/* Second White Box - Order Summary */}
                  <div
                    ref={orderSummaryRef}
                    className="bg-white rounded-b-lg py-[10px] px-[10px] lg:py-[50px] lg:px-[100px]"
                  >
                    <OrderSummary
                      handleNextStep={handlePayment}
                      isMobile={false}
                      isOrderSubmitted={isOrderSubmitted}
                      openAccordion={openAccordion}
                      setOpenAccordion={setOpenAccordion}
                      invoiceData={invoiceData}
                      onPaymentSuccess={() => setIsPaid(true)}
                      setOrderId={setOrderId}
                    />
                  </div>
                </>
              )}

              {/* Show Order Items only after payment */}
              {isPaid && (
                <div className="bg-white rounded-lg py-[10px] px-[10px] lg:py-[50px] lg:px-[100px]">
                  <OrderItems isMobile={false} orderId={orderId} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartPageContent;
