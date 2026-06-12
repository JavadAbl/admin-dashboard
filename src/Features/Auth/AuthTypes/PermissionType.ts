import type { UserRole } from "./UserType";

// ============ Permission Actions ============
export type PermissionAction = "view" | "create" | "edit" | "delete";

export const permissionActionMeta: Record<
  PermissionAction,
  { label: string; color: string }
> = {
  view: { label: "مشاهده", color: "badge-info" },
  create: { label: "ایجاد", color: "badge-success" },
  edit: { label: "ویرایش", color: "badge-warning" },
  delete: { label: "حذف", color: "badge-error" },
};

// ============ Permission Modules ============
export interface PermissionModule {
  key: string;
  label: string;
  icon: string; // lucide icon name reference
  description: string;
}

export const permissionModules: PermissionModule[] = [
  {
    key: "dashboard",
    label: "داشبورد",
    icon: "LayoutDashboard",
    description: "دسترسی به داشبورد اصلی و آمار کلی سیستم",
  },
  {
    key: "users",
    label: "کاربران",
    icon: "Users",
    description: "مدیریت کاربران، ایجاد، ویرایش و غیرفعال‌سازی حساب‌ها",
  },
  {
    key: "roles",
    label: "نقش‌ها و مجوزها",
    icon: "Shield",
    description: "تعریف نقش‌ها و تنظیم سطح دسترسی هر نقش",
  },
  {
    key: "products",
    label: "محصولات",
    icon: "Package",
    description: "مدیریت محصولات، دسته‌بندی‌ها و برندها",
  },
  {
    key: "customers",
    label: "مشتریان",
    icon: "UserCheck",
    description: "مدیریت اطلاعات مشتریان و سوابق ارتباطی",
  },
  {
    key: "invoices",
    label: "فاکتورها",
    icon: "FileText",
    description: "صدور، ویرایش و مدیریت فاکتورهای فروش",
  },
  {
    key: "orders",
    label: "سفارشات",
    icon: "ShoppingCart",
    description: "پیگیری و مدیریت سفارشات مشتریان",
  },
  {
    key: "reports",
    label: "گزارشات",
    icon: "BarChart3",
    description: "مشاهده گزارشات فروش، موجودی و عملکرد",
  },
  {
    key: "settings",
    label: "تنظیمات",
    icon: "Settings",
    description: "تنظیمات عمومی سیستم، مالیات و پیکربندی",
  },
];

// ============ Role Permissions ============
export type RolePermissions = Record<string, PermissionAction[]>;

// Default permissions per role
export const defaultRolePermissions: Record<UserRole, RolePermissions> = {
  admin: Object.fromEntries(
    permissionModules.map((m) => [m.key, ["view", "create", "edit", "delete"] as PermissionAction[]]),
  ),
  manager: Object.fromEntries(
    permissionModules.map((m) => [
      m.key,
      m.key === "roles" || m.key === "settings"
        ? (["view"] as PermissionAction[])
        : (["view", "create", "edit", "delete"] as PermissionAction[]),
    ]),
  ),
  user: Object.fromEntries(
    permissionModules.map((m) => [
      m.key,
      m.key === "dashboard" || m.key === "reports"
        ? (["view"] as PermissionAction[])
        : m.key === "invoices" || m.key === "orders"
          ? (["view", "create"] as PermissionAction[])
          : (["view"] as PermissionAction[]),
    ]),
  ),
  viewer: Object.fromEntries(
    permissionModules.map((m) => [m.key, ["view"] as PermissionAction[]]),
  ),
};

// ============ Role Meta ============
export const roleMeta: Record<
  UserRole,
  { label: string; description: string; color: string; badgeColor: string }
> = {
  admin: {
    label: "مدیر سیستم",
    description: "دسترسی کامل به تمام بخش‌های سیستم بدون محدودیت",
    color: "text-error",
    badgeColor: "badge-error",
  },
  manager: {
    label: "مدیر",
    description: "دسترسی مدیریتی به عملیات‌ها بدون تنظیمات سیستمی",
    color: "text-warning",
    badgeColor: "badge-warning",
  },
  user: {
    label: "کاربر",
    description: "دسترسی محدود به عملیات‌های روزانه و مشاهده اطلاعات",
    color: "text-info",
    badgeColor: "badge-info",
  },
  viewer: {
    label: "ناظر",
    description: "فقط مشاهده اطلاعات بدون امکان ایجاد یا ویرایش",
    color: "text-base-content/50",
    badgeColor: "badge-ghost",
  },
};
