import axios from "axios";

// Dev: Vite proxies /api to Express. Production (single server): same origin. Split hosting: set VITE_API_URL.
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });

api.interceptors.request.use((cfg) => {
  try {
    const token = localStorage.getItem("token");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
  } catch { /* storage unavailable */ }
  return cfg;
});

export const errMsg = (e, fallback = "Something went wrong. Please try again.") => e?.response?.data?.message || fallback;
export default api;
