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
    <div className="bg-white rounded-[20px] p-6 flex flex-col gap-4 h-[397px] border border-gray-100/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-bold text-[#1a1a2e]">
          پرفروش‌ترین محصولات
        </h2>
        <span className="text-[12px] text-[#7a7a96] font-normal cursor-pointer hover:text-[#1a1a2e] transition-colors">
          پرفروش‌ترین کالاها
        </span>
      </div>

      {/* Divider */}
      <hr className="border-t border-[#f3f4f6]" />

      {/* Product List */}
      <div className="flex flex-col gap-3 flex-1 justify-between">
        {TOP_PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="bg-[#f9fafb] rounded-xl p-2 flex items-center justify-between gap-3 h-16 hover:bg-[#f3f4f6]/60 transition-colors"
          >
            {/* Right: Product Thumbnail and Title */}
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white border border-gray-100">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <span className="text-[12px] text-[#1a1a2e] font-normal truncate">
                {product.title}
              </span>
            </div>

            {/* Left: Sales Count and Price */}
            <div className="flex flex-col items-start text-left shrink-0 pl-1">
              <span className="text-[12px] font-bold text-[#108981]">
                {product.salesCount}
              </span>
              <span className="text-[11px] text-[#7a7a96] font-normal">
                {product.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SellerTopProducts;
