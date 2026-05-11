"use server";

import { cookies } from "next/headers";
import http from "@/app/api/axiosInstance";

// Temp token generator
export async function GenerateTempToken() {
  const response = await http({
    url: "/temp/generate-test-auth-token?weak_pass=12341234_Mm",
    method: "GET",
  });

  return { res: response.data };
}

export async function saveToken(token) {
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const cookieStore = await cookies();
  cookieStore.set("accessToken", token, { expires: Date.now() + oneWeek });
}

export async function saveUser(user) {
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const cookieStore = await cookies();
  cookieStore.set("user", user, { expires: Date.now() + oneWeek });
}

export async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");
  return token?.value || undefined;
}

export async function getUser() {
  const cookieStore = await cookies();
  if (cookieStore.has("user")) return cookieStore.get("user");
  else return "";
}

export async function deleteTokenUserCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("user");
}
