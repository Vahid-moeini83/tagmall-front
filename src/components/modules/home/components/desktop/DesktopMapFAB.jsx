"use client";

import { LocationPinAreaIcon } from "@/icons";

export default function DesktopMapFAB({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="موقعیت‌یابی"
      className="absolute bottom-12.5 left-12.5 z-20 size-20 rounded-2xl bg-secondary border-2 border-surface/80 shadow-card flex items-center justify-center text-surface hover:bg-secondary-600 active:scale-95 transition-all cursor-pointer backdrop-blur-lg"
    >
      <LocationPinAreaIcon size={38} className="text-surface" />
    </button>
  );
}
