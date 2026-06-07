import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router";
import { cn } from "../../../Utils/Cn";

export type SidebarMenuItemType = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  badge?: number;
  children?: SidebarMenuItemType[];
};

interface Props {
  item: SidebarMenuItemType;
  isDesktopCollapsed: boolean;
}

const isAnyChildActive = (
  children: SidebarMenuItemType[],
  pathname: string,
) => {
  return children.some((child) => {
    if (child.children) {
      return isAnyChildActive(child.children, pathname);
    }
    return pathname === child.path;
  });
};

export default function SidebarMenuItem({ item, isDesktopCollapsed }: Props) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isParent = !!item.children && item.children.length > 0;

  const isActive = isParent
    ? isAnyChildActive(item.children!, location.pathname)
    : location.pathname === item.path;

  // Auto-open if a child is active
  useEffect(() => {
    if (isParent && isActive) {
      setIsOpen(true);
    }
  }, [isActive, isParent]);

  return (
    <li>
      {isParent ? (
        <details
          open={isOpen}
          className={isDesktopCollapsed ? "lg:hidden " : ""}
        >
          {/* The clickable parent trigger */}
          <summary
            onClick={(e) => {
              e.preventDefault();
              if (!isDesktopCollapsed) setIsOpen(!isOpen);
            }}
            className={cn(
              "flex items-center w-full rounded-btn cursor-pointer list-none",
              isActive ? "text-primary font-semibold" : "hover:bg-base-200",
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="flex-1 text-right">{item.name}</span>
          </summary>

          {/* The nested child menu */}
          <ul className="mt-1 pr-4 border-r-2 border-base-300 space-y-1">
            {item.children.map((child) => (
              <SidebarMenuItem
                key={child.name}
                item={child}
                isDesktopCollapsed={isDesktopCollapsed}
              />
            ))}
          </ul>
        </details>
      ) : (
        /* SINGLE ITEM */
        <Link
          to={item.path!}
          className={cn(
            "flex items-center rounded-btn",
            isActive ? "text-white bg-primary" : "hover:bg-base-200",
            isDesktopCollapsed && "lg:justify-center",
          )}
        >
          <span className={cn("text-lg", isDesktopCollapsed && "lg:mx-auto")}>
            {item.icon}
          </span>

          <span className={cn(isDesktopCollapsed && "lg:hidden")}>
            {item.name}
          </span>

          {item?.badge && item?.badge > 0 && (
            <span
              className={cn(
                "badge badge-sm badge-primary mr-auto",
                isDesktopCollapsed && "lg:hidden",
              )}
            >
              {item.badge}
            </span>
          )}
        </Link>
      )}
    </li>
  );
}
