# راهنمای ریدیزاین دسکتاپ صفحات فعلی

این سند روند کامل ریدیزاین **دسکتاپ** صفحات فعلی سایت (همه‌چیز به‌جز پنل فروشندگان) را با دیزاین سیستم جدید تعریف می‌کند. هر کاری روی دسکتاپ صفحات فعلی فقط طبق این سند انجام می‌شود.

**پیش‌نیاز:** `.cursor/docs/THEME-NEW-GUIDE.md` (توکن‌ها، `theme-new`، Portalها، فونت). این سند آن قوانین را تکرار نمی‌کند و فقط به آن ارجاع می‌دهد.

---

## ۰. خلاصه‌ی قوانین (برای مرور سریع)

1. **زیر `1024px` منجمد است.** موبایل و تبلت حتی یک پیکسل تغییر نمی‌کنند. فقط از `1024px` (`lg`) به بالا عوض می‌شود.
2. **منطق یک بار، نما دو بار.** اتصالات و فیلدها همان قبلی‌اند. منطق به hook می‌رود و نمای موبایل (`XMobile.jsx`) و نمای دسکتاپ (`XDesktop.jsx`) هر دو از آن استفاده می‌کنند.
3. **فایل موبایل منجمد است.** JSX موبایل عین‌به‌عین منتقل می‌شود و بعد از آن دیگر تغییر نمی‌کند.
4. **هر مقدار دسکتاپ از دیزاین سیستم می‌آید.** هیچ hex، px دلخواه، `style` یا کلاس خارج از دیزاین سیستم مجاز نیست.
5. **هر بخش دو commit دارد:** اول refactor بدون هیچ تغییر ظاهری، بعد طرح جدید دسکتاپ.
6. **مقدار ناموجود گزارش می‌شود، نه هاردکد.** اگر فیگما مقداری خارج از دیزاین سیستم دارد، نزدیک‌ترین توکن استفاده و مورد به کاربر گزارش می‌شود.
7. **پایان هر کار با بررسی `git diff`** (بخش ۱۳).

---

## ۱. محدوده

| بازه‌ی عرض | وضعیت |
| --- | --- |
| `0` تا `1023px` (موبایل و تبلت) | **منجمد.** هیچ تغییری مجاز نیست. طرح تبلت فیگما اعمال نمی‌شود و تبلت همان طرح موبایل فعلی را نشان می‌دهد. |
| `1024px` به بالا (`lg`) | با دیزاین سیستم جدید از نو نوشته می‌شود. |

- breakpoint دسکتاپ فقط `lg` است. breakpointهای `xl` و `2xl` فقط برای تنظیم جزئیات **داخل** طرح دسکتاپ مجازند (مثلاً دسکتاپ بزرگ `1440px+`). `sm` و `md` در کد دسکتاپ ممنوع‌اند، چون زیر `1024px` اثر می‌گذارند.
- اتصالات API، فیلدها، server actionها و store همان قبلی‌اند. ریدیزاین دسکتاپ هیچ تغییری در منطق نمی‌دهد، مگر اینکه کاربر صریحاً بخواهد.

---

## ۲. انواع فایل و مجوز تغییر

| نوع فایل | مثال | مجوز |
| --- | --- | --- |
| `globals.css` | `src/app/globals.css` | **ممنوع.** |
| `theme-new.css` | `src/app/theme-new.css` | فقط طبق `THEME-NEW-GUIDE.md`، و فقط اگر کاربر صریحاً بخواهد. توکن جدید خودسرانه اضافه نشود. |
| نمای موبایل | `components/ProductMainMobile.jsx` | **منجمد** بعد از commit refactor (بخش ۶). |
| نمای دسکتاپ | `components/desktop/ProductMainDesktop.jsx` | آزاد، فقط با دیزاین سیستم جدید (بخش ۸). |
| hook منطق | `src/hooks/useProductMain.js` | فقط برای انتقال منطق. رفتار نباید عوض شود. |
| کامپوننت ترکیب‌کننده | `components/ProductMain.jsx` | فقط رندر دو نما (بخش ۵.۴). |
| فایل‌های مشترک `ui/` و `layout/` | `ui/dialog/Dialog.jsx` | فقط کلاس `lg:` جدید، یا prop و variant جدید که **پیش‌فرضش رفتار فعلی** باشد. |
| فایل‌های تقسیم‌نشده‌ی ماژول‌ها | `cart/components/CartItems.jsx` | فقط کلاس‌های `lg:` (حالت «فقط ظاهری» در بخش ۴). |
| فایل‌های پنل فروشندگان | `modules/seller-panel/*` | خارج از محدوده‌ی این سند. **دست نخورد.** |

