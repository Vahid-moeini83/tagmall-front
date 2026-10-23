"use client";

import { createContext, useContext, useState, useMemo } from "react";

const SellerNavigationContext = createContext(null);

export function SellerNavigationProvider({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  const value = useMemo(
    () => ({
      mobileSidebarOpen,
      setMobileSidebarOpen,
      toggleMobileSidebar,
      closeMobileSidebar,
    }),
    [mobileSidebarOpen]
  );

  return (
    <SellerNavigationContext.Provider value={value}>
      {children}
    </SellerNavigationContext.Provider>
  );
}

export function useSellerNavigation() {
  const context = useContext(SellerNavigationContext);
  if (!context) {
    throw new Error(
      "useSellerNavigation must be used within a SellerNavigationProvider"
    );
  }
  return context;
}
