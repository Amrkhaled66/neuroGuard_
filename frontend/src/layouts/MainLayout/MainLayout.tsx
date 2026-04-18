import { Outlet } from "react-router-dom";
import Header from "./Header";
import ScrollToTop from "@/shared/hooks/useScrollToTop";

const MainLayout = () => {
  return (
    <div className="space-y-0 pb-8">
      <ScrollToTop />
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
