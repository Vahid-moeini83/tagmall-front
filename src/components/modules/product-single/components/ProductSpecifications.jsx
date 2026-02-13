import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function ProductSpecifications() {
  const specifications = [
    {
      title: "ابعاد",
      description: "12 * 32 میلی متر",
    },
    {
      title: "وزن",
      description: "203 گرم",
    },
    {
      title: "توضیحات سیم کارت",
      description: "سایز نانو",
    },
    {
      title: "ساختار بدنه",
      description:
        "فلز و شیشه ( قاب جلو و پشت شیشه‌ای با فریمی از جنس فولاد ضدزنگ ) دارای استاندارد IP۶۸ برای مقاومت در برابر آب ( به مدت ۳۰ دقیقه در عمق ۶ متر ) صفحه نمایش با شیشه مقاوم در برابر خط و خش به همراه محافظ Ceramic Glass دارای پوشش Olephobic برای صفحه نمایش",
    },
  ];

  return (
    <div className="bg-white rounded-lg py-[10px] px-[10px] lg:py-[50px] lg:px-[100px]">
      <Accordion type="single" collapsible defaultValue="specifications">
        <AccordionItem value="specifications">
          <AccordionTrigger className="text-primary text-[16px] lg:text-[20px] font-semibold hover:no-underline justify-between">
            مشخصات
          </AccordionTrigger>
          <AccordionContent className="mt-4">
            <div className="space-y-4">
              {specifications.map((spec, index) => (
                <div key={index}>
                  <div className="flex flex-col gap-4">
                    <h3 className="text-gray-600 font-bold">{spec.title}</h3>
                    <p className="text-gray-600">{spec.description}</p>
                  </div>
                  {index < specifications.length - 1 && (
                    <div className="border-t border-gray-200 mt-4" />
                  )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
