import { Suspense } from "react";
import MainLayout from "@/components/layout/main-layout";
import { MainHome } from "@/components/modules/home";
import { getHomePageData } from "@/lib/server/actions/home";
import {
  HOME_MAP_INITIAL_CENTER,
  HOME_MAP_SSR_RADIUS_KM,
} from "@/lib/constants/homeMap";

export const metadata = {
  title: "60750292",
  other: {
    enamad: "60750292",
  },
};

export default async function Home() {
  const { homePageRes } = await getHomePageData(
    HOME_MAP_INITIAL_CENTER.lat,
    HOME_MAP_INITIAL_CENTER.lng,
    HOME_MAP_SSR_RADIUS_KM,
  );

  return (
    <MainLayout>
      <Suspense fallback={<div className="w-full h-screen bg-gray-100" />}>
        <MainHome initialData={homePageRes?.data} />
      </Suspense>
    </MainLayout>
  );
}
