import axios from "axios";
import { getAuthToken } from "../utils/auth";

const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const normalizeApiPath = (path) => {
  if (!path) return "/";
  if (/^https?:\/\//i.test(path)) {
    const url = new URL(path);
    const pathname = url.pathname.startsWith("/api") ? url.pathname.slice(4) || "/" : url.pathname;
    return `${pathname}${url.search}`;
  }
  return path.startsWith("/api/") ? path.slice(4) : path;
};

export const getApiErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  return error?.response?.data?.message || error?.message || fallback;
};

export default apiClient;
