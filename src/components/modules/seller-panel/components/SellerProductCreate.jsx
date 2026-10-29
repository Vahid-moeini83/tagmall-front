"use client";

import { useState } from "react";
import Image from "next/image";
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
  HintIcon,
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
    "گوشی موبایل سامسونگ Galaxy S24 Ultra",
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
  const [sellingPrice, setSellingPrice] = useState("۸۹٬۵۰۰٬۰۰۰");

  // Branches Stock State
  const [branches, setBranches] = useState([
    { id: 1, name: "تهران مرکزی", stock: "۳" },
    { id: 2, name: "تهران ونک", stock: "۲" },
  ]);

  // Delivery & Sale Method State
  const [saleMethod, setSaleMethod] = useState("in_person"); // online, in_person, both
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
    <div
      className="w-full flex-1 flex flex-col px-4 sm:px-6 lg:px-10 py-6 lg:py-10 pb-24 lg:pb-12 max-w-[1440px] mx-auto gap-6 select-text"
      dir="rtl"
    >
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

        {/* View Switcher Tabs (For preview of both Figma screens) */}
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
        <div className="w-full bg-surface rounded-card p-6 lg:p-[28px] border border-border-default/60 flex flex-col gap-8 shadow-xs">
          {/* Section 1: Search Header & Input */}
          <div className="flex flex-col text-right">
            {/* CardHeader (1004x44 @ 0,0 in Figma) */}
            <div className="flex items-center justify-start gap-3">
              {/* Icon 44x44 on RIGHT in RTL (Figma: Frame 44x44 @ 960,0) */}
              <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                <SearchIcon size={24} />
              </div>

              {/* Title on the LEFT of Icon in RTL (Figma: TEXT @ 813,9) */}
              <h2 className="text-[16px] leading-[26px] font-normal text-text-primary">
                جست‌وجوی محصول
              </h2>
            </div>

            {/* Figma Line Divider (1004x0 @ 0,60 stroke:#f3f4f6) */}
            <div className="w-full h-px bg-surface-muted mt-4 mb-5" />

            {/* SearchRow: Input on Right, Button on Left in RTL */}
            <div className="flex items-center gap-3 w-full">
              {/* SearchBarContainer (Figma: 903x50 @ 101,0 r:16 fill:#f9fafb) */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="نام محصول، برند یا شناسه کالا را وارد کنید..."
                  className="w-full h-[50px] rounded-xl bg-surface-subtle border border-surface-subtle px-4 text-right text-[14px] text-text-primary placeholder:text-text-muted focus:outline-hidden focus:border-primary/40 focus:bg-surface transition-colors"
                  dir="rtl"
                />
              </div>

              {/* Search Button on far left (Figma: Frame 89x50 @ 0,0 r:12 fill:#f9fafb) */}
              <button
                type="button"
                className="w-[89px] h-[50px] rounded-xl bg-surface-subtle text-text-muted text-[16px] font-normal hover:bg-primary-50 hover:text-primary transition-colors shrink-0 flex items-center justify-center cursor-pointer"
              >
                جست‌وجو
              </button>
            </div>
          </div>

          {/* Section 2: Search Results Grid (6 Results) */}
          <div className="flex flex-col gap-4">
            {/* ResultsHeader (Figma: 1004x26) */}
            <div className="flex items-center justify-between">
              {/* Right: نتایج جست‌وجو (size 16, weight 325, #1a1a2e) */}
              <h3 className="text-[16px] font-normal text-text-primary">
                نتایج جست‌وجو
              </h3>

              {/* Left: ۶ نتیجه (size 14, weight 325, #4a4a68) */}
              <span className="text-[14px] text-text-secondary">۶ نتیجه</span>
            </div>

            {/* ResultsGrid (Figma: 3 columns, 2 rows, gap 16px) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SEARCH_RESULTS.map((product) => {
                const isSelectedBorder = product.buttonType === "primary";
                return (
                  <div
                    key={product.id}
                    className={`bg-surface rounded-2xl p-4 border flex flex-col justify-between gap-4 transition-all shadow-xs ${
                      isSelectedBorder
                        ? "border-primary"
                        : "border-border-default hover:border-primary/40"
                    }`}
                  >
                    {/* Top info row: Image on RIGHT in RTL, Text on LEFT */}
                    <div className="flex items-start gap-3 text-right">
                      {/* Image on Right in RTL (Figma: Rectangle 72x72 @ 220,12 r:12) */}
                      <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden shrink-0 bg-surface-subtle border border-border-subtle p-1 flex items-center justify-center">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          sizes="72px"
                          className="object-contain"
                        />
                      </div>

                      {/* Text on Left (Figma: Frame 208x96 @ 0,0) */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <h4 className="text-[14px] leading-snug font-medium text-text-primary line-clamp-2">
                          {product.title}
                        </h4>
                        <span className="text-[14px] text-text-secondary font-normal">
                          {product.code}
                        </span>
                        <span className="text-[14px] text-text-muted font-normal">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    {product.buttonType === "primary" ? (
                      <button
                        type="button"
                        onClick={() => handleSelectProduct(product)}
                        className="w-full h-[46px] rounded-lg bg-primary text-white text-[14px] font-normal hover:bg-primary-600 transition-colors cursor-pointer"
                      >
                        {product.buttonText}
                      </button>
                    ) : product.buttonType === "teal" ? (
                      <button
                        type="button"
                        onClick={() => handleSelectProduct(product)}
                        className="w-full h-[50px] rounded-xl bg-success-strong text-white text-[16px] font-normal hover:bg-success transition-colors cursor-pointer"
                      >
                        {product.buttonText}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSelectProduct(product)}
                        className="w-full h-[46px] rounded-lg bg-surface-muted text-text-secondary text-[14px] font-normal hover:bg-border-default hover:text-text-primary transition-colors cursor-pointer"
                      >
                        {product.buttonText}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* NoResultState Banner (Figma: 1004x110 @ 0,520 r:16 fill:#f9fafb stroke:#e5e7eb p:24) */}
            <div className="rounded-2xl bg-surface-subtle border border-border-default p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
              {/* Right block: Icon + Texts */}
              <div className="flex items-center gap-3 text-right">
                {/* Icon 44x44 on RIGHT (Figma: Frame 44x44 r:12 fill:#eeeff6) */}
                <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                  <HintIcon size={24} />
                </div>

                <div className="flex flex-col">
                  <span className="text-[18px] leading-[28px] font-normal text-text-primary">
                    محصول موردنظر را پیدا نکردید؟
                  </span>
                  <span className="text-[14px] leading-[22px] text-text-secondary mt-0.5">
                    محصول پس از بررسی، برای تکمیل اطلاعات فروش در دسترس شما قرار
                    می‌گیرد
                  </span>
                </div>
              </div>

              {/* Left block: Action Button (Figma: Frame 252x50 r:12 fill:#3d3183) */}
              <button
                type="button"
                className="h-[50px] px-6 rounded-xl bg-primary text-white text-[16px] font-normal flex items-center gap-2 hover:bg-primary-600 transition-colors shrink-0 cursor-pointer"
              >
                <MessageTextIcon size={24} />
                <span>درخواست معرفی محصول</span>
              </button>
            </div>
          </div>

          {/* Section 4: Drafts Section (Figma: 1004x258 @ 28,758) */}
          <div className="flex flex-col gap-4 pt-2">
            {/* Drafts Header */}
            <div className="flex items-center justify-between">
              {/* Right: Icon 44x44 + "محصولات پیش نویس شده" (size 16, #1a1a2e) */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                  <NoteIcon size={24} />
                </div>
                <h3 className="text-[16px] font-normal text-text-primary">
                  محصولات پیش نویس شده
                </h3>
              </div>

              {/* Left: "مشاهده همه" (size 12, #1a1a2e) with angle-left */}
              <button
                type="button"
                onClick={() => setShowDraftsEmpty(!showDraftsEmpty)}
                className="text-[12px] text-text-primary hover:text-primary transition-colors flex items-center gap-1 select-none cursor-pointer"
              >
                <span>مشاهده همه</span>
                <ChevronLeftIcon size={18} />
              </button>
            </div>

            {/* Draft Cards */}
            {!showDraftsEmpty ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DRAFT_PRODUCTS.map((draft) => (
                  <div
                    key={draft.id}
                    className="bg-surface rounded-2xl p-4 border border-border-default flex flex-col justify-between gap-4 shadow-xs"
                  >
                    <div className="flex items-start gap-3 text-right">
                      {/* Image 72x72 on Right */}
                      <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden shrink-0 bg-surface-subtle border border-border-subtle p-1 flex items-center justify-center">
                        <Image
                          src={draft.image}
                          alt={draft.title}
                          fill
                          sizes="72px"
                          className="object-contain"
                        />
                      </div>

                      {/* Text on Left */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <h4 className="text-[16px] font-normal text-text-primary leading-snug line-clamp-2">
                          {draft.title}
                        </h4>
                        <span className="text-[14px] text-text-secondary font-normal">
                          {draft.code}
                        </span>
                        <span className="text-[14px] text-text-muted font-normal">
                          {draft.category}
                        </span>
                      </div>
                    </div>

                    {/* Button (Figma: Frame 292x46 r:12 fill:#f3f4f6 text:#1a1a2e size 16) */}
                    <button
                      type="button"
                      onClick={() => handleSelectProduct(draft)}
                      className="w-full h-[46px] rounded-xl bg-surface-muted text-text-primary text-[16px] font-normal hover:bg-border-default transition-colors cursor-pointer"
                    >
                      ادامه و تکمیل
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Empty Drafts State (Figma Node: 44:45374) */}
            <div className="rounded-2xl border border-dashed border-border-default p-8 flex flex-col items-center justify-center gap-3 bg-surface-subtle/30 text-center mt-2">
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
          {/* ===================================================================== */}
          {/* Section 1: Product and authenticity (Figma: 1060x665 r:20 fill:#ffffff p:28) */}
          {/* ===================================================================== */}
          <section className="bg-surface rounded-card p-6 lg:p-[28px] border border-border-default/60 flex flex-col gap-6 shadow-xs">
            {/* CardHeader (Figma: 1004x40) */}
            <div className="flex items-center justify-between">
              {/* Right: Icon 40x40 + "محصول انتخاب‌شده" (size 18, #1a1a2e) */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                  <CheckCircleIcon size={20} />
                </div>
                <h2 className="text-[18px] font-normal text-text-primary">
                  محصول انتخاب‌شده
                </h2>
              </div>

              {/* Left: Change / Re-search Link */}
              <button
                type="button"
                onClick={() => setActiveStep("search")}
                className="text-[13px] text-primary hover:underline font-normal cursor-pointer"
              >
                تغییر یا جست‌وجوی مجدد محصول
              </button>
            </div>

            {/* Selected product card (Figma: 1004x120 r:16 fill:#ffffff stroke:#e5e7eb p:24) */}
            <div className="rounded-2xl border border-border-default p-6 flex items-center justify-between bg-surface">
              <div className="flex items-center gap-4">
                {/* Image 72x72 on Right (Figma: Rectangle 72x72 @ 884,0 r:12) */}
                <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden shrink-0 bg-surface border border-border-subtle p-1 flex items-center justify-center">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    fill
                    sizes="72px"
                    className="object-contain"
                  />
                </div>

                {/* Text Block (Figma: Frame 872x70) */}
                <div className="flex flex-col gap-1 text-right">
                  <h3 className="text-[14px] font-normal text-text-primary leading-snug">
                    {selectedProduct.title}
                  </h3>
                  <span className="text-[14px] text-text-secondary font-normal">
                    {selectedProduct.code}
                  </span>
                </div>
              </div>
            </div>

            {/* Section Divider (Figma: Section divider 1004x1 fill:#f3f4f6) */}
            <div className="w-full h-px bg-surface-muted" />

            {/* STEP 1: انتخاب تنوع محصول (Figma: Section heading 1004x54) */}
            <div className="flex flex-col gap-5">
              <div className="flex items-start justify-start gap-3">
                {/* Section marker 40x40 with "۱" (Figma: r:12 fill:#eeeff6 text:#3d3183 size 16) */}
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary font-medium text-[16px] flex items-center justify-center shrink-0">
                  ۱
                </div>

                <div className="flex flex-col text-right">
                  <h3 className="text-[18px] leading-[28px] font-normal text-text-primary">
                    انتخاب تنوع محصول
                  </h3>
                  <span className="text-[14px] leading-[22px] text-text-secondary mt-0.5">
                    اطلاعات این بخش برای خریدار نمایش داده می‌شود. انتخاب اصالت
                    الزامی است.
                  </span>
                </div>
              </div>

              {/* Form Grid: 4 fields (Figma: Variation fields + Product declarations) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Capacity (Figma: Capacity field @ 514,0 on RIGHT in RTL) */}
                <div className="flex flex-col gap-2">
                  <label className="text-[16px] text-text-secondary font-normal">
                    ظرفیت
                  </label>
                  <div className="relative">
                    <select
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="w-full h-12 rounded-xl border border-border-default px-4 text-[16px] bg-surface text-text-primary appearance-none cursor-pointer focus:border-primary focus:outline-hidden"
                      dir="rtl"
                    >
                      <option value="۲۵۶ گیگابایت">۲۵۶ گیگابایت</option>
                      <option value="۵۱۲ گیگابایت">۵۱۲ گیگابایت</option>
                      <option value="۱ ترابایت">۱ ترابایت</option>
                    </select>
                    <ChevronDownIcon
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary pointer-events-none"
                    />
                  </div>
                </div>

                {/* 2. Color (Figma: Color field @ 0,0 on LEFT in RTL) */}
                <div className="flex flex-col gap-2">
                  <label className="text-[16px] text-text-secondary font-normal">
                    رنگ
                  </label>
                  <div className="relative">
                    <select
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full h-12 rounded-xl border border-border-default px-4 text-[16px] bg-surface text-text-primary appearance-none cursor-pointer focus:border-primary focus:outline-hidden"
                      dir="rtl"
                    >
                      <option value="زرد تیتانیوم">زرد تیتانیوم</option>
                      <option value="مشکی ذغالی">مشکی ذغالی</option>
                      <option value="خاکستری تیتانیوم">خاکستری تیتانیوم</option>
                    </select>
                    <ChevronDownIcon
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary pointer-events-none"
                    />
                  </div>
                </div>

                {/* 3. Warranty (Figma: Form field Warranty @ 514,0 on RIGHT in RTL) */}
                <div className="flex flex-col gap-2">
                  <label className="text-[16px] text-text-secondary font-normal">
                    گارانتی
                  </label>
                  <div className="relative">
                    <select
                      value={warranty}
                      onChange={(e) => setWarranty(e.target.value)}
                      className="w-full h-12 rounded-xl border border-border-default px-4 text-[16px] bg-surface text-text-primary appearance-none cursor-pointer focus:border-primary focus:outline-hidden"
                      dir="rtl"
                    >
                      <option value="۲ ساله آونگ">۲ ساله آونگ</option>
                      <option value="۱۸ماهه شرکت آوای پارس">
                        ۱۸ماهه شرکت آوای پارس
                      </option>
                      <option value="گارانتی شرکتی">گارانتی شرکتی</option>
                    </select>
                    <ChevronDownIcon
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary pointer-events-none"
                    />
                  </div>
                </div>

                {/* 4. Authenticity (Figma: Authenticity @ 0,0 on LEFT in RTL) */}
                <div className="flex flex-col gap-2">
                  <label className="text-[16px] text-text-secondary font-normal">
                    اصالت کالا (الزامی)
                  </label>
                  <div className="flex items-center justify-end gap-6 h-12 px-4 rounded-xl border border-border-default bg-surface">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="text-[14px] text-text-primary">
                        غیر اصل
                      </span>
                      <input
                        type="radio"
                        name="authenticity"
                        value="غیر اصل"
                        checked={authenticity === "غیر اصل"}
                        onChange={() => setAuthenticity("غیر اصل")}
                        className="accent-primary w-4 h-4 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="text-[14px] text-text-primary">اصل</span>
                      <input
                        type="radio"
                        name="authenticity"
                        value="اصل"
                        checked={authenticity === "اصل"}
                        onChange={() => setAuthenticity("اصل")}
                        className="accent-primary w-4 h-4 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Help box: تنوع محصول مورد نظر را پیدا نکردید ؟ (Figma: 1004x110 r:16 fill:#f9fafb) */}
              <div className="rounded-2xl bg-surface-subtle border border-border-default p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                <div className="flex items-center gap-3 text-right">
                  <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                    <HintIcon size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[18px] leading-[28px] font-normal text-text-primary">
                      تنوع محصول مورد نظر را پیدا نکردید ؟
                    </span>
                    <span className="text-[14px] leading-[22px] text-text-secondary mt-0.5">
                      تنوع محصول پس از بررسی، برای تکمیل اطلاعات فروش در دسترس
                      شما قرار می‌گیرد
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="h-[50px] px-6 rounded-xl bg-primary text-white text-[16px] font-normal flex items-center gap-2 hover:bg-primary-600 transition-colors shrink-0 cursor-pointer"
                >
                  <MessageTextIcon size={24} />
                  <span>درخواست معرفی تنوع</span>
                </button>
              </div>
            </div>
          </section>

          {/* ===================================================================== */}
          {/* Section 2: Form section - قیمت‌گذاری (Figma: 1060x437 r:20 fill:#ffffff p:28) */}
          {/* ===================================================================== */}
          <section className="bg-surface rounded-card p-6 lg:p-[28px] border border-border-default/60 flex flex-col gap-6 shadow-xs">
            <div className="flex items-start justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary font-medium text-[16px] flex items-center justify-center shrink-0">
                ۲
              </div>
              <div className="flex flex-col text-right">
                <h3 className="text-[18px] leading-[28px] font-normal text-text-primary">
                  قیمت‌گذاری
                </h3>
                <span className="text-[14px] leading-[22px] text-text-secondary mt-0.5">
                  مبنای قیمت‌گذاری را انتخاب کنید؛ سپس قیمت فروش همین تنوع را
                  وارد کنید. (الزامی)
                </span>
              </div>
            </div>

            {/* Pricing Modes (Figma: 3 cards 327x98, Order in RTL: نظارتی, مصوب روی کالا, آزاد) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Card 1 (Far right in RTL): قیمت مصوب نظارتی */}
              <button
                type="button"
                onClick={() => setPricingType("regulatory")}
                className={`p-4 rounded-xl border text-right flex flex-col gap-2 transition-all cursor-pointer ${
                  pricingType === "regulatory"
                    ? "bg-primary-50 border-primary"
                    : "border-border-default bg-surface hover:border-border-hover"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[16px] font-normal text-text-primary">
                    قیمت مصوب نظارتی
                  </span>
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      pricingType === "regulatory"
                        ? "border-primary bg-primary"
                        : "border-border-default bg-surface"
                    }`}
                  >
                    {pricingType === "regulatory" && (
                      <span className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </span>
                </div>
                <span className="text-[12px] text-text-secondary leading-relaxed">
                  مبلغ مصوب مرجع نظارتی را وارد کنید؛ فروش بالاتر از آن مجاز
                  نیست.
                </span>
              </button>

              {/* Card 2 (Center in RTL): قیمت مصوب روی کالا */}
              <button
                type="button"
                onClick={() => setPricingType("printed")}
                className={`p-4 rounded-xl border text-right flex flex-col gap-2 transition-all cursor-pointer ${
                  pricingType === "printed"
                    ? "bg-primary-50 border-primary"
                    : "border-border-default bg-surface hover:border-border-hover"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[16px] font-normal text-text-primary">
                    قیمت مصوب روی کالا
                  </span>
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      pricingType === "printed"
                        ? "border-primary bg-primary"
                        : "border-border-default bg-surface"
                    }`}
                  >
                    {pricingType === "printed" && (
                      <span className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </span>
                </div>
                <span className="text-[12px] text-text-secondary leading-relaxed">
                  قیمت درج‌شده روی کالا را مبنا قرار دهید؛ مبلغ فروش نباید بیشتر
                  از آن باشد.
                </span>
              </button>

              {/* Card 3 (Left in RTL): قیمت‌گذاری آزاد (Selected in Figma) */}
              <button
                type="button"
                onClick={() => setPricingType("free")}
                className={`p-4 rounded-xl border text-right flex flex-col gap-2 transition-all cursor-pointer ${
                  pricingType === "free"
                    ? "bg-primary-50 border-primary-200"
                    : "border-border-default bg-surface hover:border-border-hover"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[16px] font-normal ${
                      pricingType === "free"
                        ? "text-primary"
                        : "text-text-primary"
                    }`}
                  >
                    قیمت‌گذاری آزاد
                  </span>
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      pricingType === "free"
                        ? "border-primary bg-surface"
                        : "border-border-default bg-surface"
                    }`}
                  >
                    {pricingType === "free" && (
                      <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </span>
                </div>
                <span className="text-[12px] text-text-secondary leading-relaxed">
                  بدون محدودیت قیمت مصوب؛ قیمت فروش را خودتان تعیین کنید.
                </span>
              </button>
            </div>

            {/* Price Input (Figma: Form field 327x108 @ 677,0 on RIGHT in RTL) */}
            <div className="flex flex-col gap-2 max-w-sm ml-auto w-full">
              <label className="text-[16px] text-text-secondary font-normal">
                قیمت فروش (الزامی) · تومان
              </label>
              <input
                type="text"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="مبلغ را به تومان وارد کنید"
                className="w-full h-12 rounded-xl border border-border-default px-4 text-right text-[16px] text-text-primary font-normal focus:border-primary focus:outline-hidden"
                dir="rtl"
              />
              <span className="text-[12px] text-text-muted">
                این قیمت برای هر دستگاه از تنوع انتخاب‌شده ثبت می‌شود.
              </span>
            </div>

            {/* Pricing divider (Figma: 1004x1 fill:#f3f4f6) */}
            <div className="w-full h-px bg-surface-muted" />

            {/* Competitor Price Alert Banner (Figma: status-badge 1004x40 r:8 fill:#108981 with 0.1 opacity) */}
            <div className="w-full h-10 rounded-lg bg-success-strong/10 px-4 flex items-center justify-center gap-2 text-right">
              <ChartLineDownSquareIcon size={24} color="#108981" />
              <span className="text-[16px] font-normal text-success-strong">
                کم ترین قیمت اعلام شده توسط سایر فروشندگان ۲۳.۰۰۰.۰۰۰ تومان
              </span>
            </div>
          </section>

          {/* ===================================================================== */}
          {/* Section 3: Form section - موجودی در شعب (Figma: 1060x478 r:20 fill:#ffffff p:28) */}
          {/* ===================================================================== */}
          <section className="bg-surface rounded-card p-6 lg:p-[28px] border border-border-default/60 flex flex-col gap-6 shadow-xs">
            <div className="flex items-start justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary font-medium text-[16px] flex items-center justify-center shrink-0">
                ۳
              </div>
              <div className="flex flex-col text-right">
                <h3 className="text-[18px] leading-[28px] font-normal text-text-primary">
                  موجودی در شعب
                </h3>
                <span className="text-[14px] leading-[22px] text-text-secondary mt-0.5">
                  موجودی قابل فروش همین تنوع را برای هر شعبه وارد کنید. حداقل یک
                  شعبه الزامی است.
                </span>
              </div>
            </div>

            {/* Inventory Rows (Figma: Branch inventory 1004x114 r:12 fill:#f9fafb p:16) */}
            <div className="flex flex-col gap-3">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="rounded-xl bg-surface-subtle p-4 flex items-center gap-4"
                >
                  {/* Far Right: Branch field (Figma: 696x82) */}
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-[16px] text-text-secondary font-normal">
                      شعبه
                    </label>
                    <div className="relative">
                      <select
                        defaultValue={branch.name}
                        className="w-full h-12 rounded-xl border border-border-default px-4 text-[16px] text-text-primary bg-surface appearance-none focus:border-primary focus:outline-hidden cursor-pointer"
                        dir="rtl"
                      >
                        <option value="تهران مرکزی">تهران مرکزی</option>
                        <option value="تهران ونک">تهران ونک</option>
                        <option value="تهران غرب">تهران غرب</option>
                        <option value="اصفهان">اصفهان</option>
                        <option value="شیراز">شیراز</option>
                      </select>
                      <ChevronDownIcon
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Middle: Available stock field (Figma: 220x82) */}
                  <div className="w-44 sm:w-56 flex flex-col gap-2">
                    <label className="text-[16px] text-text-secondary font-normal">
                      موجودی قابل فروش
                    </label>
                    <input
                      type="text"
                      defaultValue={branch.stock}
                      className="h-12 rounded-xl border border-border-default px-4 text-center text-[16px] text-text-primary bg-surface focus:border-primary focus:outline-hidden"
                      dir="rtl"
                    />
                  </div>

                  {/* Far Left: Trash icon (Figma: trash 16x16 @ 16,50 fill:#ef4444) */}
                  <div className="pt-7 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleRemoveBranch(branch.id)}
                      className="p-2 text-error hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="حذف شعبه"
                    >
                      <TrashIcon size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Inventory actions (Figma: 1004x50 @ 28,362) */}
            <div className="flex items-center justify-between pt-1">
              {/* Right: Total stock badge (Figma: Inventory total 255x42 @ 749,4 r:8 fill:#eeeff6) */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-50">
                <span className="text-[14px] text-text-secondary font-normal">
                  مجموع موجودی:
                </span>
                <span className="text-[16px] font-normal text-primary">
                  ۵ عدد در ۲ شعبه
                </span>
              </div>

              {/* Left: Add Branch Button (Figma: Action 168x50 @ 0,0 r:12 fill:#ffffff stroke:#e5e7eb) */}
              <button
                type="button"
                onClick={handleAddBranch}
                className="h-[50px] px-6 rounded-xl border border-border-default bg-surface text-primary text-[16px] font-normal hover:bg-surface-subtle transition-colors flex items-center gap-2 cursor-pointer"
              >
                <PlusIcon size={20} />
                <span>افزودن شعبه</span>
              </button>
            </div>

            <p className="text-[12px] text-text-muted leading-relaxed">
              برای شعبه بدون موجودی، عدد صفر وارد کنید یا آن شعبه را حذف کنید.
              موجودی آنلاین و حضوری مشترک است؛ یک کالا را دو بار نشمارید.
            </p>
          </section>

          {/* ===================================================================== */}
          {/* Section 4: Form section - روش فروش و تعهدات تحویل (Figma: 1060x458 r:20 fill:#ffffff p:28) */}
          {/* ===================================================================== */}
          <section className="bg-surface rounded-card p-6 lg:p-[28px] border border-border-default/60 flex flex-col gap-6 shadow-xs">
            <div className="flex items-start justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary font-medium text-[16px] flex items-center justify-center shrink-0">
                ۴
              </div>
              <div className="flex flex-col text-right">
                <h3 className="text-[18px] leading-[28px] font-normal text-text-primary">
                  روش فروش و تعهدات تحویل
                </h3>
                <span className="text-[14px] leading-[22px] text-text-secondary mt-0.5">
                  با انتخاب روش فروش، فقط شرایط تحویل مرتبط را تکمیل کنید.
                  (الزامی)
                </span>
              </div>
            </div>

            {/* Sales channels: Order in RTL: آنلاین, حضوری, آنلاین و حضوری */}
            <div className="flex items-center justify-start gap-8 py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="saleMethod"
                  value="online"
                  checked={saleMethod === "online"}
                  onChange={() => setSaleMethod("online")}
                  className="accent-primary w-4 h-4 cursor-pointer"
                />
                <span className="text-[14px] text-text-primary">آنلاین</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="saleMethod"
                  value="in_person"
                  checked={saleMethod === "in_person"}
                  onChange={() => setSaleMethod("in_person")}
                  className="accent-primary w-4 h-4 cursor-pointer"
                />
                <span className="text-[14px] text-text-primary">حضوری</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="saleMethod"
                  value="both"
                  checked={saleMethod === "both"}
                  onChange={() => setSaleMethod("both")}
                  className="accent-primary w-4 h-4 cursor-pointer"
                />
                <span className="text-[14px] text-text-primary">
                  آنلاین و حضوری
                </span>
              </label>
            </div>

            {/* 2 Subsections: Pickup conditions (Right) + Shipping conditions (Left) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box A: Pickup conditions (Figma: 492x260 @ 512,0 on RIGHT in RTL) */}
              <div className="rounded-xl bg-surface-subtle p-5 flex flex-col gap-4">
                <h4 className="text-[18px] font-normal text-text-primary">
                  فروش حضوری · تحویل در شعبه
                </h4>

                <div className="flex flex-col gap-2">
                  <label className="text-[16px] text-text-secondary font-normal">
                    زمان آماده‌سازی برای تحویل
                  </label>
                  <div className="relative">
                    <select
                      className="w-full h-12 rounded-xl border border-border-default px-4 text-[16px] bg-surface text-text-primary appearance-none focus:border-primary focus:outline-hidden cursor-pointer"
                      dir="rtl"
                    >
                      <option>همان روز · در ساعات کاری شعبه</option>
                      <option>آماده‌سازی: ۱ روز کاری</option>
                      <option>آماده‌سازی: ۲ روز کاری</option>
                    </select>
                    <ChevronDownIcon
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary pointer-events-none"
                    />
                  </div>
                </div>

                <span className="text-[12px] text-text-muted">
                  تحویل حضوری فقط در شعب دارای موجودی انجام می‌شود.
                </span>

                <label className="flex items-start gap-2.5 cursor-pointer text-[14px] text-text-primary leading-relaxed mt-auto select-none">
                  <input
                    type="checkbox"
                    checked={inPersonCommitment}
                    onChange={(e) => setInPersonCommitment(e.target.checked)}
                    className="accent-primary w-4 h-4 mt-1 shrink-0 cursor-pointer"
                  />
                  <span>
                    متعهد می‌شوم کالا را در زمان اعلام‌شده آماده کنم و در شعبه
                    منتخب به خریدار تحویل دهم.
                  </span>
                </label>
              </div>

              {/* Box B: Shipping conditions (Figma: 492x260 @ 0,0 on LEFT in RTL) */}
              <div className="rounded-xl bg-surface-subtle p-5 flex flex-col gap-4">
                <h4 className="text-[18px] font-normal text-text-primary">
                  فروش آنلاین · ارسال سفارش
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {/* Right: آماده‌سازی و ارسال */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[16px] text-text-secondary font-normal">
                      آماده‌سازی و ارسال
                    </label>
                    <div className="relative">
                      <select
                        className="w-full h-12 rounded-xl border border-border-default px-4 text-[16px] bg-surface text-text-primary appearance-none focus:border-primary focus:outline-hidden cursor-pointer"
                        dir="rtl"
                      >
                        <option>۱ روز کاری</option>
                        <option>ارسال تا ۲۴ ساعت</option>
                        <option>ارسال همان روز</option>
                      </select>
                      <ChevronDownIcon
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Left: روش ارسال */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[16px] text-text-secondary font-normal">
                      روش ارسال
                    </label>
                    <div className="relative">
                      <select
                        className="w-full h-12 rounded-xl border border-border-default px-4 text-[16px] bg-surface text-text-primary appearance-none focus:border-primary focus:outline-hidden cursor-pointer"
                        dir="rtl"
                      >
                        <option>پست پیشتاز</option>
                        <option>تیپاکس</option>
                        <option>پیک اختصاصی</option>
                      </select>
                      <ChevronDownIcon
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                <span className="text-[12px] text-text-muted">
                  این زمان تا تحویل به شرکت حمل است، نه زمان رسیدن به خریدار.
                </span>

                <label className="flex items-start gap-2.5 cursor-pointer text-[14px] text-text-primary leading-relaxed mt-auto select-none">
                  <input
                    type="checkbox"
                    checked={onlineCommitment}
                    onChange={(e) => setOnlineCommitment(e.target.checked)}
                    className="accent-primary w-4 h-4 mt-1 shrink-0 cursor-pointer"
                  />
                  <span>
                    متعهد می‌شوم سفارش را در زمان اعلام‌شده آماده و ارسال کنم و
                    کد رهگیری را در سفارش ثبت کنم.
                  </span>
                </label>
              </div>
            </div>
          </section>

          {/* ===================================================================== */}
          {/* Section 5: Review and submission (Figma: 1060x378) */}
          {/* ===================================================================== */}
          <div className="w-full flex flex-col gap-6">
            {/* Form Section Card (Figma: 1060x308 r:20 fill:#ffffff p:28) */}
            <section className="bg-surface rounded-card p-6 lg:p-[28px] border border-border-default/60 flex flex-col gap-6 shadow-xs">
              <div className="flex items-start justify-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary font-medium text-[16px] flex items-center justify-center shrink-0">
                  ۵
                </div>
                <div className="flex flex-col text-right">
                  <h3 className="text-[18px] leading-[28px] font-normal text-text-primary">
                    مرور و ثبت محصول
                  </h3>
                  <span className="text-[14px] leading-[22px] text-text-secondary mt-0.5">
                    اطلاعات زیر برای تنوع {color}، {capacity} و گارانتی{" "}
                    {warranty} ثبت می‌شود.
                  </span>
                </div>
              </div>

              {/* Registration summary (Figma: 1004x90 r:12 fill:#f9fafb p:20, Order in RTL: اصالت, قیمت, موجودی, روش فروش) */}
              <div className="rounded-xl bg-surface-subtle p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* 1. Far Right: اصالت و گارانتی */}
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-[12px] text-text-muted">
                    اصالت و گارانتی
                  </span>
                  <span className="text-[16px] font-normal text-text-primary">
                    {authenticity} · {warranty}
                  </span>
                </div>

                {/* 2. قیمت هر دستگاه */}
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-[12px] text-text-muted">
                    قیمت هر دستگاه · آزاد
                  </span>
                  <span className="text-[16px] font-normal text-text-primary">
                    {sellingPrice} تومان
                  </span>
                </div>

                {/* 3. موجودی قابل فروش */}
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-[12px] text-text-muted">
                    موجودی قابل فروش
                  </span>
                  <span className="text-[16px] font-normal text-text-primary">
                    ۵ عدد · ۲ شعبه
                  </span>
                </div>

                {/* 4. Far Left: روش فروش */}
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-[12px] text-text-muted">روش فروش</span>
                  <span className="text-[16px] font-normal text-text-primary">
                    {saleMethod === "both"
                      ? "آنلاین و حضوری"
                      : saleMethod === "online"
                        ? "آنلاین"
                        : "حضوری"}
                  </span>
                </div>
              </div>

              {/* Contextual guidance (Figma: 1004x68 r:12 fill:#f9fafb p:12) */}
              <div className="rounded-xl bg-surface-subtle p-3 flex items-start gap-3">
                <div className="pt-0.5 shrink-0 text-primary">
                  <HintIcon size={20} />
                </div>
                <span className="flex-1 text-right text-[14px] leading-relaxed text-text-secondary">
                  با ثبت نهایی، این تنوع به محصولات شما اضافه و برای کاربران
                  نمایش داده می‌شود. ویرایش قیمت، موجودی و شرایط فروش بعد از ثبت
                  از بخش «محصولات من ← محصولات تأییدشده» انجام می‌شود.
                </span>
              </div>
            </section>

            {/* Final Actions Footer (Figma: Final actions 1060x50 @ 0,328 OUTSIDE the card!) */}
            <div className="flex items-center justify-between w-full pt-1">
              {/* Right Side (In RTL): Submit and Draft Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="h-[50px] px-6 rounded-xl bg-primary text-white text-[16px] font-normal hover:bg-primary-600 transition-colors shadow-xs cursor-pointer"
                >
                  ثبت نهایی محصول
                </button>

                <button
                  type="button"
                  className="h-[50px] px-6 rounded-lg border border-primary bg-transparent text-primary text-[14px] font-normal hover:bg-primary-50 transition-colors cursor-pointer"
                >
                  پیش نویس محصول
                </button>
              </div>

              {/* Left Side (In RTL): Cancel Button (Figma: Frame 97x50 r:12 fill:#ffffff stroke:#e5e7eb) */}
              <button
                type="button"
                onClick={() => setActiveStep("search")}
                className="h-[50px] px-6 rounded-xl border border-border-default bg-surface text-text-secondary text-[16px] font-normal hover:bg-surface-muted transition-colors cursor-pointer"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerProductCreate;
