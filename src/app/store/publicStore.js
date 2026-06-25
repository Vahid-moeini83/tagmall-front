import { create } from "zustand";

const usePublicStore = create((set, get) => ({
  // User
  userInfo: {},
  setUserInfo: (newUserInfo) =>
    set((state) => {
      return { ...state, userInfo: newUserInfo };
    }),
  clearUserInfo: () => set({ userInfo: {} }),

  // Token
  token: "",
  setAccessToken: (token) =>
    set((state) => {
      return { ...state, token: token };
    }),
  clearToken: () => set({ token: "" }),

  // Login box
  isLoginOpen: false,
  setLoginOpen: (open) => set({ isLoginOpen: open }),

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

  // Product attributes (for single product page)
  selectedProductAttributes: {},
  setProductAttribute(key, value) {
    set((state) => ({
      selectedProductAttributes: {
        ...state.selectedProductAttributes,
        [key]: value,
      },
    }));
  },
  clearProductAttributes() {
    set({ selectedProductAttributes: {} });
  },

  // Cart items count
  cartItemsCount: 0,
  setCartItemsCount(count) {
    set({ cartItemsCount: count });
  },

  homeProductsListOpen: false,
  setHomeProductsListOpen(open) {
    set({ homeProductsListOpen: open });
  },
  toggleHomeProductsListOpen() {
    set((state) => ({ homeProductsListOpen: !state.homeProductsListOpen }));
  },
}));

export default usePublicStore;
