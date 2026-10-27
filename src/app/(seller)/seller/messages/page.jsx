import { SellerMessages } from "@/components/modules/seller-panel";

export const metadata = {
  title: "مرکز پیام‌ها | پنل فروشندگان تگ مال",
  description: "گفتگوهای فروشگاه با کارشناسان و مشتریان تگ مال",
};

export default function SellerMessagesPage() {
  return <SellerMessages category="experts" />;
}
