import { SellerCampaignEditor } from "@/components/modules/seller-panel";

export const metadata = { title: "ایجاد کمپین فروش | تگ مال" };

export default async function NewCampaignPage({ searchParams }) {
  const { mode } = await searchParams;
  return (
    <SellerCampaignEditor
      initialMode={["special", "combined"].includes(mode) ? mode : "campaign"}
    />
  );
}