---

## ۳. منابع مقادیر

| چه چیزی | کجا |
| --- | --- |
| رنگ، تایپوگرافی، radius، سایه، grid | جدول‌های بخش ۵ `THEME-NEW-GUIDE.md` و فایل `src/app/theme-new.css` |
| فاصله‌ها | جدول spacing بخش ۵ `THEME-NEW-GUIDE.md` (فقط ۱۳ عدد مجاز) |
| آیکن‌ها | `src/icons/index.jsx` (import از `@/icons`) |
| ابزار ادغام کلاس | `cn` از `@/lib/client/utils` |
| فرمت قیمت و زمان | `formatPrice` و `formatSecondsToTime` از `@/lib/client/utils`، و `toLocaleString("fa-IR")` |
| طرح | نود فیگما که کاربر می‌دهد (از طریق Figma Bridge) |

---

## ۴. تصمیم برای هر بخش

قبل از شروع هر بخش، طرح دسکتاپ فیگما را با کد فعلی مقایسه کن و یکی از این سه حالت را انتخاب کن:

| حالت | نشانه | روش |
| --- | --- | --- |
| **فقط ظاهری** | چیدمان و ترتیب المنت‌ها همان است؛ فقط رنگ، فاصله، فونت یا radius فرق دارد | همان فایل. فقط کلاس‌های `lg:` اضافه یا عوض می‌شوند. بدون hook و بدون تقسیم. |
| **ساختاری** | چیدمان، ترتیب، المنت‌ها یا کامپوننت‌ها فرق دارند | الگوی جداسازی (بخش ۵) و روند دو commit (بخش ۶). |
| **کامپوننت `ui/`** | یک کامپوننت عمومی (دکمه، input، دیالوگ ...) در دسکتاپ ظاهر دیگری دارد | variant یا prop جدید با پیش‌فرض فعلی، یا کلاس‌های `lg:`. کپی کردن کامپوننت ممنوع. |

اگر مطمئن نیستی، حالت **ساختاری** را انتخاب کن. اگر یک فایل تقسیم‌نشده بیش از حدود ۱۰ کلاس `lg:` جدید لازم داشت، یعنی حالت ساختاری است.

---

## ۵. الگوی جداسازی (حالت ساختاری)

### ۵.۱ ساختار فایل‌ها

```
src/hooks/
  useProductMain.js                ← logic (state, derived data, handlers, API)

src/components/modules/product-single/
  components/
    ProductMain.jsx                ← composer: calls the hook, renders both views
    ProductMainMobile.jsx          ← current JSX, moved verbatim (frozen)
    desktop/
      ProductMainDesktop.jsx       ← new desktop view
      ProductPriceCard.jsx         ← desktop-only sub-parts, if needed
  index.jsx                        ← exports unchanged
```

- اسم hook: `use` + اسم کامپوننت ترکیب‌کننده (`useProductMain`). جای همه‌ی hookها `src/hooks/` است.
- اسم نماها: اسم کامپوننت + `Mobile` یا `Desktop`.
- **هر فایل داخل پوشه‌ی `desktop/` فقط در دسکتاپ نمایش داده می‌شود.** پس کلاس‌هایش بدون prefix `lg:` نوشته می‌شوند.
- export کامپوننت ترکیب‌کننده در `index.jsx` ماژول **همان قبلی** می‌ماند تا هیچ import دیگری عوض نشود.

### ۵.۲ چه چیزی در hook می‌رود

| در hook | در نما می‌ماند |
| --- | --- |
| state مشترک دو نما (attribute انتخاب‌شده، روش تحویل، تعداد ...) | state فقط-ظاهری (باز و بسته بودن accordion، drawer، modal) |
| داده‌های محاسبه‌شده (قیمت، variant، موجودی) | ref، `ResizeObserver` و listener اسکرول مخصوص همان نما |
| handlerهایی که API صدا می‌زنند، toast نشان می‌دهند یا store را عوض می‌کنند | تصمیم‌های ظاهری بعد از یک عمل (مثلاً باز کردن drawer بعد از افزودن به سبد) |
| selectorهای Zustand که منطق لازم دارد | |
| تایمرها و effectهای منطقی (شمارش معکوس، ریست تعداد) | |

اگر یک handler منطقی بعد از اتمام کارش باید ظاهر یک نما را عوض کند (مثل `handleAddToCart` که در موبایل drawer باز می‌کند)، hook نتیجه را برمی‌گرداند (مثلاً `true` یا `false`) و نما یک **adapter هم‌نام** می‌سازد تا JSX موبایل عین‌به‌عین بماند:

