import { deleteTokenUserCookie, saveToken, saveUser } from "@/lib/server/cookies";

export function parseAuthBoolean(value) {
  if (typeof value === "boolean") return value;
  if (value === 1 || value === 0) return value === 1;
  if (typeof value !== "string") return null;

  const normalized = value.trim().toLowerCase();
  if (normalized === "true" || normalized === "1") return true;
  if (normalized === "false" || normalized === "0") return false;
  return null;
}

export function getOtpExpirySeconds(value, fallback = 120) {
  if (value === null || value === undefined || String(value).trim() === "") return fallback;
  const seconds = Number(value);
  return Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : fallback;
}

export function getAuthErrorMessage(error, fallback) {
  const response = error?.response?.data;
  const validationMessage = response?.errors
    ? Object.values(response.errors)
        .flat(Infinity)
        .find((message) => typeof message === "string")
    : undefined;
  const explicitErrorMessage =
    error?.name === "Error" || error?.name === "TypeError" ? error.message : undefined;
  const message = response?.message ?? validationMessage ?? explicitErrorMessage;
  return typeof message === "string" && message.trim() ? message : fallback;
}

export async function persistAuthSession({ authData, setAccessToken, setUserInfo }) {
  const token = authData?.token;
  const user =
    authData?.user && typeof authData.user === "object" && !Array.isArray(authData.user)
      ? authData.user
      : {};

  if (typeof token !== "string" || !token.trim()) {
    throw new Error("پاسخ ورود از سرور کامل نیست.");
  }

  try {
    await saveUser(JSON.stringify(user));
    await saveToken(token);
  } catch (error) {
    try {
      await deleteTokenUserCookie();
    } catch (cleanupError) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to clear partially saved authentication cookies:", cleanupError);
      }
    }
    throw error;
  }

  setAccessToken(token);
  setUserInfo(user);
}
