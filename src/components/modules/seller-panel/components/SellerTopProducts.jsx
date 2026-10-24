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
    <div className="bg-surface rounded-xl lg:rounded-[20px] p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 h-auto min-h-[374px] lg:h-[397px] border border-border-subtle shadow-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <h2 className="text-body font-bold text-text-primary">
          پرفروش‌ترین محصولات
        </h2>
        <span className="text-[12px] sm:text-caption text-text-muted font-normal cursor-pointer hover:text-text-primary transition-colors">
          پرفروش‌ترین کالاها
        </span>
      </div>

      {/* Divider on desktop */}
      <hr className="hidden sm:block border-t border-border-subtle" />

      {/* Product List */}
      <div className="flex flex-col gap-3 flex-1 justify-between">
        {TOP_PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="bg-surface-subtle rounded-lg p-2 flex items-center justify-between gap-3 h-16 hover:bg-surface-muted transition-colors"
          >
            {/* Right: Product Thumbnail and Title */}
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 bg-surface border border-border-subtle">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <span className="text-caption text-text-primary font-normal truncate">
                {product.title}
              </span>
            </div>

            {/* Left: Sales Count and Price */}
            <div className="flex flex-col items-start text-left shrink-0 pl-1">
              <span className="text-caption font-bold text-success">
                {product.salesCount}
              </span>
              <span className="text-[11px] text-text-muted font-normal">
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