```jsx
// ProductMainMobile.jsx
const { handleAddToCart: addToCart } = productMain;

const handleAddToCart = async () => {
  const isAdded = await addToCart();
  if (isAdded && !isDesktop) setShowOrderAccessoriesDrawer(true);
};
```

### ۵.۳ قالب hook

```js
// src/hooks/useProductMain.js
"use client";

import { useState } from "react";

// Shared logic of ProductMain; used by both mobile and desktop views
export function useProductMain(product) {
  const [quantity, setQuantity] = useState(1);
  // ... all shared state, derived values and handlers

  return {
    quantity,
    handleQuantityChange,
    // ...
  };
}
```

### ۵.۴ قالب کامپوننت ترکیب‌کننده

```jsx
// components/ProductMain.jsx
"use client";

import { useProductMain } from "@/hooks/useProductMain";
import ProductMainMobile from "./ProductMainMobile";
import ProductMainDesktop from "./desktop/ProductMainDesktop";

export default function ProductMain({ product }) {
  const productMain = useProductMain(product);

  return (
    <>
      <ProductMainDesktop product={product} productMain={productMain} />
      <ProductMainMobile product={product} productMain={productMain} />
    </>
  );
}
```

قواعد مهم:

- **hook فقط یک بار و فقط در کامپوننت ترکیب‌کننده صدا زده می‌شود**، نه داخل نماها. وگرنه API callها، toastها و تایمرها دو بار اجرا می‌شوند.
- **wrapper اضافه (مثل `<div>`) دور نماها نگذار.** یک المنت اضافه می‌تواند چیدمان موبایل را در والدهای `flex`، `grid` یا `overflow` عوض کند. نمایش و پنهان شدن با کلاس روی **root خود نماها** انجام می‌شود (۵.۵ و ۵.۶).
- **ترتیب: اول دسکتاپ، بعد موبایل.** نمای دسکتاپ در موبایل `display: none` است ولی در DOM هست. اگر بعد از نمای موبایل بیاید، نمای موبایل دیگر `:last-child` نیست و کلاس‌هایی مثل `space-y-*` یا `divide-*` در والد به آن margin یا border اضافه می‌دهند. با این ترتیب، جایگاه نمای موبایل در DOM همان قبلی می‌ماند. اگر والد از `first:`، `odd:`، `even:` یا `nth-*` روی فرزندانش استفاده می‌کند، قبل از تقسیم بررسی و به کاربر گزارش کن.

### ۵.۵ نمای موبایل (`XMobile.jsx`)

- **کل JSX فعلی کامپوننت، عین‌به‌عین** منتقل می‌شود، از جمله بخش‌های `lg:` و `hidden lg:block` قدیمی. هیچ کلاس، المنت یا متنی عوض نمی‌شود.
- تنها تغییرات مجاز:
  1. importها و امضای تابع.
  2. destructure کردن خروجی hook در بالای تابع **با همان اسم‌های قبلی**، تا JSX دست نخورد: `const { quantity, handleQuantityChange, ... } = productMain;`
  3. adapterهای هم‌نام (بخش ۵.۲).
  4. **در commit طرح جدید (نه refactor):** اضافه کردن `lg:hidden` به root نما.
- state، ref و effectهای فقط-ظاهری موبایل همراه JSX در همین فایل می‌مانند.
- بعد از commit طرح جدید، این فایل **منجمد** است.

### ۵.۶ نمای دسکتاپ (`desktop/XDesktop.jsx`)

- root نما: `hidden lg:block lg:theme-new` (یا `lg:flex` و `lg:grid` به جای `lg:block`).
- `lg:theme-new` از همان ابتدای توسعه روی root هست، تا radius و خاکستری‌ها مقدار دیزاین سیستم جدید را نشان دهند.
- همه‌ی داده‌ها از `product` و `productMain` می‌آیند. داده‌ی ثابت (mock) فیگما نباید در کد بماند.
- Portalهای نما (`DialogContent`، `DrawerContent`، `PopoverContent` ...) هم `className="lg:theme-new"` و در صورت وجود `overlayClassName="lg:theme-new"` می‌گیرند.
- اگر نما بزرگ است، به زیرکامپوننت‌های تک‌مسئولیتی در همان پوشه‌ی `desktop/` شکسته شود.

### ۵.۷ وقتی والد از قبل دو درخت جدا دارد

