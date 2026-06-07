import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import { storage } from "../../Utils/Storage";

const Layout = () => {
  // 1. Initialize state from storage (defaults to false if nothing is found)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState<boolean>(() =>
    storage.getSidebarCollapsed(),
  );

  // 2. Save to storage whenever the desktop state changes
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

      <div className="drawer-content flex flex-col">
        {/*  <div className="navbar bg-base-100 border-b border-base-300">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>

          <div className="flex-1">
            <span className="text-lg font-bold px-2">داشبود</span>
          </div>
        </div> */}

        <main className="flex-1 p-6 bg-base-200 overflow-y-auto">
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
