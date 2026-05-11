"use server";

import http from "@/app/api/axiosInstance";

// دریافت اطلاعات یک محصول
export async function getProductById(productId) {
  try {
    const response = await http({
      url: `/products/${productId}`,
      method: "GET",
    });
    return { productRes: response.data };
  } catch (err) {
    console.log("Error fetching product: ", err);
    return { productErr: err };
  }
}

// دریافت لیست نظرات یک محصول
export async function getProductComments(productId, token = null) {
  try {
    const config = {
      url: "/comments",
      method: "GET",
      params: {
        type: "product",
        id: productId,
      },
    };

    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await http(config);
    return { commentsRes: response.data };
  } catch (err) {
    console.log("Error fetching comments: ", err);
    return { commentsErr: err };
  }
}

// ثبت نظر جدید
export async function createComment(token, bodyData) {
  try {
    const response = await http({
      url: "/comments",
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: bodyData,
    });
    return { createCommentRes: response.data };
  } catch (err) {
    console.log("Error creating comment: ", err);
    return { createCommentErr: err };
  }
}

// حذف نظر
export async function deleteComment(token, commentId) {
  try {
    const response = await http({
      url: `/comments/${commentId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { deleteCommentRes: response.data };
  } catch (err) {
    console.log("Error deleting comment: ", err);
    return { deleteCommentErr: err };
  }
}

// لایک یا آنلایک کردن نظر
export async function toggleCommentLike(token, commentId) {
  try {
    const response = await http({
      url: `/comments/${commentId}/like`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { likeRes: response.data };
  } catch (err) {
    console.log("Error toggling like: ", err);
    return { likeErr: err };
  }
}