بعضی والدها خودشان درخت دسکتاپ و موبایل جدا دارند. مثلاً `ProductSingle.jsx` یک layout دسکتاپ با `hidden lg:flex` و یک layout موبایل با `!isDesktop &&` دارد:

- **درخت موبایل والد دست نمی‌خورد.**
- اگر خود layout دسکتاپ والد هم طرح جدید دارد، آن بخش طبق همین الگو جدا می‌شود (`ProductSingleDesktop.jsx` در `desktop/`). JSX درخت موبایل در فایل اصلی می‌ماند.
- کامپوننت‌های فرزند که در هر دو درخت رندر می‌شوند (مثل `ProductMain`) بدون تغییر در والد، از طریق کامپوننت ترکیب‌کننده‌ی خودشان دو نما را رندر می‌کنند.

---

## ۶. روند کار هر بخش

### Commit اول: refactor (هیچ تغییر ظاهری، نه در موبایل نه در دسکتاپ)

1. hook را بساز و منطق مشترک را **بدون تغییر رفتار** به آن منتقل کن.
2. `XMobile.jsx` را بساز و **کل** JSX فعلی را عین‌به‌عین به آن منتقل کن (بخش ۵.۵).
3. کامپوننت ترکیب‌کننده را بازنویسی کن که hook را صدا بزند و **فقط** `XMobile` را رندر کند. هنوز نمای دسکتاپ و `lg:hidden` اضافه نمی‌شود.
4. کد مرده‌ی منطقی (مثل `console.log`) فقط اگر قطعاً بی‌اثر است حذف شود.
5. چک‌لیست بخش ۱۳.۱.

پیام commit: `refactor(<module>): extract <Component> logic into use<Component> hook`

### Commit دوم: طرح جدید دسکتاپ

1. نود فیگما را با Figma Bridge بگیر و خروجی را طبق بخش ۹ تبدیل کن.
2. `desktop/XDesktop.jsx` را بساز (بخش ۵.۶).
3. در کامپوننت ترکیب‌کننده، `XDesktop` را **قبل** از `XMobile` رندر کن.
4. به root نمای موبایل `lg:hidden` اضافه کن. این تنها تغییر مجاز `XMobile` در این commit است.
5. چک‌لیست بخش ۱۳.۲.

پیام commit: `feat(<module>): implement new desktop design for <Component>`

### Commit سوم (اختیاری): پاک‌سازی

بعد از commit دوم، کلاس‌های `lg:*` و بلوک‌های `hidden lg:*` داخل `XMobile.jsx` دیگر هیچ‌وقت نمایش داده نمی‌شوند. حذفشان مجاز است، **به شرط اینکه فقط همین‌ها حذف شوند** و هیچ کلاس بدون prefix یا المنت دیگری عوض نشود.

پیام commit: `chore(<module>): remove dead desktop classes from <Component>Mobile`

### حالت «فقط ظاهری»

یک commit کافی است: فقط کلاس‌های `lg:` اضافه یا عوض می‌شوند. اگر wrapper صفحه هنوز `lg:theme-new` ندارد، مقادیر A (radius و خاکستری‌ها) را باید با توکن‌های معنایی گروه B نوشت (`lg:bg-surface`، `lg:border-border-default`، `lg:text-text-secondary`) یا تا پایان صفحه صبر کرد.

---

## ۷. ترتیب کار در کل پروژه

1. **کامپوننت‌های پایه‌ی `ui/`** که در طرح‌های دسکتاپ زیاد تکرار می‌شوند: دکمه، کارت، input، عنوان بخش، تب‌ها. با variant و پیش‌فرض فعلی.
2. **Shell دسکتاپ:** `MainNavigation`، `SearchBox`، و هدر دسکتاپ صفحه‌ی محصول. `lg:theme-new` روی خود این کامپوننت‌ها گذاشته می‌شود، **نه روی `MainLayout`**.
3. **صفحات** به ترتیب اولویت کاربر.

| صفحه | route | ماژول‌ها | وضعیت |
| --- | --- | --- | --- |
| Shell دسکتاپ | همه | `layout/navigation-menu`، `ui/search` | ⬜ شروع نشده |
| خانه | `/` | `home` | ⬜ شروع نشده |
| محصول | `/products/[slug]` | `product-single`، `seller-reviews` | ⬜ شروع نشده |
| نتایج جستجو | `/search/[slug]` | `search-results` | ⬜ شروع نشده |
| سبد خرید | `/cart` | `cart` | ⬜ شروع نشده |
| رسید | `/receipt/[id]` | `receipt` | ⬜ شروع نشده |
| پشتیبانی | `/support` | `support` | ⬜ شروع نشده |
| پروفایل (مودال) | - | `profile` | ⬜ شروع نشده |
| ورود (مودال) | - | `login` | ⬜ شروع نشده |
| صفحه‌ی ۴۰۴ | - | `not-found` | ⬜ شروع نشده |

