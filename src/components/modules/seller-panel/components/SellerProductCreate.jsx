"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SearchIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  MessageTextIcon,
  NoteIcon,
  TrashIcon,
  PlusIcon,
  ChartLineDownSquareIcon,
  CheckCircleIcon,
  VerifyIcon,
} from "@/icons";

const SEARCH_RESULTS = [
  {
    id: 1,
    title: "گوشی موبایل سامسونگ Galaxy S24 Ultra",
    code: "شناسه محصول: SM-S928B/DS",
    category: "گوشی موبایل",
    image: "/assets/images/seller/new-product/s24_ultra.png",
    buttonType: "outline",
    buttonText: "ثبت محصول",
  },
  {
    id: 2,
    title: "گوشی موبایل سامسونگ Galaxy S24 Ultra",
    code: "شناسه محصول: SM-S928B/DS",
    category: "گوشی موبایل",
    image: "/assets/images/seller/new-product/s24_ultra.png",
    buttonType: "primary",
    buttonText: "ثبت محصول",
  },
  {
    id: 3,
    title: "گوشی موبایل سامسونگ Galaxy S24 Ultra",
    code: "شناسه محصول: SM-S928B/DS",
    category: "گوشی موبایل",
    image: "/assets/images/seller/new-product/s24_ultra.png",
    buttonType: "outline",
    buttonText: "ثبت محصول",
  },
  {
    id: 4,
    title: "گوشی موبایل سامسونگ Galaxy S24 Ultra",
    code: "شناسه محصول: SM-S928B/DS",
    category: "گوشی موبایل",
    image: "/assets/images/seller/new-product/s24_ultra.png",
    buttonType: "outline",
    buttonText: "ثبت محصول",
  },
  {
    id: 5,
    title: "گوشی موبایل سامسونگ Galaxy S24 Ultra",
    code: "شناسه محصول: SM-S928B/DS",
    category: "گوشی موبایل",
    image: "/assets/images/seller/new-product/s24_ultra.png",
    buttonType: "outline",
    buttonText: "ثبت محصول",
  },
  {
    id: 6,
    title: "گوشی موبایل سامسونگ Galaxy S24 Ultra",
    code: "شناسه محصول: SM-S928B/DS",
    category: "گوشی موبایل",
    image: "/assets/images/seller/new-product/s24_ultra.png",
    buttonType: "teal",
    buttonText: "ثبت مجوز فروش",
  },
];

const DRAFT_PRODUCTS = [
  {
    id: "draft-1",
    title: "گوشی موبایل سامسونگ Galaxy S24 Ultra",
    code: "شناسه محصول: SM-S928B/DS",
    category: "گوشی موبایل",
    image: "/assets/images/seller/new-product/s24_ultra.png",
  },
  {
    id: "draft-2",
    title: "گوشی موبایل سامسونگ Galaxy S24 Ultra",
    code: "شناسه محصول: SM-S928B/DS",
    category: "گوشی موبایل",
    image: "/assets/images/seller/new-product/s24_ultra.png",
  },
  {
    id: "draft-3",
    title: "گوشی موبایل سامسونگ Galaxy S24 Ultra",
    code: "شناسه محصول: SM-S928B/DS",
    category: "گوشی موبایل",
    image: "/assets/images/seller/new-product/s24_ultra.png",
  },
];

