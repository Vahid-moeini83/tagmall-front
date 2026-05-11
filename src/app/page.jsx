import { Suspense } from "react";
import MainLayout from "@/components/layout/main-layout";
import { MainHome } from "@/components/modules/home";
import { getHomePageData } from "@/lib/server/actions/home";

export const metadata = {
  title: "60750292",
  other: {
    enamad: "60750292",
  },
};

export default async function Home() {
  // Get initial data according to location info
  const { homePageRes, homePageErr } = await getHomePageData(35.73, 51.42, 800);

  console.log("HOME RES: ", homePageRes);

  return (
    <MainLayout>
      <Suspense fallback={<div className="w-full h-screen bg-gray-100" />}>
        <MainHome initialStores={homePageRes} />
      </Suspense>
    </MainLayout>
  );
}