وضعیت‌ها: ⬜ شروع نشده، 🟨 در حال انجام، ✅ merge شده. بعد از هر merge این جدول به‌روز شود.

---

## ۸. قوانین بدون هاردکد

در نمای دسکتاپ و در هر کلاس `lg:` جدید، **هر مقدار** از دیزاین سیستم می‌آید.

| دسته | مجاز | ممنوع |
| --- | --- | --- |
| رنگ پس‌زمینه | `bg-surface`، `bg-surface-subtle`، `bg-surface-muted`، `bg-primary`، `bg-primary-50` تا `900`، `bg-secondary-*`، `bg-success`/`warning`/`error`/`info` و `-light` آن‌ها | `bg-white`، `bg-black`، `bg-[#...]`، رنگ‌های پیش‌فرض Tailwind (`bg-blue-500` ...) |
| رنگ متن | `text-text-primary`، `text-text-secondary`، `text-text-muted`، `text-text-disabled`، `text-text-on-primary`، `text-text-link` و رنگ‌های برند | `text-white`، `text-black`، `text-[#...]` |
| border | `border-border-subtle`، `border-border-default`، `border-border-strong`، رنگ‌های برند | `border-gray-200` به جای توکن معنایی، `border-[#...]` |
| تایپوگرافی | `text-display`، `text-h1` تا `text-h5`، `text-body`، `text-small`، `text-caption`، `text-label` | `text-xs` تا `text-9xl`، `text-[20px]`، `leading-[...]` |
| وزن فونت | خود توکن تایپوگرافی؛ `font-*` صریح فقط اگر فیگما عمداً وزن دیگری دارد | `font-[...]` |
| فاصله (`p`، `m`، `gap`، `space`، `inset`، `top`/`right`/`bottom`/`left`) | فقط `0`، `px`، `0.5`، `1`، `2`، `3`، `4`، `6`، `8`، `10`، `12`، `16`، `20`، `24`، `32` | هر عدد دیگر (`p-5`، `gap-7`) و `p-[...]` |
| ابعاد (`w`، `h`، `size`، `min-*`، `max-*`) | layout سیال (`w-full`، `flex-1`، کسرها مثل `w-1/2`، `grid-cols-12`)؛ ابعاد ثابت فیگما با عدد Tailwind (پیکسل تقسیم بر ۴: 48px یعنی `size-12`، 342px یعنی `w-85.5`) | `w-[342px]`، `h-[50px]` |
| radius | `rounded-sm`، `rounded-md`، `rounded-lg`، `rounded-xl`، `rounded-2xl`، `rounded-pill`، `rounded-circle`، `rounded-none` | `rounded-full` به جای `rounded-pill`/`rounded-circle`، `rounded-[...]` |
| سایه | `shadow-card`، `shadow-dropdown`، `shadow-modal`، `shadow-none` | `shadow-sm` تا `shadow-2xl`، `shadow-[...]` |
| layout صفحه | grid دوازده‌ستونه (`grid-cols-12`)، gutter با `gap-6`، margin کناری با `px-20` | عرض و margin دلخواه |
| شفافیت رنگ | modifier روی توکن (`bg-primary/10`) | `rgba(...)` |

قواعد تکمیلی:

- **رنگ‌های معنایی بر طیف خاکستری اولویت دارند.** برای متن، `text-text-secondary` بهتر از `text-gray-600` است، حتی وقتی مقدارشان نزدیک است.
- **`style={{...}}` ممنوع است.** تنها استثنا مقدار واقعاً داینامیک از داده است (مثل رنگ hex یک variant محصول که از API می‌آید).
- **`<img>` ممنوع است.** فقط `Image` از `next/image`. **`<a>` برای لینک داخلی ممنوع است.** فقط `Link` از `next/link`.
- **SVG inline ممنوع است.** آیکن‌ها از `@/icons`. اگر آیکنی در فیگما هست که در `src/icons/index.jsx` نیست، با همان الگوی فایل (props `className`، `size`، `color`) به آن اضافه و به کاربر گزارش شود.
- **مقدار دلخواه (`[...]`) فقط وقتی مجاز است که هیچ utility یا توکنی برایش وجود ندارد** (مثلاً `max-h-[90vh]` یا قالب پیچیده‌ی `grid-cols-[...]`). هر مورد باید به کاربر گزارش شود.

