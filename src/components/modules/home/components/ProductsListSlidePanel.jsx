"use client";

import { cn } from "@/lib/client/utils";

export default function ProductsListSlidePanel({ isActive, children, footer }) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-center h-full",
        isActive ? "w-full" : "mx-auto w-[90%] h-[95%]",
      )}
    >
      <div
        className={cn(
          "flex flex-col justify-between h-full min-h-0 py-12 px-16 transition-opacity duration-300",
          isActive ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        {children}
        {footer}
      </div>
    </div>
  );
}
