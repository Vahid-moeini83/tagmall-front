const NO_PHOTO = "/assets/images/fallback/no-photo.jpg";
const AVATAR = "/assets/images/fallback/avatar.png";

/**
 * Minimal product shape used when product API fails,
 * so the page can still render with safe placeholders.
 */
export function getFallbackProduct(productId = null) {
  return {
    id: productId,
    name: "نامشخص",
    gallery: [NO_PHOTO],
    attributes: [],
    accessories: [],
    specs: [],
    product_review: null,
    cooperation_in_sale: null,
    delivery_methods: [],
    base_price: 0,
    seller_info: {
      id: null,
      name: "نامشخص",
      avatar: AVATAR,
      rating: 0,
      reviews_count: 0,
    },
    store_info: {
      name: "نامشخص",
      avatar: AVATAR,
    },
  };
}
