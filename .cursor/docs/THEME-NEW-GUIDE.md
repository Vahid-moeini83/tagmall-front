# راهنمای استایل گاید جدید (دسکتاپ + پنل فروشندگان)

این سند قوانین دقیق اضافه کردن و اعمال استایل گاید جدید را توضیح می‌دهد. هدف این است که:

- **طرح موبایل حتی یک پیکسل تغییر نکند.**
- **دسکتاپ** صفحات فعلی، صفحه به صفحه، با استایل گاید جدید ریدیزاین شود.
- **پنل فروشندگان** در همه‌ی سایزها (موبایل و دسکتاپ) از استایل گاید جدید استفاده کند.

قبل از وارد کردن هر مقدار یا نوشتن هر کامپوننتی برای دسکتاپ یا پنل فروشندگان، این سند را کامل بخوانید.

---

## ۱. اصل اصلی

> استایل گاید جدید **هیچ‌وقت سراسری فعال نمی‌شود.** فقط روی المنت‌هایی اعمال می‌شود که کلاس `theme-new` یا `lg:theme-new` دارند (و فرزندانشان).

موبایل این کلاس‌ها را نمی‌گیرد، پس مقادیر قدیمی را می‌بیند. هر قانونی در ادامه آمده، برای حفظ همین اصل است.

---

## ۲. فایل‌ها

| فایل | نقش |
| --- | --- |
| `src/app/globals.css` | استایل گاید فعلی (موبایل). **مقادیر `:root` و `@theme` این فایل تغییر نمی‌کنند.** |
| `src/app/theme-new.css` | تمام مقادیر استایل گاید جدید. در `globals.css` import شده است. |
| `.cursor/docs/THEME-NEW-GUIDE.md` | همین سند: توکن‌ها و نحوه‌ی فعال‌سازی تم. |
| `.cursor/docs/DESKTOP-REDESIGN-GUIDE.md` | روند ریدیزاین دسکتاپ صفحات فعلی، جداسازی موبایل و دسکتاپ و قوانین بدون هاردکد. |

ترتیب import در `globals.css` باید همین بماند:

```css
@import "tailwindcss";
@import "../../public/assets/fonts/style.css";
@import "./theme-new.css";
```

`theme-new.css` را در هیچ layout یا کامپوننتی جداگانه import نکنید و داخل آن `@import "tailwindcss"` ننویسید.

---

## ۳. دسته‌بندی توکن‌ها

هر توکن استایل گاید جدید را قبل از وارد کردن، در یکی از این سه دسته قرار دهید:

| دسته | تعریف | کجا وارد شود |
| --- | --- | --- |
| **A** | توکنی که در `globals.css` وجود دارد ولی در استایل گاید جدید **مقدار متفاوت** دارد (مثلاً `primary` با رنگ دیگر) | داخل `@utility theme-new` در `theme-new.css` |
| **B** | توکنی که **فقط** در استایل گاید جدید وجود دارد (مثلاً یک رنگ سطح جدید) | داخل `@theme` در `theme-new.css` |
| **C** | توکنی که در هر دو استایل گاید **یکسان** است | هیچ‌جا؛ از همان توکن فعلی استفاده شود |

### چرا دسته‌ی A در `@theme` نمی‌رود؟

اگر یک توکن موجود (مثلاً `--color-primary`) دوباره در `@theme` تعریف شود، Tailwind آن را **سراسری** و روی `:root` تعریف می‌کند و موبایل هم تغییر می‌کند. داخل `@utility theme-new` اما فقط روی المنت‌هایی اعمال می‌شود که این کلاس را دارند.

### چرا برای دسته‌ی A اسم جدید نمی‌سازیم؟

اسم‌هایی مثل `seller-primary` یا `primary-v2` **ممنوع** هستند. اگر کامپوننت‌ها با `bg-primary` نوشته شوند، همان کامپوننت در پنل (با `theme-new`)، در دسکتاپ (با `lg:theme-new`) و در موبایل (بدون کلاس) هر کدام مقدار درست را می‌گیرد و بدون تغییر قابل استفاده‌ی مجدد است.

---

## ۴. نحوه‌ی وارد کردن مقادیر

### قدم ۱: پر کردن جدول‌های زیر

قبل از نوشتن CSS، جدول‌های بخش ۵ را با مقادیر استایل گاید جدید پر کنید و دسته‌ی هر توکن را مشخص کنید.

### قدم ۲: وارد کردن توکن‌های دسته‌ی A

