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
    value: "۴۸,۵۰۰,۰۰۰ تومان",
    change: "+۱۸.۵%",
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
    icon: BasketShoppingIcon,
    iconSize: 20,
    iconColor: "text-success",
    iconBg: "bg-success-light",
  },
  {
    id: "active-products",
    title: "محصولات فعال",
    value: "۴۸ کالا",
    change: "+۱۲%",
    icon: BarcodeReadIcon,
    iconSize: 24,
    iconColor: "text-primary",
    iconBg: "bg-primary-50",
  },
  {
    id: "daily-views",
    title: "بازدید امروز",
    value: "۱,۲۴۰ بار",
    change: "+۴.۲%",
    icon: CursorClickIcon,
    iconSize: 24,
    iconColor: "text-secondary",
    iconBg: "bg-secondary-50",
  },
];


function SellerStats() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS_DATA.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            className="bg-surface rounded-2xl p-5 flex flex-col justify-between h-[118px] border border-border-subtle shadow-card"
          >
            {/* Top row: Icon and Title */}
            <div className="flex items-center justify-between">
              <span className="text-small text-text-secondary font-normal">
                {item.title}
              </span>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor}`}
              >
                <Icon size={item.iconSize} />
              </div>
            </div>

            {/* Bottom row: Value and Growth Percentage */}
            <div className="flex items-baseline justify-between">
              <span className="text-h5 font-semibold text-text-primary">
                {item.value}
              </span>
              <span className="text-small font-medium text-success dir-ltr inline-block">
                {item.change}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default SellerStats;
