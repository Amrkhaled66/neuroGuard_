import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "@/shared/lib/axios";
import { getToken } from "@/shared/utils/authStorage";
import { routePaths } from "@/app/router/paths";
import { useAuth } from "@/features/auth/context/useAuth";
import { Alert } from "@/shared/utils/alert";

export function useAxiosInterceptor() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        const token = getToken();

        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401 && isAuthenticated) {
          logout();
          navigate(routePaths.signin, { replace: true });

          Alert({
            title: "Session Expired",
            text: "Your session has expired. Please sign in again.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [logout, navigate, isAuthenticated]);
}
