# API Connection TODO

> این فایل به صورت خودکار تولید شده و وضعیت اتصال بخش‌های مختلف پروژه به API را نشان می‌دهد.

منبع حقیقت API‌های موجود: `src/lib/server/actions/` — فایل‌های `auth.js`, `cart.js`, `home.js`, `product.js`, `profile.js`, `search.js`, `support.js`.
الگوی فایل action: ماژول `"use server"` که `http` (axios instance از `@/app/api/axiosInstance`) را صدا می‌زند و یک آبجکت `{ xxxRes, xxxErr }` برمی‌گرداند.

---

## صفحه نتایج جستجو (Search Results)

- **وضعیت:** Not Connected

- **مسیر فایل‌ها:**
  - `src/app/search/[slug]/page.jsx`
  - `src/components/modules/search-results/components/SearchResults.jsx`
  - `src/components/modules/search-results/components/ProductsList.jsx`
  - `src/components/modules/search-results/components/ProductListItem.jsx`
  - `src/components/modules/search-results/components/MobileSearchProductCard.jsx`

- **توضیح وضعیت فعلی:** کل صفحه نتایج با آرایه mock به نام `mockSearchProducts` (از `src/lib/client/mockRelatedAccessories.js`) رندر می‌شود. پارامتر `slug` از مسیر صفحه گرفته می‌شود ولی به کامپوننت `SearchResults` اصلاً پاس داده/استفاده نمی‌شود. سورت (مرتب‌سازی)، فیلتر موجودی و تب‌های «قطعات/لوازم جانبی» همگی state محلی هستند و هیچ فراخوانی API ندارند. دقت: سرویس `fetchSearchSuggestions` (POST /search) در `search.js` وجود دارد ولی **هیچ‌جا** استفاده نشده و `SearchBox.jsx` همان درخواست را مستقیم و تکراری از طریق axios صدا می‌زند.

- **عملیات مورد نیاز:**

  | عملیات | Method | Endpoint پیشنهادی | ورودی (Request Body / Params) | خروجی مورد انتظار (Response) | یادداشت |
  |---|---|---|---|---|---|
  | جستجوی محصولات/دسته (نتایج صفحه) | POST | /search | `{ keyword }` + هدر `Use-Random-Price-Range: 1` | `{ data: { products: [{ id, name, min_price, max_price, old_min_price, old_max_price, is_featured_sale, image, seller: { name, avatar } }], categories: [{ id, name }] } }` | endpoint و اکشن موجود (`fetchSearchSuggestions`) هستند؛ فقط صفحه نتایج باید از آن استفاده کند و `mockSearchProducts` حذف شود |
  | مرتب‌سازی نتایج | — | (پارامتر به /search) | `sort: "most_sold \| newest \| most_viewed \| most_discounted \| cheapest \| expensive"` | همان shape نتایج | به‌جای state محلی `sortBy` باید به بک‌اند ارسال شود |
  | فیلتر «فقط موجودی» | — | (پارامتر به /search) | `available: 1` | همان shape نتایج | `showAvailable` فعلاً فقط state محلی است |
  | نتایج قطعات / لوازم جانبی مرتبط | POST | /search | `{ keyword, type: "accessory" \| "part" }` | لیست محصولات مرتبط (shape بالا) | تب‌های `view=accessories` صفحه و درِورهای موبایل به همین داده نیاز دارند |

- **فایل action پیشنهادی:** از فایل موجود `src/lib/server/actions/search.js` استفاده شود (تابع `fetchSearchSuggestions` که همین حالا POST /search را دارد).

---

## فیلترهای جستجو (برند / مشخصات / نوع فروشنده / بازه قیمت)

- **وضعیت:** Not Connected

- **مسیر فایل‌ها:**
  - `src/components/modules/search-results/components/BrandFilterContent.jsx`
  - `src/components/modules/search-results/components/SpecsFilterContent.jsx`
  - `src/components/modules/search-results/components/SellerTypeFilterContent.jsx`
  - `src/components/modules/search-results/components/PriceRangeFilterContent.jsx`
  - `src/components/modules/search-results/components/FiltersSection.jsx`
  - `src/components/modules/search-results/components/FiltersDrawer.jsx`
  - `src/components/modules/search-results/components/BrandFilterDialog.jsx`
  - `src/components/modules/search-results/components/SpecsFilterDialog.jsx`
  - `src/components/modules/search-results/components/SellerTypeDialog.jsx`
  - `src/components/modules/search-results/components/PriceRangeDialog.jsx`
  - `src/hooks/useMobileProductFilters.js`

