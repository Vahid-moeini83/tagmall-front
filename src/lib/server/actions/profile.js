"use server";

import http from "@/app/api/axiosInstance";

export async function logoutUser(token) {
  try {
    const response = await http({
      url: "/auth/logout",
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { logoutRes: response.data };
  } catch (err) {
    console.log("Error logging out user: ", err);
    return { logoutErr: err };
  }
}

export async function getUserProfile(token) {
  try {
    const response = await http({
      url: "/auth/profile",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { userProfileRes: response.data };
  } catch (err) {
    console.log("Error getting user profile: ", err);
    return { userProfileErr: err };
  }
}

export async function updateUserProfile(token, bodyData) {
  try {
    const response = await http({
      url: "/auth/profile",
      method: "POST",
      data: bodyData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { updateProfileRes: response.data };
  } catch (err) {
    console.log("Error updating user profile: ", err);
    return { updateProfileErr: err };
  }
}

export async function getWalletAmount(token) {
  try {
    const response = await http({
      url: "/auth/wallet",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { getWalletRes: response.data };
  } catch (err) {
    console.log("Error getting wallet amount: ", err);
    return { getWalletErr: err };
  }
}

export async function chargeWalletAmount(token, bodyData) {
  try {
    const response = await http({
      url: "/auth/wallet",
      method: "POST",
      data: bodyData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { chargeWalletRes: response.data };
  } catch (err) {
    console.log("Error charging wallet: ", err);
    return { chargeWalletErr: err };
  }
}

export async function sellerPanelUrl(token) {
  try {
    const response = await http({
      url: "/seller-panel-url",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { sellerPanelRes: response.data };
  } catch (err) {
    console.log("Error getting seller panel url: ", err);
    return { sellerPanelErr: err };
  }
}

export async function getUserAddresses(token) {
  try {
    const response = await http({
      url: "/auth/profile/user-addresses",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { getAddressesRes: response.data };
  } catch (err) {
    console.log("Error getting user addresses: ", err);
    return { getAddressesErr: err };
  }
}

export async function submitUserAddress(token, bodyData) {
  try {
    const response = await http({
      url: "/auth/profile/user-addresses",
      method: "POST",
      data: bodyData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { submitAddressRes: response.data };
  } catch (err) {
    console.log("Error submitting user address: ", err);
    return { submitAddressErr: err };
  }
}

export async function updateUserAddress(token, bodyData, id) {
  try {
    const response = await http({
      url: `/auth/profile/user-addresses/${id}`,
      method: "PUT",
      data: bodyData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { updateAddressRes: response.data };
  } catch (err) {
    console.log("Error updating user addresses: ", err);
    return { updateAddressErr: err };
  }
}

export async function deleteUserAddress(token, id) {
  try {
    const response = await http({
      url: `/auth/profile/user-addresses/${id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { deleteAddressRes: response.data };
  } catch (err) {
    console.log("Error deleting user addresses: ", err);
    return { deleteAddressErr: err };
  }
}
