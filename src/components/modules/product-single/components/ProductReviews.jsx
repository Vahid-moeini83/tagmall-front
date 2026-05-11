import Image from "next/image";
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
    <div className="lg:bg-white pb-40 lg:py-[50px] lg:px-[100px]">
      <Accordion type="single" collapsible defaultValue="reviews">
        <AccordionItem value="reviews">
          <AccordionTrigger className="hidden lg:flex text-primary text-[16px] lg:text-[20px] font-semibold hover:no-underline justify-between">
            نقد و بررسی
          </AccordionTrigger>
          <AccordionContent className="lg:mt-4">
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
                  {review?.text || ""}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowComments(true)}
              className="font-iransans lg:hidden fixed bottom-20 py-4 right-[10px] left-[10px] rounded-lg bg-white text-primary"
            >
              پرسش و پاسخ و نظرات کاربران
            </button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
