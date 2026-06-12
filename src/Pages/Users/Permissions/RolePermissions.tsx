import { useState, useMemo, useCallback } from "react";
import {
  Shield,
  LayoutDashboard,
  Users,
  Package,
  UserCheck,
  FileText,
  ShoppingCart,
  BarChart3,
  Settings,
  Check,
  X,
  RotateCcw,
  Save,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import {
  defaultRolePermissions,
  permissionActionMeta,
  permissionModules,
  roleMeta,
  type PermissionAction,
  type RolePermissions,
} from "../../../Features/Auth/AuthTypes/PermissionType";
import type { UserRole } from "../../../Features/Auth/AuthTypes/UserType";
import PermissionSaveModal from "./PermissionSaveModal";

// ============ Icon Map ============
const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={18} />,
  Users: <Users size={18} />,
  Shield: <Shield size={18} />,
  Package: <Package size={18} />,
  UserCheck: <UserCheck size={18} />,
  FileText: <FileText size={18} />,
  ShoppingCart: <ShoppingCart size={18} />,
  BarChart3: <BarChart3 size={18} />,
  Settings: <Settings size={18} />,
};

const actionIcons: Record<PermissionAction, React.ReactNode> = {
  view: <CheckCircle2 size={14} />,
  create: <Check size={14} />,
  edit: <AlertTriangle size={14} />,
  delete: <X size={14} />,
};

const allActions: PermissionAction[] = ["view", "create", "edit", "delete"];

// ============ Deep Clone Helper ============
function deepClonePermissions(
  perms: Record<UserRole, RolePermissions>,
): Record<UserRole, RolePermissions> {
  return Object.fromEntries(
    Object.entries(perms).map(([role, modules]) => [
      role,
      Object.fromEntries(
        Object.entries(modules).map(([mod, actions]) => [mod, [...actions]]),
      ),
    ]),
  ) as Record<UserRole, RolePermissions>;
}

