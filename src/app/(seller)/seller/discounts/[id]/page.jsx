import { notFound } from "next/navigation";
import { SellerCampaignEditor } from "@/components/modules/seller-panel";
import { CAMPAIGN_PRODUCTS } from "@/components/modules/seller-panel/data/campaigns";

export const metadata = { title: "مشاهده و درخواست ویرایش کمپین | تگ مال" };

export default async function CampaignDetailPage({ params }) {
  const { id } = await params;
  if (!CAMPAIGN_PRODUCTS.some((product) => product.id === id)) notFound();
  return <SellerCampaignEditor initialMode="combined" readOnly />;
}
