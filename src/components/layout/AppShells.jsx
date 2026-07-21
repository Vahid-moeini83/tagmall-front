"use client";

import { Suspense } from "react";
import { ReceiptDeliveryShell } from "@/components/modules/receipt";
import { ConversationShell } from "@/components/modules/support";

function AppShellsContent() {
  return (
    <>
      <ReceiptDeliveryShell />
      <ConversationShell />
    </>
  );
}

function AppShells() {
  return (
    <Suspense fallback={null}>
      <AppShellsContent />
    </Suspense>
  );
}

export default AppShells;