// ============ Main Component ============
export default function RolePermissions() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [permissions, setPermissions] = useState<
    Record<UserRole, RolePermissions>
  >(() => deepClonePermissions(defaultRolePermissions));
  const [isOpenSaveModal, setIsOpenSaveModal] = useState(false);

  // Track if there are unsaved changes
  const hasChanges = useMemo(() => {
    const current = JSON.stringify(permissions);
    const original = JSON.stringify(defaultRolePermissions);
    return current !== original;
  }, [permissions]);

  // Current role permissions
  const currentPermissions = permissions[selectedRole];
  const currentMeta = roleMeta[selectedRole];

  // Count total permissions per role
  const permissionCounts = useMemo(() => {
    const counts = Object.fromEntries(
      (Object.keys(roleMeta) as UserRole[]).map((role) => {
        const perms = permissions[role];
        const granted = Object.values(perms).reduce(
          (sum, actions) => sum + actions.length,
          0,
        );
        const total = permissionModules.length * allActions.length;
        return [role, { granted, total }];
      }),
    );
    return counts;
  }, [permissions]);

  // Toggle a specific action for a module
  const togglePermission = useCallback(
    (moduleKey: string, action: PermissionAction) => {
      setPermissions((prev) => {
        const updated = deepClonePermissions(prev);
        const actions = updated[selectedRole][moduleKey];
        const idx = actions.indexOf(action);
        if (idx >= 0) {
          // Prevent removing "view" if other actions exist
          if (action === "view" && actions.length > 1) return prev;
          actions.splice(idx, 1);
        } else {
          // Adding "create"/"edit"/"delete" requires "view"
          if (action !== "view" && !actions.includes("view")) {
            actions.push("view");
          }
          actions.push(action);
        }
        return updated;
      });
    },
    [selectedRole],
  );

  // Toggle all actions for a module
  const toggleAllForModule = useCallback(
    (moduleKey: string) => {
      setPermissions((prev) => {
        const updated = deepClonePermissions(prev);
        const actions = updated[selectedRole][moduleKey];
        if (actions.length === allActions.length) {
          // Can't remove view if it's the dashboard — keep at least view
          updated[selectedRole][moduleKey] = [];
        } else {
          updated[selectedRole][moduleKey] = [...allActions];
        }
        return updated;
      });
    },
    [selectedRole],
  );

  // Grant all for role
  const grantAllForRole = useCallback(() => {
    setPermissions((prev) => {
      const updated = deepClonePermissions(prev);
      permissionModules.forEach((m) => {
        updated[selectedRole][m.key] = [...allActions];
      });
      return updated;
    });
  }, [selectedRole]);

  // Revoke all for role
  const revokeAllForRole = useCallback(() => {
    setPermissions((prev) => {
      const updated = deepClonePermissions(prev);
      permissionModules.forEach((m) => {
        updated[selectedRole][m.key] = [];
      });
      return updated;
    });
  }, [selectedRole]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setPermissions(deepClonePermissions(defaultRolePermissions));
    toast.info("مجوزها به حالت پیش‌فرض بازنشانی شد");
  }, []);

  // Save handler
  const handleSave = useCallback(() => {
    console.log("Saving permissions:", permissions);
    toast.success("مجوزها با موفقیت ذخیره شد");
    setIsOpenSaveModal(false);
  }, [permissions]);

  return (
    <>
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl space-y-3">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield size={20} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-base-content">
                  مجوزها و نقش‌ها
                </h1>
                <p className="text-xs text-base-content/60">
                  تعریف و مدیریت سطح دسترسی هر نقش در سیستم
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="btn btn-ghost btn-sm gap-2"
                onClick={resetToDefaults}
                disabled={!hasChanges}
              >
                <RotateCcw size={16} />
                بازنشانی
              </button>

              <button
                className="btn btn-primary btn-sm gap-2"
                onClick={() => setIsOpenSaveModal(true)}
                disabled={!hasChanges}
              >
                <Save size={16} />
                ذخیره تغییرات
              </button>
            </div>
          </div>

          {/* Unsaved Changes Banner */}
          {hasChanges && (
            <div className="flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/5 p-3">
              <AlertTriangle size={18} className="shrink-0 text-warning" />
              <p className="text-sm text-base-content/70">
                تغییرات ذخیره نشده‌ای وجود دارد. برای اعمال تغییرات، دکمه «ذخیره
                تغییرات» را بزنید.
              </p>
            </div>
          )}

          {/* Role Selector Cards */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {(Object.keys(roleMeta) as UserRole[]).map((role) => {
              const meta = roleMeta[role];
              const count = permissionCounts[role];
              const isSelected = selectedRole === role;

              return (
                <button
                  key={role}
                  className={`card shadow-sm border-2 transition-all text-right ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-base-100 hover:border-base-300"
                  }`}
                  onClick={() => setSelectedRole(role)}
                >
                  <div className="card-body p-3">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Shield size={16} className={meta.color} />
                      </div>
                      <span
                        className={`badge ${meta.badgeColor} badge-sm gap-1`}
                      >
                        {count.granted}/{count.total}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm mt-2">{meta.label}</h3>
                    <p className="text-[10px] text-base-content/50 leading-relaxed line-clamp-2">
                      {meta.description}
                    </p>
                    {/* Mini permission bar */}
                    <div className="mt-2 h-1.5 bg-base-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${(count.granted / count.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {/* Right Column - Role Info */}
            <div className="flex flex-col gap-3 lg:col-span-1 h-full">
              {/* Role Detail Card */}
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Shield size={24} className={currentMeta.color} />
                    </div>
                    <span
                      className={`badge ${currentMeta.badgeColor} badge-lg gap-1 font-medium shadow-sm`}
                    >
                      {currentMeta.label}
                    </span>
                  </div>

                  <h2 className="card-title text-lg leading-relaxed">
                    {currentMeta.label}
                  </h2>

                  <p className="text-xs text-base-content/60 leading-relaxed mt-1">
                    {currentMeta.description}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-base-content/60">مجوزهای فعال</span>
                      <span className="font-bold text-primary">
                        {permissionCounts[selectedRole].granted} از{" "}
                        {permissionCounts[selectedRole].total}
                      </span>
                    </div>
                    <div className="h-2 bg-base-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${(permissionCounts[selectedRole].granted / permissionCounts[selectedRole].total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card bg-base-100 shadow-sm flex-1">
                <div className="card-body">
                  <h3 className="mb-3 font-semibold text-base-content/80">
                    عملیات سریع
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      className="btn btn-outline btn-sm gap-2"
                      onClick={grantAllForRole}
                    >
                      <Check size={15} />
                      اعطای تمام مجوزها
                    </button>
                    <button
                      className="btn btn-outline btn-sm gap-2"
                      onClick={revokeAllForRole}
                    >
                      <Lock size={15} />
                      سلب تمام مجوزها
                    </button>
                    <button
                      className="btn btn-outline btn-sm gap-2"
                      onClick={() => {
                        setPermissions((prev) => ({
                          ...prev,
                          [selectedRole]: deepClonePermissions(
                            defaultRolePermissions,
                          )[selectedRole],
                        }));
                      }}
                    >
                      <RotateCcw size={15} />
                      بازنشانی این نقش
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Column - Permission Grid */}
            <div className="flex flex-col gap-3 lg:col-span-2 h-full">
              {/* Permission Table */}
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                        <CheckCircle2 size={18} className="text-success" />
                      </div>
                      <h3 className="font-semibold">ماتریس مجوزها</h3>
                    </div>
                    <span className="text-xs text-base-content/50">
                      {currentMeta.label}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="table table-sm w-full">
                      <thead>
                        <tr className="bg-base-300/75 text-xs">
                          <th className="rounded-none w-52">ماژول</th>
                          {allActions.map((action) => (
                            <th key={action} className="text-center w-24">
                              <div className="flex flex-col items-center gap-1">
                                <span>
                                  {permissionActionMeta[action].label}
                                </span>
                              </div>
                            </th>
                          ))}
                          <th className="rounded-none text-center w-20">همه</th>
                        </tr>
                      </thead>
                      <tbody>
                        {permissionModules.map((mod) => {
                          const modPerms = currentPermissions[mod.key] || [];
                          const hasAll = allActions.every((a) =>
                            modPerms.includes(a),
                          );

                          return (
                            <tr key={mod.key} className="hover">
                              {/* Module Name */}
                              <td>
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center shrink-0">
                                    {iconMap[mod.icon] || <Package size={16} />}
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">
                                      {mod.label}
                                    </p>
                                    <p className="text-[10px] text-base-content/40 max-w-40 truncate">
                                      {mod.description}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Action Toggles */}
                              {allActions.map((action) => {
                                const isGranted = modPerms.includes(action);
                                const isViewAction = action === "view";
                                const hasOtherActions = modPerms.some(
                                  (a) => a !== "view",
                                );
                                const isLocked =
                                  isViewAction && hasOtherActions;

                                return (
                                  <td key={action} className="text-center">
                                    <button
                                      className={`btn btn-xs btn-square ${
                                        isGranted
                                          ? "btn-primary"
                                          : "btn-ghost border border-base-300"
                                      }`}
                                      onClick={() =>
                                        togglePermission(mod.key, action)
                                      }
                                      title={
                                        isLocked
                                          ? "نمی‌توان مشاهده را در حالی که سایر مجوزها فعال هستند حذف کرد"
                                          : isGranted
                                            ? `سلب مجوز ${permissionActionMeta[action].label}`
                                            : `اعطای مجوز ${permissionActionMeta[action].label}`
                                      }
                                    >
                                      {isGranted ? (
                                        actionIcons[action]
                                      ) : isLocked ? (
                                        <Lock
                                          size={12}
                                          className="text-base-content/30"
                                        />
                                      ) : (
                                        <X
                                          size={12}
                                          className="text-base-content/20"
                                        />
                                      )}
                                    </button>
                                  </td>
                                );
                              })}

                              {/* Toggle All */}
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  className="checkbox checkbox-primary checkbox-xs"
                                  checked={hasAll}
                                  onChange={() => toggleAllForModule(mod.key)}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Permission Summary Cards */}
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10">
                      <BarChart3 size={18} className="text-info" />
                    </div>
                    <h3 className="font-semibold">خلاصه مجوزها</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {allActions.map((action) => {
                      const meta = permissionActionMeta[action];
                      const count = permissionModules.filter((m) =>
                        (currentPermissions[m.key] || []).includes(action),
                      ).length;

                      return (
                        <div
                          key={action}
                          className="rounded-xl bg-base-200/50 p-3 text-center ring-1 ring-base-300"
                        >
                          <p className="text-2xl font-bold text-primary">
                            {count}
                          </p>
                          <p className="text-xs text-base-content/60 mt-1">
                            {meta.label}
                          </p>
                          <div className="mt-2 h-1 bg-base-300 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                action === "view"
                                  ? "bg-info"
                                  : action === "create"
                                    ? "bg-success"
                                    : action === "edit"
                                      ? "bg-warning"
                                      : "bg-error"
                              }`}
                              style={{
                                width: `${(count / permissionModules.length) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Role Comparison */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Shield size={18} className="text-primary" />
                </div>
                <h3 className="font-semibold">مقایسه نقش‌ها</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="table table-sm table-zebra w-full">
                  <thead>
                    <tr className="bg-base-300/75 text-xs">
                      <th className="rounded-none w-52">ماژول</th>
                      {(Object.keys(roleMeta) as UserRole[]).map((role) => (
                        <th key={role} className="text-center">
                          <span
                            className={`badge ${roleMeta[role].badgeColor} badge-sm gap-1`}
                          >
                            {roleMeta[role].label}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissionModules.map((mod) => (
                      <tr key={mod.key}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-base-200 flex items-center justify-center shrink-0">
                              {iconMap[mod.icon] && (
                                <span className="scale-75">
                                  {iconMap[mod.icon]}
                                </span>
                              )}
                            </div>
                            <span className="text-sm font-medium">
                              {mod.label}
                            </span>
                          </div>
                        </td>
                        {(Object.keys(roleMeta) as UserRole[]).map((role) => {
                          const actions = permissions[role][mod.key] || [];
                          return (
                            <td key={role} className="text-center">
                              <div className="flex items-center justify-center gap-1 flex-wrap">
                                {allActions.map((action) => (
                                  <span
                                    key={action}
                                    className={`inline-block w-5 h-5 rounded text-[9px] font-bold leading-5 ${
                                      actions.includes(action)
                                        ? action === "view"
                                          ? "bg-info/20 text-info"
                                          : action === "create"
                                            ? "bg-success/20 text-success"
                                            : action === "edit"
                                              ? "bg-warning/20 text-warning"
                                              : "bg-error/20 text-error"
                                        : "bg-base-200 text-base-content/20"
                                    }`}
                                    title={permissionActionMeta[action].label}
                                  >
                                    {action === "view"
                                      ? "م"
                                      : action === "create"
                                        ? "ا"
                                        : action === "edit"
                                          ? "و"
                                          : "ح"}
                                  </span>
                                ))}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Confirmation Modal */}
      <PermissionSaveModal
        isOpen={isOpenSaveModal}
        onClose={() => setIsOpenSaveModal(false)}
        onConfirm={handleSave}
        role={selectedRole}
        permissions={permissions}
      />
    </>
  );
}