- **توضیح وضعیت فعلی:** لیست برندها (`mockBrands`) و مشخصات (`mockSpecs`) به‌صورت آرایه‌های hardcoded داخل کامپوننت تعریف شده‌اند. گزینه‌های نوع فروشنده (`sellerTypeOptions`) و بازه قیمت (`minPrice=500`, `maxPrice=100000000`) ثابت/سخت‌کد هستند. انتخاب فیلترها فقط state محلی است و در هیچ درخواستی به سرور ارسال نمی‌شود.

- **عملیات مورد نیاز:**

  | عملیات | Method | Endpoint پیشنهادی | ورودی (Request Body / Params) | خروجی مورد انتظار (Response) | یادداشت |
  |---|---|---|---|---|---|
  | دریافت لیست برندها | GET | /brands | — | `[{ id, name }]` | جایگزین `mockBrands` |
  | دریافت لیست مشخصات (فیلترها) | GET | /products/specs-filters یا /search/specs | `{ keyword? }` | `[{ id, name, options: [{ id, name }] }]` | جایگزین `mockSpecs` |
  | دریافت گزینه‌های نوع فروشنده | GET | /seller-types | — | `[{ id, label }]` | جایگزین `sellerTypeOptions` سخت‌کد |
  | دریافت بازه قیمت مجاز | GET | /search/price-range | `{ keyword? }` | `{ min_price, max_price }` | به‌جای `minPrice=500 / maxPrice=100000000` |
  | اعمال فیلترها در جستجو | POST | /search | `{ keyword, brand_ids: [], spec_ids: [], seller_types: [], price_from, price_to, sort, available }` | همان shape نتایج جستجو | فیلترها باید به بک‌اند ارسال شوند نه اینکه فقط UI را تغییر دهند |

- **فایل action پیشنهادی:** `src/lib/server/actions/search.js` (فایل موجود — توابع جدید اضافه شود).

---

## امتیاز و نظرات فروشنده (Seller Reviews)

- **وضعیت:** Not Connected

- **مسیر فایل‌ها:**
  - `src/components/modules/seller-reviews/components/SellerReviewsContent.jsx`
  - `src/components/modules/seller-reviews/components/RatingOverview.jsx`
  - `src/components/modules/seller-reviews/components/ReviewCard.jsx`
  - `src/components/modules/seller-reviews/components/ReviewInput.jsx`
  - مصرف‌کننده‌ها: `src/components/modules/home/components/MainHome.jsx` (خطوط 532، 545) و `src/components/modules/product-single/components/ProductMain.jsx` (خطوط 1306، 1319)

- **توضیح وضعیت فعلی:** کل مودال «تجربه خرید از فروشنده» با `mockSellerReviewsData` (از `src/lib/client/mockReviewsData.js`) رندر می‌شود. ارسال نظر فقط به state محلی اضافه می‌شود، حذف نظر یک `setTimeout` فیک است که آیتم را از لیست محلی حذف می‌کند، و ثبت گزارش فقط toast می‌زند. هیچ فراخوانی API وجود ندارد.

- **عملیات مورد نیاز:**

  | عملیات | Method | Endpoint پیشنهادی | ورودی (Request Body / Params) | خروجی مورد انتظار (Response) | یادداشت |
  |---|---|---|---|---|---|
  | دریافت نظرات فروشنده + توزیع امتیاز | GET | /seller-reviews?seller_id={id} یا /comments?type=seller&id={sellerId} | Params: `seller_id` (از `product.seller_info.id`) | `{ data: { rating, total_reviews, rating_distribution: [{ stars, count, percentage }], reviews: [{ id, user_name, rating, body, product_name, is_mine, seller_reply: { body, created_at }, created_at }] } }` | shape فعلی mock: `{ sellerName, sellerAvatar, rating, totalReviews, userAvatar, ratingDistribution, reviews }` |
  | ثبت نظر جدید | POST | /comments (type: seller) | `{ type: "seller", id: sellerId, body, rating }` | `{ id, user_name, rating, body, ... }` | `ReviewInput` فیلدهای `rating`, `comment`, `file` را دارد (فایل فعلاً ارسال نمی‌شود) |
  | حذف نظر | DELETE | /comments/{commentId} | Path: `commentId` | پیام موفقیت | حذف فیک (setTimeout) فعلی را با این API جایگزین کن |
  | پاسخ فروشنده | PUT | /comments/{commentId}/reply | `{ body }` | نظر به‌روزرسانی‌شده | در mock به‌صورت `sellerReply` وجود دارد ولی عملیات ثبت ندارد |

