import Image from "next/image";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function ProductReviews() {
  return (
    <div className="bg-white rounded-lg py-[10px] px-[10px] lg:py-[50px] lg:px-[100px]">
      <Accordion type="single" collapsible defaultValue="reviews">
        <AccordionItem value="reviews">
          <AccordionTrigger className="text-primary text-[16px] lg:text-[20px] font-semibold hover:no-underline justify-between">
            نقد و بررسی
          </AccordionTrigger>
          <AccordionContent className="mt-4">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Right Section - Image */}
              <div className="lg:w-1/2">
                <div className="relative w-full h-[460px]">
                  <Image
                    src="/assets/images/fallback/phone.png"
                    fill
                    alt="Product review"
                    className="object-contain"
                    quality={100}
                  />
                </div>
              </div>

              {/* Left Section - Text */}
              <div className="lg:w-1/2">
                <p className="text-gray-600 text-base/12">
                  گوشی های هوشمند خانواده آیفون 15 در قالب چهار گوشی آیفون 15
                  پرومکس و آیفون 15 پرو و آیفون 15 و آیفون مینی معرفی شدند ؛
                  بدون شک دو مدل پرو وپرو مکس به عنوان پرچمدار شرکت از مشخصات
                  فنی قدرتمند تری بهره برده اند .اما در این میان آیفون 15 به
                  همراه آیفون 15مینی با قیمتی مقرون به صرفه تر روانهبازار شده
                  اند تا امکان خرید برای کاربران بیش تر امکان پذیر باشد .در این
                  مقاله خواهیم دید که آیفون15 به نسبت نسخل قبلی چه مشخصاتی با
                  خودبه همراه داشته و در بخش های مختلف چه عملکردی را به نمایش می
                  گذارد .شاید با توجه به مشخصات تقریبا مشابه آیفون15 و آیفون14 ،
                  این سوال برای شمابه وجود آید که چرا آیفون15 می تواند عملکرد
                  بهتری داشته باشد. پس با ما همراه باشید تا دلایل عملکرد بهتر و
                  قدرتمند تر و سریع تر آیفون 15 به نسبت آیفون 14 پی ببرید .
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
