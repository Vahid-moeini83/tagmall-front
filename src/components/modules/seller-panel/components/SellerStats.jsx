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
    iconColor: "text-[#3d3183]",
    iconBg: "bg-[#dddeee]",
  },
  {
    id: "orders-count",
    title: "تعداد سفارشات",
    value: "۳۴ سفارش",
    change: "+۱۲%",
    icon: BasketShoppingIcon,
    iconSize: 20,
    iconColor: "text-[#108981]",
    iconBg: "bg-[#108981]/10",
  },
  {
    id: "active-products",
    title: "محصولات فعال",
    value: "۴۸ کالا",
    change: "+۱۲%",
    icon: BarcodeReadIcon,
    iconSize: 24,
    iconColor: "text-[#3d3183]",
    iconBg: "bg-[#2b256a]/10",
  },
  {
    id: "daily-views",
    title: "بازدید امروز",
    value: "۱,۲۴۰ بار",
    change: "+۴.۲%",
    icon: CursorClickIcon,
    iconSize: 24,
    iconColor: "text-[#f58220]",
    iconBg: "bg-[#ffbc99]/20",
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
            className="bg-white rounded-2xl p-5 flex flex-col justify-between h-[118px] border border-gray-100/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
          >
            {/* Top row: Icon and Title */}
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#4a4a68] font-normal">
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
              <span className="text-[18px] font-semibold text-[#1a1a2e]">
                {item.value}
              </span>
              <span className="text-[14px] font-medium text-[#108981] dir-ltr inline-block">
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