- **فایل action پیشنهادی:** `src/lib/server/actions/sellerReview.js` (فایل جدید، هم‌راستا با pattern فایل‌های موجود) — یا توابع جدید در `src/lib/server/actions/product.js`.

---

## لوازم جانبی و قطعات مرتبط (Related / Order Accessories)

- **وضعیت:** Partially Connected

- **مسیر فایل‌ها:**
  - `src/components/modules/product-single/components/ProductRelatedAccessoriesDrawer.jsx`
  - `src/components/modules/product-single/components/ProductOrderAccessoriesDrawer.jsx`
  - `src/components/modules/product-single/components/ProductMain.jsx` (بخش درِورهای موبایل)

- **توضیح وضعیت فعلی:** بخش دسکتاپ (`ProductRelatedAccessories.jsx`) از `product.accessories` واقعی API استفاده می‌کند، ولی درِورهای موبایل «لوازم جانبی و قطعات مرتبط» و «پیشنهاد تکمیل خرید» با `mockRelatedAccessories` و `mockSearchProducts` (از `src/lib/client/mockRelatedAccessories.js`) رندر می‌شوند. هیچ داده واقعی «لوازم جانبی برای این محصول خاص» و «قطعات مرتبط» دریافت نمی‌شود.

- **عملیات مورد نیاز:**

  | عملیات | Method | Endpoint پیشنهادی | ورودی (Request Body / Params) | خروجی مورد انتظار (Response) | یادداشت |
  |---|---|---|---|---|---|
  | دریافت لوازم جانبی/قطعات مرتبط با محصول | GET | /products/{productId}/accessories | Path: `productId` | `{ data: [{ id, name, img, min_price, max_price, old_min_price, old_max_price, is_featured_sale, href }] }` | shape فعلی mock: `{ id, name, img, minPrice, maxPrice, oldMinPrice, oldMaxPrice, isSpecialSale, saleTimer, href }` |

- **فایل action پیشنهادی:** توابع جدید در `src/lib/server/actions/product.js` (فایل موجود).

---

## تجربه کاربران مشارکت در فروش (Partnership Share Chat)

- **وضعیت:** Partially Connected

- **مسیر فایل‌ها:**
  - `src/components/modules/product-single/components/ProductPartnership.jsx`
  - `src/components/modules/product-single/components/PartnershipShareChat.jsx`
  - `src/components/modules/product-single/components/PartnershipPlatformSlider.jsx`

- **توضیح وضعیت فعلی:** لینک اختصاصی مشارکت (`cooperation.cooperation_link`) و تصویر (`cooperation.image`) از API محصول می‌آیند (بخش وصل است). اما لیست «تجربه کاربران» با `mockPartnershipExperiences` (از `src/lib/client/mockPartnershipExperiences.js`) رندر می‌شود؛ لایک و ارسال تجربه فقط state محلی است. لیست پلتفرم‌های اشتراک‌گذاری (`socialPlatforms`) به‌صورت hardcoded با `url: "#"` تعریف شده است و لینک واقعی ندارد.

- **عملیات مورد نیاز:**

  | عملیات | Method | Endpoint پیشنهادی | ورودی (Request Body / Params) | خروجی مورد انتظار (Response) | یادداشت |
  |---|---|---|---|---|---|
  | دریافت تجربه‌های کاربران مشارکت | GET | /partnership/experiences?product_id={id} | Params: `product_id` | `[{ id, user_id, user_name, text, likes, is_liked, created_at, platform }]` | shape فعلی mock: `{ id, userId, userName, text, likes, isLiked, createdAt, platform }` |
  | ثبت تجربه جدید | POST | /partnership/experiences | `{ product_id, text, platform }` | `{ id, user_name, text, ... }` | ارسال فعلی فقط به state محلی اضافه می‌شود |
  | لایک/آنلایک تجربه | POST | /partnership/experiences/{id}/like | Path: `id` | `{ is_liked, likes }` | مانند `toggleCommentLike` در product.js |
  | دریافت لیست پلتفرم‌های اشتراک‌گذاری | GET | /partnership/platforms | — | `[{ name, url, logo }]` | جایگزین `socialPlatforms` سخت‌کد با `url: "#"` |

