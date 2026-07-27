"use client";

import { Suspense } from "react";
import { ReceiptDeliveryShell } from "@/components/modules/receipt";
import { ConversationShell } from "@/components/modules/support";
import AuthLoginGate from "@/components/layout/AuthLoginGate";

function AppShellsContent() {
  return (
    <>
      <AuthLoginGate />
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
