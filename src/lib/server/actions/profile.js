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

export async function updateUserProfileAvatar(token, bodyData) {
  try {
    const response = await http({
      url: "/auth/profile/change-avatar",
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

export async function setDefaultAddress(token, id) {
  try {
    const response = await http({
      url: `/auth/profile/user-addresses/${id}`,
      method: "PATCH",
      data: { is_default: true },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { setDefaultAddressRes: response.data };
  } catch (err) {
    console.log("Error setting default address: ", err);
    return { setDefaultAddressErr: err };
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

export async function getUserEmails(token) {
  try {
    const response = await http({
      url: "/auth/profile/emails",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { getEmailsRes: response.data };
  } catch (err) {
    console.log("Error getting user emails: ", err);
    return { getEmailsErr: err };
  }
}

export async function sendEmailOtp(token, bodyData) {
  try {
    const response = await http({
      url: "/auth/profile/emails/send-otp",
      method: "POST",
      data: bodyData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { sendEmailOtpRes: response.data };
  } catch (err) {
    console.log("Error sending email otp: ", err);
    return { sendEmailOtpErr: err };
  }
}

export async function verifyEmailOtp(token, bodyData) {
  try {
    const response = await http({
      url: "/auth/profile/emails/verify-otp",
      method: "POST",
      data: bodyData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { verifyEmailOtpRes: response.data };
  } catch (err) {
    console.log("Error verifying email otp: ", err);
    return { verifyEmailOtpErr: err };
  }
}

export async function setDefaultEmail(token, id) {
  try {
    const response = await http({
      url: `/auth/profile/emails/${id}/set-default`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { setDefaultEmailRes: response.data };
  } catch (err) {
    console.log("Error setting default email: ", err);
    return { setDefaultEmailErr: err };
  }
}

export async function getUserMobiles(token) {
  try {
    const response = await http({
      url: "/auth/profile/mobiles",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { getMobilesRes: response.data };
  } catch (err) {
    console.log("Error getting user mobiles: ", err);
    return { getMobilesErr: err };
  }
}

export async function sendMobileOtp(token, bodyData) {
  try {
    const response = await http({
      url: "/auth/profile/mobiles/send-otp",
      method: "POST",
      data: bodyData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { sendMobileOtpRes: response.data };
  } catch (err) {
    console.log("Error sending mobile otp: ", err);
    return { sendMobileOtpErr: err };
  }
}

export async function verifyMobileOtp(token, bodyData) {
  try {
    const response = await http({
      url: "/auth/profile/mobiles/verify-otp",
      method: "POST",
      data: bodyData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { verifyMobileOtpRes: response.data };
  } catch (err) {
    console.log("Error verifying mobile otp: ", err);
    return { verifyMobileOtpErr: err };
  }
}

export async function setDefaultMobile(token, id) {
  try {
    const response = await http({
      url: `/auth/profile/mobiles/${id}/set-default`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { setDefaultMobileRes: response.data };
  } catch (err) {
    console.log("Error setting default mobile: ", err);
    return { setDefaultMobileErr: err };
  }
}

export async function deleteUserMobile(token, id) {
  try {
    const response = await http({
      url: `/auth/profile/mobiles/${id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { deleteMobileRes: response.data };
  } catch (err) {
    console.log("Error deleting user mobile: ", err);
    return { deleteMobileErr: err };
  }
}

export async function getUserSessions(token, mobile = null) {
  try {
    const url = mobile
      ? `/auth/profile/sessions?mobile=${mobile}`
      : "/auth/profile/sessions";
    const response = await http({
      url,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { getSessionsRes: response.data };
  } catch (err) {
    console.log("Error getting user sessions: ", err);
    return { getSessionsErr: err };
  }
}

export async function deleteMultipleSessions(token, bodyData) {
  try {
    const response = await http({
      url: "/auth/profile/sessions/multiple-delete",
      method: "POST",
      data: bodyData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { deleteSessionsRes: response.data };
  } catch (err) {
    console.log("Error deleting sessions: ", err);
    return { deleteSessionsErr: err };
  }
}

export async function getUserBankAccounts(token) {
  try {
    const response = await http({
      url: "/auth/profile/bank-accounts",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { getBankAccountsRes: response.data };
  } catch (err) {
    console.log("Error getting user bank accounts: ", err);
    return { getBankAccountsErr: err };
  }
}

export async function submitBankAccount(token, bodyData) {
  try {
    const response = await http({
      url: "/auth/profile/bank-accounts",
      method: "POST",
      data: bodyData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { submitBankAccountRes: response.data };
  } catch (err) {
    console.log("Error submitting bank account: ", err);
    return { submitBankAccountErr: err };
  }
}

export async function setDefaultBankAccount(token, id) {
  try {
    const response = await http({
      url: `/auth/profile/bank-accounts/${id}/set-default`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { setDefaultBankAccountRes: response.data };
  } catch (err) {
    console.log("Error setting default bank account: ", err);
    return { setDefaultBankAccountErr: err };
  }
}

export async function deleteUserBankAccount(token, id) {
  try {
    const response = await http({
      url: `/auth/profile/bank-accounts/${id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { deleteBankAccountRes: response.data };
  } catch (err) {
    console.log("Error deleting user bank account: ", err);
    return { deleteBankAccountErr: err };
  }
}