داخل `@utility theme-new` در `theme-new.css`، **خود متغیر `--color-*` / `--radius-*` / `--font-*`** را override کنید، نه متغیرهای کمکی `:root` مثل `--primary-color`:

```css
@utility theme-new {
  /* Marker property: Tailwind rejects an empty @utility. Keep it. */
  --theme-new: 1;

  --color-primary: #2b2170;
  --color-gray-300: #e8e8e8;
  --radius-lg: 12px;
}
```

دلیل: در `globals.css` مقدار `--color-primary` روی `:root` از `var(--primary-color)` محاسبه می‌شود. override کردن `--primary-color` روی یک المنت فرزند روی `--color-primary` اثری ندارد.

خط `--theme-new: 1;` را **پاک نکنید.** Tailwind روی `@utility` خالی خطا می‌دهد و build کل پروژه می‌شکند.

### قدم ۳: وارد کردن توکن‌های دسته‌ی B

داخل `@theme` در `theme-new.css`:

```css
@theme {
  --color-surface: #ffffff;
  --color-border-subtle: #eeeeee;
  --shadow-card: 0 4px 16px rgb(0 0 0 / 0.06);
}
```

**قبل از اضافه کردن هر اسم جدید**، مطمئن شوید با هیچ کلاسی که الان در کد استفاده شده تداخل ندارد:

```bash
rg "\bsurface\b" src
```

این مورد حیاتی است، چون Tailwind رنگ‌های پیش‌فرض خودش را هم دارد و بعضی از آن‌ها الان در موبایل استفاده شده‌اند. مثلاً `gray-50` در چند فایل (`Dialog.jsx`، `SearchHistory.jsx`، `ProfileWalletContent.jsx` و ...) با مقدار پیش‌فرض Tailwind استفاده شده است. اگر استایل گاید جدید `gray-50` داشته باشد و آن را در `@theme` تعریف کنید، **موبایل تغییر می‌کند.** چنین توکنی را یا در دسته‌ی A (داخل `@utility theme-new`) بگذارید یا اسم دیگری برایش انتخاب کنید.

### قدم ۴: قواعد نام‌گذاری دسته‌ی B

- اسم‌ها **معنایی** باشند و نقش را بگویند، نه ظاهر را: `surface`، `surface-muted`، `border-subtle`، `text-muted`.
- از پیشوند یا پسوند نسخه یا بخش استفاده نشود: `v2`، `new`، `seller`، `desktop` ممنوع.
- از namespaceهای استاندارد Tailwind v4 استفاده شود تا کلاس‌ها خودکار ساخته شوند:

| نوع | namespace | کلاس نمونه |
| --- | --- | --- |
| رنگ | `--color-*` | `bg-surface`، `text-text-muted`، `border-border-subtle` |
| اندازه‌ی فونت | `--text-*` | `text-title-lg` |
| فونت | `--font-*` | `font-heading` |
| radius | `--radius-*` | `rounded-card` |
| سایه | `--shadow-*` | `shadow-card` |
| فاصله | `--spacing-*` | **ممنوع؛** از مقیاس عددی Tailwind استفاده شود (جدول بخش ۵) |
| عرض container | `--container-*` | فقط با اسم معنایی که در مقیاس Tailwind نیست |
| breakpoint | `--breakpoint-*` | **ممنوع؛** breakpointها تغییر نمی‌کنند |

**هشدار مهم درباره‌ی `--spacing-*` و `--container-*`:** در Tailwind v4 کلاس‌های `max-w-*`، `w-*`، `min-w-*`، `size-*` و `basis-*` اول در `--spacing-*` و بعد در `--container-*` دنبال مقدار می‌گردند. پس تعریف اسم‌هایی مثل `--spacing-sm` یا `--spacing-lg` بی‌صدا مقدار `max-w-sm` و `max-w-lg` را در **کل پروژه** (از جمله موبایل) عوض می‌کند. این اتفاق یک بار افتاده و صفحه‌ی ۴۰۴ موبایل را خراب کرده بود. اسم‌های `3xs`، `2xs`، `xs`، `sm`، `md`، `lg`، `xl` و `2xl` تا `7xl` در این دو namespace **ممنوع** هستند.

---

## ۵. جدول مقادیر دیزاین سیستم (استخراج شده از فیگما)

ستون «دسته» بر اساس قوانین ایزوله‌سازی تم با A (اورراید در `@utility theme-new`)، B (توکن جدید در `@theme`) یا C (یکسان در هر دو تم) تفکیک شده است.

