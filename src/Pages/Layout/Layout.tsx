import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import { storage } from "../../Utils/Storage";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState<boolean>(() =>
    storage.getSidebarCollapsed(),
  );

  useEffect(() => {
    storage.setSidebarCollapsed(isDesktopCollapsed);
  }, [isDesktopCollapsed]);

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isSidebarOpen}
        onChange={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="drawer-content ">
        <main className="flex-1 py-6 px-4 lg:px-10 bg-base-300/75 overflow-y-auto h-screen">
          <Outlet />
        </main>
      </div>

      <Sidebar
        isDesktopCollapsed={isDesktopCollapsed}
        setIsDesktopCollapsed={setIsDesktopCollapsed}
      />
    </div>
  );
};

export default Layout;
