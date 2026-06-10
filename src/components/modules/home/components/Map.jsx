"use client";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import Image from "next/image";
import toast from "react-hot-toast";
import { SellerMarker, UserMarker } from "@/components/ui/markers";
import { GPSIcon } from "@/icons";
import usePublicStore from "@/app/store/publicStore";

const CUSTOM_TILE_URL =
  "https://api.neshan.org/tile/raster/basemap/{z}/{x}/{y}?style=neshan&Api-key=service.cfd22467b9064762be3c1beec3756c47";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM contributors</a>';

/**
 * ضریب کاهش radius — کمی کمتر از viewport واقعی ارسال می‌کنیم
 * تا فروشگاه‌هایی که در لبه‌ی دید کاربر هستن (و احتمالاً ناقص دیده می‌شن)
 * وارد نتایج نشن و دیتای دقیق‌تری داشته باشیم.
 * مثال: viewport=50km → ارسال‌شده=48km (50 * 0.96)
 */
const RADIUS_REDUCTION_FACTOR = 0.96;

/**
 * محاسبه radius به کیلومتر بر اساس viewport جغرافیایی نقشه.
 * فاصله واقعی از مرکز نقشه تا گوشه‌ی شمال‌شرقی viewport رو حساب می‌کنه
 * تا همه گوشه‌های صفحه کاربر پوشش داده بشن — مستقل از zoom و اندازه صفحه.
 * سپس یک ضریب کاهشی اعمال می‌کنه تا فقط دیتای دقیقِ داخل ویو نمایش داده بشه.
 * نکته: این تابع هم برای pan و هم برای zoom درست عمل می‌کنه،
 * چون Leaflet بعد از هر دو عملیات، moveend رو fire می‌کنه.
 * @param {L.Map} map - instance نقشه Leaflet
 * @returns {number} radius به کیلومتر (گرد شده به بالا)
 */
function getViewportRadiusKm(map) {
  const center = map.getCenter();
  const bounds = map.getBounds();
  const northEast = bounds.getNorthEast();
  // distanceTo فاصله به متر برمی‌گردونه (فرمول Haversine داخل Leaflet)
  const distanceMeters = center.distanceTo(northEast);
  return Math.ceil((distanceMeters / 1000) * RADIUS_REDUCTION_FACTOR);
}