- **فایل action پیشنهادی:** `src/lib/server/actions/partnership.js` (فایل جدید).

---

## مشارکت در فروش و لینک‌های دریافت‌شده در پروفایل

- **وضعیت:** Not Connected

- **مسیر فایل‌ها:**
  - `src/components/modules/profile/components/ProfilePartnership.jsx`
  - `src/components/modules/profile/components/ProfileReceivedLinks.jsx`
  - `src/components/modules/profile/components/ProfileMainPanel.jsx` (خطوط 160-188)

- **توضیح وضعیت فعلی:** هر دو بخش با آرایه‌های mock داخلی رندر می‌شوند (`mockProducts` شامل `{ id, name, img }`). فیلتر «پیشنهادات»، فیلتر بازه زمانی و دکمه «سود مشارکت در فروش» همگی UI بدون فراخوانی API هستند. اطلاعات «بازدید 1000، خرید موفق 10 بار» در `ProfileReceivedLinks` ثابت و hardcoded است.

- **عملیات مورد نیاز:**

  | عملیات | Method | Endpoint پیشنهادی | ورودی (Request Body / Params) | خروجی مورد انتظار (Response) | یادداشت |
  |---|---|---|---|---|---|
  | دریافت محصولات پیشنهادی مشارکت در فروش | GET | /partnership/products | Params: `sort` | `[{ id, name, img, profit_percent }]` | جایگزین `mockProducts` در `ProfilePartnership` |
  | دریافت لینک‌های دریافت‌شده (مشارکت) | GET | /partnership/received-links | Params: `sort`, `from_date`, `to_date` | `[{ id, product_name, img, status, views_count, purchases_count }]` | جایگزین `mockProducts` در `ProfileReceivedLinks`؛ «بازدید/خرید موفق» از پاسخ واقعی |
  | محاسبه/دریافت سود مشارکت | GET | /partnership/profit | — | `{ total_profit, status }` | دکمه «سود مشارکت در فروش» فعلاً هیچ عملی ندارد |

- **فایل action پیشنهادی:** `src/lib/server/actions/partnership.js` (فایل جدید — با بخش تجربه مشارکت مشترک باشد).

---

## رسید تحویل سفارش (Receipt)

- **وضعیت:** Not Connected

- **مسیر فایل‌ها:**
  - `src/app/receipt/[id]/page.jsx`
  - `src/lib/client/receiptData.js`
  - `src/components/modules/receipt/*` (ReceiptDeliveryShell, ReceiptStepOne, ReceiptStepTwo, ReceiptStepThree, ReceiptProductList, ReceiptSellerHeader, ReceiptDeliveryHeader/Content)
  - مصرف‌کننده‌های ساخت دیتای رسید در کلاینت: `src/components/modules/cart/components/OrderItems.jsx`, `src/components/modules/home/components/HorizontalProductSlider.jsx`, `src/components/modules/home/components/ProductCardMobile.jsx`

- **توضیح وضعیت فعلی:** صفحه `/receipt/[id]` بدون هیچ درخواست API، فقط `defaultReceiptData` (mock با `orderId: "1234"`, `sellerName: "سیتی تل"`, `visitDate: "8 تا 10 مهر ماه 1403"`) را در درِور رسید باز می‌کند و به `/` ریدایرکت می‌کند. در سایر نقاط، داده رسید به‌صورت کلاینت‌ساید با `buildReceiptDataFromStore` و مقدارهای پیش‌فرض mock ساخته می‌شود (مثلاً `lastUpdate: "1 دقیقه پیش"` ثابت). اکشن `getOrderById` (GET /orders/:id) وجود دارد ولی برای ساخت رسید استفاده نمی‌شود.

- **عملیات مورد نیاز:**

  | عملیات | Method | Endpoint پیشنهادی | ورودی (Request Body / Params) | خروجی مورد انتظار (Response) | یادداشت |
  |---|---|---|---|---|---|
  | دریافت رسید/جزئیات تحویل سفارش | GET | /orders/{orderId}/receipt | Path: `orderId` + هدر Authorization | `{ data: { order_id, visit_date, status, last_update, items_count, seller: { name, avatar, rating, total_reviews }, items: [{ id, product_name, quantity, quantity_label, image, status, updated_at }] } }` | shape فعلی mock: `{ orderId, visitDate, status, lastUpdate, itemsCount, seller: { sellerName, sellerAvatar, rating, totalReviews }, items: [{ id, product_name, quantity, quantityLabel, image, status, updated_at }] }` |

