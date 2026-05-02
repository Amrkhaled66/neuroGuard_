import { AppRouter } from "@/app/router/AppRouter";
import QueryProvider from "@/shared/context/QueryProvider";
import AuthProvider from "@/features/auth/context/authContext";
import AlertHost from "@/shared/ui/AlertHost";
import { ErrorBoundary } from "react-error-boundary";
import { useAxiosInterceptor } from "@/shared/hooks/useAxiosInterceptor";
import ErrorFallback from "./shared/ui/ErrorFallback";
function AxiosInterceptorBootstrap() {
  useAxiosInterceptor();
  return null;
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
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
