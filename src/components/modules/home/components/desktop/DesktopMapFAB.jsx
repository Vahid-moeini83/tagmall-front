"use client";

import { StrokeLocationIcon } from "@/icons";

export default function DesktopMapFAB({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="موقعیت‌یابی"
      className="absolute bottom-12 left-12 z-20 size-20 rounded-2xl bg-secondary border-2 border-surface/60 shadow-card flex items-center justify-center text-surface hover:bg-secondary-600 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
    >
      <StrokeLocationIcon size={36} className="text-surface" />
    </button>
  );
}
