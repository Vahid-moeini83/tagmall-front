"use client";

import { useMainHome } from "@/hooks/useMainHome";
import MainHomeDesktop from "./desktop/MainHomeDesktop";
import MainHomeMobile from "./MainHomeMobile";

export default function MainHome({ initialData }) {
  const homeMain = useMainHome(initialData);

  return (
    <>
      <MainHomeDesktop initialData={initialData} homeMain={homeMain} />
      <MainHomeMobile initialData={initialData} homeMain={homeMain} />
    </>
  );
}
