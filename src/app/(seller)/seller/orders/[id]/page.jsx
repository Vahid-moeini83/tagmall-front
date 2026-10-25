import { SellerOrderDetail } from "@/components/modules/seller-panel";

export const metadata = {
  title: "جزئیات سفارش | پنل فروشندگان تگ مال",
  description: "مشاهده جزئیات سفارش در پنل فروشندگان تگ مال",
};

export default async function SellerOrderDetailPage({ params }) {
  const { id } = await params;

  return <SellerOrderDetail orderId={decodeURIComponent(id)} />;
}
