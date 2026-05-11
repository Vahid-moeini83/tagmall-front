"use client";

import http from "@/app/api/axiosInstance";

export const fetchSearchSuggestions = async (bodyData) => {
  try {
    const response = await http({
      url: "/search",
      method: "POST",
      data: bodyData,
      headers: {
        "Use-Random-Price-Range": 1,
      },
    });

    return { searchSuggestionsRes: response.data };
  } catch (err) {
    return {
      searchSuggestionsErr: { message: err.message || "خطا در دریافت اطلاعات" },
    };
  }
};

export const addToSearchHistory = async (bodyData, token, userSearchId) => {
  try {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (userSearchId) {
      headers["User-Search-Id"] = userSearchId;
    }

    const response = await http({
      url: "/search-history",
      method: "POST",
      data: bodyData,
      headers,
    });

    return { addToSearchHistoryRes: response.data };
  } catch (err) {
    console.log("Error adding to search history: ", err);
    return { addToSearchHistoryErr: err };
  }
};

export const fetchSearchHistory = async (token, userSearchId) => {
  try {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (userSearchId) {
      headers["User-Search-Id"] = userSearchId;
    }

    const response = await http({
      url: "/search-history",
      method: "GET",
      headers,
    });

    return { searchHistoryRes: response.data };
  } catch (err) {
    console.log("Error fetching search hsitory: ", err);
    return { searchHistoryErr: err };
  }
};

export const deleteSearchHistoryItem = async (
  bodyData,
  token,
  userSearchId,
) => {
  try {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (userSearchId) {
      headers["User-Search-Id"] = userSearchId;
    }

    const response = await http({
      url: "/delete-search-history",
      method: "POST",
      data: bodyData,
      headers,
    });

    return { deleteSearchHistoryItemRes: response.data };
  } catch (err) {
    console.log("Error deleting history items: ", err);
    return { deleteSearchHistoryItemErr: err };
  }
};

export const deleteAllSearchHistory = async (token, userSearchId) => {
  try {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (userSearchId) {
      headers["User-Search-Id"] = userSearchId;
    }

    const response = await http({
      url: "/search-history/clear",
      method: "DELETE",
      headers,
    });

    return { deleteAllSearchHistoryRes: response.data };
  } catch (err) {
    console.log("Error deleting all search history: ", err);
    return { deleteAllSearchHistoryErr: err };
  }
};
