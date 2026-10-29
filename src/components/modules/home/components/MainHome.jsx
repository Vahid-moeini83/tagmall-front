"use client";

import { useMainHome } from "@/hooks/useMainHome";
import MainHomeMobile from "./MainHomeMobile";

export default function MainHome({ initialData }) {
  const homeMain = useMainHome(initialData);

  return <MainHomeMobile initialData={initialData} homeMain={homeMain} />;
}
