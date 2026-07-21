"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import Image from "next/image";
import toast from "react-hot-toast";
import { SellerMarker, UserMarker } from "@/components/ui/markers";
import { GPSIcon } from "@/icons";
import usePublicStore from "@/app/store/publicStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  HOME_MAP_INITIAL_CENTER,
  HOME_MAP_INITIAL_ZOOM,
} from "@/lib/constants/homeMap";
import {
  getVisibleMapFetchArea,
  isDesktopMapLayout,
} from "@/lib/client/homeMapViewport";

const CUSTOM_TILE_URL =
  "https://api.neshan.org/tile/raster/basemap/{z}/{x}/{y}?style=neshan&Api-key=service.cfd22467b9064762be3c1beec3756c47";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM contributors</a>';

// Mobile GPS sits 5px above drawer (40px button + 5px gap); visible only when drawer is closed
const MOBILE_GPS_ABOVE_DRAWER_CLASS =
  "absolute left-4 -top-[45px] z-1001 hidden group-data-[drawer-closed]/home-drawer:block";

function normalizeStoreId(id) {
  return id == null ? null : String(id);
}

function MapComponent({
  activeSellerId,
  onSellerSelect,
  onMapReady,
  sellers,
  onMapMove,
  skipInitialAreaFetch = false,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const markerRootsRef = useRef([]);
  const sellerDataRef = useRef([]);
  const prevVisibleSellerIdsRef = useRef(null);
  const userMarkerRef = useRef(null);
  const userMarkerRootRef = useRef(null);
  const watchIdRef = useRef(null);
  const LRef = useRef(null);
  const isProgrammaticMoveRef = useRef(false);
  const mapMoveDebounceRef = useRef(null);
  const onMapMoveRef = useRef(onMapMove);
  const sellersRef = useRef(sellers);
  const activeSellerIdRef = useRef(activeSellerId);
  const skipInitialAreaFetchRef = useRef(skipInitialAreaFetch);

  const [isGpsEnabled, setIsGpsEnabled] = useState(false);
  const [userPosition, setUserPosition] = useState(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);

  const longPressTimerRef = useRef(null);
  const gpsButtonLongPressTimerRef = useRef(null);
  const isLongPressTriggeredRef = useRef(false);
  const isGpsEnabledRef = useRef(false);

  const isSearchBoxOpen = usePublicStore((s) => s.searchBoxOpen);
  const isSmUp = useMediaQuery("(min-width: 640px)");
  const [homeDrawerEl, setHomeDrawerEl] = useState(null);

  // Keep latest callbacks without re-attaching map listeners
  useEffect(() => {
    onMapMoveRef.current = onMapMove;
  }, [onMapMove]);

  useEffect(() => {
    sellersRef.current = sellers;
  }, [sellers]);

  useEffect(() => {
    activeSellerIdRef.current = activeSellerId;
  }, [activeSellerId]);

  useEffect(() => {
    skipInitialAreaFetchRef.current = skipInitialAreaFetch;
  }, [skipInitialAreaFetch]);

  // Attach mobile GPS to the home drawer so it moves with drawer transform
  useEffect(() => {
    if (isSmUp) {
      setHomeDrawerEl(null);
      return;
    }

    let retryId = 0;
    const bindDrawer = () => {
      const el = document.querySelector("[data-home-products-drawer]");
      setHomeDrawerEl(el);
      if (!el) {
        retryId = window.setTimeout(bindDrawer, 100);
      }
    };

    bindDrawer();
    return () => window.clearTimeout(retryId);
  }, [isSmUp]);

  const resetMapView = () => {
    if (!mapRef.current) return;
    isProgrammaticMoveRef.current = true;
    mapRef.current.flyTo([35.73, 51.42], 13, {
      animate: true,
      duration: 1.5,
    });
  };

  // Pan with desktop offset so the marker stays visible beside the sidebar
  const panToWithDesktopOffset = (map, latLng) => {
    if (!LRef.current) return;
    const L = LRef.current;

    const isDesktop = isDesktopMapLayout();
    if (isDesktop) {
      const targetLatLng =
        latLng instanceof L.LatLng
          ? latLng
          : new L.LatLng(latLng.lat, latLng.lng);
      const centerPoint = map.latLngToContainerPoint(map.getCenter());
      const targetPoint = map.latLngToContainerPoint(targetLatLng);
      const diffX = centerPoint.x - targetPoint.x;
      const shiftAmount = map.getSize().x * 0.5;
      const newCenterPoint = L.point(
        targetPoint.x - diffX + shiftAmount,
        targetPoint.y,
      );
      const newCenterLatLng = map.containerPointToLatLng(newCenterPoint);
      map.panTo(newCenterLatLng, { animate: true, duration: 1.0 });
    } else {
      const ll = latLng?.lat != null ? [latLng.lat, latLng.lng] : latLng;
      map.panTo(ll, { animate: true, duration: 1.0 });
    }
  };

  // Fly to a store — reads sellersRef so programmatic moves always use fresh data
  const panToSeller = (storeId) => {
    if (!mapRef.current || !LRef.current) return;
    const L = LRef.current;

    const seller = sellersRef.current.find(
      (s) => normalizeStoreId(s.storeId) === normalizeStoreId(storeId),
    );
    if (!seller) return;
    const map = mapRef.current;
    const targetLatLng = new L.LatLng(seller.location.lat, seller.location.lng);
    const isDesktop = isDesktopMapLayout();

    isProgrammaticMoveRef.current = true;

    if (isDesktop) {
      const targetZoom = 15;
      const targetPoint = map.project(targetLatLng, targetZoom);
      const shiftAmount = map.getSize().x * 0.25;
      const shiftedPoint = L.point(targetPoint.x + shiftAmount, targetPoint.y);
      const shiftedLatLng = map.unproject(shiftedPoint, targetZoom);
      map.flyTo(shiftedLatLng, targetZoom, { animate: true, duration: 1.0 });
    } else {
      map.flyTo(targetLatLng, 15, { animate: true, duration: 1.0 });
    }
  };

  const buildSellerIcon = (seller, isActive) => {
    if (!LRef.current) return { icon: null, root: null, container: null };
    const L = LRef.current;

    const container = document.createElement("div");
    const root = createRoot(container);
    root.render(<SellerMarker seller={seller} isActive={isActive} />);
    const iconSize = seller.hasSpecialSale ? [48, 52] : [12, 12];
    const iconAnchor = seller.hasSpecialSale ? [24, 52] : [6, 6];
    const icon = L.divIcon({
      className: "custom-marker",
      html: container,
      iconSize,
      iconAnchor,
    });
    return { icon, root, container };
  };

  // Re-render marker React trees in place — avoids Leaflet setIcon flicker
  const syncMarkerActiveState = () => {
    markerRootsRef.current.forEach((root, i) => {
      const seller = sellerDataRef.current[i];
      if (!root || !seller) return;
      root.render(
        <SellerMarker
          seller={seller}
          isActive={
            normalizeStoreId(seller.storeId) ===
            normalizeStoreId(activeSellerIdRef.current)
          }
        />,
      );
    });
  };

  // Create or update store markers for every seller in the current region
  const addMarkers = () => {
    if (!mapRef.current || !LRef.current) return;
    const L = LRef.current;
    const map = mapRef.current;

    const visibleStoreIds = new Set(sellers.map((s) => s.storeId));
    const prevIds = prevVisibleSellerIdsRef.current;
    const sameSet =
      prevIds &&
      prevIds.size === visibleStoreIds.size &&
      [...visibleStoreIds].every((id) => prevIds.has(id));

    if (sameSet && markersRef.current.length > 0) {
      syncMarkerActiveState();
      return;
    }

    prevVisibleSellerIdsRef.current = visibleStoreIds;

    markerRootsRef.current.forEach((root) => {
      if (root) {
        setTimeout(() => root.unmount(), 0);
      }
    });
    markerRootsRef.current = [];
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];
    sellerDataRef.current = [];

    sellers.forEach((seller) => {
      const isActive =
        normalizeStoreId(seller.storeId) === normalizeStoreId(activeSellerId);
      const { icon, root } = buildSellerIcon(seller, isActive);
      markerRootsRef.current.push(root);
      sellerDataRef.current.push(seller);

      const marker = L.marker([seller.location.lat, seller.location.lng], {
        icon,
      }).addTo(map);
      marker.on("click", () => {
        onSellerSelect(seller.storeId);
      });
      markersRef.current.push(marker);
    });
  };

  const toggleGps = () => {
    if (isLongPressTriggeredRef.current) {
      isLongPressTriggeredRef.current = false;
      return;
    }

    if (isGpsEnabled) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsGpsEnabled(false);
      setUserPosition(null);
      setIsManualMode(false);
    } else {
      if ("geolocation" in navigator) {
        toast.loading("در حال دریافت موقعیت...", { id: "gps-loading" });
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            toast.dismiss("gps-loading");
            const heading =
              position.coords.heading !== null ? position.coords.heading : 0;
            setUserPosition({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              heading: heading,
            });
            setIsGpsEnabled(true);
            setIsManualMode(false);
          },
          (error) => {
            toast.dismiss("gps-loading");
            console.error("Error getting location:", error);
            let msg = "دسترسی به موقعیت مکانی امکان‌پذیر نیست.";
            if (error.code === error.TIMEOUT) {
              msg = "زمان دریافت موقعیت تمام شد. لطفاً دوباره تلاش کنید.";
            } else if (error.code === error.PERMISSION_DENIED) {
              msg = "لطفاً دسترسی به موقعیت مکانی را فعال کنید.";
            }
            toast.error(msg);
            setIsGpsEnabled(false);
          },
        );
      } else {
        toast.error("مرورگر شما از GPS پشتیبانی نمی‌کند.");
      }
    }
  };

  const handleGpsButtonMouseDown = () => {
    isLongPressTriggeredRef.current = false;
    gpsButtonLongPressTimerRef.current = setTimeout(() => {
      isLongPressTriggeredRef.current = true;
      if (userPosition && mapRef.current) {
        panToWithDesktopOffset(mapRef.current, userPosition);
      } else {
        toast.error("موقعیتی یافت نشد");
      }
    }, 1000);
  };

  const handleGpsButtonMouseUp = () => {
    if (gpsButtonLongPressTimerRef.current) {
      clearTimeout(gpsButtonLongPressTimerRef.current);
      gpsButtonLongPressTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (onMapReady) {
      onMapReady({ panToSeller, resetMapView });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onMapReady]);

  useEffect(() => {
    isGpsEnabledRef.current = isGpsEnabled;
  }, [isGpsEnabled]);

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window === "undefined") return;
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      LRef.current = L;
      setIsLeafletLoaded(true);
    };
    loadLeaflet();
  }, []);

  useEffect(() => {
    if (!mapRef.current || !LRef.current) return;
    const L = LRef.current;
    const map = mapRef.current;

    if (!userPosition) {
      if (userMarkerRootRef.current) {
        setTimeout(() => {
          userMarkerRootRef.current?.unmount();
        }, 0);
        userMarkerRootRef.current = null;
      }
      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
      return;
    }

    if (userMarkerRootRef.current) {
      const oldRoot = userMarkerRootRef.current;
      setTimeout(() => {
        oldRoot?.unmount();
      }, 0);
      userMarkerRootRef.current = null;
    }
    const container = document.createElement("div");
    const root = createRoot(container);
    flushSync(() => {
      root.render(
        <UserMarker
          heading={userPosition.heading ?? 0}
          isManual={isManualMode}
        />,
      );
    });
    userMarkerRootRef.current = root;

    const icon = L.divIcon({
      className: "user-marker",
      html: container,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userPosition.lat, userPosition.lng]);
      userMarkerRef.current.setIcon(icon);
    } else {
      const marker = L.marker([userPosition.lat, userPosition.lng], {
        icon,
      }).addTo(map);
      userMarkerRef.current = marker;
    }

    panToWithDesktopOffset(map, userPosition);
  }, [userPosition, isManualMode]);

  useEffect(() => {
    if (!mapContainerRef.current || !isLeafletLoaded || !LRef.current) return;
    if (mapRef.current) return;

    const L = LRef.current;
    const map = L.map(mapContainerRef.current).setView(
      [HOME_MAP_INITIAL_CENTER.lat, HOME_MAP_INITIAL_CENTER.lng],
      HOME_MAP_INITIAL_ZOOM,
    );
    mapRef.current = map;

    L.tileLayer(CUSTOM_TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      maxZoom: 19,
    }).addTo(map);

    let longPressTimeout = null;

    const handleMouseDown = (e) => {
      if (e.originalEvent.button !== 0) return;
      longPressTimeout = setTimeout(() => {
        if (isGpsEnabledRef.current) {
          toast.error("برای تنظیم موقعیت دستی، ابتدا GPS را خاموش کنید.");
          return;
        }
        setUserPosition({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          heading: 0,
        });
        setIsManualMode(true);
        toast.success("موقعیت دستی انتخاب شد");
      }, 700);
    };

    const handleMouseUpOrMove = () => {
      if (longPressTimeout) {
        clearTimeout(longPressTimeout);
        longPressTimeout = null;
      }
    };

    const handleContextMenu = (e) => {
      if (isGpsEnabledRef.current) {
        toast.error("برای تنظیم موقعیت دستی، ابتدا GPS را خاموش کنید.");
        return;
      }
      setUserPosition({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        heading: 0,
      });
      setIsManualMode(true);
      toast.success("موقعیت دستی انتخاب شد");
    };

    map.on("mousedown", handleMouseDown);
    map.on("mouseup", handleMouseUpOrMove);
    map.on("mousemove", handleMouseUpOrMove);
    map.on("contextmenu", handleContextMenu);

    const notifyVisibleAreaFetch = () => {
      if (!onMapMoveRef.current) return;
      const { lat, lng, radiusKm } = getVisibleMapFetchArea(map);
      onMapMoveRef.current(lat, lng, radiusKm);
    };

    const handleMoveEnd = () => {
      if (isProgrammaticMoveRef.current) {
        isProgrammaticMoveRef.current = false;
        return;
      }

      if (mapMoveDebounceRef.current) {
        clearTimeout(mapMoveDebounceRef.current);
      }
      mapMoveDebounceRef.current = setTimeout(notifyVisibleAreaFetch, 600);
    };

    const handleViewportResize = () => {
      if (mapMoveDebounceRef.current) {
        clearTimeout(mapMoveDebounceRef.current);
      }
      mapMoveDebounceRef.current = setTimeout(notifyVisibleAreaFetch, 600);
    };

    map.on("moveend", handleMoveEnd);
    map.on("resize", handleViewportResize);
    window.addEventListener("resize", handleViewportResize);

    // Desktop always refetches with the left-visible bounds (SSR uses full viewport).
    const shouldInitialFetch =
      !skipInitialAreaFetchRef.current || isDesktopMapLayout();

    if (shouldInitialFetch) {
      requestAnimationFrame(notifyVisibleAreaFetch);
    }

    addMarkers();

    return () => {
      if (mapMoveDebounceRef.current) clearTimeout(mapMoveDebounceRef.current);
      window.removeEventListener("resize", handleViewportResize);
      markerRootsRef.current.forEach((root) => root?.unmount());
      markerRootsRef.current = [];
      if (userMarkerRootRef.current) {
        userMarkerRootRef.current?.unmount();
        userMarkerRootRef.current = null;
      }
      if (longPressTimeout) clearTimeout(longPressTimeout);
      map.remove();
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isLeafletLoaded]);

  useEffect(() => {
    addMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellers]);

  useEffect(() => {
    if (markersRef.current.length > 0) {
      syncMarkerActiveState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSellerId]);

  const gpsButton = (
    <div
      onClick={toggleGps}
      onMouseDown={handleGpsButtonMouseDown}
      onMouseUp={handleGpsButtonMouseUp}
      onMouseLeave={handleGpsButtonMouseUp}
      className={
        isSmUp
          ? "absolute left-4 z-1000 sm:bottom-auto sm:top-4 sm:left-4 lg:top-auto lg:bottom-12 lg:left-8 cursor-pointer"
          : `${MOBILE_GPS_ABOVE_DRAWER_CLASS} cursor-pointer pointer-events-auto`
      }
    >
      <div
        className={`bg-gray-200/40 backdrop-blur-sm border border-white sm:bg-gray-100/70 rounded-lg flex flex-col justify-center items-center gap-0.5 w-10 h-10 sm:w-[50px] sm:h-[50px] ${
          isGpsEnabled ? "text-primary" : "text-gray-800"
        }`}
      >
        <GPSIcon size={20} />
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 z-0 w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* موبایل: GPS به دراور portal می‌شود تا با حرکت دراور جابه‌جا شود */}
      {!isSmUp && homeDrawerEl
        ? createPortal(gpsButton, homeDrawerEl)
        : isSmUp
          ? gpsButton
          : null}

      {/* لوگو */}
      {!isSearchBoxOpen && (
        <div className="absolute top-6 lg:top-9 right-2.5 lg:left-8 lg:right-[unset] z-1000">
          <Image
            src="/assets/images/logo/main-logo.svg"
            width={130}
            height={50}
            alt="main-logo"
            className="object-contain"
          />
        </div>
      )}
    </div>
  );
}

export default MapComponent;
