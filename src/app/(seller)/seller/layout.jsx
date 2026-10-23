import {
  SellerSidebar,
  SellerBottomNav,
  SellerNavigationProvider,
} from "@/components/modules/seller-panel";

export const metadata = {
  title: "پنل فروشندگان | تگ مال",
  description: "پنل مدیریت فروشگاه و پیشخوان فروشندگان تگ مال",
};


export default function SellerLayout({ children }) {
  return (
    <SellerNavigationProvider>
      <div className="theme-new min-h-screen bg-surface-muted text-text-primary flex flex-col lg:flex-row">
        {/* Sidebar navigation (renders on right side in RTL on desktop, top bar + drawer on mobile) */}
        <SellerSidebar />

        {/* Main page content area (renders on left side in RTL) */}
        <main className="flex-1 min-w-0 flex flex-col">{children}</main>

        {/* Mobile fixed bottom navigation bar (Figma PWA 44:39566) */}
        <SellerBottomNav />
      </div>
    </SellerNavigationProvider>
  );
}
