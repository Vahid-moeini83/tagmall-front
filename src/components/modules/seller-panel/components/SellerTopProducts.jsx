import Image from "next/image";

const TOP_PRODUCTS = [
  {
    id: 1,
    title: "گوشی شیائومی پوکو X6 پرو ۵G",
    salesCount: "۱۲۴ فروش",
    price: "۱۷,۴۹۰,۰۰۰ تومان",
    image: "/assets/images/seller/poco-1.png",
  },
  {
    id: 2,
    title: "گوشی شیائومی پوکو X6 پرو ۵G",
    salesCount: "۱۲۴ فروش",
    price: "۱۷,۴۹۰,۰۰۰ تومان",
    image: "/assets/images/seller/poco-2.png",
  },
  {
    id: 3,
    title: "گوشی شیائومی پوکو X6 پرو ۵G",
    salesCount: "۱۲۴ فروش",
    price: "۱۷,۴۹۰,۰۰۰ تومان",
    image: "/assets/images/seller/poco-3.png",
  },
  {
    id: 4,
    title: "گوشی شیائومی پوکو X6 پرو ۵G",
    salesCount: "۱۲۴ فروش",
    price: "۱۷,۴۹۰,۰۰۰ تومان",
    image: "/assets/images/seller/poco-4.png",
  },
];

function SellerTopProducts() {
  return (
    <div className="bg-surface rounded-xl lg:rounded-[20px] p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 h-auto min-h-[434px] sm:min-h-[374px] lg:h-[397px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-1">
        <h2 className="text-[18px] leading-[26px] sm:text-body sm:leading-[25px] [font-weight:450] sm:[font-weight:600] text-text-primary">
          پرفروش‌ترین محصولات
        </h2>
        <span className="text-[12px] leading-[18px] sm:text-caption text-text-muted [font-weight:325] cursor-pointer hover:text-text-primary transition-colors">
          پرفروش‌ترین کالاها
        </span>
      </div>

      {/* Divider on desktop */}
      <hr className="hidden sm:block border-t border-border-subtle" />

      {/* Product List */}
      <div className="flex flex-col gap-[10px] sm:gap-3 flex-1">
        {TOP_PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="bg-surface-subtle rounded-[12px] p-2.5 sm:p-2 flex items-center gap-3 h-[76px] sm:h-16 shrink-0 hover:bg-surface-muted transition-colors"
          >
            {/* Mobile: product details stack beside the thumbnail. */}
            <div className="relative h-[56px] w-12 rounded-[8px] sm:h-12 sm:rounded-[7.2px] overflow-hidden shrink-0 bg-surface">
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 overflow-hidden sm:flex-row sm:items-center sm:gap-3">
              <span className="w-full truncate text-right text-[14px] leading-[22px] text-text-primary [font-weight:325] sm:text-caption sm:leading-[18px]">
                {product.title}
              </span>
              <div className="flex w-full min-w-0 flex-row-reverse items-center justify-between gap-0 sm:w-auto sm:shrink-0 sm:flex-col sm:items-start sm:gap-[2px]">
                <span className="w-[53px] shrink-0 whitespace-nowrap text-left text-caption leading-[18px] [font-weight:325] sm:[font-weight:600] text-success-strong">
                  {product.salesCount}
                </span>
                <span className="w-[89px] shrink-0 whitespace-nowrap text-left text-[12px] leading-[18px] text-text-muted [font-weight:325] sm:text-[11px] sm:leading-[17px]">
                  {product.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SellerTopProducts;
