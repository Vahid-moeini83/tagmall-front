"use client";

import { useState } from "react";
import {
  ArrowRightIcon,
  StarIcon,
  StrokeArrowLeftIcon,
  VerifyIcon,
} from "@/icons";
import Image from "next/image";
import RatingOverview from "./RatingOverview";
import ReviewCard from "./ReviewCard";
import ReviewInput from "./ReviewInput";
import Dialog, { DialogWrapper } from "@/components/ui/dialog";

export default function SellerReviewsModal({ isOpen, onClose, sellerData }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    // Delete review logic
    console.log("Deleting review:", reviewToDelete);
    setShowDeleteDialog(false);
    setReviewToDelete(null);
  };

  const handleSubmitReview = (reviewData) => {
    // Submit new review logic
    console.log("New review:", reviewData);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main container */}
      <div className="fixed inset-0 z-[150] bg-white overflow-y-auto">
        <div className="min-h-screen py-8 lg:py-[50px] px-4 lg:px-[140px] pb-[180px] lg:pb-[160px]">
          {/* Main content */}
          <div className="flex flex-col gap-4 lg:gap-8">
            <div className="flex items-center justify-between lg:items-start lg:flex-col gap-1">
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
              <div className="flex items-center gap-1">
                <span className="text-xs lg:text-sm text-gray-600/70">
                  (آرا {sellerData.totalReviews})
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
            <div className="max-w-[640px] mx-auto w-full lg:-translate-y-12">
              <RatingOverview
                ratingDistribution={sellerData.ratingDistribution}
              />
            </div>

            {/* Reviews section */}
            <div className="flex flex-col gap-4 lg:gap-6 w-full">
              {sellerData.reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isUserReview={review.isUserReview}
                  onDelete={() => handleDeleteClick(review.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Fixed bottom section */}
        <div className="fixed left-0 right-0 bg-white  py-2 px-4 lg:px-[80px] bottom-0">
          <div className="flex items-center gap-4">
            {/* Back button */}
            <button
              onClick={onClose}
              className="hidden lg:inline shrink-0"
              aria-label="بازگشت"
            >
              <StrokeArrowLeftIcon
                size={24}
                className="text-gray-700 rotate-180"
              />
            </button>

            {/* Review input field */}
            <div className="flex-1">
              <ReviewInput
                userAvatar={sellerData.userAvatar}
                onSubmit={handleSubmitReview}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <DialogWrapper
        title="حذف نظر"
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <div className="flex flex-col gap-4">
          <p className="text-gray-700">آیا از حذف این نظر اطمینان دارید؟</p>
          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={() => setShowDeleteDialog(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              انصراف
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-error text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              حذف
            </button>
          </div>
        </div>
      </DialogWrapper>
    </>
  );
}
