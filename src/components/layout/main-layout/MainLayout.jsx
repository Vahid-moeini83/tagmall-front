"use client";

import { SearchBox } from "@/components/ui/search";
import usePublicStore from "@/app/store/publicStore";
import MainNavigation from "../navigation-menu";

function MainLayout({ children }) {
  const searchBoxOpen = usePublicStore((s) => s.searchBoxOpen);
  const setSearchBoxOpen = usePublicStore((s) => s.setSearchBoxOpen);

  return (
    <div
      id="scroll-root"
      className="flex flex-col h-screen overflow-hidden lg:min-h-screen lg:overflow-visible lg:flex-row"
    >
      <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>
      <MainNavigation isHomePage={true} />
      <SearchBox
        isOpen={searchBoxOpen}
        onClose={() => setSearchBoxOpen(false)}
        isHomePage={true}
      />
    </div>
  );
}

export default MainLayout;
