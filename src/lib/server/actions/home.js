"use server";

import http from "@/app/api/axiosInstance";

/** Fetch regional home-page data filtered by map viewport (lat/lng/radius in km). */
export const getHomePageData = async (lat, lng, radius) => {  try {
    const params = new URLSearchParams();
    if (lat != null) params.set("latitude", lat);
    if (lng != null) params.set("longitude", lng);
    if (radius != null) params.set("radius", radius);
    const query = params.toString() ? `?${params.toString()}` : "";

    const response = await http({
      url: `/home-page${query}`,
      method: "GET",
    });

    return { homePageRes: response.data };
  } catch (err) {
    console.log("Error getting home page data: ", err);
    return { homePageErr: err };
  }
};