function SellerProductCreate() {
  // Phase 1: 'search' (Figma Node: 44:45285) vs Phase 2: 'configure' (Figma Node: 44:45502)
  const [activeStep, setActiveStep] = useState("search");

  // Search state
  const [searchQuery, setSearchQuery] = useState(
    "گوشی موبایل سامسونگ Galaxy S24 Ultra"
  );
  const [showDraftsEmpty, setShowDraftsEmpty] = useState(false);

  // Configure Form State (Screen 2)
  const [selectedProduct, setSelectedProduct] = useState(SEARCH_RESULTS[1]);
  const [capacity, setCapacity] = useState("۲۵۶ گیگابایت");
  const [color, setColor] = useState("زرد تیتانیوم");
  const [warranty, setWarranty] = useState("۲ ساله آونگ");
  const [authenticity, setAuthenticity] = useState("اصل"); // اصل vs غیر اصل

  // Pricing State
  const [pricingType, setPricingType] = useState("free"); // free, printed, regulatory
  const [sellingPrice, setSellingPrice] = useState("۸۹,۵۰۰,۰۰۰");

  // Branches Stock State
  const [branches, setBranches] = useState([
    { id: 1, name: "تهران مرکزی", stock: "۳" },
    { id: 2, name: "تهران غرب", stock: "۲" },
  ]);

  // Delivery & Sale Method State
  const [saleMethod, setSaleMethod] = useState("both"); // online, in_person, both
  const [inPersonCommitment, setInPersonCommitment] = useState(true);
  const [onlineCommitment, setOnlineCommitment] = useState(true);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActiveStep("configure");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddBranch = () => {
    setBranches((prev) => [
      ...prev,
      { id: Date.now(), name: "شعبه جدید", stock: "۰" },
    ]);
  };

  const handleRemoveBranch = (id) => {
    if (branches.length > 1) {
      setBranches((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col px-4 sm:px-6 lg:px-10 py-6 lg:py-10 pb-24 lg:pb-12 max-w-[1440px] mx-auto gap-6">
      {/* Top Header Bar (Desktop - Figma Node: 44:45287) */}
      <header className="hidden lg:flex items-center justify-between">
        <div className="flex flex-col gap-1 text-right">
          <h1 className="text-[22px] leading-[30px] font-semibold text-text-primary">
            پنل فروشگاه تگ مال
          </h1>
          <p className="text-[12px] leading-[18px] text-text-muted">
            امروز ۳۰ مرداد ماه ۱۴۰۵ ساعت ۱۲:۲۴
          </p>
        </div>

        {/* View Switcher Tabs (For easy demo of both Figma screens) */}
        <div className="flex items-center gap-2 bg-surface p-1 rounded-xl border border-border-default text-xs">
          <button
            type="button"
            onClick={() => setActiveStep("search")}
            className={`px-3.5 py-1.5 rounded-lg transition-colors font-medium ${
              activeStep === "search"
                ? "bg-primary text-white shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            مرحله ۱: جست‌وجو و انتخاب
          </button>
          <button
            type="button"
            onClick={() => setActiveStep("configure")}
            className={`px-3.5 py-1.5 rounded-lg transition-colors font-medium ${
              activeStep === "configure"
                ? "bg-primary text-white shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            مرحله ۲: قیمت‌گذاری و تنوع
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SCREEN 1: Search & Select Product (Figma Node: 44:45285) */}
      {/* ========================================================================= */}
      {activeStep === "search" && (
        <div className="w-full bg-surface rounded-[20px] p-6 lg:p-8 border border-border-default/60 flex flex-col gap-8 shadow-xs">
          {/* Section 1: Search Header & Input */}
          <div className="flex flex-col gap-5 text-right">
            {/* Header: Title + Search Icon */}
            <div className="flex items-center justify-start gap-3">
              <h2 className="text-[18px] font-semibold text-text-primary">
                جست‌وجوی محصول
              </h2>
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                <SearchIcon size={20} />
              </div>
            </div>

            {/* Search Input Bar (Input on Right, Button on Left in RTL) */}
            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                className="h-12 px-6 rounded-xl bg-surface-subtle border border-border-default text-text-secondary text-[14px] font-normal hover:bg-surface hover:border-primary/40 transition-colors shrink-0"
              >
                جست‌وجو
              </button>

              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="نام محصول، برند یا شناسه کالا را وارد کنید..."
                  className="w-full h-12 rounded-xl bg-surface-subtle border border-border-default px-4 text-right text-[14px] text-text-primary placeholder:text-text-muted focus:outline-hidden focus:border-primary focus:bg-surface transition-colors"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Search Results Grid (6 Results) */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-text-primary">
                نتایج جست‌وجو
              </h3>
              <span className="text-[13px] text-text-muted">۶ نتیجه</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SEARCH_RESULTS.map((product) => (
                <div
                  key={product.id}
                  className="bg-surface rounded-2xl p-4 border border-border-default/70 flex flex-col justify-between gap-4 hover:border-primary/40 transition-all shadow-xs"
                >
                  {/* Top info row: Image on RIGHT in RTL, Text on LEFT */}
                  <div className="flex items-start gap-3 text-right">
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <h4 className="text-[14px] font-semibold text-text-primary leading-snug line-clamp-2">
                        {product.title}
                      </h4>
                      <span className="text-[12px] text-text-muted font-normal">
                        {product.code}
                      </span>
                      <span className="text-[12px] text-text-secondary font-medium">
                        {product.category}
                      </span>
                    </div>

                    <div className="relative w-18 h-18 rounded-lg overflow-hidden shrink-0 bg-surface-subtle border border-border-subtle p-1 flex items-center justify-center">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="72px"
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  {product.buttonType === "primary" ? (
                    <button
                      type="button"
                      onClick={() => handleSelectProduct(product)}
                      className="w-full h-10 rounded-xl bg-primary text-white text-[13px] font-semibold hover:bg-primary-hover transition-colors shadow-xs"
                    >
                      {product.buttonText}
                    </button>
                  ) : product.buttonType === "teal" ? (
                    <button
                      type="button"
                      onClick={() => handleSelectProduct(product)}
                      className="w-full h-10 rounded-xl bg-[#108981] text-white text-[13px] font-semibold hover:bg-[#108981]/90 transition-colors shadow-xs"
                    >
                      {product.buttonText}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelectProduct(product)}
                      className="w-full h-10 rounded-xl bg-surface-subtle text-text-secondary border border-border-default text-[13px] font-normal hover:bg-surface hover:text-primary transition-colors"
                    >
                      {product.buttonText}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Help / Request Product Banner (Figma Node: 44:45320) */}
          <div className="rounded-2xl bg-surface-subtle border border-border-subtle p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              className="h-11 px-5 rounded-xl bg-[#3d3183] text-white text-[13px] font-semibold flex items-center gap-2 hover:bg-[#342970] transition-colors shrink-0 shadow-xs"
            >
              <MessageTextIcon size={18} />
              <span>درخواست معرفی محصول</span>
            </button>

            <div className="flex items-center gap-3 text-right">
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-text-primary">
                  محصول موردنظر را پیدا نکردید؟
                </span>
                <span className="text-[12px] text-text-muted mt-0.5">
                  محصول پس از بررسی، برای تکمیل اطلاعات فروش در دسترس شما قرار
                  می‌گیرد
                </span>
              </div>

              <div className="w-10 h-10 rounded-full bg-primary-50 text-primary flex items-center justify-center shrink-0">
                <VerifyIcon size={20} />
              </div>
            </div>
          </div>

          {/* Section 4: Drafts Section (Figma Node: 44:45329) */}
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowDraftsEmpty(!showDraftsEmpty)}
                className="text-[13px] text-text-muted hover:text-text-primary transition-colors flex items-center gap-1 select-none"
              >
                <span>مشاهده همه</span>
                <ChevronLeftIcon size={16} />
              </button>

              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-semibold text-text-primary">
                  محصولات پیش‌نویس شده
                </h3>
                <div className="w-8 h-8 rounded-lg bg-surface-subtle text-text-secondary flex items-center justify-center">
                  <NoteIcon size={18} />
                </div>
              </div>
            </div>

            {/* Draft Cards */}
            {!showDraftsEmpty ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DRAFT_PRODUCTS.map((draft) => (
                  <div
                    key={draft.id}
                    className="bg-surface rounded-2xl p-4 border border-border-default/70 flex flex-col justify-between gap-4 shadow-xs"
                  >
                    <div className="flex items-start gap-3 text-right">
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <h4 className="text-[14px] font-semibold text-text-primary leading-snug line-clamp-2">
                          {draft.title}
                        </h4>
                        <span className="text-[12px] text-text-muted font-normal">
                          {draft.code}
                        </span>
                        <span className="text-[12px] text-text-secondary font-medium">
                          {draft.category}
                        </span>
                      </div>

                      <div className="relative w-18 h-18 rounded-lg overflow-hidden shrink-0 bg-surface-subtle border border-border-subtle p-1 flex items-center justify-center">
                        <Image
                          src={draft.image}
                          alt={draft.title}
                          fill
                          sizes="72px"
                          className="object-contain"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectProduct(draft)}
                      className="w-full h-10 rounded-xl bg-surface-subtle text-text-secondary border border-border-default text-[13px] font-normal hover:bg-surface hover:text-primary transition-colors"
                    >
                      ادامه و تکمیل
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Empty Drafts State (Figma Node: 44:45374) */}
            <div className="rounded-2xl border border-dashed border-border-default/80 p-8 flex flex-col items-center justify-center gap-3 bg-surface-subtle/30 text-center mt-2">
              <div className="relative w-44 h-36">
                <Image
                  src="/assets/images/seller/new-product/empty_drafts.png"
                  alt="محصولات پیش‌نویس شده وجود ندارد"
                  fill
                  sizes="176px"
                  className="object-contain"
                />
              </div>
              <p className="text-[14px] text-text-muted font-normal">
                محصولات پیش نویس شده وجود ندارد
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: Configure & Submit Product (Figma Node: 44:45502) */}
      {/* ========================================================================= */}
      {activeStep === "configure" && (
        <div className="w-full flex flex-col gap-6 text-right">
          {/* Card 0: Selected Product Card (Figma Node: 44:45505) */}
          <section className="bg-surface rounded-[20px] p-6 lg:p-8 border border-border-default/60 flex flex-col gap-5 shadow-xs">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveStep("search")}
                className="text-[13px] text-primary hover:underline font-medium"
              >
                تغییر یا جست‌وجوی مجدد محصول
              </button>

              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-semibold text-text-primary">
                  محصول انتخاب‌شده
                </h2>
                <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary flex items-center justify-center">
                  <CheckCircleIcon size={18} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border-default p-4 flex items-center justify-between bg-surface-subtle/30">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span>دسته‌بندی: کالای دیجیتال</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1 text-right">
                  <h3 className="text-[15px] font-bold text-text-primary">
                    {selectedProduct.title}
                  </h3>
                  <span className="text-[12px] text-text-muted">
                    {selectedProduct.code}
                  </span>
                </div>

                <div className="relative w-18 h-18 rounded-xl overflow-hidden shrink-0 bg-surface border border-border-subtle p-1 flex items-center justify-center">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    fill
                    sizes="72px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {/* STEP 1: انتخاب تنوع محصول */}
            <div className="flex flex-col gap-5 pt-3">
              <div className="flex items-start justify-end gap-3">
                <div className="flex flex-col text-right">
                  <h3 className="text-[16px] font-semibold text-text-primary">
                    انتخاب تنوع محصول
                  </h3>
                  <span className="text-[12px] text-text-muted mt-0.5">
                    اطلاعات این بخش برای خریدار نمایش داده می‌شود. انتخاب اصالت
                    الزامی است.
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary-50 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                  ۱
                </div>
              </div>

              {/* Form Grid: 4 fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Color */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] text-text-secondary">رنگ</label>
                  <div className="relative">
                    <select
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full h-12 rounded-xl border border-border-default px-4 text-[13px] bg-surface text-text-primary appearance-none cursor-pointer focus:border-primary focus:outline-hidden"
                      dir="rtl"
                    >
                      <option value="زرد تیتانیوم">زرد تیتانیوم</option>
                      <option value="مشکی ذغالی">مشکی ذغالی</option>
                      <option value="خاکستری تیتانیوم">خاکستری تیتانیوم</option>
                    </select>
                    <ChevronDownIcon
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                    />
                  </div>
                </div>

                {/* 2. Capacity */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] text-text-secondary">
                    ظرفیت
                  </label>
                  <div className="relative">
                    <select
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="w-full h-12 rounded-xl border border-border-default px-4 text-[13px] bg-surface text-text-primary appearance-none cursor-pointer focus:border-primary focus:outline-hidden"
                      dir="rtl"
                    >
                      <option value="۲۵۶ گیگابایت">۲۵۶ گیگابایت</option>
                      <option value="۵۱۲ گیگابایت">۵۱۲ گیگابایت</option>
                      <option value="۱ ترابایت">۱ ترابایت</option>
                    </select>
                    <ChevronDownIcon
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                    />
                  </div>
                </div>

                {/* 3. Authenticity (Radio) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] text-text-secondary">
                    اصالت کالا (الزامی)
                  </label>
                  <div className="flex items-center justify-end gap-6 h-12 px-4 rounded-xl border border-border-default bg-surface">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="text-[13px] text-text-primary">
                        غیر اصل
                      </span>
                      <input
                        type="radio"
                        name="authenticity"
                        value="غیر اصل"
                        checked={authenticity === "غیر اصل"}
                        onChange={() => setAuthenticity("غیر اصل")}
                        className="accent-primary w-4 h-4"
                      />
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="text-[13px] text-text-primary">اصل</span>
                      <input
                        type="radio"
                        name="authenticity"
                        value="اصل"
                        checked={authenticity === "اصل"}
                        onChange={() => setAuthenticity("اصل")}
                        className="accent-primary w-4 h-4"
                      />
                    </label>
                  </div>
                </div>

                {/* 4. Warranty */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] text-text-secondary">
                    گارانتی
                  </label>
                  <div className="relative">
                    <select
                      value={warranty}
                      onChange={(e) => setWarranty(e.target.value)}
                      className="w-full h-12 rounded-xl border border-border-default px-4 text-[13px] bg-surface text-text-primary appearance-none cursor-pointer focus:border-primary focus:outline-hidden"
                      dir="rtl"
                    >
                      <option value="۲ ساله آونگ">۲ ساله آونگ</option>
                      <option value="۱۸ماهه شرکت آوای پارس">
                        ۱۸ماهه شرکت آوای پارس
                      </option>
                      <option value="گارانتی شرکتی">گارانتی شرکتی</option>
                    </select>
                    <ChevronDownIcon
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Help box: تنوع محصول مورد نظر را پیدا نکردید؟ */}
              <div className="rounded-xl bg-surface-subtle border border-border-subtle p-4 flex flex-col sm:flex-row items-center justify-between gap-3 mt-1">
                <button
                  type="button"
                  className="h-10 px-4 rounded-xl bg-[#3d3183] text-white text-[12px] font-semibold flex items-center gap-2 hover:bg-[#342970] transition-colors shrink-0"
                >
                  <MessageTextIcon size={16} />
                  <span>درخواست معرفی تنوع</span>
                </button>

                <div className="flex items-center gap-2 text-right">
                  <span className="text-[13px] text-text-secondary">
                    تنوع محصول مورد نظر را پیدا نکردید ؟
                  </span>
                  <div className="w-7 h-7 rounded-full bg-primary-50 text-primary flex items-center justify-center shrink-0">
                    <VerifyIcon size={16} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* STEP 2: قیمت‌گذاری (Figma Node: 44:45548) */}
          <section className="bg-surface rounded-[20px] p-6 lg:p-8 border border-border-default/60 flex flex-col gap-5 shadow-xs">
            <div className="flex items-start justify-end gap-3">
              <div className="flex flex-col text-right">
                <h3 className="text-[16px] font-semibold text-text-primary">
                  قیمت‌گذاری
                </h3>
                <span className="text-[12px] text-text-muted mt-0.5">
                  مبنای قیمت‌گذاری را انتخاب کنید؛ سپس قیمت فروش همین تنوع را
                  وارد کنید. (الزامی)
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-50 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                ۲
              </div>
            </div>

            {/* Pricing Types Radio Cards (3 cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Card 1: قیمت‌گذاری آزاد */}
              <button
                type="button"
                onClick={() => setPricingType("free")}
                className={`p-4 rounded-2xl border text-right flex flex-col gap-2 transition-all ${
                  pricingType === "free"
                    ? "bg-primary-50/60 border-primary"
                    : "border-border-default bg-surface hover:border-border-hover"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      pricingType === "free"
                        ? "border-primary bg-primary"
                        : "border-border-default bg-surface"
                    }`}
                  >
                    {pricingType === "free" && (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="text-[14px] font-bold text-text-primary">
                    قیمت‌گذاری آزاد
                  </span>
                </div>
                <span className="text-[11px] text-text-muted leading-relaxed">
                  بدون محدودیت قیمت مصوب؛ قیمت فروش را خودتان تعیین کنید.
                </span>
              </button>

              {/* Card 2: قیمت مصوب روی کالا */}
              <button
                type="button"
                onClick={() => setPricingType("printed")}
                className={`p-4 rounded-2xl border text-right flex flex-col gap-2 transition-all ${
                  pricingType === "printed"
                    ? "bg-primary-50/60 border-primary"
                    : "border-border-default bg-surface hover:border-border-hover"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      pricingType === "printed"
                        ? "border-primary bg-primary"
                        : "border-border-default bg-surface"
                    }`}
                  >
                    {pricingType === "printed" && (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="text-[14px] font-bold text-text-primary">
                    قیمت مصوب روی کالا
                  </span>
                </div>
                <span className="text-[11px] text-text-muted leading-relaxed">
                  قیمت درج‌شده روی کالا را مبنا قرار دهید؛ مبلغ فروش نباید بیشتر
                  از آن باشد.
                </span>
              </button>

              {/* Card 3: قیمت مصوب نظارتی */}
              <button
                type="button"
                onClick={() => setPricingType("regulatory")}
                className={`p-4 rounded-2xl border text-right flex flex-col gap-2 transition-all ${
                  pricingType === "regulatory"
                    ? "bg-primary-50/60 border-primary"
                    : "border-border-default bg-surface hover:border-border-hover"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      pricingType === "regulatory"
                        ? "border-primary bg-primary"
                        : "border-border-default bg-surface"
                    }`}
                  >
                    {pricingType === "regulatory" && (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="text-[14px] font-bold text-text-primary">
                    قیمت مصوب نظارتی
                  </span>
                </div>
                <span className="text-[11px] text-text-muted leading-relaxed">
                  مبلغ مصوب مرجع نظارتی را وارد کنید؛ فروش بالاتر از آن مجاز
                  نیست.
                </span>
              </button>
            </div>

            {/* Price Input */}
            <div className="flex flex-col gap-1.5 max-w-md ml-auto w-full">
              <label className="text-[13px] text-text-secondary">
                قیمت فروش (الزامی) • تومان
              </label>
              <input
                type="text"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="مبلغ را به تومان وارد کنید"
                className="w-full h-12 rounded-xl border border-border-default px-4 text-right text-[14px] text-text-primary font-semibold focus:border-primary focus:outline-hidden"
                dir="rtl"
              />
              <span className="text-[11px] text-text-muted">
                این قیمت برای هر دستگاه از تنوع انتخاب‌شده ثبت می‌شود.
              </span>
            </div>

            {/* Competitor Price Alert Banner (Figma Node: 44:45586) */}
            <div className="rounded-xl bg-[#e8f7f5] border border-[#a2e5db] p-3.5 flex items-center justify-center gap-2 text-right">
              <span className="text-[13px] font-medium text-[#0d7870]">
                کم ترین قیمت اعلام شده توسط سایر فروشندگان ۲۳,۰۰۰,۰۰۰ تومان
              </span>
              <ChartLineDownSquareIcon size={18} color="#0d7870" />
            </div>
          </section>

          {/* STEP 3: موجودی در شعب (Figma Node: 44:45588) */}
          <section className="bg-surface rounded-[20px] p-6 lg:p-8 border border-border-default/60 flex flex-col gap-5 shadow-xs">
            <div className="flex items-start justify-end gap-3">
              <div className="flex flex-col text-right">
                <h3 className="text-[16px] font-semibold text-text-primary">
                  موجودی در شعب
                </h3>
                <span className="text-[12px] text-text-muted mt-0.5">
                  موجودی قابل فروش همین تنوع را برای هر شعبه وارد کنید. حداقل یک
                  شعبه الزامی است.
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-50 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                ۳
              </div>
            </div>

            {/* Branch Inputs */}
            <div className="flex flex-col gap-3">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="rounded-2xl border border-border-default p-4 flex flex-col sm:flex-row items-center gap-3 bg-surface-subtle/20"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveBranch(branch.id)}
                    className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors shrink-0"
                    title="حذف شعبه"
                  >
                    <TrashIcon size={18} />
                  </button>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] text-text-muted">
                        موجودی قابل فروش
                      </label>
                      <input
                        type="text"
                        defaultValue={branch.stock}
                        className="h-11 rounded-xl border border-border-default px-3 text-right text-[13px] text-text-primary bg-surface focus:border-primary focus:outline-hidden"
                        dir="rtl"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] text-text-muted">
                        شعبه
                      </label>
                      <div className="relative">
                        <select
                          defaultValue={branch.name}
                          className="w-full h-11 rounded-xl border border-border-default px-3 text-[13px] text-text-primary bg-surface appearance-none focus:border-primary focus:outline-hidden cursor-pointer"
                          dir="rtl"
                        >
                          <option value="تهران مرکزی">تهران مرکزی</option>
                          <option value="تهران غرب">تهران غرب</option>
                          <option value="اصفهان">اصفهان</option>
                          <option value="شیراز">شیراز</option>
                        </select>
                        <ChevronDownIcon
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Branch Button & Total Stock Badge */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleAddBranch}
                className="h-10 px-4 rounded-xl border border-border-default text-text-secondary text-[13px] font-medium hover:bg-surface-subtle hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <PlusIcon size={16} />
                <span>افزودن شعبه</span>
              </button>

              <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-primary-50 text-primary text-[12px] font-semibold">
                مجموع موجودی: ۵ عدد در ۲ شعبه
              </span>
            </div>

            <p className="text-[11px] text-text-muted">
              برای شعبه بدون موجودی، عدد صفر وارد کنید یا آن شعبه را حذف کنید.
              موجودی آنلاین و حضوری مشترک است؛ یک کالا را دو بار نشمارید.
            </p>
          </section>

          {/* STEP 4: روش فروش و تعهدات تحویل (Figma Node: 44:45618) */}
          <section className="bg-surface rounded-[20px] p-6 lg:p-8 border border-border-default/60 flex flex-col gap-5 shadow-xs">
            <div className="flex items-start justify-end gap-3">
              <div className="flex flex-col text-right">
                <h3 className="text-[16px] font-semibold text-text-primary">
                  روش فروش و تعهدات تحویل
                </h3>
                <span className="text-[12px] text-text-muted mt-0.5">
                  با انتخاب روش فروش، فقط شرایط تحویل مرتبط را تکمیل کنید.
                  (الزامی)
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-50 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                ۴
              </div>
            </div>

            {/* Sale Method Radios: آنلاین، حضوری، آنلاین و حضوری */}
            <div className="flex items-center justify-end gap-6 py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-[13px] text-text-primary">آنلاین</span>
                <input
                  type="radio"
                  name="saleMethod"
                  value="online"
                  checked={saleMethod === "online"}
                  onChange={() => setSaleMethod("online")}
                  className="accent-primary w-4 h-4"
                />
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-[13px] text-text-primary">حضوری</span>
                <input
                  type="radio"
                  name="saleMethod"
                  value="in_person"
                  checked={saleMethod === "in_person"}
                  onChange={() => setSaleMethod("in_person")}
                  className="accent-primary w-4 h-4"
                />
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-[13px] font-semibold text-primary">
                  آنلاین و حضوری
                </span>
                <input
                  type="radio"
                  name="saleMethod"
                  value="both"
                  checked={saleMethod === "both"}
                  onChange={() => setSaleMethod("both")}
                  className="accent-primary w-4 h-4"
                />
              </label>
            </div>

            {/* 2 Subsections: In-Person Delivery + Online Shipping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Box A: فروش حضوری • تحویل در شعبه */}
              <div className="rounded-2xl border border-border-default/80 p-5 flex flex-col gap-4 bg-surface-subtle/20">
                <h4 className="text-[14px] font-bold text-text-primary">
                  فروش حضوری • تحویل در شعبه
                </h4>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] text-text-secondary">
                    زمان آماده‌سازی برای تحویل
                  </label>
                  <div className="relative">
                    <select
                      className="w-full h-11 rounded-xl border border-border-default px-3 text-[13px] bg-surface text-text-primary appearance-none focus:border-primary focus:outline-hidden"
                      dir="rtl"
                    >
                      <option>آماده‌سازی: ۱ روز کاری</option>
                      <option>تحویل فوری (۲ ساعت)</option>
                      <option>آماده‌سازی: ۲ روز کاری</option>
                    </select>
                    <ChevronDownIcon
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                    />
                  </div>
                </div>

                <span className="text-[11px] text-text-muted">
                  تحویل حضوری فقط در شعب دارای موجودی انجام می‌شود.
                </span>

                <label className="flex items-start gap-2.5 cursor-pointer text-[12px] text-text-secondary leading-relaxed mt-auto select-none">
                  <input
                    type="checkbox"
                    checked={inPersonCommitment}
                    onChange={(e) => setInPersonCommitment(e.target.checked)}
                    className="accent-primary w-4 h-4 mt-0.5 shrink-0"
                  />
                  <span>
                    متعهد می‌شوم کالا را در زمان اعلام‌شده آماده کنم و در شعبه
                    منتخب به خریدار تحویل دهم.
                  </span>
                </label>
              </div>

              {/* Box B: فروش آنلاین • ارسال سفارش */}
              <div className="rounded-2xl border border-border-default/80 p-5 flex flex-col gap-4 bg-surface-subtle/20">
                <h4 className="text-[14px] font-bold text-text-primary">
                  فروش آنلاین • ارسال سفارش
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] text-text-secondary">
                      روش ارسال
                    </label>
                    <div className="relative">
                      <select
                        className="w-full h-11 rounded-xl border border-border-default px-3 text-[13px] bg-surface text-text-primary appearance-none focus:border-primary focus:outline-hidden"
                        dir="rtl"
                      >
                        <option>پست پیشتاز</option>
                        <option>تیپاکس</option>
                        <option>پیک اختصاصی</option>
                      </select>
                      <ChevronDownIcon
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] text-text-secondary">
                      آماده‌سازی و ارسال
                    </label>
                    <div className="relative">
                      <select
                        className="w-full h-11 rounded-xl border border-border-default px-3 text-[13px] bg-surface text-text-primary appearance-none focus:border-primary focus:outline-hidden"
                        dir="rtl"
                      >
                        <option>ارسال تا ۲۴ ساعت</option>
                        <option>ارسال تا ۴۸ ساعت</option>
                        <option>ارسال همان روز</option>
                      </select>
                      <ChevronDownIcon
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                <span className="text-[11px] text-text-muted">
                  این زمان تا تحویل به شرکت حمل است، نه زمان رسیدن به خریدار.
                </span>

                <label className="flex items-start gap-2.5 cursor-pointer text-[12px] text-text-secondary leading-relaxed mt-auto select-none">
                  <input
                    type="checkbox"
                    checked={onlineCommitment}
                    onChange={(e) => setOnlineCommitment(e.target.checked)}
                    className="accent-primary w-4 h-4 mt-0.5 shrink-0"
                  />
                  <span>
                    متعهد می‌شوم سفارش را در زمان اعلام‌شده آماده و ارسال کنم و
                    کد رهگیری را در سفارش ثبت کنم.
                  </span>
                </label>
              </div>
            </div>
          </section>

          {/* STEP 5: مرور و ثبت محصول (Figma Node: 44:45656) */}
          <section className="bg-surface rounded-[20px] p-6 lg:p-8 border border-border-default/60 flex flex-col gap-5 shadow-xs">
            <div className="flex items-start justify-end gap-3">
              <div className="flex flex-col text-right">
                <h3 className="text-[16px] font-semibold text-text-primary">
                  مرور و ثبت محصول
                </h3>
                <span className="text-[12px] text-text-muted mt-0.5">
                  اطلاعات زیر برای تنوع {color}، {capacity} و گارانتی {warranty}{" "}
                  ثبت می‌شود.
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-50 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                ۵
              </div>
            </div>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl border border-border-default/70 bg-surface-subtle/30 flex flex-col gap-1 text-right">
                <span className="text-[12px] text-text-muted">
                  اصالت و گارانتی
                </span>
                <span className="text-[13px] font-semibold text-text-primary">
                  {authenticity} • {warranty}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-border-default/70 bg-surface-subtle/30 flex flex-col gap-1 text-right">
                <span className="text-[12px] text-text-muted">
                  قیمت هر دستگاه
                </span>
                <span className="text-[13px] font-semibold text-[#108981]">
                  {sellingPrice} تومان
                </span>
              </div>

              <div className="p-4 rounded-xl border border-border-default/70 bg-surface-subtle/30 flex flex-col gap-1 text-right">
                <span className="text-[12px] text-text-muted">
                  موجودی قابل فروش
                </span>
                <span className="text-[13px] font-semibold text-text-primary">
                  ۵ عدد • ۲ شعبه
                </span>
              </div>

              <div className="p-4 rounded-xl border border-border-default/70 bg-surface-subtle/30 flex flex-col gap-1 text-right">
                <span className="text-[12px] text-text-muted">روش فروش</span>
                <span className="text-[13px] font-semibold text-text-primary">
                  {saleMethod === "both"
                    ? "آنلاین و حضوری"
                    : saleMethod === "online"
                    ? "آنلاین"
                    : "حضوری"}
                </span>
              </div>
            </div>

            {/* Final Info Note */}
            <div className="rounded-xl bg-surface-subtle p-3.5 border border-border-subtle/60 flex items-center gap-2.5 text-[12px] text-text-muted">
              <span className="flex-1 text-right leading-relaxed">
                با ثبت نهایی، این تنوع به محصولات شما اضافه و برای کاربران نمایش
                داده می‌شود. ویرایش قیمت، موجودی و شرایط فروش بعد از ثبت از بخش
                «محصولات من – محصولات تأیید‌شده» انجام می‌شود.
              </span>
              <VerifyIcon size={18} color="#7a7a96" className="shrink-0" />
            </div>

            {/* Action Buttons Footer (Figma Node: 44:45688) */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-border-subtle">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="h-12 px-8 rounded-xl bg-primary text-white text-[14px] font-semibold hover:bg-primary-hover transition-colors shadow-xs"
                >
                  ثبت نهایی محصول
                </button>

                <button
                  type="button"
                  className="h-12 px-6 rounded-xl border border-border-default bg-surface text-text-secondary text-[14px] font-normal hover:bg-surface-subtle transition-colors"
                >
                  پیش نویس محصول
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveStep("search")}
                className="h-12 px-5 text-text-muted hover:text-text-primary text-[14px] font-normal transition-colors"
              >
                انصراف
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default SellerProductCreate;
