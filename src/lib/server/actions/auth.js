"use client";

import http from "@/app/api/axiosInstance";

export async function sendOtp(bodyData) {
  try {
    const response = await http({
      url: "/auth/send-otp",
      method: "POST",
      data: bodyData,
    });
    return { sendOtpRes: response.data };
  } catch (err) {
    console.log("Error sending OTP: ", err);
    return { sendOtpErr: err };
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
    console.log("Error checking OTP: ", err);
    return { checkErr: err };
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
    console.log("Error registering user: ", err);
    return { registerErr: err };
  }
}