### رنگ‌ها

#### رنگ اصلی و طیف آن (Primary Brand)
| نام در دیزاین سیستم | توکن در پروژه | مقدار فعلی | مقدار جدید | دسته |
| --- | --- | --- | --- | --- |
| Primary (Base / 500) | `--color-primary` | `#3d3183` | `#3d3183` | A / C |
| Primary 50 | `--color-primary-50` | - | `#eeeff6` | B |
| Primary 100 | `--color-primary-100` | - | `#dddeee` | B |
| Primary 200 | `--color-primary-200` | - | `#c3c5df` | B |
| Primary 300 | `--color-primary-300` | - | `#9d9fc8` | B |
| Primary 400 | `--color-primary-400` | - | `#6868b1` | B |
| Primary 500 | `--color-primary-500` | - | `#3d3183` | B |
| Primary 600 | `--color-primary-600` | - | `#2b256a` | B |
| Primary 700 | `--color-primary-700` | - | `#201c54` | B |
| Primary 800 | `--color-primary-800` | - | `#16143e` | B |
| Primary 900 | `--color-primary-900` | - | `#0e0d2b` | B |

#### رنگ ثانویه و طیف آن (Secondary Brand)
| نام در دیزاین سیستم | توکن در پروژه | مقدار فعلی | مقدار جدید | دسته |
| --- | --- | --- | --- | --- |
| Secondary (Base / 500) | `--color-secondary` | - | `#f58220` | B |
| Secondary 50 | `--color-secondary-50` | - | `#fef6ef` | B |
| Secondary 100 | `--color-secondary-100` | - | `#feecde` | B |
| Secondary 200 | `--color-secondary-200` | - | `#fcdcc1` | B |
| Secondary 300 | `--color-secondary-300` | - | `#fbc79b` | B |
| Secondary 400 | `--color-secondary-400` | - | `#f9ae6e` | B |
| Secondary 500 | `--color-secondary-500` | - | `#f58220` | B |
| Secondary 600 | `--color-secondary-600` | - | `#d06f1b` | B |
| Secondary 700 | `--color-secondary-700` | - | `#ac5b16` | B |
| Secondary 800 | `--color-secondary-800` | - | `#7b4110` | B |
| Secondary 900 | `--color-secondary-900` | - | `#562e0b` | B |

#### رنگ‌های خنثی و خاکستری (Neutrals & Grays)
| نام در دیزاین سیستم | توکن در پروژه | مقدار فعلی | مقدار جدید | دسته |
| --- | --- | --- | --- | --- |
| سفید (White) | `--color-surface` | `#ffffff` | `#ffffff` | B |
| خاکستری ۵۰ | `--color-gray-50` | - | `#f9fafb` | A |
| خاکستری ۱۰۰ | `--color-gray-100` | `#f9f9f9` | `#f3f4f6` | A |
| خاکستری ۲۰۰ | `--color-gray-200` | `#f9f7f7` | `#e5e7eb` | A |
| خاکستری ۳۰۰ | `--color-gray-300` | `#ededed` | `#d1d5db` | A |
| خاکستری ۴۰۰ | `--color-gray-400` | `#cbcbcb` | `#9ca3af` | A |
| خاکستری ۵۰۰ | `--color-gray-500` | `#adadad` | `#6b7280` | A |
| خاکستری ۶۰۰ | `--color-gray-600` | `#757575` | `#4b5563` | A |
| خاکستری ۷۰۰ | `--color-gray-700` | `#474747` | `#374151` | A |
| خاکستری ۸۰۰ | `--color-gray-800` | `#353535` | `#1f2937` | A |
| خاکستری ۹۰۰ | `--color-gray-900` | - | `#111827` | A |

#### سطوح و حاشیه‌ها (Surfaces & Borders)
| نام معنایی | توکن در پروژه | مقدار | دسته |
| --- | --- | --- | --- |
| Surface | `--color-surface` | `#ffffff` | B |
| Surface Subtle | `--color-surface-subtle` | `#f9fafb` | B |
| Surface Muted | `--color-surface-muted` | `#f3f4f6` | B |
| Border Subtle | `--color-border-subtle` | `#f3f4f6` | B |
| Border Default | `--color-border-default` | `#e5e7eb` | B |
| Border Strong | `--color-border-strong` | `#d1d5db` | B |

