/**
 * Shared map defaults for the home page.
 * SSR uses the same center + an estimated radius so the first paint matches
 * the client map viewport before Leaflet computes the exact radius.
 */
export const HOME_MAP_INITIAL_CENTER = {
  lat: 31.1,
  lng: 53.5,
};

export const HOME_MAP_INITIAL_ZOOM = 13;

/** Conservative mobile radius for zoom 13 — desktop refetches left-visible bounds on mount. */
export const HOME_MAP_SSR_RADIUS_KM = 12;
