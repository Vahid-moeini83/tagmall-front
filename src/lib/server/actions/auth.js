"use server";

import http from "@/app/api/axiosInstance";

function serializeAuthError(error) {
  const serialized = {
    name: typeof error?.name === "string" ? error.name : "Error",
    message: typeof error?.message === "string" ? error.message : "درخواست ناموفق بود.",
  };
  const response = error?.response;

  if (response) {
    serialized.response = {};
    if (Number.isInteger(response.status)) serialized.response.status = response.status;
    if (response.data !== undefined) serialized.response.data = response.data;
  }

  return serialized;
}

function logAuthError(message, error) {
  if (process.env.NODE_ENV === "development") console.error(message, error);
}

export async function sendOtp(bodyData) {
  try {
    const response = await http({
      url: "/auth/send-otp",
      method: "POST",
      data: bodyData,
    });
    const responseData = response.data;
    const safeResponseData = { ...responseData };
    delete safeResponseData.otp;
    const otpPayload = safeResponseData.data;

    if (otpPayload && typeof otpPayload === "object") {
      const safeOtpPayload = { ...otpPayload };
      delete safeOtpPayload.otp;
      safeResponseData.data = safeOtpPayload;
    }

    return { sendOtpRes: safeResponseData };
  } catch (err) {
    logAuthError("Error sending OTP:", err);
    return { sendOtpErr: serializeAuthError(err) };
  }
}

export async function checkAuthValidation(bodyData) {
  try {
    const response = await http({
      url: "/auth/otp-validation",
      method: "POST",
      data: bodyData,
    });
    return { checkRes: response.data };
  } catch (err) {
    logAuthError("Error checking OTP:", err);
    return { checkErr: serializeAuthError(err) };
  }
}

export async function registerUser(bodyData) {
  try {
    const response = await http({
      url: "/auth/otp-auth",
      method: "POST",
      data: bodyData,
    });
    return { registerRes: response.data };
  } catch (err) {
    logAuthError("Error registering user:", err);
    return { registerErr: serializeAuthError(err) };
  }
}
