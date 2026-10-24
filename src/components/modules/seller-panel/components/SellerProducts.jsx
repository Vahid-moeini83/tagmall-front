"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PlusSimpleIcon,
  ChevronDownIcon,
  EditIcon,
  MessageTextIcon,
  CursorClickIcon,
} from "@/icons";
import { SlidersHorizontal } from "lucide-react";

/**
 * 8 products matching Figma node 44:44034 & 44:44999
 */
const PRODUCTS_LIST = [
  {
    id: "DKP-۴۲۱",
    code: "DKP-۴۲۱",
    title: "گوشی موبایل اپل مدل iPhone 13 Pro Max",
    category: "کالای دیجیتال",
    priceFrom: "از ۱۴,۲۰۰,۰۰۰",
    priceTo: "تا ۱۴,۲۰۰,۰۰۰",
    stock: "۱۴ عدد",
    stockCount: 14,
    status: {
      label: "فعال",
      bg: "bg-[#108981]/10",
      color: "text-[#108981]",
    },
    image: "/assets/images/seller/products/iphone-13.png",
  },
  {
    id: "DKP-۴۲۲",
    code: "DKP-۴۲۲",
    title: "هدفون بی سیم سونی مدل WH-1000XM4",
    category: "صوتی و تصویری",
    priceFrom: "از ۱۴,۲۰۰,۰۰۰",
    priceTo: "تا ۱۴,۲۰۰,۰۰۰",
    stock: "۵ عدد",
    stockCount: 5,
    status: {
      label: "ارسال شده",
      bg: "bg-primary/10",
      color: "text-primary",
    },
    image: "/assets/images/seller/products/sony-headphones.png",
  },
  {
    id: "DKP-۴۲۳",
    code: "DKP-۴۲۳",
    title: "ساعت هوشمند اپل سری ۹ بند اسپورت",
    category: "ساعت هوشمند",
    priceFrom: "از ۱۴,۲۰۰,۰۰۰",
    priceTo: "تا ۱۴,۲۰۰,۰۰۰",
    stock: "(ناموجود)",
    stockCount: 0,
    isOutOfStock: true,
    status: {
      label: "غیرفعال",
      bg: "bg-error-light",
      color: "text-error",
    },
    image: "/assets/images/seller/products/apple-watch.png",
  },
  {
    id: "DKP-۴۲۴",
    code: "DKP-۴۲۴",
    title: "تی‌شرت مردانه نایک طرح Dri-Fit",
    category: "پوشاک مردانه",
    priceFrom: "از ۱۴,۲۰۰,۰۰۰",
    priceTo: "تا ۱۴,۲۰۰,۰۰۰",
    stock: "۴۵ عدد",
    stockCount: 45,
    status: {
      label: "فعال",
      bg: "bg-[#108981]/10",
      color: "text-[#108981]",
    },
    image: "/assets/images/seller/products/nike-tshirt.png",
  },
  {
    id: "DKP-۴۲۶-1",
    code: "DKP-۴۲۶",
    title: "کوله پشتی مسافرتی شیائومی مدل کلاسیک",
    category: "کوله و چمدان",
    priceFrom: "از ۱۴,۲۰۰,۰۰۰",
    priceTo: "تا ۱۴,۲۰۰,۰۰۰",
    stock: "۳ عدد",
    stockCount: 3,
    status: {
      label: "در انتظار تأیید",
      bg: "bg-warning-light",
      color: "text-[#D97706]",
    },
    image: "/assets/images/seller/products/xiaomi-backpack.png",
  },
  {
    id: "DKP-۴۲۶-2",
    code: "DKP-۴۲۶",
    title: "کوله پشتی مسافرتی شیائومی مدل کلاسیک",
    category: "کوله و چمدان",
    priceFrom: "از ۱۴,۲۰۰,۰۰۰",
    priceTo: "تا ۱۴,۲۰۰,۰۰۰",
    stock: "۲۸ عدد",
    stockCount: 28,
    status: {
      label: "تحویل داده شده",
      bg: "bg-info-light",
      color: "text-info",
    },
    image: "/assets/images/seller/products/xiaomi-backpack.png",
  },
  {
    id: "DKP-۴۲۷",
    code: "DKP-۴۲۷",
    title: "پاوربانک ۲۰۰۰۰ میلی آمپر انکر",
    category: "لوازم جانبی موبایل",
    priceFrom: "از ۱۴,۲۰۰,۰۰۰",
    priceTo: "تا ۱۴,۲۰۰,۰۰۰",
    stock: "۶۰ عدد",
    stockCount: 60,
    status: {
      label: "فعال",
      bg: "bg-[#108981]/10",
      color: "text-[#108981]",
    },
    image: "/assets/images/seller/products/anker-powerbank.png",
  },
  {
    id: "DKP-۴۲۸",
    code: "DKP-۴۲۸",
    title: "کیبورد مکانیکال ریزر مدل BlackWidow",
    category: "تجهیزات گیمینگ",
    priceFrom: "از ۱۴,۲۰۰,۰۰۰",
    priceTo: "تا ۱۴,۲۰۰,۰۰۰",
    stock: "۱۲ عدد",
    stockCount: 12,
    status: {
      label: "مرجوع شده",
      bg: "bg-[#FEF9C3]",
      color: "text-[#854D0E]",
    },
    image: "/assets/images/seller/products/razer-keyboard.png",
  },
];

function SellerProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort] = useState("جدیدترین");
  const [selectedStatus] = useState("همه");
  const [selectedCategory] = useState("همه");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter products based on search input
  const filteredProducts = useMemo(() => {
    return PRODUCTS_LIST.filter((p) => {
      const matchQuery =
        !searchQuery.trim() ||
        p.title.includes(searchQuery.trim()) ||
        p.code.includes(searchQuery.trim()) ||
        p.category.includes(searchQuery.trim());

      const matchCategory =
        selectedCategory === "همه" || p.category.includes(selectedCategory);

      const matchStatus =
        selectedStatus === "همه" || p.status.label.includes(selectedStatus);

      return matchQuery && matchCategory && matchStatus;
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

  return (
    <div className="flex-1 w-full max-w-[1140px] mx-auto p-4 sm:p-6 lg:p-10 pb-28 lg:pb-10 flex flex-col gap-5 lg:gap-6">
      {/* 1. Header (Desktop: title + date / Mobile: title + items count + Add button) */}
      <div className="flex flex-col gap-4">
        {/* Desktop top title & date (Figma Node 44:44037) */}
        <header className="hidden lg:flex flex-col gap-1 text-right">
          <h1 className="text-[22px] lg:text-h4 font-semibold text-text-primary">
            پنل فروشگاه تگ مال
          </h1>
          <p className="text-caption text-text-muted">
            امروز ۳۰ مرداد ماه ۱۴۰۵ ساعت ۱۲:۲۴
          </p>
        </header>

        {/* Action row (Title + Add product button) */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1 text-right">
            <h2 className="text-body sm:text-[18px] lg:text-[20px] font-bold text-text-primary">
              <span className="lg:hidden">محصولات من</span>
              <span className="hidden lg:inline">لیست محصولات من</span>
            </h2>
            <p className="text-[12px] text-text-muted lg:hidden">
              ۴۸ کالا در فروشگاه
            </p>
          </div>

          <Link
            href="/seller/products/new"
            className="h-11 px-4 lg:px-5 rounded-xl bg-primary text-white text-[13px] sm:text-[14px] font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shrink-0 shadow-sm"
          >
            <PlusSimpleIcon size={18} />
            <span>افزودن محصول جدید</span>
          </Link>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      {/* Desktop Filter Bar (Figma Node: 44:44046) */}
      <div className="hidden lg:flex bg-surface rounded-2xl p-4 border border-border-subtle shadow-card items-center justify-between gap-3">
        {/* Right side in RTL: Search Input */}
        <div className="relative w-[420px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جست و جو در گروه کالایی، برند ها، محصولات، شناسه محصولات"
            className="w-full h-11 bg-surface-subtle rounded-xl px-4 text-[12px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-right"
          />
        </div>

        {/* Left side in RTL: 3 Filter Dropdowns */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="h-11 px-4 border border-border-default rounded-[15px] flex items-center justify-between gap-3 text-text-primary text-[14px] bg-surface hover:border-primary/40 transition-colors"
          >
            <ChevronDownIcon size={18} className="text-text-muted shrink-0" />
            <span>مرتب سازی: جدیدترین</span>
          </button>

          <button
            type="button"
            className="h-11 px-4 border border-border-default rounded-[15px] flex items-center justify-between gap-3 text-text-primary text-[14px] bg-surface hover:border-primary/40 transition-colors"
          >
            <ChevronDownIcon size={18} className="text-text-muted shrink-0" />
            <span>مرتب سازی: جدیدترین</span>
          </button>

          <button
            type="button"
            className="h-11 px-4 border border-border-default rounded-[15px] flex items-center justify-between gap-3 text-text-primary text-[14px] bg-surface hover:border-primary/40 transition-colors"
          >
            <ChevronDownIcon size={18} className="text-text-muted shrink-0" />
            <span>مرتب سازی: جدیدترین</span>
          </button>
        </div>
      </div>

      {/* Mobile Filter & Search Box (Figma Node: 44:45032) */}
      <div className="lg:hidden bg-surface rounded-2xl p-4 border border-border-subtle shadow-card flex flex-col gap-3">
        {/* Row 1: Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جست و جو در محصولات"
            className="w-full h-11 bg-surface-subtle rounded-xl px-4 text-center text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Row 2: Search scope subtext */}
        <p className="text-[11px] text-text-muted text-center">
          گروه کالایی، برند ها، محصولات، شناسه محصولات
        </p>

        {/* Row 3: Filter tools buttons */}
        <div className="flex items-center gap-2 pt-1">
          {/* Dropdown button: تهران */}
          <button
            type="button"
            className="flex-1 h-11 border border-border-default rounded-[15px] px-4 flex items-center justify-between text-text-primary text-[13px] bg-surface hover:border-primary/40 transition-colors"
          >
            <ChevronDownIcon size={18} className="text-text-muted shrink-0" />
            <span>تهران</span>
          </button>

          {/* Filter button */}
          <button
            type="button"
            className="w-[105px] h-11 bg-primary/10 border border-primary/20 rounded-xl px-3 flex items-center justify-center gap-1.5 text-primary text-[13px] font-semibold hover:bg-primary/20 transition-colors shrink-0"
          >
            <SlidersHorizontal size={16} />
            <span>فیلترها</span>
          </button>
        </div>
      </div>

      {/* 3. Mobile Products List (Figma Node: 44:45043) */}
      <div className="flex flex-col gap-3 lg:hidden">
        {/* Result count indicator */}
        <div className="flex items-center justify-between text-[13px] px-1">
          <span className="font-semibold text-text-primary">لیست محصولات من</span>
          <span className="text-[12px] text-text-muted">۱ تا ۸ از ۴۸ کالا</span>
        </div>

        {/* Product Cards */}
        {filteredProducts.map((product) => (
          <div
            key={`mobile-${product.id}`}
            className="bg-surface rounded-2xl p-4 border border-border-subtle shadow-card flex flex-col gap-3.5"
          >
            {/* Row 1: Title & SKU on right, Image on left */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 flex flex-col gap-1 text-right">
                <h3 className="text-[14px] font-bold text-text-primary line-clamp-2 leading-snug">
                  {product.title}
                </h3>
                <span className="text-[12px] font-medium text-text-muted">
                  {product.code}
                </span>
              </div>

              <div className="relative w-[68px] h-[68px] rounded-xl overflow-hidden shrink-0 bg-surface border border-border-subtle shadow-xs">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="68px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Row 2: Status Badge on right, Category on left */}
            <div className="flex items-center justify-between">
              <span
                className={`h-7 px-3.5 rounded-lg text-[12px] font-medium flex items-center justify-center ${product.status.bg} ${product.status.color}`}
              >
                {product.status.label}
              </span>

              <span className="text-[13px] text-text-muted">
                {product.category}
              </span>
            </div>

            {/* Row 3: Price & Stock Grey Box */}
            <div className="bg-surface-subtle rounded-xl p-3 flex items-center justify-between text-right">
              {/* Stock on right */}
              <div className="flex flex-col gap-0.5 min-w-[70px]">
                <span className="text-[11px] text-text-muted">
                  موجودی
                </span>
                <span
                  className={`text-[13px] font-bold ${
                    product.isOutOfStock ? "text-error" : "text-text-secondary"
                  }`}
                >
                  {product.stock}
                </span>
              </div>

              <div className="w-px h-9 bg-border-default/60 mx-3" />

              {/* Price range on left */}
              <div className="flex flex-col gap-0.5 text-left">
                <span className="text-[11px] text-text-muted text-right">
                  بازه قیمتی (تومان)
                </span>
                <div className="text-[12px] font-semibold text-text-primary leading-tight flex flex-col items-end">
                  <span>{product.priceFrom}</span>
                  <span>{product.priceTo}</span>
                </div>
              </div>
            </div>

            {/* Row 4: Actions (Visit, Messages, Edit button) */}
            <div className="flex items-center justify-between pt-2 border-t border-border-subtle/70">
              <button
                type="button"
                className="flex items-center gap-1.5 text-text-muted hover:text-text-primary transition-colors text-[12px] font-medium"
              >
                <CursorClickIcon size={18} />
                <span>بازدید</span>
              </button>

              <button
                type="button"
                className="flex items-center gap-1.5 text-text-muted hover:text-text-primary transition-colors text-[12px] font-medium"
              >
                <MessageTextIcon size={18} />
                <span>پیام‌ها</span>
              </button>

              <button
                type="button"
                className="h-9 px-4 rounded-xl bg-primary/10 text-primary text-[12px] font-semibold flex items-center gap-1.5 hover:bg-primary/20 transition-colors"
              >
                <EditIcon size={16} />
                <span>ویرایش</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Desktop Products Table (Figma Node: 44:44055) */}
      <div className="hidden lg:block bg-surface rounded-[24px] p-6 border border-border-subtle shadow-card">
        {/* Table Header */}
        <div
          className="bg-surface-subtle rounded-xl h-12 px-6 items-center text-[13px] font-bold text-text-muted select-none"
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(280px, 1fr) 140px 160px 100px 120px 120px",
          }}
        >
          <div className="text-right pr-2">نام محصول و کد کالا</div>
          <div className="text-center">گروه کالایی</div>
          <div className="text-center">بازه قیمتی (تومان)</div>
          <div className="text-center">موجودی</div>
          <div className="text-center">وضعیت</div>
          <div className="text-center">عملیات</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-border-subtle/80 mt-1">
          {filteredProducts.map((product) => (
            <div
              key={`desktop-${product.id}`}
              className="h-[72px] px-6 items-center hover:bg-surface-subtle/40 transition-colors"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(280px, 1fr) 140px 160px 100px 120px 120px",
              }}
            >
              {/* Product Info & Thumb */}
              <div className="flex items-center gap-3 overflow-hidden pr-2">
                <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-surface border border-border-subtle shadow-xs">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-0.5 truncate text-right">
                  <span className="text-[14px] font-medium text-text-primary truncate">
                    {product.title}
                  </span>
                  <span className="text-[12px] font-normal text-text-muted">
                    {product.code}
                  </span>
                </div>
              </div>

              {/* Category */}
              <div className="text-center text-[14px] text-text-muted truncate px-2">
                {product.category}
              </div>

              {/* Price Range */}
              <div className="text-center text-[13px] text-text-primary leading-tight flex flex-col items-center justify-center">
                <span>{product.priceFrom}</span>
                <span>{product.priceTo}</span>
              </div>

              {/* Stock */}
              <div
                className={`text-center text-[14px] font-medium ${
                  product.isOutOfStock ? "text-error" : "text-text-secondary"
                }`}
              >
                {product.stock}
              </div>

              {/* Status */}
              <div className="flex items-center justify-center">
                <span
                  className={`h-7 px-3.5 rounded-md text-[12px] font-medium inline-flex items-center justify-center ${product.status.bg} ${product.status.color}`}
                >
                  {product.status.label}
                </span>
              </div>

              {/* Operations (3 icons: pen-line, messages-text, cursor-click) */}
              <div className="flex items-center justify-center gap-3 text-text-muted">
                <button
                  type="button"
                  title="ویرایش محصول"
                  className="hover:text-primary transition-colors p-1"
                >
                  <EditIcon size={18} />
                </button>
                <button
                  type="button"
                  title="پیام‌ها"
                  className="hover:text-primary transition-colors p-1"
                >
                  <MessageTextIcon size={18} />
                </button>
                <button
                  type="button"
                  title="آمار بازدید"
                  className="hover:text-primary transition-colors p-1"
                >
                  <CursorClickIcon size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 5. Pagination Bar (Figma Node: 44:44222) */}
        <div className="flex items-center justify-between pt-6 mt-4 border-t border-border-subtle">
          <span className="text-[13px] text-text-muted">
            نمایش ۱ تا ۸ از ۴۸ کالا
          </span>

          <div className="flex items-center gap-1.5 select-none shrink-0">
            <button
              type="button"
              className="border border-border-default rounded-lg px-3.5 h-9 text-[13px] text-text-secondary hover:border-primary/50 transition-colors shrink-0"
            >
              قبلی
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className={`w-9 min-w-9 h-9 rounded-lg text-[13px] font-semibold flex items-center justify-center transition-colors shrink-0 ${
                currentPage === 1
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              ۱
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(2)}
              className="w-8 min-w-8 h-9 text-[13px] text-text-muted hover:text-text-primary flex items-center justify-center transition-colors shrink-0"
            >
              ۲
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(3)}
              className="w-8 min-w-8 h-9 text-[13px] text-text-muted hover:text-text-primary flex items-center justify-center transition-colors shrink-0"
            >
              ۳
            </button>
            <span className="w-6 text-center text-text-muted text-[13px] shrink-0">
              ...
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage(6)}
              className="w-8 min-w-8 h-9 text-[13px] text-text-muted hover:text-text-primary flex items-center justify-center transition-colors shrink-0"
            >
              ۶
            </button>
            <button
              type="button"
              className="border border-border-default rounded-lg px-3.5 h-9 text-[13px] text-text-secondary hover:border-primary/50 transition-colors shrink-0"
            >
              بعدی
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerProducts;
