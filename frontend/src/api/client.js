import axios from "axios";
import { getAuthToken, setAuthSession } from "../utils/auth";

export const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return "https://lms-platform-backend-six.vercel.app/api";
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
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

// Response interceptor for handling 401 Unauthorized / Invalid Token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshRes = await axios.post(`${getBaseUrl()}/auth/refresh-token`, {}, { withCredentials: true });
        const newToken = refreshRes.data?.accessToken || refreshRes.data?.token;
        if (newToken) {
          setAuthSession(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        console.warn("Session refresh attempt skipped:", refreshErr.message);
      }
    }

    return Promise.reject(error);
  }
);

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

export const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const apiBase = getBaseUrl();
  const origin = apiBase.replace(/\/api\/?$/, "");
  return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default apiClient;
