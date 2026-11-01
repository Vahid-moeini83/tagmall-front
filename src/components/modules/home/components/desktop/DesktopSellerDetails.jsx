"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  VerifyIcon,
  StarIcon,
  ArrowLeftIcon,
  LocationPinLineIcon,
  DesktopMonitorIcon,
  AngleLeftCircleIcon,
  MessageTextIcon,
} from "@/icons";
import DesktopStoreGalleryModal from "./DesktopStoreGalleryModal";

export default function DesktopSellerDetails({
  activeSellerInfo,
  onBackToSlider,
}) {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const galleryRef = useRef(null);

  const storeName =
    activeSellerInfo?.name ||
    activeSellerInfo?.storeName ||
    activeSellerInfo?.sellerName ||
    "فروشگاه گرین کالا";
  const ratingText = activeSellerInfo?.rating
    ? `${activeSellerInfo.rating}/۵`
    : "۴.۹/۵";

  // Gallery images (from seller data or default fallbacks)
  const galleryImages = activeSellerInfo?.gallery?.length
    ? activeSellerInfo.gallery
    : [
        "/assets/images/home/sampleMap.jpg",
        "/assets/images/home/sampleMap.jpg",
        "/assets/images/home/sampleMap.jpg",
        "/assets/images/home/sampleMap.jpg",
      ];

  const handleImageClick = (idx) => {
    setSelectedImageIndex(idx);
    setIsGalleryModalOpen(true);
  };

  const scrollGallery = (direction) => {
    if (!galleryRef.current) return;
    const scrollAmount = 175;
    galleryRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-between pt-4 overflow-y-auto pr-1 scrollbar-thin">
      <div className="space-y-6">
        {/* Store Header (Figma 515x60) */}
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle h-15">
          {/* Right side: Store Avatar & Meta */}
          <div className="flex items-center gap-4">
            <div className="size-15 rounded-xl border border-border-default overflow-hidden relative shrink-0">
              <Image
                src={
                  activeSellerInfo?.profileImage ||
                  "/assets/images/fallback/no-photo.jpg"
                }
                alt={storeName}
                width={60}
                height={60}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <h3 className="text-h5 font-semibold text-text-primary">
                  {storeName}
                </h3>
                <VerifyIcon size={20} />
              </div>
              {/* Badges */}
              <div className="flex items-center gap-2">
                <div className="bg-surface-muted rounded-pill px-2.5 py-1 text-label text-text-secondary font-normal">
                  باز است
                </div>
                <div className="bg-surface-muted rounded-pill px-2.5 py-1 text-label text-text-secondary font-normal flex items-center gap-1">
                  <StarIcon size={15} className="text-warning" />
                  <span className="font-semibold">{ratingText}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Left side: Back to slider button */}
          <button
            type="button"
            onClick={onBackToSlider}
            aria-label="بازگشت به لیست فروشگاه‌ها"
            className="size-10 rounded-lg hover:bg-surface-subtle flex items-center justify-center text-text-primary transition-colors cursor-pointer"
          >
            <ArrowLeftIcon size={24} />
          </button>
        </div>

        {/* Metadata Grid (Figma 515x124) */}
        <div className="bg-surface-subtle border border-border-default rounded-xl p-3 flex flex-col gap-3">
          {/* Hours Row */}
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-surface border border-border-default flex items-center justify-center shrink-0 text-text-primary">
              <DesktopMonitorIcon size={18} />
            </div>
            <span className="text-small text-text-primary flex-1 text-right">
              {activeSellerInfo?.workingHours ||
                "معمولا از ساعت ۹ تا ۱۳ و ۱۷ تا ۲۴"}
            </span>
          </div>

          {/* Address Row */}
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-lg bg-surface border border-border-default flex items-center justify-center shrink-0 text-text-primary mt-0.5">
              <LocationPinLineIcon size={18} />
            </div>
            <span className="text-small text-text-primary flex-1 text-right leading-relaxed">
              {activeSellerInfo?.address ||
                "تهران، ضلع جنوب شرقی تقاطع خیابان جمهوری اسلامی و پل حافظ، چهارسو مال، سیتی سنتر"}
            </span>
          </div>
        </div>

        {/* Gallery Section (Figma 515x408) */}
        <div className="space-y-3">
          <h4 className="text-body font-semibold text-text-primary text-right">
            تصاویر محیط فروشگاه
          </h4>

          {/* Gallery Horizontal Grid / Carousel */}
          <div
            ref={galleryRef}
            className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1 scroll-smooth"
          >
            {galleryImages.map((imgSrc, idx) => (
              <div
                key={idx}
                onClick={() => handleImageClick(idx)}
                title="مشاهده تصویر در اندازه کامل"
                className="w-41.25 h-80 shrink-0 rounded-xl overflow-hidden shadow-card border border-border-default bg-surface relative cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <Image
                  src={imgSrc}
                  alt={`تصویر فروشگاه ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Gallery navigation & indicators */}
          <div className="flex items-center justify-center gap-3 pt-2 h-6">
            <button
              type="button"
              onClick={() => {
                scrollGallery("right");
                setActivePageIndex((prev) => Math.max(prev - 1, 0));
              }}
              aria-label="قبلی"
              className="text-text-muted hover:text-primary transition-colors cursor-pointer rotate-180 flex items-center justify-center"
            >
              <AngleLeftCircleIcon size={24} />
            </button>

            {/* Pagination dots */}
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map((idx) =>
                idx === activePageIndex ? (
                  <div
                    key={idx}
                    className="w-5 h-2.5 rounded-pill bg-primary transition-all duration-300"
                  />
                ) : (
                  <div
                    key={idx}
                    className="size-2.5 rounded-circle bg-border-strong transition-all duration-300"
                  />
                ),
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                scrollGallery("left");
                setActivePageIndex((prev) => Math.min(prev + 1, 3));
              }}
              aria-label="بعدی"
              className="text-primary hover:text-primary-600 transition-colors cursor-pointer flex items-center justify-center"
            >
              <AngleLeftCircleIcon size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Support Button (Figma 515x50 at bottom) */}
      <Link
        href="/support"
        className="mt-6 w-full h-12.5 rounded-xl bg-primary hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 text-surface text-body font-normal cursor-pointer shrink-0"
      >
        <MessageTextIcon size={20} className="text-surface" />
        <span>ارتباط با واحد پشتیبانی</span>
      </Link>

      {/* Fullscreen Store Images Lightbox Modal */}
      <DesktopStoreGalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        images={galleryImages}
        currentIndex={selectedImageIndex}
        onIndexChange={setSelectedImageIndex}
      />
    </div>
  );
}
