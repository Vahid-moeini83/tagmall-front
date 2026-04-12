"use server";

import http from "@/app/api/axiosInstance";

export const getHomePageData = async (lat, lng, radius) => {
  try {
    const response = await http({
      url: `/home-page?latitude=${lat}&longitude=${lng}&radius=${radius}`,
      method: "GET",
    });

    return { homePageRes: response.data };
  } catch (err) {
    console.log("Error getting home page data: ", err);
    return { homePageErr: err };
  }
};
