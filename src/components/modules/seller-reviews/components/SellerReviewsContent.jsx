"use client";

import { useRef, useState } from "react";
import {
  CloseSquareIcon,
  SquarePlusIcon2,
  StarIcon,
  StrokeArrowLeftIcon,
  VerifyIcon,
} from "@/icons";
import Image from "next/image";
import toast from "react-hot-toast";
import RatingOverview from "./RatingOverview";
import ReviewCard from "./ReviewCard";
import ReviewInput from "./ReviewInput";

export default function SellerReviewsContent({ onClose, sellerData }) {
  const [reviews, setReviews] = useState(sellerData?.reviews || []);
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [reportMsg, setReportMsg] = useState(null);
  const [reportText, setReportText] = useState("");
  const reportInputRef = useRef(null);

  const hasUserReview = reviews.some((review) => review.isUserReview);

  const handleDelete = async (reviewId) => {
    setDeletingReviewId(reviewId);

    // Test delete — remove from local list
    await new Promise((resolve) => setTimeout(resolve, 400));
    setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    setDeletingReviewId(null);
    toast.success("نظر حذف شد");
  };

  const handleReport = (target) => {
    setReportMsg(target);
    setReportText("");
  };

  const handleSubmitReport = () => {
    if (!reportText.trim()) return;

    // Test report submit
    toast.success("گزارش با موفقیت ثبت شد");
    setReportMsg(null);
    setReportText("");
  };

  const handleSubmitReview = (reviewData) => {
    if (hasUserReview) return;

    const newReview = {
      id: Date.now(),
      userName: "شما",
      rating: reviewData.rating,
      comment: reviewData.comment,
      productName: "محصول خریداری‌شده",
      timeAgo: "همین الان",
      isUserReview: true,
      sellerReply: null,
    };

    setReviews((prev) => [newReview, ...prev]);
  };

  const renderBottomContent = () => {
    // Report mode — like SupportSingleChat report UI
    if (reportMsg) {
      return (
        <div className="flex-1 max-w-[500px] mx-auto w-full">
          <div className="flex items-center justify-center relative mb-3">
            <span className="font-iransans font-bold text-error-medium text-base">
              گزارش نظر
            </span>
            <button
              type="button"
              onClick={() => {
                setReportMsg(null);
                setReportText("");
              }}
              className="absolute left-4"
            >
              <CloseSquareIcon size={20} />
            </button>
          </div>

          <div className="bg-gray-200 rounded-xl p-[5px] flex flex-col gap-2">
            <div className="border-2 border-gray-400 rounded-full p-[10px] max-w-[70%] mr-auto rounded-bl-none">
              <p className="font-iransans text-xs text-gray-600 line-clamp-1 overflow-hidden">
                {reportMsg.comment}
              </p>
            </div>

            <div className="flex items-end rounded-xl overflow-hidden bg-white">
              <textarea
                ref={reportInputRef}
                placeholder="توضیحات ...."
                value={reportText}
                rows={1}
                onChange={(e) => {
                  setReportText(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitReport();
                  }
                }}
                className="font-iransans placeholder:text-gray-400 text-gray-600 min-h-12 py-3 pr-4 w-full outline-none select-all bg-transparent resize-none overflow-hidden leading-6 text-right placeholder:text-center placeholder:pr-8 flex-1"
              />
              <div className="flex items-center justify-center w-12 min-h-12 shrink-0">
                <button
                  type="button"
                  disabled={reportText.trim().length === 0}
                  onClick={handleSubmitReport}
                  className={`font-iransans transition-colors ${
                    reportText.trim().length > 0
                      ? "text-primary cursor-pointer"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  ارسال
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // After user submitted a review — thank you instead of input
    if (hasUserReview) {
      return (
        <div className="flex-1 flex items-center justify-center pt-2 pb-8 lg:py-4">
          <p className="font-iransans font-bold text-success-medium text-sm lg:text-base text-center">
            از اشتراک گذاری تجربه خرید متشکریم :)
          </p>
        </div>
      );
    }

    return (
      <div className="flex-1">
        <ReviewInput
          userAvatar={sellerData.userAvatar}
          onSubmit={handleSubmitReview}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="lg:hidden flex items-center justify-center pt-4 pb-2 px-[10px]">
        <h3 className="font-iransans font-bold text-primary">
          تجربه خرید از{" "}
          <span className="font-iransans font-extralight">
            {sellerData?.sellerName}
          </span>
        </h3>
      </div>
      <div className="overflow-y-auto scroll-hidden">
        <div className="min-h-screen lg:py-[50px] lg:px-[140px] pb-46 lg:pb-[160px]">
          {/* Main content */}
          <div className="flex flex-col gap-3 lg:gap-8">
            <div className="flex items-center justify-between lg:items-start lg:flex-col gap-1 px-[10px] lg:px-0">
              {/* Seller profile section */}
              <div className="flex items-center gap-2">
                <Image
                  src={
                    sellerData.sellerAvatar ||
                    "/assets/images/fallback/avatar.png"
                  }
                  width={48}
                  height={48}
                  alt="seller avatar"
                  className="bg-white rounded-lg"
                />
                <div className="flex items-center gap-1">
                  <span className="text-sm lg:text-base text-gray-600">
                    {sellerData.sellerName}
                  </span>
                  <VerifyIcon size={20} />
                </div>
              </div>
              {/* Overall rating section */}
              <div className="flex items-center gap-1 ml-[5px]">
                <span className="text-sm text-gray-600">
                  آرا {sellerData.totalReviews}
                </span>
                <div className="flex items-center gap-1">
                  <StarIcon size={20} className="text-yellow-600 mb-1" />
                  <span className="text-sm lg:text-base">
                    {sellerData.rating}
                    <span className="text-xs text-gray-600/70">/5</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Rating distribution section - centered */}
            <div className="max-w-[640px] mx-auto w-full border-b-4 border-gray-200 pb-[10px] lg:pb-0 lg:border-0 lg:-translate-y-12">
              <div className="px-[10px] lg:px-0">
                <RatingOverview
                  ratingDistribution={sellerData.ratingDistribution}
                />
              </div>
            </div>

            {/* Reviews section */}
            <div className="flex flex-col gap-4 lg:gap-6 w-full lg:mt-0">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="not-last:border-b-4 border-gray-200"
                >
                  <div className="px-[10px] pb-4 lg:px-0 lg:pb-6">
                    <ReviewCard
                      review={review}
                      isUserReview={review.isUserReview}
                      onDelete={handleDelete}
                      onReport={handleReport}
                      isDeleting={deletingReviewId === review.id}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed bottom section */}
        <div className="fixed left-0 right-0 bg-white py-2 lg:py-4 px-4 lg:px-[80px] bottom-0">
          <div className="flex items-center gap-4">
            {/* Back button */}
            <button
              type="button"
              onClick={onClose}
              className="hidden lg:inline shrink-0"
              aria-label="بازگشت"
            >
              <StrokeArrowLeftIcon
                size={20}
                className="text-gray-700 rotate-180"
              />
            </button>

            {renderBottomContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
