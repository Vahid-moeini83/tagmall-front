import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ConversationIcon } from "@/icons";

export default function ProductSpecifications({ setShowComments, specs }) {
  return (
    <div className="lg:bg-white lg:rounded-t-lg pb-40 pt-18 lg:py-[50px] lg:px-[100px]">
      <Accordion type="single" collapsible defaultValue="specifications">
        <AccordionItem value="specifications">
          <AccordionTrigger className="hidden lg:flex text-primary text-[16px] lg:text-[20px] font-semibold hover:no-underline justify-between">
            مشخصات
          </AccordionTrigger>
          <AccordionContent className="lg:mt-4">
            {specs?.length > 0 ? (
              <div className="space-y-2 lg:space-y-4">
                {specs?.map((spec, index) => (
                  <div key={index}>
                    <div className="flex flex-col gap-2 lg:gap-5">
                      <h3 className="text-gray-600 text-xs lg:text-base font-extrabold">
                        {spec.name}:
                      </h3>
                      <p className="text-gray-600 text-xs/8 lg:text-base/12 font-extralight text-justify">
                        {spec.value}
                      </p>
                    </div>
                    {index < specs?.length - 1 && (
                      <div className="border-t-2 border-gray-200 lg:mt-1" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">
                مشخصاتی برای این محصول ثبت نشده است
              </p>
            )}
            <div
              onClick={() => setShowComments(true)}
              className=" lg:hidden fixed bottom-17 right-0 left-0 p-[10px] flex items-center justify-center"
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