function MapComponent({
  activeSellerId,
  onSellerSelect,
  onMapReady,
  filteredProducts,
  sellers,
  onMapMove,
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

  const [isGpsEnabled, setIsGpsEnabled] = useState(false);
  const [userPosition, setUserPosition] = useState(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);

  const longPressTimerRef = useRef(null);
  const gpsButtonLongPressTimerRef = useRef(null);
  const isLongPressTriggeredRef = useRef(false);
  const isGpsEnabledRef = useRef(false);

  const isSearchBoxOpen = usePublicStore((s) => s.searchBoxOpen);

  // همیشه آخرین نسخه onMapMove و sellers رو نگه می‌داریم بدون نیاز به re-setup listener
  useEffect(() => {
    onMapMoveRef.current = onMapMove;
  }, [onMapMove]);

  useEffect(() => {
    sellersRef.current = sellers;
  }, [sellers]);

  // بازنشانی نقشه به موقعیت اولیه
  const resetMapView = () => {
    if (!mapRef.current) return;
    isProgrammaticMoveRef.current = true;
    mapRef.current.flyTo([35.73, 51.42], 13, {
      animate: true,
      duration: 1.5,
    });
  };

  // حرکت نقشه با در نظر گرفتن دسکتاپ (افست برای نیم‌صفحه)
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

  // پرواز به سمت یک فروشگاه — از sellersRef استفاده می‌کنیم تا همیشه آخرین لیست داشته باشیم
  const panToSeller = (storeId) => {
    if (!mapRef.current || !LRef.current) return;
    const L = LRef.current;

    const seller = sellersRef.current.find((s) => s.storeId === storeId);
    if (!seller) return;
    const map = mapRef.current;
    const targetLatLng = new L.LatLng(seller.location.lat, seller.location.lng);
    const isDesktop =
      typeof window !== "undefined" && window.innerWidth >= 1024;

    isProgrammaticMoveRef.current = true;

    if (isDesktop) {
      // محاسبه مستقیم مرکز جابجاشده در فضای CRS بدون نیاز به حرکت اولیه نقشه
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
    if (!LRef.current) return { icon: null, root: null };
    const L = LRef.current;

    const container = document.createElement("div");
    const root = createRoot(container);
    root.render(<SellerMarker seller={seller} isActive={isActive} />);
    // چک کردن اینکه آیا این فروشگاه محصول ویژه داره یا نه
    const hasSpecialProduct = filteredProducts.some(
      (p) => p.storeId === seller.storeId && p.isSpecialSale,
    );
    const iconSize = hasSpecialProduct ? [48, 52] : [12, 12];
    const iconAnchor = hasSpecialProduct ? [24, 52] : [6, 6];
    const icon = L.divIcon({
      className: "custom-marker",
      html: container,
      iconSize,
      iconAnchor,
    });
    return { icon, root };
  };

  // افزودن یا به‌روزرسانی مارکرهای فروشگاه‌ها
  const addMarkers = () => {
    if (!mapRef.current || !LRef.current) return;
    const L = LRef.current;
    const map = mapRef.current;

    const visibleStoreIds = new Set(filteredProducts.map((p) => p.storeId));
    const prevIds = prevVisibleSellerIdsRef.current;
    const sameSet =
      prevIds &&
      prevIds.size === visibleStoreIds.size &&
      [...visibleStoreIds].every((id) => prevIds.has(id));

    if (sameSet && markersRef.current.length > 0) {
      markersRef.current.forEach((marker, i) => {
        const seller = sellerDataRef.current[i];
        if (!seller) return;
        const root = markerRootsRef.current[i];
        if (root) {
          setTimeout(() => root.unmount(), 0);
        }
        const isActive = seller.storeId === activeSellerId;
        const { icon, root: newRoot } = buildSellerIcon(seller, isActive);
        markerRootsRef.current[i] = newRoot;
        marker.setIcon(icon);
      });
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
      if (visibleStoreIds.has(seller.storeId)) {
        const isActive = seller.storeId === activeSellerId;
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
      }
    });
  };

  // فعال/غیرفعال کردن GPS
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

  // Long-press روی دکمه GPS (پن به موقعیت کاربر)
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

  // در معرض قرار دادن توابع نقشه برای والد
  useEffect(() => {
    if (onMapReady) {
      onMapReady({ panToSeller, resetMapView });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onMapReady]);

  useEffect(() => {
    isGpsEnabledRef.current = isGpsEnabled;
  }, [isGpsEnabled]);

  // بارگذاری Leaflet استاندارد (بدون وابستگی به نشان)
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

  // همگام‌سازی مارکر کاربر (GPS یا دستی)
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

  // راه‌اندازی نقشه با تایل دلخواه
  useEffect(() => {
    if (!mapContainerRef.current || !isLeafletLoaded || !LRef.current) return;
    if (mapRef.current) return; // جلوگیری از راه‌اندازی مجدد

    const L = LRef.current;
    // ایجاد نقشه بدون تنظیمات نشان
    const map = L.map(mapContainerRef.current).setView([31.1, 53.5], 13);
    mapRef.current = map;

    // اضافه کردن لایه تایل سفارشی
    L.tileLayer(CUSTOM_TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      maxZoom: 19,
    }).addTo(map);

    // --- رویدادهای long-press برای انتخاب موقعیت دستی (بدون تغییر) ---
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

    // ─── درخواست فروشگاه‌های منطقه جدید هنگام جابجایی نقشه توسط کاربر ───
    const handleMoveEnd = () => {
      // حرکت‌های برنامه‌ای (panToSeller / resetMapView) رو نادیده بگیر
      if (isProgrammaticMoveRef.current) {
        isProgrammaticMoveRef.current = false;
        return;
      }
      if (!onMapMoveRef.current) return;

      // debounce: فقط وقتی نقشه کاملاً ایستاد (pan یا zoom)، درخواست بزن
      // moveend هم بعد از drag و هم بعد از تغییر zoom fire می‌شه — پس هر دو پوشش دارن
      if (mapMoveDebounceRef.current) {
        clearTimeout(mapMoveDebounceRef.current);
      }
      mapMoveDebounceRef.current = setTimeout(() => {
        const center = map.getCenter();
        // فاصله واقعی جغرافیایی از مرکز تا گوشه viewport — به کیلومتر (با ضریب کاهشی)
        const radiusKm = getViewportRadiusKm(map);
        onMapMoveRef.current(center.lat, center.lng, radiusKm);
      }, 600);
    };

    map.on("moveend", handleMoveEnd);

    // ─── FIX: fetch اولیه برای viewport واقعی بعد از بارگذاری نقشه ──────────
    // بدون این، دیتای SSR (مختصات هاردکد شده) تا اولین حرکت کاربر نمایش داده می‌شه.
    // requestAnimationFrame اطمینان می‌ده که container ابعاد نهایی‌اش رو گرفته.
    requestAnimationFrame(() => {
      if (onMapMoveRef.current) {
        const center = map.getCenter();
        const radiusKm = getViewportRadiusKm(map);
        onMapMoveRef.current(center.lat, center.lng, radiusKm);
      }
    });
    // ─────────────────────────────────────────────────────────────────────────

    addMarkers();

    return () => {
      if (mapMoveDebounceRef.current) clearTimeout(mapMoveDebounceRef.current);
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

  // بازآفرینی مارکرها هنگام تغییر فیلتر یا فروشنده فعال
  useEffect(() => {
    addMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSellerId, filteredProducts]);

  return (
    <div className="absolute inset-0 z-0 w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* دکمه GPS */}
      <div
        onClick={toggleGps}
        onMouseDown={handleGpsButtonMouseDown}
        onMouseUp={handleGpsButtonMouseUp}
        onMouseLeave={handleGpsButtonMouseUp}
        className="absolute bottom-[calc(360px+env(safe-area-inset-bottom))] left-4 z-1000 sm:bottom-auto sm:top-4 sm:left-4 lg:top-auto lg:bottom-12 lg:left-8 cursor-pointer"
      >
        <div
          className={`bg-gray-200/40 backdrop-blur-sm border border-white sm:bg-gray-100/70 rounded-md flex flex-col justify-center items-center gap-0.5 w-10 h-10 sm:w-[50px] sm:h-[50px] ${
            isGpsEnabled ? "text-primary" : "text-gray-800"
          }`}
        >
          <GPSIcon size={20} />
        </div>
      </div>

      {/* لوگو */}
      {!isSearchBoxOpen && (
        <div className="absolute top-6 lg:top-9 right-2.5 lg:left-8 lg:right-[unset] z-1000">
          <Image
            src="/assets/images/logo/main-logo.svg"
            width={110}
            height={40}
            alt="main-logo"
            className="object-contain"
          />
        </div>
      )}
    </div>
  );
}

export default MapComponent;
