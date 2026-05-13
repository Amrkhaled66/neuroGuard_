import { AppRouter } from "@/app/router/AppRouter";
import QueryProvider from "@/shared/context/QueryProvider";
import AuthProvider from "@/features/auth/context/authContext";
import AlertHost from "@/shared/ui/AlertHost";
import {
  ErrorBoundary,
  type FallbackProps,
} from "react-error-boundary";
import type { ComponentType } from "react";
import { useAxiosInterceptor } from "@/shared/hooks/useAxiosInterceptor";
import ErrorFallback from "./shared/ui/ErrorFallback";
function AxiosInterceptorBootstrap() {
  useAxiosInterceptor();
  return null;
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback as ComponentType<FallbackProps>}
    >
      <QueryProvider>
        <AuthProvider>
          <AxiosInterceptorBootstrap />
          <AppRouter />
          <AlertHost />
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
