import { create } from "zustand";

const usePublicStore = create((set, get) => ({
  // User
  userInfo: {},
  setUserInfo: (newUserInfo) =>
    set((state) => {
      return { ...state, userInfo: newUserInfo };
    }),

  // Token
  token: "",
  setAccessToken: (token) =>
    set((state) => {
      return { ...state, accessToken: token };
    }),

  // Home filter: at least one of special/visit must be true (responsive + desktop)
  homeFilterSpecial: true,
  homeFilterVisit: true,

  setHomeFilterSpecial(checked) {
    const { homeFilterVisit } = get();
    if (!checked && !homeFilterVisit) return;
    set({ homeFilterSpecial: checked });
  },

  setHomeFilterVisit(checked) {
    const { homeFilterSpecial } = get();
    if (!checked && !homeFilterSpecial) return;
    set({ homeFilterVisit: checked });
  },

  setHomeFilterMode(mode) {
    if (mode === "all") set({ homeFilterSpecial: true, homeFilterVisit: true });
    else if (mode === "special")
      set({ homeFilterSpecial: true, homeFilterVisit: false });
    else if (mode === "visit")
      set({ homeFilterSpecial: false, homeFilterVisit: true });
  },

  homeFilterPopoverOpen: false,
  setHomeFilterPopoverOpen(open) {
    set({ homeFilterPopoverOpen: open });
  },

  // Search box state
  searchValue: "",
  setSearchValue(value) {
    set({ searchValue: value });
  },

  searchBoxOpen: false,
  setSearchBoxOpen(open) {
    set({ searchBoxOpen: open });
  },

  // Search result box state
  showSearchResultBox: false,
  searchResultData: null,
  setShowSearchResultBox(show, data = null) {
    set({ showSearchResultBox: show, searchResultData: data });
  },
}));

export default usePublicStore;
