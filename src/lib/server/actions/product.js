"use server";

import http from "@/app/api/axiosInstance";

// Get product details (no token required)
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

// Resolve variant and inventories based on selected attribute values (no token required)
export async function resolveVariant(bodyData) {
  try {
    const response = await http({
      url: "/products/resolve-variant",
      method: "POST",
      data: bodyData,
    });
    return { resolveVariantRes: response.data };
  } catch (err) {
    console.log("Error resolving variant: ", err);
    return { resolveVariantErr: err };
  }
}

// Get product comments list
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

// Create new comment
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

// Update existing comment
export async function updateComment(token, commentId, bodyData) {
  try {
    const response = await http({
      url: `/comments/${commentId}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: bodyData,
    });
    return { updateCommentRes: response.data };
  } catch (err) {
    console.log("Error updating comment: ", err);
    return { updateCommentErr: err };
  }
}

// Delete comment
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

// Toggle comment like/unlike
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