#### رنگ‌های معنایی متن (Semantic Text Colors)
| نقش متن | توکن در پروژه | مقدار | دسته |
| --- | --- | --- | --- |
| متن اصلی | `--color-text-primary` / `--color-text-main` | `#1a1a2e` | B |
| متن ثانویه | `--color-text-secondary` | `#4a4a68` | B |
| متن کمکی / فرعی | `--color-text-muted` / `--color-text-helper` | `#7a7a96` | B |
| متن غیرفعال | `--color-text-disabled` | `#b0b0c4` | B |
| متن روی رنگ اصلی | `--color-text-on-primary` | `#ffffff` | B |
| متن روی رنگ ثانویه | `--color-text-on-secondary` | `#ffffff` | B |
| متن لینک | `--color-text-link` | `#3d3183` | B |
| متن لینک فعال | `--color-text-link-active` | `#f58220` | B |

#### رنگ‌های وضعیتی و کاربردی (Functional Status Colors)
| نقش | توکن در پروژه | مقدار قبلی | مقدار جدید در دیزاین سیستم | دسته |
| --- | --- | --- | --- | --- |
| موفقیت (Success Base) | `--color-success` | `#00966d` | `#00ba88` | A |
| موفقیت روشن | `--color-success-light` | `#f3fdfa` | `#f3fdfa` | C |
| هشدار (Warning Base) | `--color-warning` | `#a9791c` | `#f4b740` | A |
| هشدار روشن | `--color-warning-light` | `#fff8e1` | `#fff8e1` | C |
| خطا (Error Base) | `--color-error` | `#c30000` | `#ed2e2e` | A |
| خطا روشن | `--color-error-light` | `#fff2f2` | `#fff2f2` | C |
| اطلاعات (Info Base) | `--color-info` | - | `#3b82f6` | B |
| اطلاعات روشن | `--color-info-light` | - | `#eff6ff` | B |

---

### تایپوگرافی

هر کلاس تایپوگرافی **اندازه، line-height و وزن فونت** را با هم دارد (`--text-*--font-weight` در `theme-new.css`). پس `text-h3` به‌تنهایی دقیقاً سبک طراح است و نیازی به `font-semibold` کنارش نیست. اگر جایی عمداً وزن دیگری لازم است، کلاس `font-*` صریح همیشه بر وزن توکن غلبه می‌کند.

فایل‌های فونت Dana فقط وزن‌های `200`، `400` و `600` را دارند (`public/assets/fonts/style.css`). وزن‌های Bold (700) و ExtraBold (800) طراح با نزدیک‌ترین فایل (600) و بولد مصنوعی مرورگر نمایش داده می‌شوند. برای نمایش دقیق، فایل‌های فونت 700 و 800 باید از طراح گرفته و اضافه شوند.

#### سلسله‌مراتب دسکتاپ (Desktop Typography)
| نام المان | کلاس Tailwind | فونت | سایز | Line Height | وزن فونت |
| --- | --- | --- | --- | --- | --- |
| عنوان نمایشی (Display) | `text-display` | Dana | `56px` | `64px` | ExtraBold (800) |
| عنوان ۱ (Heading 1) | `text-h1` | Dana | `44px` | `52px` | Bold (700) |
| عنوان ۲ (Heading 2) | `text-h2` | Dana | `36px` | `44px` | Bold (700) |
| عنوان ۳ (Heading 3) | `text-h3` | Dana | `28px` | `36px` | SemiBold (600) |
| عنوان ۴ (Heading 4) | `text-h4` | Dana | `22px` | `30px` | SemiBold (600) |
| عنوان ۵ (Heading 5) | `text-h5` | Dana | `18px` | `26px` | SemiBold (600) |
| متن بدنه (Body) | `text-body` | Dana | `16px` | `26px` | Regular (400) |
| متن کوچک (Small) | `text-small` | Dana | `14px` | `22px` | Regular (400) |
| زیرنویس (Caption) | `text-caption` | Dana | `12px` | `18px` | Regular (400) |
| برچسب (Label / Tag) | `text-label` | Dana | `12px` | `16px` | SemiBold (600) |