### پروتکل مقدار ناموجود

اگر طرح فیگما مقداری دارد که در دیزاین سیستم نیست (مثلاً فاصله‌ی `14px`، رنگ خارج از palette، سایه‌ی دیگر):

1. هاردکد **نکن**.
2. نزدیک‌ترین توکن را استفاده کن.
3. در پایان کار، یک جدول گزارش بده: محل در کد، مقدار فیگما، توکن جایگزین.

تصمیم نهایی (اصلاح طرح یا اضافه کردن توکن جدید به `theme-new.css`) با کاربر است.

---

## ۹. کار با خروجی Figma Bridge

خروجی Figma Bridge **مستقیم** در پروژه قرار نمی‌گیرد. قبل از نوشتن در `XDesktop.jsx`، این تبدیل‌ها انجام می‌شود:

| در خروجی فیگما | تبدیل به |
| --- | --- |
| رنگ hex (`#3D3183`، `#F3F4F6` ...) | توکن هم‌مقدار از جدول رنگ‌ها (`primary`، `surface-muted` ...) |
| `font-size` + `line-height` + `font-weight` | یک کلاس تایپوگرافی (`text-h4`، `text-body` ...) |
| padding، margin و gap به px | عدد Tailwind (px تقسیم بر ۴) از ۱۳ عدد مجاز |
| width و height ثابت | layout سیال، در غیر این صورت عدد Tailwind |
| `border-radius` به px | کلاس radius هم‌مقدار در `theme-new` (`8px` یعنی `rounded-md`، `12px` یعنی `rounded-lg` ...) |
| `box-shadow` | `shadow-card`، `shadow-dropdown` یا `shadow-modal` |
| `position: absolute` با مختصات | flex یا grid، مگر اینکه واقعاً لایه‌ای باشد |
| `<img>` و آدرس تصویر فیگما | `Image` با داده‌ی واقعی (مثلاً `product.gallery`)؛ fallback از `/assets/images/fallback/` |
| SVG آیکن | آیکن هم‌شکل از `@/icons` |
| متن ثابت نمونه (اسم محصول، قیمت، تعداد) | فیلد واقعی از props و hook |
| اعداد | فرمت فارسی با `toLocaleString("fa-IR")` یا `formatPrice` |
| دکمه و لینک بی‌عملکرد | handler موجود در hook، یا `Link` به route واقعی |
| حالت‌های hover، active و disabled فیگما | variantهای Tailwind (`hover:`، `disabled:`، `data-[state=...]:`) با همان توکن‌ها |

بعد از تبدیل:

- **ساختار معنایی HTML** رعایت شود: `h1` تا `h6` به ترتیب، `button` برای عمل، `Link` برای مسیر.
- **accessibility:** `aria-label` برای دکمه‌های فقط-آیکن، `alt` معنادار برای `Image`، و دسترسی با کیبورد.
- **حالت‌های داده** که در فیگما نیستند ولی در کد هستند (loading، خالی، خطا، ناموجود) حفظ شوند. اگر فیگما طرحشان را ندارد، با همان توکن‌ها ساده پیاده و گزارش شوند.

---

## ۱۰. نکات فنی

### SSR و `useMediaQuery`

- **نمایش و پنهان کردن نماها فقط با CSS** (`hidden lg:block` و `lg:hidden`)، نه با `useMediaQuery`. مقدار اولیه‌ی `useMediaQuery` روی سرور `false` است و استفاده از آن برای ظاهر باعث پرش صفحه هنگام بارگذاری می‌شود.
- `useMediaQuery` فقط برای **رفتار** مجاز است (مثلاً اینکه یک عمل، drawer موبایل یا modal دسکتاپ باز کند). استفاده‌های فعلی آن در کد موبایل دست نمی‌خورد.

### هر دو نما هم‌زمان در DOM هستند

- **`id`ها** در نمای دسکتاپ باید با نمای موبایل فرق داشته باشند (از `useId` استفاده شود).
- **`name` گروه‌های radio** در نمای دسکتاپ باید متفاوت باشد. دو گروه radio هم‌نام در یک صفحه یک گروه حساب می‌شوند و انتخاب یکی، دیگری را پاک می‌کند.
- **کامپوننت‌های سنگین** (نقشه، اسلایدر) را در نمای دسکتاپ فقط وقتی دوباره رندر کن که طرح دسکتاپ واقعاً لازمشان دارد.
- **فرم‌ها:** دو فرم با فیلدهای هم‌نام هم‌زمان در DOM نباید با یک `submit` ارسال شوند. هر نما فرم خودش را دارد و هر دو از handler مشترک hook استفاده می‌کنند.

