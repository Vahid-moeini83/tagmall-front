"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

function SellerDetails({ activeSellerInfo, viewMode, onBackToSlider }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      rtl: true,
      loop: true,
      slides: {
        perView: 1,
        spacing: 10,
      },
    },
    [
      (slider) => {
        slider.on("created", () => {
          setCurrentSlide(slider.track.details.rel);
        });
        slider.on("slideChanged", () => {
          setCurrentSlide(slider.track.details.rel);
        });
      },
    ],
  );

  // Refresh slider layout when switching to seller-details view so it renders correctly
  useEffect(() => {
    if (viewMode === "seller-details" && instanceRef.current) {
      setTimeout(() => {
        instanceRef.current.update();
      }, 100);
    }
  }, [viewMode]);

  return (
    <div className="flex flex-col gap-4 h-full animate-in fade-in zoom-in duration-300">
      <button
        onClick={onBackToSlider}
        className="flex items-center gap-2 text-primary font-bold self-start"
      >
        <ArrowRightIcon className="w-5 h-5" />
        <span>بازگشت به لیست محصولات</span>
      </button>
      <div className="flex flex-col gap-2 text-gray-600 bg-white/60 p-4 rounded-xl backdrop-blur-md">
        <div className="flex items-start gap-2">
          <span className="font-semibold">آدرس:</span>
          <span>{activeSellerInfo.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">ساعت کاری:</span>
          <span>{activeSellerInfo.workingHours}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-gray-700">عکس های فروشگاه:</span>
        <div
          ref={sliderRef}
          className="keen-slider rounded-lg overflow-hidden shadow-md"
        >
          <div className="keen-slider__slide number-slide1">
            <Image
              src="/assets/images/home/sampleMap.jpg"
              alt="Store Image 1"
              width={600}
              height={400}
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="keen-slider__slide number-slide2">
            <Image
              src="/assets/images/home/sampleMap.jpg"
              alt="Store Image 2"
              width={600}
              height={400}
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="keen-slider__slide number-slide3">
            <Image
              src="/assets/images/home/sampleMap.jpg"
              alt="Store Image 3"
              width={600}
              height={400}
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                instanceRef.current?.moveToIdx(idx);
              }}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                currentSlide === idx
                  ? "bg-primary w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SellerDetails;
