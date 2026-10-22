import { SellerSidebar } from "@/components/modules/seller-panel";

export const metadata = {
  title: "پنل فروشندگان | تگ مال",
  description: "پنل مدیریت فروشگاه و پیشخوان فروشندگان تگ مال",
};


export default function SellerLayout({ children }) {
  return (
    <div className="theme-new min-h-screen bg-[#f3f4f6] text-[#1a1a2e] flex flex-col lg:flex-row">
      {/* Sidebar navigation (renders on right side in RTL) */}
      <SellerSidebar />

      {/* Main page content area (renders on left side in RTL) */}
      <main className="flex-1 min-w-0 flex flex-col">{children}</main>
    </div>
  );
}
