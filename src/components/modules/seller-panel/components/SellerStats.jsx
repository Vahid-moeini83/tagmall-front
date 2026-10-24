import {
  CoinFrontSwapIcon,
  BasketShoppingIcon,
  BarcodeReadIcon,
  CursorClickIcon,
} from "@/icons";


const STATS_DATA = [
  {
    id: "total-sales",
    title: "کل فروش (ماه)",
    value: "۴۸,۵۰۰,۰۰۰",
    unit: "تومان",
    desktopValue: "۴۸,۵۰۰,۰۰۰ تومان",
    change: "+۱۸.۵%",
    mobileChange: "۱۸.۵٪+ ↑",
    icon: CoinFrontSwapIcon,
    iconSize: 24,
    iconColor: "text-primary",
    iconBg: "bg-primary-100",
  },
  {
    id: "orders-count",
    title: "تعداد سفارشات",
    value: "۳۴ سفارش",
    change: "+۱۲%",
    mobileChange: "۱۲٪+ ↑",
    icon: BasketShoppingIcon,
    iconSize: 20,
    mobileIconSize: 18,
    iconColor: "text-success",
    iconBg: "bg-success-light",
  },
  {
    id: "active-products",
    title: "محصولات فعال",
    value: "۴۸ کالا",
    change: "+۱۲%",
    mobileChange: "۱۲٪+ ↑",
    icon: BarcodeReadIcon,
    iconSize: 24,
    mobileIconSize: 18,
    iconColor: "text-primary",
    iconBg: "bg-primary-50",
  },
  {
    id: "daily-views",
    title: "بازدید امروز",
    value: "۱,۲۴۰ بار",
    change: "+۴.۲%",
    mobileChange: "۴.۲٪+ ↑",
    icon: CursorClickIcon,
    iconSize: 24,
    mobileIconSize: 22,
    iconColor: "text-secondary",
    iconBg: "bg-secondary-50",
  },
];


function SellerStats() {
  const salesItem = STATS_DATA[0];
  const ordersItem = STATS_DATA[1];
  const productsItem = STATS_DATA[2];
  const viewsItem = STATS_DATA[3];

  const SalesIcon = salesItem.icon;
  const OrdersIcon = ordersItem.icon;
  const ProductsIcon = productsItem.icon;
  const ViewsIcon = viewsItem.icon;

  return (
    <section>
      {/* Mobile PWA Layout (Figma Node: 44:39361) */}
      <div className="flex flex-col gap-3.5 lg:hidden">
        {/* Card 1: Total monthly sales (Height: 164px, Radius: 16px) */}
        <div className="bg-surface rounded-xl p-4 sm:p-5 flex flex-col justify-between h-[164px] border border-border-subtle shadow-card">
          {/* Top row: Title and Icon */}
          <div className="flex items-center justify-between">
            <span className="text-small text-text-secondary font-normal">
              {salesItem.title}
            </span>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${salesItem.iconBg} ${salesItem.iconColor}`}>
              <SalesIcon size={salesItem.iconSize} />
            </div>
          </div>

          {/* Middle row: Big amount + unit */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-[28px] font-bold text-primary leading-tight">
              {salesItem.value}
            </span>
            <span className="text-small text-text-secondary font-normal">
              {salesItem.unit}
            </span>
          </div>

          {/* Bottom row: Growth badge (Arrow on right side of number in Figma) */}
          <div className="flex items-center justify-start">
            <div className="inline-flex items-center gap-1 text-[13px] font-medium text-success" dir="ltr">
              <span>۱۸.۵%+</span>
              <span className="text-[13px] leading-none">↑</span>
            </div>
          </div>
        </div>

        {/* Cards 2 & 3: 2-Column Grid (Height: 124px each, Radius: 16px) */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Right: Orders count */}
          <div className="bg-surface rounded-xl p-3.5 flex flex-col justify-between h-[124px] border border-border-subtle shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-text-secondary font-normal">
                {ordersItem.title}
              </span>
              <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 ${ordersItem.iconBg} ${ordersItem.iconColor}`}>
                <OrdersIcon size={ordersItem.mobileIconSize} />
              </div>
            </div>
            <div className="text-[18px] font-semibold text-text-primary leading-tight">
              {ordersItem.value}
            </div>
            <div className="flex items-center justify-start">
              <div className="inline-flex items-center gap-1 text-[12px] font-medium text-success" dir="ltr">
                <span>۱۲%+</span>
                <span className="text-[12px] leading-none">↑</span>
              </div>
            </div>
          </div>

          {/* Left: Active products */}
          <div className="bg-surface rounded-xl p-3.5 flex flex-col justify-between h-[124px] border border-border-subtle shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-text-secondary font-normal">
                {productsItem.title}
              </span>
              <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 ${productsItem.iconBg} ${productsItem.iconColor}`}>
                <ProductsIcon size={productsItem.mobileIconSize} />
              </div>
            </div>
            <div className="text-[18px] font-semibold text-text-primary leading-tight">
              {productsItem.value}
            </div>
            <div className="flex items-center justify-start">
              <div className="inline-flex items-center gap-1 text-[12px] font-medium text-success" dir="ltr">
                <span>۱۲%+</span>
                <span className="text-[12px] leading-none">↑</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Daily views horizontal bar (Height: 70px, Radius: 16px) */}
        <div className="bg-surface rounded-xl px-4 py-3 flex items-center justify-between h-[70px] border border-border-subtle shadow-card">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${viewsItem.iconBg} ${viewsItem.iconColor}`}>
              <ViewsIcon size={viewsItem.mobileIconSize} />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-text-secondary font-normal">
                {viewsItem.title}
              </span>
              <span className="text-[18px] font-semibold text-text-primary leading-tight">
                {viewsItem.value}
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1 text-[13px] font-medium text-success" dir="ltr">
            <span>۴.۲%+</span>
            <span className="text-[13px] leading-none">↑</span>
          </div>
        </div>
      </div>

      {/* Desktop 4-Column Grid (Figma Node: 44:39024) */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-4">
        {STATS_DATA.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="bg-surface rounded-xl p-5 flex flex-col justify-between h-[118px] border border-border-subtle shadow-card"
            >
              {/* Top row: Icon and Title */}
              <div className="flex items-center justify-between">
                <span className="text-small text-text-secondary font-normal">
                  {item.title}
                </span>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor}`}
                >
                  <Icon size={item.iconSize} />
                </div>
              </div>

              {/* Bottom row: Value and Growth Percentage */}
              <div className="flex items-baseline justify-between">
                <span className="text-h5 font-semibold text-text-primary">
                  {item.desktopValue || item.value}
                </span>
                <span className="text-small font-medium text-success" dir="ltr">
                  {item.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SellerStats;