#### سلسله‌مراتب موبایل (Mobile Typography)
| نام المان | کلاس Tailwind | فونت | سایز | Line Height | وزن فونت |
| --- | --- | --- | --- | --- | --- |
| عنوان نمایشی | `text-mobile-display` | Dana | `36px` | `44px` | ExtraBold |
| عنوان ۱ | `text-mobile-h1` | Dana | `32px` | `40px` | Bold |
| عنوان ۲ | `text-mobile-h2` | Dana | `26px` | `34px` | Bold |
| عنوان ۳ | `text-mobile-h3` | Dana | `22px` | `30px` | SemiBold |
| عنوان ۴ | `text-mobile-h4` | Dana | `18px` | `26px` | SemiBold |
| متن بدنه | `text-mobile-body` | Dana | `14px` | `24px` | Regular |
| زیرنویس | `text-mobile-caption` | Dana | `11px` | `16px` | Regular |
| برچسب | `text-mobile-label` | Dana | `11px` | `14px` | SemiBold |

---

### شعاع گوشه‌ها (Border Radius)

| نام در دیزاین سیستم | توکن پروژه | کلاس Tailwind | مقدار فعلی (موبایل) | مقدار دیزاین سیستم جدید | دسته |
| --- | --- | --- | --- | --- | --- |
| بدون گردی | `rounded-none` | `rounded-none` | `0px` | `0px` | C |
| کم (Subtle) | `--radius-sm` | `rounded-sm` | `4px` | `4px` | C |
| متوسط (Medium) | `--radius-md` | `rounded-md` | `10px` | `8px` | A |
| زیاد (Large) | `--radius-lg` | `rounded-lg` | `16px` | `12px` | A |
| خیلی زیاد (XLarge) | `--radius-xl` | `rounded-xl` | `24px` | `16px` | A |
| گرد (Round) | `--radius-2xl` | `rounded-2xl` | `32px` | `24px` | A |
| کپسولی (Pill) | `--radius-pill` | `rounded-pill` | - | `999px` | B |
| دایره (Circle) | `--radius-circle` | `rounded-circle` | - | `50%` | B |

---

### مقیاس فاصله‌گذاری (Spacing Scale - 4px Grid)

grid چهار پیکسلی طراح دقیقاً همان مقیاس عددی Tailwind است (`p-1` یعنی `calc(var(--spacing) * 1)` و `--spacing` برابر `0.25rem` یا 4px است). پس فاصله‌ها **توکن جدید ندارند** و با کلاس عددی معادل نوشته می‌شوند. این هاردکد حساب نمی‌شود، چون همه از همان متغیر `--spacing` می‌آیند.

**فقط همین ۱۳ عدد مجاز است.** عددهای خارج از این جدول (مثل `p-5`، `gap-7`، `mt-9`) و مقادیر دلخواه (مثل `p-[18px]`) ممنوع هستند. این قانون برای همه‌ی utilityهای فاصله‌ای صدق می‌کند: `p*`، `m*`، `gap*`، `space-*`، `inset*`، `top`/`right`/`bottom`/`left` و `translate-*`.

| نام در دیزاین سیستم | مقدار | عدد Tailwind | کلاس نمونه | کاربرد |
| --- | --- | --- | --- | --- |
| `2xs` | `2px` | `0.5` | `p-0.5`، `gap-0.5` | فواصل بسیار ریز، برچسب‌ها |
| `xs` | `4px` | `1` | `p-1`، `gap-1` | فاصله میکرو، آیکون و متن نزدیک |
| `sm` | `8px` | `2` | `p-2`، `gap-2` | پدینگ دکمه‌های کوچک، فاصله inputها |
| `md` | `12px` | `3` | `p-3`، `gap-3` | فاصله بین آیتم‌های فشرده |
| `base` | `16px` | `4` | `p-4`، `gap-4` | پدینگ پیش‌فرض کارت‌ها و grid |
| `lg` | `24px` | `6` | `p-6`، `gap-6` | پدینگ سکشن‌ها، فاصله ستون‌ها (gutter دسکتاپ) |
| `xl` | `32px` | `8` | `p-8`، `gap-8` | فاصله بین بلاک‌های محتوایی |
| `2xl` | `40px` | `10` | `p-10`، `gap-10` | حاشیه‌های بیرونی تبلت |
| `3xl` | `48px` | `12` | `p-12`، `gap-12` | تفکیک سکشن‌های اصلی |
| `4xl` | `64px` | `16` | `p-16`، `gap-16` | هدرهای بزرگ و فاصله‌های ماکرو |
| `5xl` | `80px` | `20` | `px-20` | margin کناری دسکتاپ |
| `6xl` | `96px` | `24` | `py-24` | سکشن‌های لندینگ |
| `7xl` | `128px` | `32` | `py-32` | فواصل کلان |

`0` (بدون فاصله) و `px` (یک پیکسل، برای borderها) هم مجاز هستند.

