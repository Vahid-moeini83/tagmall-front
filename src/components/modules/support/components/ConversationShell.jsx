"use client";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import usePublicStore from "@/app/store/publicStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SupportSingleChat from "./SupportSingleChat";

function ConversationShell() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const conversationOpen = usePublicStore((s) => s.conversationOpen);
  const activeConversation = usePublicStore((s) => s.activeConversation);
  const closeConversation = usePublicStore((s) => s.closeConversation);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClose = () => {
    closeConversation();

    if (pathname === "/support" && searchParams.get("conversationId")) {
      const tab = searchParams.get("tab");
      router.replace(tab ? `/support?tab=${tab}` : "/support", {
        scroll: false,
      });
    }
  };

  if (!conversationOpen || !activeConversation) return null;

  if (isDesktop) {
    return (
      <div className="fixed inset-0 z-1000 bg-white h-screen">
        <SupportSingleChat
          setIsOpen={handleClose}
          conversation={activeConversation}
        />
      </div>
    );
  }

  return (
    <Drawer
      open={conversationOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      dismissible
      shouldScaleBackground={false}
    >
      <DrawerContent
        className="z-100! px-[10px] h-[96%]! fixed!"
        overlayClassName="z-100 lg:hidden"
      >
        <SupportSingleChat
          setIsOpen={handleClose}
          conversation={activeConversation}
        />
      </DrawerContent>
    </Drawer>
  );
}

export default ConversationShell;
