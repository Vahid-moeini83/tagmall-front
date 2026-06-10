"use client";

import { useRef, useState, useEffect } from "react";
import {
  PanelIcon,
  CommentsIcon,
  ShareIcon,
  StrokeArrowLeftIcon,
} from "@/icons";
import { useRouter } from "next/navigation";

const sectionButtons = [
  {
    id: "details",
    icon: <PanelIcon size={20} color="currentColor" />,
  },
  {
    id: "specsAndComments",

    icon: <CommentsIcon size={20} color="currentColor" />,
  },
  {
    id: "partnership",
    icon: <ShareIcon size={20} color="currentColor" />,
  },
];

export default function ProductNavigation({ activeSection, setActiveSection }) {
  const buttonRefs = useRef({});
  const navContainerRef = useRef(null);
  const [mobileIndicatorStyle, setMobileIndicatorStyle] = useState({});
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  // Update indicator position for mobile
  useEffect(() => {
    const activeButton = buttonRefs.current[activeSection];
    const container = navContainerRef.current;

    if (activeButton && container) {
      const buttonRect = activeButton.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const left = buttonRect.left - containerRect.left;
      const top = buttonRect.top - containerRect.top;

      setMobileIndicatorStyle({
        left: `${left}px`,
        top: `${top}px`,
        opacity: 1,
      });
    }
  }, [activeSection]);

  return (
    <>
      {/* Desktop Navigation - Sidebar */}
      <div className="fixed right-[60px] bottom-[64px] z-10 hidden lg:flex flex-col gap-[16px]">
        {sectionButtons.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`p-[15px] rounded-lg transition-colors ${
              activeSection === section.id
                ? "bg-gray-200 text-primary"
                : "bg-white text-black"
            }`}
          >
            {section.icon}
          </button>
        ))}
        {/* Back button */}
        <button
          onClick={handleGoBack}
          className={`p-[15px] rounded-lg transition-colors`}
        >
          <StrokeArrowLeftIcon
            size={20}
            className="rotate-180 cursor-pointer"
          />
        </button>
      </div>

      {/* Mobile Navigation - Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 lg:hidden bg-white p-[10px] shadow-md border-t border-gray-200">
        <nav
          ref={navContainerRef}
          className="flex justify-around items-center w-full relative"
        >
          {/* Animated background indicator */}
          <div
            className="absolute w-12 h-12 bg-gray-200 rounded-lg transition-all duration-300 ease-in-out pointer-events-none"
            style={mobileIndicatorStyle}
          />
          {sectionButtons.map((section) => (
            <button
              key={section.id}
              ref={(el) => (buttonRefs.current[section.id] = el)}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors z-10 ${
                activeSection === section.id ? "text-primary" : "text-black"
              }`}
            >
              {section.icon}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
