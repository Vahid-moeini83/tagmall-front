"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
}

export default function useSellerProfileSection() {
  return useSyncExternalStore(
    subscribe,
    () => window.location.hash.slice(1) || "details",
    () => "details",
  );
}
