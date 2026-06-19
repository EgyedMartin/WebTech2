import axios from "axios";

export const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api`;
export const TOKEN_KEY = "pk_token";

export const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;
  if (!detail) return err?.message || "Ismeretlen hiba történt";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((e) => (e?.msg ? e.msg : JSON.stringify(e))).join(" ");
  }
  return JSON.stringify(detail);
};
