"use client";

import { useEffect, useRef } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import usePublicStore from "@/app/store/publicStore";
import { dismissConversationHistory } from "../utils/conversation";
import SupportSingleChat from "./SupportSingleChat";

function ConversationShell() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const conversationOpen = usePublicStore((s) => s.conversationOpen);
  const activeConversation = usePublicStore((s) => s.activeConversation);
  const closeConversation = usePublicStore((s) => s.closeConversation);
  const closingFromUiRef = useRef(false);

  const handleClose = () => {
    if (closingFromUiRef.current) return;

    closeConversation();

    const result = dismissConversationHistory();
    // history.back() will fire popstate; ignore that duplicate close
    if (result === "back") {
      closingFromUiRef.current = true;
    }
  };

  // System / browser back: only close the chat overlay (URL already restored)
  useEffect(() => {
    if (!conversationOpen) return;

    const onPopState = () => {
      if (closingFromUiRef.current) {
        closingFromUiRef.current = false;
        return;
      }
      closeConversation();
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [conversationOpen, closeConversation]);

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