- **فایل action پیشنهادی:** `src/lib/server/actions/receipt.js` (فایل جدید) یا توابع جدید در `src/lib/server/actions/cart.js` (جایی که `getOrderById` است).

---

## برداشت وجه از کیف پول (Wallet Withdrawal)

- **وضعیت:** Partially Connected

- **مسیر فایل‌ها:**
  - `src/components/modules/profile/components/ProfileWallet.jsx`
  - `src/components/modules/profile/components/ProfileWalletAmountContent.jsx`
  - `src/components/modules/profile/components/ProfileWalletTypeContent.jsx`

- **توضیح وضعیت فعلی:** مسیر «افزایش اعتبار (شارژ)» با `chargeWalletAmount` (POST /auth/wallet) وصل است و `payment_url` را باز می‌کند (بخش وصل است). اما مسیر «برداشت وجه» هیچ درخواست API ندارد: `handleAmountSubmit` برای `withdraw` فقط به مرحله OTP می‌رود و `handleOtpVerify` فقط `toast.success("درخواست وجه با موفقیت ثبت شد")` می‌زند. شماره موبایل در مرحله OTP هم hardcoded است: `phone="09158427785"`.

- **عملیات مورد نیاز:**

  | عملیات | Method | Endpoint پیشنهادی | ورودی (Request Body / Params) | خروجی مورد انتظار (Response) | یادداشت |
  |---|---|---|---|---|---|
  | درخواست برداشت وجه | POST | /auth/wallet/withdraw | `{ amount, mobile, otp }` | `{ status, message }` | به‌جای toast در `handleOtpVerify`؛ شماره موبایل از پروفایل واقعی کاربر خوانده شود نه مقدار hardcoded |

- **فایل action پیشنهادی:** توابع جدید در `src/lib/server/actions/profile.js` (فایل موجود).

---

## ثبت گزارش (دیدگاه محصول / پیام پشتیبانی / نظر فروشنده)

- **وضعیت:** Not Connected

- **مسیر فایل‌ها:**
  - `src/components/modules/product-single/components/ProductUserComments.jsx` (خطوط 320-330)
  - `src/components/modules/support/components/SupportSingleChat.jsx` (خطوط 411-414)
  - `src/components/modules/seller-reviews/components/SellerReviewsContent.jsx` (خطوط 41-48)

- **توضیح وضعیت فعلی:** هر سه نقطه فقط `toast.success("گزارش با موفقیت ثبت شد")` نشان می‌دهند و هیچ درخواستی به سرور نمی‌فرستند (هر سه دارای کامنت `// TODO: connect report API`). بقیه عملیات در `ProductUserComments` (ایجاد/ویرایش/حذف/لایک) و `SupportSingleChat` (دریافت/ارسال/حذف پیام) واقعاً به API وصل هستند؛ فقط «گزارش» ناقص است.

- **عملیات مورد نیاز:**

  | عملیات | Method | Endpoint پیشنهادی | ورودی (Request Body / Params) | خروجی مورد انتظار (Response) | یادداشت |
  |---|---|---|---|---|---|
  | گزارش دیدگاه محصول | POST | /comments/{commentId}/report | `{ description }` + هدر Authorization | `{ status, message }` | از `ProductUserComments.handleSubmitReport` (دارای `reportMsgId` و متن گزارش) |
  | گزارش پیام پشتیبانی | POST | /support/messages/{messageId}/report | `{ description }` + هدر Authorization | `{ status, message }` | از `SupportSingleChat` (خط ~411) |
  | گزارش نظر فروشنده | POST | /seller-reviews/{reviewId}/report | `{ description }` + هدر Authorization | `{ status, message }` | از `SellerReviewsContent.handleSubmitReport` |

- **فایل action پیشنهادی:** `src/lib/server/actions/report.js` (فایل جدید) — یا توابع به‌صورت جدا در `product.js` و `support.js` (دقت: endpoint باید با بک‌اند هماهنگ شود).

---

## ویرایش اطلاعات هویتی پروفایل (نام / نام خانوادگی / کد ملی)

- **وضعیت:** Not Connected

- **مسیر فایل‌ها:**
  - `src/components/modules/profile/components/ProfileEditInfo.jsx`

