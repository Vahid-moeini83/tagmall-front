"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  EditIcon,
  TagSimpleIcon,
  BarcodeReadIcon,
  BoxShieldIcon,
  BoxUserIcon,
  TicketSimplePercentIcon,
  ChartLineDownSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/icons";

const PRODUCT_IMAGES = [
  {
    id: 1,
    src: "/assets/images/seller/product-detail/product_main.png",
    thumb: "/assets/images/seller/product-detail/thumb_1.png",
    alt: "نمای جلو و پشت محصول",
  },
  {
    id: 2,
    src: "/assets/images/seller/product-detail/product_main.png",
    thumb: "/assets/images/seller/product-detail/thumb_2.png",
    alt: "نمای سفید محصول",
  },
  {
    id: 3,
    src: "/assets/images/seller/product-detail/product_main.png",
    thumb: "/assets/images/seller/product-detail/thumb_3.png",
    alt: "نمای کناری محصول",
  },
  {
    id: 4,
    src: "/assets/images/seller/product-detail/product_main.png",
    thumb: "/assets/images/seller/product-detail/thumb_4.png",
    alt: "تصویر در دست محصول",
  },
];

const COLOR_OPTIONS = [
  { id: "black", label: "مشکی ذغالی", hex: "#3d3183" },
  { id: "blue", label: "آبی سورمه‌ای", hex: "#1e2b4c" },
  { id: "silver", label: "نقره‌ای مات", hex: "#e0e0e0" },
];

const CAPACITY_OPTIONS = [
  { id: "256", label: "۲۵۶ گیگابایت" },
  { id: "512", label: "۵۱۲ گیگابایت" },
  { id: "1tb", label: "۱ ترابایت" },
];

const WARRANTY_OPTIONS = [
  { id: "avaye-pars", label: "۱۸ماهه شرکت آوای پارس" },
  { id: "avang", label: "۱ ساله آونگ" },
];

function SellerProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedCapacity, setSelectedCapacity] = useState("256");
  const [selectedWarranty, setSelectedWarranty] = useState("avaye-pars");

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % PRODUCT_IMAGES.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length
    );
  };

  return (
    <div className="w-full flex-1 flex flex-col px-4 sm:px-6 lg:px-10 py-6 lg:py-10 pb-24 lg:pb-12 max-w-[1440px] mx-auto gap-6">
      {/* Desktop Top Title Bar (Figma Node: 44:44319) */}
      <header className="hidden lg:flex items-center justify-between">
        <div className="flex flex-col gap-1 text-right">
          <h1 className="text-[22px] leading-[30px] font-semibold text-text-primary">
            پنل فروشگاه تگ مال
          </h1>
          <p className="text-[12px] leading-[18px] text-text-muted">
            امروز ۳۰ مرداد ماه ۱۴۰۵ ساعت ۱۲:۲۴
          </p>
        </div>
      </header>

      {/* Breadcrumb Navigation (Figma Nodes: 44:44324 / 44:45147) */}
      <nav
        aria-label="مسیر راهنما"
        className="flex items-center justify-start text-[13px] leading-5 gap-2 select-none"
        dir="rtl"
      >
        <Link
          href="/seller"
          className="text-text-secondary hover:text-primary transition-colors"
        >
          داشبورد فروشنده
        </Link>
        <span className="text-text-muted text-[13px]">/</span>
        <Link
          href="/seller/products"
          className="text-text-secondary hover:text-primary transition-colors"
        >
          محصولات من
        </Link>
        <span className="text-text-muted text-[13px]">/</span>
        <span className="text-primary font-bold">شناسنامه کالا</span>
      </nav>

      {/* ========================================================================= */}
      {/* DESKTOP VIEW (Two columns: Right = Product Info Card, Left = Gallery & Variations) */}
      {/* ========================================================================= */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-start">
        {/* RIGHT COLUMN (In RTL grid: 7 cols = ~616px) -> Main Product Info Card */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <section className="bg-surface rounded-[20px] p-6 lg:p-8 border border-border-default/60 flex flex-col gap-5 shadow-xs">
            {/* 1. Header: Status badge & last updated on LEFT, Title on RIGHT */}
            <div className="flex items-start justify-between gap-4">
              {/* Product Title on RIGHT */}
              <h2 className="text-[18px] lg:text-[20px] font-semibold text-text-primary leading-[30px] text-right">
                هدفون بی سیم سونی مدل WH-1000XM4
              </h2>

              {/* Status & Last Updated on LEFT */}
              <div className="flex flex-col items-start gap-1.5 shrink-0 text-left">
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#108981]/10 text-[#108981] text-[12px] font-semibold">
                  وضعیت: فعال در ویترین
                </span>
                <span className="text-[10px] text-text-muted">
                  آخرین به‌روزرسانی: امروز، ساعت ۱۰:۳۰
                </span>
              </div>
            </div>

            <div className="h-px bg-border-subtle" />

            {/* 2. Info Grid: 2x2 Specs (SKU, Category, Shipping, Stock) */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-right">
              {/* Row 1, Col 1 (Right): Main Category */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-text-muted text-[12px]">
                  <TagSimpleIcon size={16} color="#7a7a96" />
                  <span>دسته‌بندی اصلی</span>
                </div>
                <span className="text-[14px] text-text-primary font-normal">
                  لوازم صوتی و تصویری
                </span>
              </div>

              {/* Row 1, Col 2 (Left): SKU */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-text-muted text-[12px]">
                  <BarcodeReadIcon size={16} color="#7a7a96" />
                  <span>کد کالا (SKU)</span>
                </div>
                <span className="text-[14px] text-text-primary font-normal tracking-wide">
                  DKP-۸۹۱۲۷
                </span>
              </div>

              {/* Row 2, Col 1 (Right): Shipping Commitment */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-text-muted text-[12px]">
                  <BoxShieldIcon size={16} color="#7a7a96" />
                  <span>تعهد ارسال</span>
                </div>
                <span className="text-[14px] text-text-primary font-normal">
                  آماده‌سازی: ۱ روز کاری
                </span>
              </div>

              {/* Row 2, Col 2 (Left): Total Stock */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-text-muted text-[12px]">
                  <span className="w-4 h-4 rounded-full bg-border-default/80 flex items-center justify-center text-[10px] text-text-muted">
                    📦
                  </span>
                  <span>موجودی کل</span>
                </div>
                <span className="text-[14px] text-text-primary font-normal">
                  ۲۴ عدد
                </span>
              </div>
            </div>

            {/* 3. Branch Inventory Alert Box (Figma Node: 44:44415) */}
            <div className="rounded-lg bg-surface-subtle p-3.5 flex flex-col gap-1.5 border border-border-subtle/50 text-right">
              <div className="flex items-center gap-1.5 text-text-muted text-[12px]">
                <BoxUserIcon size={16} color="#7a7a96" />
                <span>موجودی در دیگر شعب</span>
              </div>
              <p className="text-[14px] text-primary font-medium">
                تهران مرکزی: ۱۶ عدد • تهران غرب: ۸ عدد
              </p>
            </div>

            <div className="h-px bg-border-subtle" />

            {/* 4. Pricing & Competitor Section (Figma Nodes: 44:44421 / 44:44428) */}
            <div className="flex flex-col gap-3">
              {/* Discount Box */}
              <div className="rounded-lg bg-primary-50/70 border border-primary/15 p-4 flex items-center justify-between">
                {/* Title & Promotion deadline on RIGHT */}
                <div className="flex flex-col gap-1 text-right">
                  <div className="flex items-center gap-1.5 text-text-primary text-[14px] font-medium">
                    <TicketSimplePercentIcon size={18} color="#3d3183" />
                    <span>قیمت فروش با تخفیف تگ ‌مال</span>
                  </div>
                  <span className="text-[11px] text-error font-medium">
                    فروش ویژه تا ۱۵ مهرماه
                  </span>
                </div>

                {/* Price on LEFT */}
                <div className="text-[20px] font-bold text-[#108981]">
                  ۱۳,۰۶۴,۰۰۰ تومان
                </div>
              </div>

              {/* Competitor Price Comparison Row */}
              <div className="flex items-center justify-between px-1 text-[13px] text-text-muted">
                <div className="flex items-center gap-1.5">
                  <ChartLineDownSquareIcon size={16} color="#7a7a96" />
                  <span>کمترین قیمت سایر فروشندگان</span>
                </div>
                <span className="text-text-secondary font-medium">
                  ۱۲,۹۰۰,۰۰۰ تومان
                </span>
              </div>
            </div>

            {/* 5. Action Buttons (Figma Node: 44:44431) - Edit on RIGHT, Deactivate in MIDDLE, Delete on LEFT */}
            <div className="flex items-center justify-between gap-3 pt-2">
              {/* Right side in RTL: Edit Product (Figma Node: 44:44439 - no icon on desktop) */}
              <button
                type="button"
                className="h-[46px] px-6 rounded-xl bg-primary text-white text-[14px] font-semibold hover:bg-primary-hover transition-colors shadow-xs"
              >
                ویرایش اطلاعات محصول
              </button>

              {/* Left side in RTL: Deactivate in middle, Delete on far left */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="h-[46px] px-5 rounded-xl border border-border-default bg-surface text-text-secondary text-[14px] font-normal hover:bg-surface-subtle transition-colors"
                >
                  غیرفعال‌سازی موقت
                </button>
                <button
                  type="button"
                  className="h-[46px] px-6 rounded-xl bg-error text-white text-[14px] font-medium hover:bg-error/90 transition-colors shadow-xs"
                >
                  حذف محصول
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* LEFT COLUMN (In RTL grid: 5 cols = ~420px) -> Gallery Card & Variations Card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Card 1: Gallery Card (Figma Node: 44:44332) */}
          <section className="bg-surface rounded-2xl p-5 border border-border-default/60 flex flex-col items-center gap-4 shadow-xs">
            {/* Main Product Image */}
            <div className="relative w-full aspect-[420/378] max-h-[360px] rounded-xl overflow-hidden bg-surface-subtle flex items-center justify-center">
              <Image
                src={PRODUCT_IMAGES[selectedImage].src}
                alt={PRODUCT_IMAGES[selectedImage].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-contain p-2"
                priority
              />
            </div>

            {/* Carousel Dots Indicator (Figma Node: 44:44342) */}
            <div className="flex items-center justify-center gap-1.5 py-1" dir="ltr">
              {PRODUCT_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`transition-all ${
                    selectedImage === idx
                      ? "w-5 h-2.5 bg-primary rounded-full"
                      : "w-2.5 h-2.5 bg-border-default hover:bg-text-muted rounded-full"
                  }`}
                  aria-label={`نمایش تصویر ${idx + 1}`}
                />
              ))}
            </div>

            {/* Thumbnails Row (Figma Node: 44:44334) */}
            <div className="w-full flex items-center justify-center gap-2">
              {PRODUCT_IMAGES.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-[62px] h-[62px] rounded border transition-all overflow-hidden ${
                    selectedImage === idx
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border-default hover:border-border-hover opacity-80 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.thumb}
                    alt={img.alt}
                    fill
                    sizes="62px"
                    className="object-cover"
                  />
                </button>
              ))}

              {/* Extra Images Count Box */}
              <div className="w-[62px] h-[62px] rounded border border-border-default bg-[#eeeff6] flex items-center justify-center text-text-primary text-[14px] font-semibold select-none">
                +۱۲
              </div>
            </div>
          </section>

          {/* Card 2: Variations Card (Figma Node: 44:44351) */}
          <section className="bg-surface rounded-[20px] p-6 border border-border-default/60 flex flex-col gap-4 shadow-xs text-right">
            <h3 className="text-[15px] font-semibold text-text-primary">
              تنوع محصول
            </h3>

            <div className="h-px bg-border-subtle" />

            {/* Color Variations */}
            <div className="flex flex-col gap-2">
              <span className="text-[13px] text-text-muted">رنگبندی</span>
              <div className="flex flex-wrap items-center gap-2.5">
                {COLOR_OPTIONS.map((color) => {
                  const isSelected = selectedColor === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColor(color.id)}
                      className={`h-[38px] px-3 rounded-lg border text-[13px] flex items-center gap-2 transition-all ${
                        isSelected
                          ? "bg-primary-50 border-primary text-primary font-semibold"
                          : "border-border-default text-text-primary hover:border-border-hover bg-surface"
                      }`}
                    >
                      <span>{color.label}</span>
                      <span
                        className="w-3 h-3 rounded-full border border-border-default/40"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Capacity Variations */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-[13px] text-text-muted">ظرفیت</span>
              <div className="flex flex-wrap items-center gap-2.5">
                {CAPACITY_OPTIONS.map((cap) => {
                  const isSelected = selectedCapacity === cap.id;
                  return (
                    <button
                      key={cap.id}
                      type="button"
                      onClick={() => setSelectedCapacity(cap.id)}
                      className={`h-[38px] px-3.5 rounded-lg border text-[13px] transition-all ${
                        isSelected
                          ? "bg-primary-50 border-primary text-primary font-semibold"
                          : "border-border-default text-text-primary hover:border-border-hover bg-surface"
                      }`}
                    >
                      {cap.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Warranty Variations */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-[13px] text-text-muted">گارانتی</span>
              <div className="flex flex-wrap items-center gap-2.5">
                {WARRANTY_OPTIONS.map((war) => {
                  const isSelected = selectedWarranty === war.id;
                  return (
                    <button
                      key={war.id}
                      type="button"
                      onClick={() => setSelectedWarranty(war.id)}
                      className={`h-[38px] px-3.5 rounded-lg border text-[13px] transition-all ${
                        isSelected
                          ? "bg-primary-50 border-primary text-primary font-semibold"
                          : "border-border-default text-text-primary hover:border-border-hover bg-surface"
                      }`}
                    >
                      {war.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE VIEW (Single column cards matching Figma Node 44:45127) */}
      {/* ========================================================================= */}
      <div className="lg:hidden flex flex-col gap-4">
        {/* Card 1: Product Gallery & Header (Figma Node: 44:45153) */}
        <section className="bg-surface rounded-2xl p-4 border border-border-default/60 flex flex-col gap-4 shadow-xs">
          {/* Main Image Viewport with Nav arrows */}
          <div className="relative w-full aspect-[358/322] rounded-xl overflow-hidden bg-surface-subtle flex items-center justify-center">
            <Image
              src={PRODUCT_IMAGES[selectedImage].src}
              alt={PRODUCT_IMAGES[selectedImage].alt}
              fill
              sizes="(max-width: 640px) 100vw, 390px"
              className="object-contain p-2"
              priority
            />
          </div>

          {/* Dots Pagination + Next / Prev Buttons */}
          <div className="flex items-center justify-between px-2">
            <button
              type="button"
              onClick={prevImage}
              className="w-9 h-9 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors"
              aria-label="تصویر قبلی"
            >
              <ChevronRightIcon size={20} />
            </button>

            <div className="flex items-center gap-1.5" dir="ltr">
              {PRODUCT_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`transition-all ${
                    selectedImage === idx
                      ? "w-5 h-2.5 bg-primary rounded-full"
                      : "w-2.5 h-2.5 bg-border-default rounded-full"
                  }`}
                  aria-label={`تصویر ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextImage}
              className="w-9 h-9 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors"
              aria-label="تصویر بعدی"
            >
              <ChevronLeftIcon size={20} />
            </button>
          </div>

          {/* Thumbnails Row */}
          <div className="grid grid-cols-5 gap-2">
            {PRODUCT_IMAGES.map((img, idx) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelectedImage(idx)}
                className={`relative aspect-square rounded border transition-all overflow-hidden ${
                  selectedImage === idx
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border-default"
                }`}
              >
                <Image
                  src={img.thumb}
                  alt={img.alt}
                  fill
                  sizes="58px"
                  className="object-cover"
                />
              </button>
            ))}

            <div className="aspect-square rounded border border-border-default bg-[#eeeff6] flex items-center justify-center text-text-primary text-[13px] font-semibold select-none">
              +۱۲
            </div>
          </div>

          <div className="h-px bg-border-subtle" />

          {/* Product Title & Status */}
          <div className="flex flex-col gap-2 text-right">
            <h2 className="text-[17px] font-semibold text-text-primary leading-snug">
              هدفون بی سیم سونی مدل WH-1000XM4
            </h2>

            <div className="flex items-center justify-start">
              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#108981]/10 text-[#108981] text-[12px] font-semibold">
                وضعیت: فعال در ویترین
              </span>
            </div>

            <span className="text-[11px] text-text-muted">
              آخرین بروزرسانی: امروز ساعت ۱۰:۳۰
            </span>
          </div>
        </section>

        {/* Card 2: Price & Quick Edit (Figma Node: 44:45178) */}
        <section className="bg-surface rounded-2xl p-4 border border-border-default/60 flex flex-col gap-4 shadow-xs">
          {/* Discount Box */}
          <div className="rounded-lg bg-[#f9fafb] border border-[#eeeff6] p-3.5 flex flex-col gap-2 text-right">
            <div className="flex items-center gap-1.5 text-text-primary text-[13px] font-medium">
              <TicketSimplePercentIcon size={18} color="#3d3183" />
              <span>قیمت فروش با تخفیف تگ مال</span>
            </div>
            <span className="text-[11px] text-error font-medium">
              فروش ویژه تا ۱۵ مهرماه
            </span>
            <span className="text-[20px] font-bold text-[#108981]">
              ۱۳,۰۶۴,۰۰۰ تومان
            </span>
          </div>

          {/* Competitor Price */}
          <div className="flex flex-col gap-1 text-right px-1">
            <span className="text-[12px] text-text-muted">
              کمترین قیمت سایر فروشندگان
            </span>
            <span className="text-[15px] font-semibold text-text-secondary">
              ۱۲,۹۰۰,۰۰۰ تومان
            </span>
          </div>

          <div className="h-px bg-border-subtle" />

          {/* Edit Button */}
          <button
            type="button"
            className="w-full h-12 rounded-xl bg-primary text-white text-[14px] font-semibold hover:bg-primary-hover transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <EditIcon size={18} />
            <span>ویرایش اطلاعات محصول</span>
          </button>
        </section>

        {/* Card 3: Variations Card (Figma Node: 44:45194) */}
        <section className="bg-surface rounded-2xl p-4 border border-border-default/60 flex flex-col gap-4 shadow-xs text-right">
          <h3 className="text-[16px] font-semibold text-text-primary">
            تنوع محصول
          </h3>

          <div className="h-px bg-border-subtle" />

          {/* Color Variations (Radio list with color indicator) */}
          <div className="flex flex-col gap-2">
            <span className="text-[13px] text-text-muted">رنگبندی</span>
            <div className="flex flex-col gap-2">
              {COLOR_OPTIONS.map((color) => {
                const isSelected = selectedColor === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color.id)}
                    className={`h-12 px-3.5 rounded-lg border flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-primary-50/60 border-primary text-primary font-semibold"
                        : "border-border-default text-text-primary bg-surface"
                    }`}
                  >
                    {/* Color dot & label on RIGHT in RTL */}
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-border-default/40"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-[14px]">{color.label}</span>
                    </div>

                    {/* Radio circle on LEFT */}
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-border-default bg-surface"
                      }`}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Capacity Variations */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-[13px] text-text-muted">ظرفیت</span>
            <div className="grid grid-cols-3 gap-2">
              {CAPACITY_OPTIONS.map((cap) => {
                const isSelected = selectedCapacity === cap.id;
                return (
                  <button
                    key={cap.id}
                    type="button"
                    onClick={() => setSelectedCapacity(cap.id)}
                    className={`h-14 px-2 rounded-lg border text-[13px] flex items-center justify-center text-center transition-all ${
                      isSelected
                        ? "bg-primary-50/60 border-primary text-primary font-semibold"
                        : "border-border-default text-text-primary bg-surface"
                    }`}
                  >
                    {cap.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Warranty Variations */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-[13px] text-text-muted">گارانتی</span>
            <div className="flex flex-col gap-2">
              {WARRANTY_OPTIONS.map((war) => {
                const isSelected = selectedWarranty === war.id;
                return (
                  <button
                    key={war.id}
                    type="button"
                    onClick={() => setSelectedWarranty(war.id)}
                    className={`h-12 px-3.5 rounded-lg border flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-primary-50/60 border-primary text-primary font-semibold"
                        : "border-border-default text-text-primary bg-surface"
                    }`}
                  >
                    <span className="text-[14px]">{war.label}</span>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-border-default bg-surface"
                      }`}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Card 4: Product Specifications & Stock (Figma Node: 44:45230) */}
        <section className="bg-surface rounded-2xl p-4 border border-border-default/60 flex flex-col gap-4 shadow-xs text-right">
          <h3 className="text-[16px] font-semibold text-text-primary">
            شناسنامه کالا
          </h3>

          <div className="h-px bg-border-subtle" />

          {/* Category */}
          <div className="flex flex-col gap-1">
            <span className="text-[12px] text-text-muted">دسته‌بندی اصلی</span>
            <span className="text-[14px] text-text-primary font-normal">
              لوازم صوتی و تصویری
            </span>
          </div>

          {/* SKU */}
          <div className="flex flex-col gap-1">
            <span className="text-[12px] text-text-muted">کد کالا (SKU)</span>
            <span className="text-[14px] text-text-primary font-normal tracking-wide">
              DKP-۸۹۱۲۷
            </span>
          </div>

          <div className="h-px bg-border-subtle" />

          {/* Stock & Shipping */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-text-muted">موجودی کل</span>
              <span className="text-[14px] text-text-primary font-normal">
                ۲۴ عدد
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-text-muted">تعهد ارسال</span>
              <span className="text-[14px] text-text-primary font-normal">
                آماده‌سازی: ۱ روز کاری
              </span>
            </div>
          </div>

          {/* Branch Stocks Box */}
          <div className="rounded-lg bg-surface-subtle p-3.5 flex flex-col gap-2 border border-border-subtle/50">
            <span className="text-[13px] text-text-secondary font-medium">
              موجودی در دیگر شعب
            </span>
            <div className="flex items-center justify-between text-[13px] text-primary">
              <span>تهران مرکزی</span>
              <span>۱۶ عدد</span>
            </div>
            <div className="h-px bg-border-subtle/70" />
            <div className="flex items-center justify-between text-[13px] text-primary">
              <span>تهران غرب</span>
              <span>۸ عدد</span>
            </div>
          </div>
        </section>

        {/* Card 5: Secondary Actions (Figma Node: 44:45256) */}
        <section className="bg-surface rounded-2xl p-4 border border-border-default/60 flex flex-col gap-3 shadow-xs">
          <button
            type="button"
            className="w-full h-12 rounded-xl border border-border-default text-text-secondary text-[14px] font-normal hover:bg-surface-subtle transition-colors"
          >
            غیرفعال‌سازی موقت
          </button>

          <div className="h-px bg-border-subtle" />

          <button
            type="button"
            className="w-full h-12 rounded-xl text-error text-[14px] font-medium hover:bg-error/5 transition-colors"
          >
            حذف محصول
          </button>
        </section>
      </div>
    </div>
  );
}

export default SellerProductDetail;
