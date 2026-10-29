import {
  CoinFrontSwapIcon,
  BasketShoppingIcon,
  BarcodeReadIcon,
  CursorClickIcon,
  BoxUserIcon,
  ReceiptIcon,
  StrokeArrowLeftIcon,
} from "@/icons";

const STATS_DATA = [
  {
    id: "total-sales",
    title: "کل فروش (ماه)",
    value: "۴۸,۵۰۰,۰۰۰",
    unit: "تومان",
    desktopValue: "۴۸,۵۰۰,۰۰۰ تومان",
    change: "+۱۸.۵%",
    mobileChange: "۱۸.۵٪+",
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
    mobileChange: "۱۲٪+",
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
    mobileChange: "۱۲٪+",
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
    mobileChange: "۴.۲٪+",
    icon: CursorClickIcon,
    iconSize: 24,
    mobileIconSize: 22,
    iconColor: "text-secondary",
    iconBg: "bg-secondary-50",
  },
];

const FINANCIAL_STATS = [
  {
    title: "کل فروش ( امروز )",
    value: "۱۲۴,۵۰۰,۰۰۰ تومان",
    change: "+۱۴.۲٪",
    icon: CoinFrontSwapIcon,
    color: "text-secondary bg-secondary-100/50",
  },
  {
    title: "هزینه کلیک ها",
    value: "۹۸,۲۰۰,۰۰۰ تومان",
    change: "+۱۸.۵٪",
    icon: CoinFrontSwapIcon,
    color: "text-primary bg-primary-600/10",
  },
  {
    title: "تعداد کلیک های معتبر",
    value: "نرخ کلیک",
    change: "پلکانی",
    icon: CursorClickIcon,
    color: "text-error bg-error/10",
  },
  {
    title: "تعداد تراکنش",
    value: "۳۴۲ تراکنش",
    change: "+۸٪",
    icon: BoxUserIcon,
    color: "text-secondary bg-secondary-100/50",
  },
];

function SellerStats({ variant = "default" }) {
  if (variant === "wallet") {
    const metrics = [
      {
        title: "نرخ هر کلیک معتبر",
        value: "۵۰۰",
        unit: "تومان",
        icon: CursorClickIcon,
      },
      {
        title: "هزینهٔ کلیک‌ها",
        value: "۱٬۵۰۰٬۰۰۰",
        unit: "تومان",
        icon: ReceiptIcon,
      },
      {
        title: "تعداد کلیک معتبر",
        value: "۳٬۰۰۰",
        unit: "کلیک",
        icon: CursorClickIcon,
      },
    ];
    return (
      <div
        className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-4"
        dir="ltr"
      >
        {metrics.map(({ title, value, unit, icon: Icon }) => (
          <article
            key={title}
            className="flex h-[114px] min-w-0 flex-col gap-3 rounded-xl bg-surface p-5"
            dir="rtl"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[13px] leading-[21px] text-text-muted">
                {title}
              </h3>
              <Icon size={20} className="text-primary" />
            </div>
            <p className="flex items-baseline gap-2">
              <span className="text-[25px] font-normal leading-[41px]">
                {value}
              </span>
              <span className="text-[13px] text-text-muted">{unit}</span>
            </p>
          </article>
        ))}
      </div>
    );
  }
  if (variant === "financial") {
    return (
      <section
        aria-label="خلاصه گزارش مالی"
        className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-4"
        dir="ltr"
      >
        {FINANCIAL_STATS.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              dir="rtl"
              className="flex h-[126px] min-w-0 flex-col gap-3 rounded-xl bg-surface p-5"
            >
              <div className="flex h-10 items-center justify-between gap-2">
                <h2 className="text-caption text-text-muted">{item.title}</h2>
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${item.color}`}
                >
                  <Icon size={24} />
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-1 whitespace-nowrap">
                <p className="text-h4 font-bold leading-[34px]">{item.value}</p>
                <span
                  dir={item.change === "پلکانی" ? "rtl" : "ltr"}
                  className={`text-caption ${item.change === "پلکانی" ? "text-text-secondary" : "font-bold text-success-strong"}`}
                >
                  {item.change}
                </span>
              </div>
            </article>
          );
        })}
      </section>
    );
  }
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
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${salesItem.iconBg} ${salesItem.iconColor}`}
            >
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
            <div
              className="inline-flex items-center gap-1 text-[13px] font-medium text-success"
              dir="ltr"
            >
              <span>{salesItem.mobileChange}</span>
              <StrokeArrowLeftIcon size={12} className="rotate-90" />
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
              <div
                className={`w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 ${ordersItem.iconBg} ${ordersItem.iconColor}`}
              >
                <OrdersIcon size={ordersItem.mobileIconSize} />
              </div>
            </div>
            <div className="text-[18px] font-semibold text-text-primary leading-tight">
              {ordersItem.value}
            </div>
            <div className="flex items-center justify-start">
              <div
                className="inline-flex items-center gap-1 text-[12px] font-medium text-success"
                dir="ltr"
              >
                <span>{ordersItem.mobileChange}</span>
                <StrokeArrowLeftIcon size={12} className="rotate-90" />
              </div>
            </div>
          </div>

          {/* Left: Active products */}
          <div className="bg-surface rounded-xl p-3.5 flex flex-col justify-between h-[124px] border border-border-subtle shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-text-secondary font-normal">
                {productsItem.title}
              </span>
              <div
                className={`w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 ${productsItem.iconBg} ${productsItem.iconColor}`}
              >
                <ProductsIcon size={productsItem.mobileIconSize} />
              </div>
            </div>
            <div className="text-[18px] font-semibold text-text-primary leading-tight">
              {productsItem.value}
            </div>
            <div className="flex items-center justify-start">
              <div
                className="inline-flex items-center gap-1 text-[12px] font-medium text-success"
                dir="ltr"
              >
                <span>{productsItem.mobileChange}</span>
                <StrokeArrowLeftIcon size={12} className="rotate-90" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Daily views horizontal bar (Height: 70px, Radius: 16px) */}
        <div className="bg-surface rounded-xl px-4 py-3 flex items-center justify-between h-[70px] border border-border-subtle shadow-card">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${viewsItem.iconBg} ${viewsItem.iconColor}`}
            >
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

          <div
            className="inline-flex items-center gap-1 text-[13px] font-medium text-success"
            dir="ltr"
          >
            <span>{viewsItem.mobileChange}</span>
            <StrokeArrowLeftIcon size={12} className="rotate-90" />
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