---

### سایه‌ها (Shadows)

| نام | توکن | کلاس Tailwind | مقدار | دسته |
| --- | --- | --- | --- | --- |
| Card Shadow | `--shadow-card` | `shadow-card` | `0 2px 12px rgba(0, 0, 0, 0.06)` | B |
| Dropdown Shadow | `--shadow-dropdown` | `shadow-dropdown` | `0 4px 20px rgba(0, 0, 0, 0.08)` | B |
| Modal Shadow | `--shadow-modal` | `shadow-modal` | `0 10px 30px rgba(0, 0, 0, 0.12)` | B |

---

### سیستم گرید و ساختار صفحات (Grid & Layout System)

| دستگاه | ستون‌ها (Columns) | فاصله بین ستون‌ها (Gutter) | مارجین کناری (Margin) | بازه عرض صفحه (Breakpoint) |
| --- | --- | --- | --- | --- |
| دسکتاپ بزرگ (Large Desktop) | ۱۲ ستونه | `24px` | `80px` | `1440px+` |
| دسکتاپ (Desktop) | ۱۲ ستونه | `24px` | `80px` | `1024px – 1439px` |
| تبلت (Tablet) | ۸ ستونه | `16px` | `40px` | `768px – 1023px` |
| موبایل بزرگ (Large Mobile) | ۴ ستونه | `16px` | `16px` | `480px – 767px` |
| موبایل (Mobile) | ۴ ستونه | `16px` | `16px` | `0 – 479px` |

---


## ۶. نحوه‌ی فعال‌سازی

| بخش | کلاس روی wrapper اصلی | نتیجه |
| --- | --- | --- |
| پنل فروشندگان | `theme-new` | استایل گاید جدید در همه‌ی سایزها |
| صفحه‌ای که دسکتاپش کامل ریدیزاین شده | `lg:theme-new` | استایل گاید جدید فقط از `1024px` (`64rem`) به بالا |
| صفحه‌ای که هنوز ریدیزاین نشده | بدون کلاس | دقیقاً همان حالت فعلی |

### پنل فروشندگان

کلاس `theme-new` روی wrapper اصلی layout پنل قرار می‌گیرد، نه روی `body` یا `html`:

```jsx
// src/app/(seller)/seller/layout.jsx
export default function SellerLayout({ children }) {
  return <div className="theme-new min-h-screen">{children}</div>;
}
```

### صفحات فعلی در دسکتاپ

`lg:theme-new` **فقط وقتی** روی wrapper یک صفحه گذاشته می‌شود که دسکتاپ آن صفحه کامل ریدیزاین شده باشد. نیمه‌کاره فعالش نکنید، چون بخش‌های ریدیزاین‌نشده با مقادیر جدید به‌هم‌ریخته دیده می‌شوند.

```jsx
<div className="lg:theme-new">
  <CartPageContent />
</div>
```

**استثنا:** wrapper یک نمای دسکتاپ کاملاً جدید (فایل `XDesktop.jsx` طبق `DESKTOP-REDESIGN-GUIDE.md`) از همان ابتدای توسعه `lg:theme-new` می‌گیرد، چون همه‌ی محتوای داخلش با دیزاین سیستم جدید نوشته می‌شود. بدون آن، radius و خاکستری‌ها حین توسعه مقادیر قدیمی را نشان می‌دهند.

### المنت‌هایی که بیرون از wrapper رندر می‌شوند

هر چیزی که بیرون از wrapper رندر شود، تم جدید را نمی‌گیرد:

- **`AppShells` و `Toaster`** در `src/app/layout.jsx` بیرون از `children` رندر می‌شوند.
- **`MainNavigation` و `SearchBox`** داخل `MainLayout` هستند، نه داخل صفحه. اگر wrapper روی محتوای صفحه باشد، این‌ها تم را نمی‌گیرند و برای ریدیزاینشان باید `lg:theme-new` جداگانه روی خودشان گذاشته شود.
- **Portalها** (بخش ۸).

---

## ۷. قوانین نوشتن کامپوننت‌ها

### فایل‌های مشترک (موبایل و دسکتاپ)

منظور هر فایلی است که در موبایل هم رندر می‌شود: همه‌ی `components/ui/*`، `components/layout/*` و ماژول‌های فعلی در `components/modules/*`.

