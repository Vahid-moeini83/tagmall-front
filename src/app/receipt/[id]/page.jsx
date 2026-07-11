"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import usePublicStore from "@/app/store/publicStore";
import { defaultReceiptData } from "@/lib/client/receiptData";

export default function ReceiptPage() {
  const router = useRouter();
  const openReceiptDrawer = usePublicStore((s) => s.openReceiptDrawer);

  useEffect(() => {
    openReceiptDrawer(defaultReceiptData);
    router.replace("/");
  }, [openReceiptDrawer, router]);

  return null;
}
