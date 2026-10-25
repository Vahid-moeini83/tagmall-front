import { notFound } from "next/navigation";
import { SellerMessages } from "@/components/modules/seller-panel";
import { MESSAGE_SECTIONS } from "@/components/modules/seller-panel/data/messageSections";

export async function generateMetadata({ params }) {
  const { category } = await params;
  const section = MESSAGE_SECTIONS.find((item) => item.id === category);
  return { title: `${section?.label || "پیام‌ها"} | پنل فروشندگان تگ مال` };
}

export default async function SellerMessageCategoryPage({ params }) {
  const { category } = await params;
  if (!MESSAGE_SECTIONS.some((item) => item.id === category)) notFound();
  return <SellerMessages key={category} category={category} />;
}