1. **هر کلاسی که مخصوص استایل گاید جدید است فقط با `lg:` نوشته شود.**

   ```jsx
   // Correct
   <div className="bg-white lg:bg-surface lg:shadow-card">

   // Wrong: changes mobile
   <div className="bg-surface">
   ```

2. **کلاس‌های بدون prefix را برای تغییر دسکتاپ عوض نکنید.** کلاس بدون prefix متعلق به موبایل است. اگر دسکتاپ مقدار دیگری لازم دارد، نسخه‌ی `lg:` را اضافه کنید یا عوض کنید.
3. کلاس‌های دسته‌ی A (مثل `bg-primary`) نیازی به `lg:` ندارند. خودشان زیر `lg:theme-new` مقدار جدید را می‌گیرند.
4. اگر ساختار دسکتاپ یک بخش با موبایل فرق دارد، طبق الگوی `DESKTOP-REDESIGN-GUIDE.md` منطق به hook می‌رود و دو نمای جدا ساخته می‌شود (`XMobile.jsx` و `XDesktop.jsx`) که با `lg:hidden` و `hidden lg:block` نمایش داده می‌شوند. از تشخیص سایز با JavaScript (مثل `window.innerWidth`) برای تغییر ظاهر استفاده نکنید، چون SSR را خراب می‌کند.

### فایل‌های مخصوص پنل فروشندگان

فایل‌های `components/modules/seller-panel/*` فقط داخل `theme-new` رندر می‌شوند، پس کلاس‌های استایل گاید جدید را می‌شود **بدون** `lg:` نوشت. اگر فایلی از این ماژول بعداً در صفحات عمومی استفاده شد، باید به قوانین فایل‌های مشترک برگردد.

### گسترش کامپوننت‌های `ui/`

اگر یک کامپوننت `ui/` در استایل گاید جدید ظاهر متفاوتی دارد:

- کامپوننت را **کپی نکنید.**
- یک `variant` یا prop جدید اضافه کنید که **مقدار پیش‌فرضش رفتار فعلی** باشد.
- یا تغییرات را فقط با کلاس‌های `lg:` اعمال کنید، اگر برای پنل در موبایل لازم نیست.

```jsx
function Button({ variant = "default", className, ...props }) {
  const variants = {
    default: "...", // current behavior, unchanged
    seller: "...", // new style guide
  };
  // ...
}
```

---

## ۸. Portalها

این کامپوننت‌ها محتوایشان را به `body` منتقل می‌کنند و از wrapper بیرون می‌افتند، پس `theme-new` به آن‌ها نمی‌رسد:

| کامپوننت | فایل | روش اعمال تم |
| --- | --- | --- |
| `DialogContent` | `ui/dialog/Dialog.jsx` | `className` + `overlayClassName` |
| `DrawerContent` | `ui/drawer/Drawer.jsx` | `className` + `overlayClassName` |
| `PopoverContent` | `ui/popover/Popover.jsx` | `className` |
| `DropdownMenuContent` | `ui/dropdown-menu/DropdownMenu.jsx` | `className` |
| `ContextMenuContent` | `ui/context-menu/CustomContextMenu.jsx` | `className` |
| `MessageContextMenu` | `ui/MessageContextMenu.jsx` | با `createPortal` رندر می‌شود؛ قبل از استفاده در بخش جدید بررسی شود |

همان کلاسی که wrapper دارد را به Portal هم بدهید:

```jsx
// Inside seller panel
<DialogContent className="theme-new" overlayClassName="theme-new">

// Inside a redesigned desktop page
<DialogContent className="lg:theme-new" overlayClassName="lg:theme-new">
```

---

## ۹. فونت

در `globals.css` فونت مستقیم روی `*` تنظیم شده است:

```css
* {
  font-family: Dana;
}
```

چون روی **هر** المنت جداگانه تنظیم می‌شود، override کردن متغیر فونت داخل `theme-new` اثری ندارد.

- اگر فونت استایل گاید جدید **همان Dana** است: کاری لازم نیست.
- اگر فونت **متفاوت** است: آن خط باید به متغیر تبدیل شود. این تغییر خروجی موبایل را عوض نمی‌کند، چون مقدار پیش‌فرض همان Dana می‌ماند:

  ```css
  /* globals.css */
  * {
    font-family: var(--font-dana);
  }
  ```

  ```css
  /* theme-new.css */
  @utility theme-new {
    --font-dana: NewFont;
  }
  ```

  فایل‌های فونت جدید باید در `public/assets/fonts/` قرار بگیرند و در `style.css` همان پوشه تعریف شوند.

---

