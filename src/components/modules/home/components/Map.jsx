"use client";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import Image from "next/image";
import { sellers } from "@/lib/data";
import toast from "react-hot-toast";
import { SellerMarker, UserMarker } from "@/components/ui/markers";
import { GPSIcon } from "@/icons";

const MAP_KEY = "web.62daef333a0348299fa1a0eab10b34f2";

function Map({ activeSellerId, onSellerSelect, onMapReady, filteredProducts }) {
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

  const [isGpsEnabled, setIsGpsEnabled] = useState(false);
  const [userPosition, setUserPosition] = useState(null);
  const [isManualMode, setIsManualMode] = useState(false);

  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);

  const longPressTimerRef = useRef(null);
  const gpsButtonLongPressTimerRef = useRef(null);
  const isLongPressTriggeredRef = useRef(false);
  const isGpsEnabledRef = useRef(false);

  useEffect(() => {
    isGpsEnabledRef.current = isGpsEnabled;
  }, [isGpsEnabled]);

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window === "undefined") return;

      const L = await import("@neshan-maps-platform/leaflet");
      await import("@neshan-maps-platform/leaflet/dist/leaflet.css");
      LRef.current = L.default || L;
      setIsLeafletLoaded(true);
    };

    loadLeaflet();
  }, []);

  // Reset map to default center and zoom
  const resetMapView = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo([35.73, 51.42], 13, {
      animate: true,
      duration: 1.5,
    });
  };

  // Pan to a point: on desktop (>=1024px, map is half screen) put point on left like seller; on smaller viewport center exactly
  const panToWithDesktopOffset = (map, latLng) => {
    if (!LRef.current) return;
    const L = LRef.current;

    const isDesktop =
      typeof window !== "undefined" && window.innerWidth >= 1024;
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

  // Fly to seller: on desktop use offset; on viewport < 1024px center exactly on point
  const panToSeller = (sellerId) => {
    if (!mapRef.current || !LRef.current) return;
    const L = LRef.current;

    const seller = sellers.find((s) => s.id === sellerId);
    if (!seller) return;
    const map = mapRef.current;
    const targetLatLng = new L.LatLng(seller.location.lat, seller.location.lng);
    const isDesktop =
      typeof window !== "undefined" && window.innerWidth >= 1024;

    if (isDesktop) {
      map.flyTo(targetLatLng, 15, { animate: false });
      setTimeout(() => {
        const centerPoint = map.latLngToContainerPoint(map.getCenter());
        const sellerPoint = map.latLngToContainerPoint(targetLatLng);
        const diffX = centerPoint.x - sellerPoint.x;
        const shiftAmount = map.getSize().x * 0.25;
        const newCenterPoint = L.point(
          sellerPoint.x - diffX + shiftAmount,
          sellerPoint.y,
        );
        const newCenterLatLng = map.containerPointToLatLng(newCenterPoint);
        map.panTo(newCenterLatLng, { animate: true, duration: 1.0 });
      }, 100);
    } else {
      map.flyTo(targetLatLng, 15, { animate: true, duration: 1.0 });
    }
  };

  // Expose map actions (panToSeller, resetMapView) to parent on mount
  useEffect(() => {
    if (onMapReady) {
      onMapReady({ panToSeller, resetMapView });
    }
  }, [onMapReady]);

  // Helper: build icon for a seller marker. flushSync so DOM is ready before Leaflet uses it (no flicker).
  const buildSellerIcon = (seller, isActive) => {
    if (!LRef.current) return { icon: null, root: null };
    const L = LRef.current;

    const container = document.createElement("div");
    const root = createRoot(container);
    flushSync(() => {
      root.render(<SellerMarker seller={seller} isActive={isActive} />);
    });
    const iconSize = seller.hasSpecialSale ? [48, 52] : [12, 12];
    const iconAnchor = seller.hasSpecialSale ? [24, 52] : [6, 6];
    const icon = L.divIcon({
      className: "custom-marker",
      html: container,
      iconSize,
      iconAnchor,
    });
    return { icon, root };
  };

  // Add/update seller markers. When only activeSellerId changes, update icons in place to avoid flicker.
  const addMarkers = () => {
    if (!mapRef.current || !LRef.current) return;
    const L = LRef.current;
    const map = mapRef.current;
    const visibleSellerIds = new Set(filteredProducts.map((p) => p.seller.id));
    const prevIds = prevVisibleSellerIdsRef.current;
    const sameSet =
      prevIds &&
      prevIds.size === visibleSellerIds.size &&
      [...visibleSellerIds].every((id) => prevIds.has(id));

    if (sameSet && markersRef.current.length > 0) {
      markersRef.current.forEach((marker, i) => {
        const seller = sellerDataRef.current[i];
        if (!seller) return;
        const root = markerRootsRef.current[i];
        root?.unmount();
        const { icon, root: newRoot } = buildSellerIcon(
          seller,
          seller.id === activeSellerId,
        );
        markerRootsRef.current[i] = newRoot;
        marker.setIcon(icon);
      });
      return;
    }

    prevVisibleSellerIdsRef.current = visibleSellerIds;
    markerRootsRef.current.forEach((root) => root?.unmount());
    markerRootsRef.current = [];
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];
    sellerDataRef.current = [];

    sellers.forEach((seller) => {
      if (visibleSellerIds.has(seller.id)) {
        const isActive = seller.id === activeSellerId;
        const { icon, root } = buildSellerIcon(seller, isActive);
        markerRootsRef.current.push(root);
        sellerDataRef.current.push(seller);

        const marker = L.marker([seller.location.lat, seller.location.lng], {
          icon,
        }).addTo(map);
        marker.on("click", () => {
          onSellerSelect(seller.id);
        });
        markersRef.current.push(marker);
      }
    });
  };

  // Keep user marker in sync with userPosition (GPS or manual); pan map to user when position changes
  useEffect(() => {
    if (!mapRef.current || !LRef.current) return;
    const L = LRef.current;
    const map = mapRef.current;

    if (!userPosition) {
      if (userMarkerRootRef.current) {
        userMarkerRootRef.current?.unmount();
        userMarkerRootRef.current = null;
      }
      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
      return;
    }

    if (userMarkerRootRef.current) {
      userMarkerRootRef.current?.unmount();
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

  // Toggle GPS on/off; ignore click if long-press was just triggered
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

  // Init map, long-press on map for manual position, cleanup on unmount
  useEffect(() => {
    if (!mapContainerRef.current || !isLeafletLoaded || !LRef.current) return;
    if (mapRef.current) return; // Prevent double initialization

    const L = LRef.current;
    const map = L.map(mapContainerRef.current, {
      key: MAP_KEY,
      maptype: "dreamy-gold",
      center: [35.73, 51.42],
      zoom: 13,
    });
    mapRef.current = map;

    let touchStartPos = null;

    const handleLongPressStart = (e) => {
      longPressTimerRef.current = setTimeout(() => {
        if (isGpsEnabledRef.current) {
          toast.error("برای تنظیم موقعیت دستی، ابتدا GPS را خاموش کنید.");
          return;
        }
        const { lat, lng } = e.latlng;
        setUserPosition({
          lat: lat,
          lng: lng,
          heading: 0,
        });
        setIsManualMode(true);
        toast.success("موقعیت دستی انتخاب شد");
      }, 1000);
    };

    const handleLongPressEnd = () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      touchStartPos = null;
    };

    // Mouse events for desktop
    map.on("mousedown", handleLongPressStart);
    map.on("mouseup", handleLongPressEnd);
    map.on("mousemove", handleLongPressEnd);

    // Native touch events for mobile (more reliable)
    const mapContainer = mapContainerRef.current;

    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return; // Only single touch

      const touch = e.touches[0];
      touchStartPos = { x: touch.clientX, y: touch.clientY };

      longPressTimerRef.current = setTimeout(() => {
        if (isGpsEnabledRef.current) {
          toast.error("برای تنظیم موقعیت دستی، ابتدا GPS را خاموش کنید.");
          handleLongPressEnd();
          return;
        }

        // Convert touch position to map coordinates
        const point = map.containerPointToLatLng([
          touch.clientX,
          touch.clientY,
        ]);
        setUserPosition({
          lat: point.lat,
          lng: point.lng,
          heading: 0,
        });
        setIsManualMode(true);
        toast.success("موقعیت دستی انتخاب شد");
        handleLongPressEnd();
      }, 1000);
    };

    const handleTouchMove = (e) => {
      if (!touchStartPos || !longPressTimerRef.current) return;

      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartPos.x);
      const deltaY = Math.abs(touch.clientY - touchStartPos.y);

      // Cancel if finger moved more than 10px
      if (deltaX > 10 || deltaY > 10) {
        handleLongPressEnd();
      }
    };

    const handleTouchEnd = () => {
      handleLongPressEnd();
    };

    mapContainer.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    mapContainer.addEventListener("touchmove", handleTouchMove, {
      passive: true,
    });
    mapContainer.addEventListener("touchend", handleTouchEnd);
    mapContainer.addEventListener("touchcancel", handleTouchEnd);

    // Cancel on map move/drag
    map.on("move", handleLongPressEnd);

    addMarkers();

    return () => {
      markerRootsRef.current.forEach((root) => root?.unmount());
      markerRootsRef.current = [];
      if (userMarkerRootRef.current) {
        userMarkerRootRef.current?.unmount();
        userMarkerRootRef.current = null;
      }

      // Remove touch event listeners
      mapContainer.removeEventListener("touchstart", handleTouchStart);
      mapContainer.removeEventListener("touchmove", handleTouchMove);
      mapContainer.removeEventListener("touchend", handleTouchEnd);
      mapContainer.removeEventListener("touchcancel", handleTouchEnd);

      map.remove();
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, [isLeafletLoaded]);

  // Re-add markers when active seller or filter changes
  useEffect(() => {
    addMarkers();
  }, [activeSellerId, filteredProducts]);

  // Long-press on GPS button: pan map to current user position
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

  return (
    <div className="absolute inset-0 z-0 w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top blue shadow */}
      <div className="block lg:hidden absolute top-0 left-0 right-0 w-full h-16 pointer-events-none z-1000 bg-linear-to-b from-[#231E64] via-[#231E64]/40 to-transparent" />

      {/* GPS Button */}
      <div
        onClick={toggleGps}
        onMouseDown={handleGpsButtonMouseDown}
        onMouseUp={handleGpsButtonMouseUp}
        onMouseLeave={handleGpsButtonMouseUp}
        className="absolute bottom-72 left-4 z-1000 sm:bottom-auto sm:top-4 sm:left-4 lg:top-auto lg:bottom-12 lg:left-8 cursor-pointer"
      >
        <div
          className={`bg-gray-200/50 backdrop-blur-sm  border border-white sm:bg-gray-100/70 rounded-lg flex flex-col justify-center items-center gap-0.5 w-10 h-10 sm:w-[50px] sm:h-[50px] ${isGpsEnabled ? "text-primary" : "text-gray-800"}`}
        >
          <GPSIcon size={20} />
        </div>
      </div>

      {/* Logo */}
      <div className="absolute top-4 lg:left-8 lg:right-[unset] right-4 z-1000">
        <Image
          src="/assets/images/logo/main-logo.svg"
          width={110}
          height={40}
          alt="main-logo"
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default Map;
