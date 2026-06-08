import { useEffect } from "react";
import { useGetUser } from "../../Features/Auth/AuthApi";
import SidebarMenuItem, {
  type SidebarMenuItemType,
} from "./Components/SidebarMenuItem";

const menuItems: SidebarMenuItemType[] = [
  { name: "داشبورد", icon: "🏠", path: "/Dashboard" },
  {
    name: "محصولات",
    icon: "📦",
    path: "/Products",
  },
  {
    name: "مشتریان",
    icon: "👥",
    path: "/Customers",
  },
  { name: "تنضیمات", icon: "⚙️", path: "/Settings" },
  { name: "پیام ها", icon: "✉️", badge: 4, path: "/Messages" },
];

interface Props {
  isDesktopCollapsed: boolean;
  setIsDesktopCollapsed: (state: boolean) => any;
}

export default function Sidebar({
  isDesktopCollapsed,
  setIsDesktopCollapsed,
}: Props) {
  const { data: user, refetch: refetchUser } = useGetUser();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        const checkbox = document.getElementById(
          "my-drawer",
        ) as HTMLInputElement;
        if (checkbox) checkbox.checked = false;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!user) refetchUser();
  }, [refetchUser, user]);

  if (!user) return null;

  return (
    <div className="drawer-side z-40">
      {/* Overlay for mobile */}
      <label
        htmlFor="my-drawer"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>

      <aside
        className={`w-64 min-h-full bg-base-100 text-base-content transition-all duration-300 ease-in-out relative
                         ${isDesktopCollapsed ? "lg:w-16" : "lg:w-64"}`}
      >
        {/* Sidebar Header / Logo */}
        <div
          className={`p-4 border-b border-base-300 flex items-center ${
            isDesktopCollapsed ? "lg:justify-center" : "justify-between"
          }`}
        >
          <h2
            className={`text-2xl font-bold transition-opacity duration-200 ${
              isDesktopCollapsed ? "lg:hidden" : ""
            }`}
          >
            پنل ادمین
          </h2>

          {/* Close button inside sidebar for desktop */}
          <button
            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            className="btn btn-sm btn-ghost btn-square hidden lg:flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
              />
            </svg>
          </button>
        </div>

        {/* Sidebar Menu */}
        <ul className="menu p-2 lg:p-4 w-full">
          {menuItems.map((item) => (
            // Key is moved here to avoid React warnings
            <SidebarMenuItem
              key={item.name}
              item={item}
              isDesktopCollapsed={isDesktopCollapsed}
            />
          ))}
        </ul>

        {/* Sidebar Footer */}
        <div
          className={`absolute bottom-0 w-full p-4 border-t border-base-300 flex items-center ${
            isDesktopCollapsed ? "lg:justify-center" : "gap-3"
          }`}
        >
          <div className="avatar placeholder">
            <img
              src="/images/user-avatar.webp"
              className="rounded-full size-10"
              alt="User Avatar"
            />
          </div>
          <div className={`${isDesktopCollapsed ? "lg:hidden" : ""}`}>
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs opacity-60">Admin</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
