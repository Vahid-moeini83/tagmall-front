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
  const { homePageRes, homePageErr } = await getHomePageData(31, 53, 800);

  console.log(homePageRes);

  return (
    <MainLayout>
      <Suspense fallback={<div className="w-full h-screen bg-gray-100" />}>
        <MainHome initialData={homePageRes?.data} />
      </Suspense>
    </MainLayout>
  );
}
