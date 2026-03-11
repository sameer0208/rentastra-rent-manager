import axios from "axios";
import { getCurrentPropertyId } from "./propertyIdStore.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
});

/* Attach JWT token and current property so all requests are scoped */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const propertyId = getCurrentPropertyId();
  if (propertyId) {
    config.headers["X-Property-Id"] = propertyId;
  }
  return config;
});

/* On 401 (expired/invalid token), clear token and redirect to login */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/**
 * Fetch final settlement receipt (HTML) with auth and open in new window.
 * Uses the same api instance so the logged-in user's token is sent.
 */
export async function openFinalReceipt(guestId) {
  const res = await api.get(`/receipts/final/${guestId}`, {
    responseType: "text",
  });
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(res.data);
    w.document.close();
  }
}

export default api;
