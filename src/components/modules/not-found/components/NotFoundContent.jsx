"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LocateIcon, ChevronRightIcon, LocationIcon } from "@/icons";

function NotFoundActions() {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full max-w-[320px] gap-3">
      <Link
        href="/"
        className="w-full flex items-center justify-center gap-2 rounded-full bg-primary text-white font-bold py-3 px-6 transition-opacity hover:opacity-90 active:scale-[0.98]"
      >
        <LocationIcon size={20} className="text-white " />
        بازگشت به صفحه اصلی
      </Link>

      <button
        type="button"
        onClick={() => router.back()}
        className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-primary text-primary font-bold py-3 px-6 bg-white transition-colors hover:bg-tint-200 active:scale-[0.98] cursor-pointer"
      >
        <ChevronRightIcon size={20} className="text-primary" />
        بازگشت به صفحه قبل
      </button>
    </div>
  );
}

function NotFoundContent() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-linear-to-b from-tint-200 via-white to-tint-300 flex flex-col items-center justify-center px-6 py-12">
      {/* Decorative background shapes */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-tint-500/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/3 left-8 w-16 h-16 rounded-2xl bg-primary/5 rotate-12 animate-slide-up-simple"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-10 w-12 h-12 rounded-full bg-tint-600/20 animate-fade-in"
        aria-hidden
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg animate-fade-in">
        <Image
          src="/assets/images/logo/small-logo.svg"
          width={48}
          height={48}
          alt="تگ مال"
          className="mb-6"
          priority
        />

        {/* 404 visual */}
        <div className="mb-8">
          <div className="bg-white border-2 border-primary rounded-2xl px-10 py-8 shadow-[0_20px_60px_-15px_rgba(61,49,131,0.25)]">
            <p className="text-7xl sm:text-8xl font-bold leading-none bg-linear-to-br from-primary to-shade-200 bg-clip-text text-transparent">
              ۴۰۴
            </p>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-primary mb-8">
          صفحه یافت نشد
        </h1>

        <NotFoundActions />
      </div>
    </main>
  );
}

export default NotFoundContent;
