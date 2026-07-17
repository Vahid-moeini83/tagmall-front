import Image from "next/image";
import { ConversationIcon } from "@/icons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function ProductReviews({ setShowComments, review }) {
  if (!review) {
    return null;
  }

  return (
    <div className="lg:bg-white pb-40 pt-16 lg:py-[50px] lg:px-[100px]">
      <Accordion type="single" collapsible defaultValue="reviews">
        <AccordionItem value="reviews">
          <AccordionTrigger className="hidden lg:flex text-primary text-[16px] lg:text-[20px] font-semibold hover:no-underline justify-between">
            نقد و بررسی
          </AccordionTrigger>
          <AccordionContent className="lg:mt-4">
            {review?.text ? (
              <div className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-6">
                {/* Image Section */}
                <div className="lg:w-1/2">
                  <div className="relative w-full h-[160px] lg:h-[460px]">
                    <Image
                      src={review?.image || "/assets/images/fallback/phone.png"}
                      fill
                      alt="Product review"
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Left Section - Text */}
                <div className="lg:w-1/2">
                  <p className="text-gray-600 text-xs/8 lg:text-base/12 text-justify">
                    {review?.text}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-600 mt-2">
                نقد و بررسی برای این محصول ثبت نشده است
              </p>
            )}
            <div
              onClick={() => setShowComments(true)}
              className=" lg:hidden fixed bottom-17 p-[10px] right-0 left-0 flex items-center justify-center"
            >
              <button className="font-iransans w-full rounded-full bg-white text-primary border-2 border-primary py-2 flex items-center justify-center gap-2">
                <ConversationIcon size={20} />
                پرسش و پاسخ و دیدگاه کاربران
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
