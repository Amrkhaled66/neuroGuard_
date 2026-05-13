import axios from "axios";

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "/api";
const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, "");

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosPrivate = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosPrivate.interceptors.response.use(
  (response) => {
    return response.data.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
