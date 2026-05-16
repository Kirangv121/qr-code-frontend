import axios from "axios";

function normalizeApiBaseURL(envUrl) {
  const fallback = "http://localhost:5000";
  let u = typeof envUrl === "string" && envUrl.trim() ? envUrl.trim() : fallback;
  u = u.replace(/\/+$/, "");
  if (!/\/api$/i.test(u)) {
    u = `${u}/api`;
  }
  return u;
}

/**
 * Split deploy (frontend + backend on different Vercel URLs):
 *   VITE_API_URL=https://your-backend.vercel.app
 *   Do NOT set VITE_RELATIVE_API=true
 *
 * Single Vercel project (same domain):
 *   VITE_RELATIVE_API=true
 */
function resolveApiBaseURL() {
  if (import.meta.env.VITE_RELATIVE_API === "true") {
    return "/api";
  }
  if (import.meta.env.VITE_API_URL) {
    return normalizeApiBaseURL(import.meta.env.VITE_API_URL);
  }
  if (import.meta.env.DEV) {
    return "/api";
  }
  console.warn("[API] VITE_API_URL is not set — defaulting to localhost");
  return normalizeApiBaseURL("http://localhost:5000");
}

const baseURL = resolveApiBaseURL();

export const api = axios.create({ baseURL });

export function setAuthToken(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

export function loadStoredToken() {
  return null;
}