## ۱۰. ممنوع‌ها

- ❌ هر selector روی `:root`، `html`، `body` یا `*` در `theme-new.css`.
- ❌ تغییر مقادیر `:root` یا `@theme` فعلی در `globals.css`.
- ❌ تعریف دوباره‌ی یک توکن موجود در `@theme` داخل `theme-new.css` (توکن دسته‌ی A فقط داخل `@utility theme-new`).
- ❌ اسم‌هایی مثل `primary-v2`، `seller-primary` یا `desktop-gray`.
- ❌ کلاس‌های دسته‌ی B بدون `lg:` در فایل‌های مشترک.
- ❌ تغییر کلاس‌های بدون prefix (کلاس‌های موبایل) برای ریدیزاین دسکتاپ.
- ❌ media query جدید با breakpoint دیگر؛ فقط `lg` (`64rem`).
- ❌ تشخیص موبایل یا دسکتاپ با JavaScript برای تغییر ظاهر.
- ❌ گذاشتن `theme-new` روی `body` یا `html`.
- ❌ پاک کردن `--theme-new: 1;` از `@utility theme-new`.
- ❌ فعال کردن `lg:theme-new` روی صفحه‌ای که ریدیزاینش نیمه‌کاره است.
- ❌ تعریف توکن `--spacing-*`، یا `--container-*` با اسم‌های مقیاس Tailwind (`xs`، `sm`، `md`، `lg`، `xl`، `2xl` ...).

---

## ۱۱. چک‌لیست ریدیزاین دسکتاپ هر صفحه

چک‌لیست کامل و مرحله‌به‌مرحله در `DESKTOP-REDESIGN-GUIDE.md` است. خلاصه:

- [ ] توکن‌های لازم این صفحه در `theme-new.css` وجود دارند.
- [ ] همه‌ی تغییرات فایل‌های مشترک فقط در کلاس‌های `lg:` هستند.
- [ ] `lg:theme-new` روی wrapper نمای دسکتاپ یا صفحه گذاشته شده است.
- [ ] Portalهای این صفحه (`Dialog`، `Drawer`، `Popover` ...) هم `lg:theme-new` گرفته‌اند.
- [ ] Navigation و SearchBox در صورت ریدیزاین، `lg:theme-new` جداگانه دارند.
- [ ] صفحه در عرض `1023px` (موبایل) و `1024px` (دسکتاپ) بررسی شده است.
- [ ] بررسی `git diff` بخش ۱۲ انجام شده است.

## چک‌لیست هر بخش پنل فروشندگان

- [ ] داخل layout پنل (`theme-new`) رندر می‌شود.
- [ ] Portalها کلاس `theme-new` گرفته‌اند.
- [ ] کامپوننت‌های `ui/` کپی نشده‌اند و در صورت نیاز variant گرفته‌اند.
- [ ] در موبایل و دسکتاپ بررسی شده است.

---

## ۱۲. تور ایمنی موبایل

موبایل فقط از سه راه می‌تواند ناخواسته تغییر کند. در پایان هر کار، هر سه با `git diff` بررسی می‌شوند:

1. **`theme-new.css`:** هر توکن جدید در `@theme` با قوانین بخش ۴ (تداخل اسم) و هشدار `--spacing-*` و `--container-*` چک شود.
2. **فایل‌های مشترک** (`ui/`، `layout/` و ماژول‌های فعلی): در diff این فایل‌ها هیچ کلاس بدون prefix `lg:` نباید اضافه، حذف یا عوض شده باشد. تنها استثنا جابه‌جایی عین‌به‌عین کد در commit refactor است.
3. **فایل‌های `XMobile.jsx`:** بعد از commit refactor، این فایل‌ها نباید در هیچ diff دیگری دیده شوند.

---

## ۱۳. پایان مهاجرت دسکتاپ

وقتی دسکتاپ **همه‌ی** صفحات ریدیزاین شد و همه‌جا `lg:theme-new` دارند، می‌شود (اختیاری) به جای کلاس روی هر صفحه، مقادیر دسته‌ی A را یک بار برای کل دسکتاپ فعال کرد:

```css
/* theme-new.css */
@media (width >= 64rem) {
  :root {
    --color-primary: #2b2170;
  }
}
```

این تنها حالتی است که override روی `:root` مجاز است، آن هم فقط داخل media query دسکتاپ و فقط بعد از تمام شدن کامل مهاجرت. تا آن زمان قانون بخش ۱۰ معتبر است.
