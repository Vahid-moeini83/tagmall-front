import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { HintIcon, StarIcon } from "@/icons";
import { Trash2Icon } from "lucide-react";

export default function ReviewCard({ review, isUserReview, onDelete }) {
  const borderColor = isUserReview ? "border-gray-400" : "border-gray-200";
  const bgColor = isUserReview ? "bg-gray-100/50" : "";

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col gap-2 items-start justify-between w-full">
        {/* Customer review - right side */}
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="w-full flex justify-start">
              <div className="flex flex-col gap-1 items-center">
                <div
                  className={`max-w-[380px] lg:max-w-[440px] ${bgColor} border-2 ${borderColor} rounded-t-lg rounded-bl-lg p-4 flex flex-col gap-3`}
                >
                  <div className="flex items-center gap-1">
                    <StarIcon className="text-yellow-600" size={20} />
                    <span>
                      {review.rating}
                      <span className="text-xs text-gray-600/70">/5</span>
                    </span>
                  </div>

                  <p className="text-gray-600 font-iransans text-xs lg:text-sm leading-relaxed">
                    <span className="font-iransans font-semibold text-gray-800">
                      {review.userName} :
                    </span>{" "}
                    {review.comment}
                  </p>

                  <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                    <span className="font-iransans">{review.productName}</span>
                  </div>

                  <div className="text-center text-gray-400 text-xs mt-2">
                    {review.timeAgo}
                  </div>
                </div>
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="bg-white border shadow-xl z-[1000]">
            {isUserReview && (
              <ContextMenuItem className="flex items-center justify-between text-xs lg:text-base text-error-medium py-3! lg:py-2! cursor-pointer hover:bg-error-light">
                <Trash2Icon size={20} />
                حذف
              </ContextMenuItem>
            )}
            <ContextMenuItem className="flex items-center justify-between text-xs lg:text-base text-error-medium py-3! lg:py-2! cursor-pointer hover:bg-error-light">
              <HintIcon size={20} />
              گزارش
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        {/* Seller reply - left side */}
        {review.sellerReply && (
          <div className="w-full flex justify-end">
            <ContextMenu>
              <ContextMenuTrigger>
                <div className="max-w-[380px] lg:max-w-[440px] border-2 border-gray-200 rounded-t-lg rounded-br-lg p-4 flex flex-col gap-3">
                  <p className="text-gray-600 font-iransans text-xs lg:text-sm leading-relaxed">
                    <span className="font-semibold font-iransans text-gray-800">
                      پاسخ فروشنده:
                    </span>{" "}
                    {review.sellerReply.comment}
                  </p>

                  <div className="text-center text-gray-400 text-xs mt-2">
                    {review.sellerReply.timeAgo}
                  </div>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className="bg-white border shadow-xl z-[1000]">
                <ContextMenuItem className="flex items-center justify-between text-xs lg:text-base text-error-medium py-3! lg:py-2! cursor-pointer hover:bg-error-light">
                  <HintIcon size={20} />
                  گزارش
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        )}
      </div>
    </div>
  );
}
