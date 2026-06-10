import {
  AxiosError,
  create,
  isAxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { clearStoredSession, getAccessToken } from '@/features/auth/services/auth-storage.service';


const API_BASE_URL = 'http://192.168.1.12:8010';

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
};

function isApiEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  return typeof value === 'object' && value !== null && 'success' in value && 'data' in value;
}

function unwrapResponseData<T>(response: AxiosResponse<ApiEnvelope<T> | T>) {
  return isApiEnvelope<T>(response.data) ? response.data.data : response.data;
}

async function attachAuthorizationHeader(config: InternalAxiosRequestConfig) {
  const token = await getAccessToken();

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

export const axiosInstance = create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const axiosPrivate = create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosPrivate.interceptors.request.use(attachAuthorizationHeader, (error) => Promise.reject(error));
axiosInstance.interceptors.response.use(unwrapResponseData, (error) => Promise.reject(error));
axiosPrivate.interceptors.response.use(unwrapResponseData, (error) => Promise.reject(error));

export async function resetAxiosAuthState() {
  await clearStoredSession();
}

export function isAxiosUnauthorizedError(error: unknown) {
  return isAxiosError(error) && error.response?.status === 401;
}

export function getAxiosErrorStatus(error: unknown) {
  return isAxiosError(error) ? error.response?.status ?? 0 : 0;
}

export type { AxiosError };
