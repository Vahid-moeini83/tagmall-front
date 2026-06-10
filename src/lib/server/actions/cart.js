"use server";

import http from "@/app/api/axiosInstance";

// Get cart items list with financial summary
export async function getCart(token) {
  try {
    const response = await http({
      url: "/cart",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { cartRes: response.data };
  } catch (err) {
    console.log("Error fetching cart: ", err);
    return { cartErr: err };
  }
}

// Add item to cart
export async function addCartItem(token, bodyData) {
  try {
    const response = await http({
      url: "/cart",
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: bodyData,
    });
    return { addCartItemRes: response.data };
  } catch (err) {
    console.log("Error adding cart item: ", err);
    return { addCartItemErr: err.response?.data?.message || err };
  }
}

// Update item quantity in cart
export async function updateCartItem(token, itemId, bodyData) {
  try {
    const response = await http({
      url: `/cart/${itemId}`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: bodyData,
    });
    return { updateCartItemRes: response.data };
  } catch (err) {
    console.log("Error updating cart item: ", err);
    return { updateCartItemErr: err };
  }
}

// Remove item from cart
export async function deleteCartItem(token, itemId) {
  try {
    const response = await http({
      url: `/cart/${itemId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { deleteCartItemRes: response.data };
  } catch (err) {
    console.log("Error deleting cart item: ", err);
    return { deleteCartItemErr: err };
  }
}

// Get invoice before payment
export async function getCartInvoice(token) {
  try {
    const response = await http({
      url: "/cart/invoice",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { invoiceRes: response.data };
  } catch (err) {
    console.log("Error fetching invoice: ", err);
    return { invoiceErr: err };
  }
}

// Get notes list for a cart item
export async function getCartItemNotes(token, itemId) {
  try {
    const response = await http({
      url: `/cart/${itemId}/notes`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { notesRes: response.data };
  } catch (err) {
    console.log("Error fetching notes: ", err);
    return { notesErr: err };
  }
}

// Create new note for a cart item
export async function createCartItemNote(token, itemId, bodyData) {
  try {
    const response = await http({
      url: `/cart/${itemId}/notes`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: bodyData,
    });
    return { createNoteRes: response.data };
  } catch (err) {
    console.log("Error creating note: ", err);
    return { createNoteErr: err };
  }
}

// Update a note on cart item
export async function updateCartItemNote(token, itemId, noteId, bodyData) {
  try {
    const response = await http({
      url: `/cart/${itemId}/notes/${noteId}`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: bodyData,
    });
    return { updateNoteRes: response.data };
  } catch (err) {
    console.log("Error updating note: ", err);
    return { updateNoteErr: err };
  }
}

// Delete a note from cart item
export async function deleteCartItemNote(token, itemId, noteId) {
  try {
    const response = await http({
      url: `/cart/${itemId}/notes/${noteId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { deleteNoteRes: response.data };
  } catch (err) {
    console.log("Error deleting note: ", err);
    return { deleteNoteErr: err };
  }
}

// Checkout and start payment process
export async function checkoutOrder(token, bodyData) {
  try {
    const response = await http({
      url: "/orders/checkout",
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: bodyData,
    });
    return { checkoutRes: response.data };
  } catch (err) {
    console.log("Error checking out: ", err);
    return { checkoutErr: err };
  }
}

// Get user orders list (paginated 15 items)
export async function getUserOrders(token, page = 1) {
  try {
    const response = await http({
      url: `/orders?page=${page}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { ordersRes: response.data };
  } catch (err) {
    console.log("Error fetching orders: ", err);
    return { ordersErr: err };
  }
}

// Get order details by ID
export async function getOrderById(token, orderId) {
  try {
    const response = await http({
      url: `/orders/${orderId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { orderRes: response.data };
  } catch (err) {
    console.log("Error fetching order: ", err);
    return { orderErr: err };
  }
}

// Cancel order (only pending, reserved, or awaiting_payment status)
export async function cancelOrder(token, orderId) {
  try {
    const response = await http({
      url: `/orders/${orderId}/cancel`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { cancelOrderRes: response.data };
  } catch (err) {
    console.log("Error cancelling order: ", err);
    return { cancelOrderErr: err };
  }
}
