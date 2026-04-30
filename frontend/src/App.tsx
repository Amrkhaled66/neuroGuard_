import { AppRouter } from "@/app/router/AppRouter";
import QueryProvider from "@/shared/context/QueryProvider";
import AuthProvider from "@/features/auth/context/authContext";
import AlertHost from "@/shared/ui/AlertHost";

import { useAxiosInterceptor } from "@/shared/hooks/useAxiosInterceptor";

function AxiosInterceptorBootstrap() {
  useAxiosInterceptor();
  return null;
}

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AxiosInterceptorBootstrap />
        <AppRouter />
        <AlertHost />
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
