// داده‌های نمونه برای تست بخش آرا و امتیاز

export const mockSellerReviewsData = {
  sellerName: "سیتی تل",
  sellerAvatar: "/assets/images/fallback/avatar.png",
  rating: 4.5,
  totalReviews: 1247,
  userAvatar: "/assets/images/fallback/avatar.png",
  ratingDistribution: [
    { stars: 5, count: 850, percentage: 68 },
    { stars: 4, count: 250, percentage: 20 },
    { stars: 3, count: 87, percentage: 7 },
    { stars: 2, count: 37, percentage: 3 },
    { stars: 1, count: 23, percentage: 2 },
  ],
  reviews: [
    {
      id: 1,
      userName: "علی محمدی",
      rating: 5,
      comment: "کیفیت محصول عالی بود و قیمت مناسب.",
      productName: "گوشی موبایل سامسونگ Galaxy S23",
      timeAgo: "2 ساعت پیش",
      isUserReview: false,
      sellerReply: {
        comment:
          "سپاس از اعتماد شما. خوشحالیم که از خرید خود راضی هستید. امیدواریم در خریدهای بعدی هم ما را انتخاب کنید.",
        timeAgo: "1 ساعت پیش",
      },
    },
    {
      id: 2,
      userName: "مریم احمدی",
      rating: 4,
      comment:
        "محصول خوبی بود اما بسته‌بندی می‌توانست بهتر باشد. در کل راضی هستم.",
      productName: "هدفون بلوتوثی سونی WH-1000XM5",
      timeAgo: "5 ساعت پیش",
      isUserReview: false,
      sellerReply: null,
    },
  ],
};