- **توضیح وضعیت فعلی:** بخش اطلاعات پایه (نام کامل و کد ملی) فقط نمایشی است؛ `fullName` به‌صورت `<h1>` ثابت و کد ملی `readOnly` رندر می‌شود. هیچ اکشن/endpoint ویرایشی مانند `updateUserProfile` در `src/lib/server/actions/profile.js` وجود ندارد (فقط `updateUserProfileAvatar` موجود است). سایر زیربخش‌های پروفایل (آواتار، تلفن، ایمیل، آدرس، حساب بانکی، نشست‌ها) همگی به API وصل‌اند.

- **عملیات مورد نیاز:**

  | عملیات | Method | Endpoint پیشنهادی | ورودی (Request Body / Params) | خروجی مورد انتظار (Response) | یادداشت |
  |---|---|---|---|---|---|
  | به‌روزرسانی اطلاعات هویتی | PUT | /auth/profile | `{ name, family, national_code }` + هدر Authorization | `{ user: { id, name, family, national_code, avatar } }` | در صورتی که بک‌اند اجازه ویرایش دهد؛ در غیر این صورت باید مشخص شود این بخش عمداً فقط‌خواندنی است |
  | دریافت پروفایل (موجود) | GET | /auth/profile | — | `{ user: { id, name, family, national_code, avatar } }` | اکشن `getUserProfile` موجود است |

- **فایل action پیشنهادی:** توابع جدید در `src/lib/server/actions/profile.js` (فایل موجود).

---

## خلاصه

| وضعیت | تعداد | بخش‌ها |
|---|---|---|
| Not Connected | 7 | صفحه نتایج جستجو، فیلترهای جستجو، امتیاز و نظرات فروشنده، مشارکت در فروش پروفایل، رسید تحویل سفارش، ثبت گزارش، ویرایش اطلاعات هویتی پروفایل |
| Partially Connected | 3 | لوازم جانبی و قطعات مرتبط، تجربه کاربران مشارکت در فروش، برداشت وجه از کیف پول |

### نکات تکمیلی (debug / hardcoded که باید در زمان اتصال پاک شوند)

- `console.log`‌های فعال در کامپوننت‌ها: `SearchBox.jsx:43`، `CartPageContent.jsx:67`، `OrderItems.jsx:32`، `OrderSummary.jsx:73`، `Map.jsx:293`، `LoginEnterPhone.jsx:36/42`، `LoginOtp.jsx` (چند مورد)، `LoginUserRegisteration.jsx:93`، `ProfileWalletContent.jsx:54`، `ProfileEmailContent.jsx:36`، `ProfilePhoneContent.jsx:37`، `ProfileUserAddresses.jsx` (۸ مورد)، `ProfileEditInfo.jsx:258`، `ProfileMainPanel.jsx:48`، `support/page.jsx:12`، `ProductMain.jsx:43`.
- کد OTP دریافتی در UI نمایش داده می‌شود (باکس «کد تایید (تست)») در `ProfilePhoneOtpContent.jsx`، `ProfileEmailOtpContent.jsx` و `ProfileSessionsOtpContent.jsx` — مربوط به محیط تست است.
- لینک‌های dead: `href="/products/2"` در `ProductCardMobile.jsx:145`، `href="#"` در `HorizontalProductSlider.jsx` (ثبت سفارش فروش ویژه)، `url: "#"` برای پلتفرم‌ها در `ProductPartnership.jsx`.
- متن‌های ثابت غیرواقعی: `lastUpdate: "1 دقیقه پیش"` و `بروزرسانی 1 دقیقه پیش` در فایل‌های رسید/کارت‌های محصول، تایمر `۰۰:۰۰:۰۰` در `CartItems.jsx` و `ProductCardMobile.jsx`، «(1 کالا)» در `HomeFilterContent.jsx:63`، متن تستی مودال یادداشت در `OrderItems.jsx`، تصویر نمونه `sampleMap.jpg` (سه‌بار تکرار) در `SellerDetails.jsx`.
- `ProfileUserSessions.jsx` یک کامپوننت کاملاً mock است (آرایه hardcoded و CRUD لوکال) ولی در جریان اصلی UI استفاده نمی‌شود (بخش واقعی `ProfileSessions.jsx` به API وصل است).
- `SupportChatContent.jsx` یک کامپوننت نمونه با پیام‌های hardcoded است و هیچ‌جا رندر نمی‌شود (dead code).
- کلید API نقشه Neshan به‌صورت hardcoded در `Map.jsx` قرار دارد — در محیط production باید به env منتقل شود.
