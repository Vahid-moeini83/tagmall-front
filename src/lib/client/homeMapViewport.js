/**
 * Home map viewport helpers — compute API fetch center/radius from the
 * map area the user can actually see (device-aware, desktop sidebar-aware).
 */

/** Matches Tailwind `lg` — desktop slider layout starts here. */
export const HOME_DESKTOP_BREAKPOINT_PX = 1024;

/** Matches Tailwind `xl` — wider slider ratio on large screens. */
export const HOME_XL_BREAKPOINT_PX = 1280;

/** Slider width ratios — keep in sync with MainHome sidebar classes. */
const SLIDER_WIDTH_RATIO_LG = 0.4;
const SLIDER_WIDTH_RATIO_XL = 0.44;

/** `max-w-200` on the desktop slider panel (50rem). */
const SLIDER_MAX_WIDTH_PX = 800;

/** `lg:mr-24` reserved for the right navigation rail. */
const NAV_RAIL_WIDTH_PX = 96;

/** Shrink radius slightly so edge stores outside the visible frame are excluded. */
export const MAP_RADIUS_REDUCTION_FACTOR = 0.96;

export function isDesktopMapLayout(viewportWidth = window.innerWidth) {
  return viewportWidth >= HOME_DESKTOP_BREAKPOINT_PX;
}

/**
 * Width (px) of the map covered by the desktop slider + nav rail.
 * Mirrors `lg:w-[40%] xl:w-[44%] max-w-200 lg:mr-24` in MainHome.
 */
export function getDesktopObscuredMapWidth(viewportWidth = window.innerWidth) {
  const sliderRatio =
    viewportWidth >= HOME_XL_BREAKPOINT_PX
      ? SLIDER_WIDTH_RATIO_XL
      : SLIDER_WIDTH_RATIO_LG;
  const sliderWidth = Math.min(viewportWidth * sliderRatio, SLIDER_MAX_WIDTH_PX);

  return sliderWidth + NAV_RAIL_WIDTH_PX;
}

/**
 * Return API fetch params `{ lat, lng, radiusKm }` for the visible map region.
 * Mobile: full map container. Desktop: left portion not covered by the slider.
 */
export function getVisibleMapFetchArea(map) {
  const mapSize = map.getSize();
  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : mapSize.x;

  if (!isDesktopMapLayout(viewportWidth)) {
    const center = map.getCenter();
    const northEast = map.getBounds().getNorthEast();
    const distanceMeters = center.distanceTo(northEast);

    return {
      lat: center.lat,
      lng: center.lng,
      radiusKm: Math.ceil(
        (distanceMeters / 1000) * MAP_RADIUS_REDUCTION_FACTOR,
      ),
    };
  }

  const obscuredWidth = getDesktopObscuredMapWidth(viewportWidth);
  const visibleWidth = Math.max(mapSize.x - obscuredWidth, mapSize.x * 0.35);

  const centerPoint = map.containerPointToLatLng([
    visibleWidth / 2,
    mapSize.y / 2,
  ]);

  const cornerPoints = [
    [0, 0],
    [visibleWidth, 0],
    [0, mapSize.y],
    [visibleWidth, mapSize.y],
  ];

  let maxDistanceMeters = 0;
  cornerPoints.forEach(([x, y]) => {
    const cornerLatLng = map.containerPointToLatLng([x, y]);
    const distance = centerPoint.distanceTo(cornerLatLng);
    if (distance > maxDistanceMeters) {
      maxDistanceMeters = distance;
    }
  });

  return {
    lat: centerPoint.lat,
    lng: centerPoint.lng,
    radiusKm: Math.ceil(
      (maxDistanceMeters / 1000) * MAP_RADIUS_REDUCTION_FACTOR,
    ),
  };
}
