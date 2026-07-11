const receiptProductMock = {
  id: "1",
  product_name: "محافظ صفحه نمایش گوشی موبایل اسپیگن نئوهیبرید",
  quantity: 1,
  quantityLabel: "تعداد یک محافظ صفحه نمایش",
  image: "/assets/images/fallback/no-photo.jpg",
  status: "آماده تحویل",
  updated_at: new Date().toISOString(),
};

export const defaultReceiptData = {
  orderId: "1234",
  visitDate: "8 تا 10 مهر ماه 1403",
  status: "آماده تحویل",
  lastUpdate: "1 دقیقه پیش",
  itemsCount: 4,
  seller: {
    sellerName: "سیتی تل",
    sellerAvatar: "/assets/images/fallback/avatar.png",
    rating: 4.6,
    totalReviews: 128,
  },
  items: [
    { ...receiptProductMock, id: "1" },
    { ...receiptProductMock, id: "2" },
    { ...receiptProductMock, id: "3" },
    { ...receiptProductMock, id: "4" },
  ],
};

export function buildReceiptDataFromStore(store, products = []) {
  const items = products.map((product) => ({
    id: String(product.id),
    product_name: product.name,
    quantity: product.orderHistory?.quantity ?? 1,
    image: product.img || "/assets/images/fallback/no-photo.jpg",
    status: product.orderHistory?.statusLabel ?? "آماده تحویل",
    updated_at: product.orderHistory?.updatedAt ?? new Date().toISOString(),
  }));

  const firstProduct = products[0];

  return {
    orderId: firstProduct?.orderHistory?.orderId ?? defaultReceiptData.orderId,
    visitDate:
      firstProduct?.orderHistory?.visitDate ?? defaultReceiptData.visitDate,
    status:
      firstProduct?.orderHistory?.statusLabel ?? defaultReceiptData.status,
    lastUpdate: "1 دقیقه پیش",
    itemsCount: items.length || 1,
    seller: {
      sellerName: store?.seller?.storeName || store?.seller?.name || "فروشگاه",
      sellerAvatar:
        store?.seller?.profileImage || "/assets/images/fallback/avatar.png",
      rating: store?.seller?.rating ?? 5,
      totalReviews: store?.seller?.totalReviews ?? 0,
    },
    items: items.length > 0 ? items : defaultReceiptData.items,
  };
}
