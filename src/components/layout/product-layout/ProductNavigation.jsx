"use client";

import { useState } from "react";
import {
  PanelIcon,
  CommentsIcon,
  ExternalLinkIcon,
  ArrowRightIcon,
} from "@/icons";

export default function ProductNavigation() {
  const [activeSection, setActiveSection] = useState("details");

  return (
    <>
      {/* Desktop Navigation - Sidebar */}
      <div className="fixed right-[64px] bottom-[64px] z-10 hidden lg:flex flex-col gap-[16px]">
        <button
          onClick={() => setActiveSection("details")}
          className={`p-[15px] rounded-lg transition-colors ${
            activeSection === "details"
              ? "bg-gray-200 text-primary"
              : "bg-white text-black"
          }`}
        >
          <PanelIcon size={20} color="currentColor" />
        </button>
        <button
          onClick={() => setActiveSection("comments")}
          className={`p-[15px] rounded-lg transition-colors ${
            activeSection === "comments"
              ? "bg-gray-200 text-primary"
              : "bg-white text-black"
          }`}
        >
          <CommentsIcon size={20} color="currentColor" />
        </button>
        <button
          onClick={() => setActiveSection("external")}
          className={`p-[15px] rounded-lg transition-colors ${
            activeSection === "external"
              ? "bg-gray-200 text-primary"
              : "bg-white text-black"
          }`}
        >
          <ExternalLinkIcon size={20} color="currentColor" />
        </button>
        <button
          onClick={() => setActiveSection("back")}
          className={`p-[15px] rounded-lg transition-colors ${
            activeSection === "back"
              ? "bg-gray-200 text-primary"
              : "bg-white text-black"
          }`}
        >
          <ArrowRightIcon size={20} color="currentColor" />
        </button>
      </div>

      {/* Mobile Navigation - Bottom Bar */}
      <div className="fixed bottom-[16px] left-[10px] right-[10px] z-10 lg:hidden bg-white rounded-lg p-[10px] flex justify-around items-center">
        <button
          onClick={() => setActiveSection("details")}
          className={`p-[10px] rounded-lg transition-colors ${
            activeSection === "details" ? "text-primary" : "text-black"
          }`}
        >
          <PanelIcon size={20} color="currentColor" />
        </button>
        <button
          onClick={() => setActiveSection("comments")}
          className={`p-[10px] rounded-lg transition-colors ${
            activeSection === "comments" ? "text-primary" : "text-black"
          }`}
        >
          <CommentsIcon size={20} color="currentColor" />
        </button>
        <button
          onClick={() => setActiveSection("external")}
          className={`p-[10px] rounded-lg transition-colors ${
            activeSection === "external" ? "text-primary" : "text-black"
          }`}
        >
          <ExternalLinkIcon size={20} color="currentColor" />
        </button>
        <button
          onClick={() => setActiveSection("back")}
          className={`p-[10px] rounded-lg transition-colors ${
            activeSection === "back" ? "text-primary" : "text-black"
          }`}
        >
          <ArrowRightIcon size={20} color="currentColor" />
        </button>
      </div>
    </>
  );
}
