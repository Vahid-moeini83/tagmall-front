export const CAMPAIGN_PRODUCTS = [
  {
    id: "1024",
    name: "گوشی هوشمند ایکس ۱۴ پرو",
    price: 2100000,
    offer: 1850000,
    stock: 20,
    quantity: 8,
    visits: 1248,
    sold: 12,
    status: "active",
  },
  {
    id: "1025",
    name: "هدفون بی‌سیم مدل M5",
    price: 2700000,
    offer: 2400000,
    stock: 35,
    quantity: 12,
    visits: 986,
    sold: 2,
    status: "expired",
  },
  {
    id: "1026",
    name: "لپ‌تاپ گیمینگ X1",
    price: 3650000,
    offer: 3200000,
    stock: 10,
    quantity: 5,
    visits: 742,
    sold: 5,
    status: "active",
  },
  {
    id: "1027",
    name: "دوربین عکاسی بدون آینه",
    price: 650000,
    offer: 590000,
    stock: 15,
    quantity: 0,
    visits: 615,
    sold: 14,
    status: "draft",
  },
  {
    id: "1028",
    name: "تبلت ۱۱ اینچی M1",
    price: 950000,
    offer: 850000,
    stock: 20,
    quantity: 4,
    visits: 540,
    sold: 13,
    status: "expired",
  },
  {
    id: "1029",
    name: "ساعت هوشمند سری ۹",
    price: 1250000,
    offer: 1100000,
    stock: 20,
    quantity: 6,
    visits: 520,
    sold: 16,
    status: "active",
  },
].map((product, index) => ({
  ...product,
  image: `/assets/images/seller/campaigns/product-${index + 1}.png`,
}));

export const CAMPAIGN_STATUSES = [
  { id: "all", label: "همه کمپین‌ها", count: 148 },
  { id: "active", label: "کمپین‌های فعال", count: 12 },
  { id: "draft", label: "پیش‌نویس‌ها", count: 24 },
  { id: "expired", label: "منقضی شده", count: 85 },
  { id: "cancelled", label: "لغو شده", count: 5 },
];

export const CAMPAIGN_STATUS_STYLE = {
  active: {
    label: "فعال",
    className: "bg-success-strong/10 text-success-strong",
  },
  expired: { label: "منقضی", className: "bg-secondary/10 text-secondary" },
  draft: {
    label: "پیش‌نویس",
    className: "bg-surface-muted text-text-disabled",
  },
  cancelled: { label: "لغو شده", className: "bg-error-light text-error" },
};

export const CAMPAIGN_EVENTS = [
  {
    id: "black-friday",
    title: "کمپین بلاک فرایدی",
    date: "۷ آذر ۱۴۰۵",
    start: 14050907,
    end: 14050907,
  },
  {
    id: "yalda",
    title: "کمپین فروش شب یلدا",
    date: "۲۹ و ۳۰ آذر ۱۴۰۵",
    start: 14050929,
    end: 14050930,
  },
  {
    id: "halloween",
    title: "کمپین هالووین",
    date: "۹ آبان ۱۴۰۵",
    start: 14050809,
    end: 14050809,
  },
  {
    id: "halloween-next",
    title: "کمپین هالووین",
    date: "فردا، ۳۱ مرداد ۱۴۰۵",
    start: 14050531,
    end: 14050531,
  },
];

export const formatCampaignNumber = (value) =>
  new Intl.NumberFormat("fa-IR").format(value);