### المنت‌های بیرون از wrapper

`AppShells` و `Toaster` (در `src/app/layout.jsx`) و Portalها تم wrapper را نمی‌گیرند. جزئیات در `THEME-NEW-GUIDE.md` بخش‌های ۶ و ۸.

---

## ۱۱. انتشار تدریجی و git

- برای هر صفحه یک شاخه از `dev` ساخته می‌شود: `redesign/desktop-<page>` (مثلاً `redesign/desktop-product`).
- commitهای همه‌ی بخش‌های آن صفحه (refactor، طرح جدید، پاک‌سازی) روی همین شاخه است.
- **فقط وقتی دسکتاپ کل صفحه تمام شد** به `dev` merge می‌شود. تا آن زمان دسکتاپ آن صفحه در `dev` همان طرح قدیمی است.
- بعد از merge، جدول وضعیت بخش ۷ به‌روز می‌شود.
- کارفرما قبول کرده که تا پایان کار، دسکتاپ ترکیبی از صفحات جدید و قدیم باشد.

---

## ۱۲. ممنوع‌ها

- ❌ هر تغییر در کلاس‌های بدون prefix، المنت‌ها یا متن‌های فایل‌های موبایل و فایل‌های مشترک.
- ❌ ویرایش `XMobile.jsx` بعد از commit طرح جدید (به‌جز پاک‌سازی اختیاری بخش ۶).
- ❌ refactor و طرح جدید در یک commit.
- ❌ تغییر رفتار منطقی (API، اعتبارسنجی، پیام‌ها، store) در ریدیزاین.
- ❌ صدا زدن hook داخل نماها به جای کامپوننت ترکیب‌کننده.
- ❌ wrapper اضافه دور نماها، یا رندر نمای دسکتاپ بعد از نمای موبایل.
- ❌ `sm:` و `md:` در کد دسکتاپ.
- ❌ hex، `rgba`، `style`، `<img>`، `<a>` داخلی، SVG inline.
- ❌ مقدار دلخواه `[...]` بدون دلیل و بدون گزارش.
- ❌ کلاس‌های پیش‌فرض Tailwind که معادل دیزاین سیستمی دارند (`text-lg`، `shadow-md`، `bg-white`، `rounded-full` ...).
- ❌ عددهای فاصله خارج از ۱۳ عدد مجاز.
- ❌ تغییر `globals.css`، یا اضافه کردن توکن به `theme-new.css` بدون درخواست کاربر.
- ❌ دست زدن به فایل‌های پنل فروشندگان.
- ❌ گذاشتن `lg:theme-new` روی `MainLayout`، `body` یا `html`.
- ❌ داده‌ی ثابت فیگما در کد نهایی.

---

## ۱۳. چک‌لیست‌ها

### ۱۳.۱ قبل از commit اول (refactor)

- [ ] JSX در `XMobile.jsx` با JSX قبلی **یکسان** است. فقط importها، امضای تابع، destructure و adapterها عوض شده‌اند.
- [ ] کامپوننت ترکیب‌کننده hook را یک بار صدا می‌زند و فقط `XMobile` را رندر می‌کند.
- [ ] export در `index.jsx` ماژول عوض نشده است.
- [ ] رفتارها (افزودن به سبد، انتخاب‌ها، تایمر، toastها) در موبایل و دسکتاپ مثل قبل کار می‌کنند.
- [ ] `npm run lint` بدون خطای جدید.

### ۱۳.۲ قبل از commit دوم (طرح جدید)

- [ ] نمای دسکتاپ قبل از نمای موبایل رندر می‌شود و wrapper اضافه ندارد.
- [ ] root نمای دسکتاپ `hidden lg:block lg:theme-new` (یا `lg:flex`/`lg:grid`) دارد.
- [ ] تنها تغییر `XMobile.jsx` اضافه شدن `lg:hidden` به root است.
- [ ] Portalهای نمای دسکتاپ `lg:theme-new` دارند.
- [ ] `id`ها و `name`های radio در نمای دسکتاپ یکتا هستند.
- [ ] جستجوی هاردکد در فایل‌های `desktop/` و کلاس‌های `lg:` جدید نتیجه‌ی گزارش‌نشده‌ای ندارد:

  ```bash
  rg -n "#[0-9a-fA-F]{3,8}\b|rgba?\(|-\[([0-9#.]|calc|var|rgb)|style=\{|<img|<a |<svg|\b(text-(xs|sm|base|lg|xl|[2-9]xl)|shadow-(sm|md|lg|xl|2xl)|bg-white|bg-black|text-white|text-black|rounded-full)\b|\b(sm|md):" src/components/modules/<module>/components/desktop
  ```

