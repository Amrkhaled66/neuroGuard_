import { Outlet } from "react-router-dom";
import Header from "./Header";
const MainLayout = () => {
  return (
    <div className=" pb-8 mx-auto space-y-0">
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