- [ ] عددهای فاصله فقط از ۱۳ عدد مجاز هستند.
- [ ] جدول گزارش «مقادیر ناموجود در دیزاین سیستم» به کاربر داده شده (یا اعلام شده که موردی نبوده).
- [ ] صفحه در عرض `1023px` (باید دقیقاً مثل قبل باشد) و `1024px`، `1280px` و `1440px` بررسی شده است.
- [ ] `npm run lint` بدون خطای جدید.

### ۱۳.۳ بررسی `git diff` (پایان هر کار)

```bash
git diff --stat
git diff -- src/app/globals.css src/app/theme-new.css src/components/modules/seller-panel
```

- [ ] `globals.css` و فایل‌های پنل فروشندگان هیچ تغییری ندارند.
- [ ] `theme-new.css` فقط با درخواست صریح کاربر تغییر کرده است.
- [ ] در diff فایل‌های مشترک (`ui/`، `layout/`، فایل‌های تقسیم‌نشده) هیچ کلاس بدون prefix `lg:` اضافه، حذف یا عوض نشده است.
- [ ] هیچ فایل `*Mobile.jsx` در diff نیست، به‌جز در commit refactor خودش یا اضافه شدن `lg:hidden`.

---

## ۱۴. نمونه: `ProductMain`

`components/modules/product-single/components/ProductMain.jsx` الان حدود ۱۳۴۰ خط است و منطق، UI موبایل و UI دسکتاپ را با هم دارد. حالت آن **ساختاری** است.

| بخش فعلی | مقصد |
| --- | --- |
| state: `selectedAttributes`، `deliveryMethod`، `quantity`، `timeRemaining`، `isAddingToCart` | `useProductMain` |
| محاسبات: `sellerData`، `deliveryMethods`، `matchedVariant`، `selectedInventory`، `currentPrice`، `isAvailable`، `isDeliveryMethodSupported` | `useProductMain` |
| handlerها: `handleSelectAttribute`، `handleQuantityChange`، `handleConversation`، `handleAddToCart` | `useProductMain` (`handleAddToCart` نتیجه را برمی‌گرداند) |
| effectها: شمارش معکوس، ریست تعداد، ریست روش تحویل | `useProductMain` |
| state ظاهری: `expanded`، `addressOpen`، `showOtherSellers`، `isReviewsModalOpen`، `show*Drawer` | هر نما برای خودش |
| `orderCardRef`، `orderCardHeight`، `isScrollAtTop` و effectهای `ResizeObserver` و اسکرول | `ProductMainMobile` |
| کل JSX فعلی | `ProductMainMobile` (عین‌به‌عین) |
| طرح جدید از فیگما | `desktop/ProductMainDesktop` |

در موبایل، adapter هم‌نام `handleAddToCart` بعد از افزودن موفق، drawer لوازم جانبی را باز می‌کند (بخش ۵.۲).

---

## ۱۵. پرامپت‌های آماده

برای هر بخش فقط مقادیر داخل `<...>` عوض می‌شوند.

**مرحله‌ی ۱: refactor**

```
طبق .cursor/docs/DESKTOP-REDESIGN-GUIDE.md، commit اول (refactor) بخش <نام کامپوننت> در <مسیر فایل> را انجام بده. هیچ تغییر ظاهری نباید ایجاد شود.
```

**مرحله‌ی ۲: طرح دسکتاپ**

```
طبق .cursor/docs/DESKTOP-REDESIGN-GUIDE.md و .cursor/docs/THEME-NEW-GUIDE.md، طرح دسکتاپ بخش <نام کامپوننت> را از نود فیگمای <لینک یا شناسه‌ی نود> با Figma Bridge پیاده کن (commit دوم). در پایان گزارش مقادیر ناموجود در دیزاین سیستم و نتیجه‌ی چک‌لیست ۱۳.۲ و ۱۳.۳ را بده.
```

**حالت فقط ظاهری**

```
طبق .cursor/docs/DESKTOP-REDESIGN-GUIDE.md (حالت فقط ظاهری)، دسکتاپ <نام کامپوننت> را مطابق نود فیگمای <لینک یا شناسه‌ی نود> فقط با کلاس‌های lg: به‌روز کن.
```
