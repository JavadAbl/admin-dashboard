import { useCallback, useState } from "react";
import { Save, AlertTriangle } from "lucide-react";
import Modal from "../../../Components/Modals/Modal";
import {
  type RolePermissions,
  roleMeta,
  defaultRolePermissions,
  permissionModules,
  permissionActionMeta,
} from "../../../Features/Auth/AuthTypes/PermissionType";
import type { UserRole } from "../../../Features/Auth/AuthTypes/UserType";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  role: UserRole;
  permissions: Record<UserRole, RolePermissions>;
}

export default function PermissionSaveModal({
  isOpen,
  onClose,
  onConfirm,
  role,
  permissions,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const currentMeta = roleMeta[role];
  const currentPerms = permissions[role];
  const defaultPerms = defaultRolePermissions[role];

  // Compute diff
  const changedModules = permissionModules.filter((mod) => {
    const current = (currentPerms[mod.key] || []).sort().join(",");
    const original = (defaultPerms[mod.key] || []).sort().join(",");
    return current !== original;
  });

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);
      try {
        await onConfirm();
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطای نامشخص");
      } finally {
        setIsLoading(false);
      }
    },
    [onConfirm],
  );

  return (
    <Modal
      title="ذخیره تغییرات مجوزها"
      description={`نقش: ${currentMeta.label}`}
      isOpen={isOpen}
      onClose={onClose}
      icon={Save}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="alert alert-error">
            <svg
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m2-2l2 2m-2-2l-2-2"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="alert alert-warning">
          <AlertTriangle size={20} className="shrink-0" />
          <div>
            <h3 className="font-bold">توجه!</h3>
            <div className="text-sm">
              تغییر مجوزها بر تمام کاربرانی که دارای نقش «{currentMeta.label}»
              هستند تأثیر خواهد گذاشت.
            </div>
          </div>
        </div>

        {/* Changed Modules Summary */}
        <div className="bg-base-200/50 rounded-lg p-3 border border-base-300">
          <p className="text-xs text-base-content/60 mb-2">
            تغییرات اعمال‌شده:
          </p>
          {changedModules.length === 0 ? (
            <p className="text-sm text-base-content/40">بدون تغییر</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {changedModules.map((mod) => {
                const currentActions = (currentPerms[mod.key] || []).sort();
                const originalActions = (defaultPerms[mod.key] || []).sort();

                const added = currentActions.filter(
                  (a) => !originalActions.includes(a),
                );
                const removed = originalActions.filter(
                  (a) => !currentActions.includes(a),
                );

                return (
                  <div
                    key={mod.key}
                    className="flex items-center justify-between text-xs bg-base-100 rounded-lg p-2"
                  >
                    <span className="font-medium">{mod.label}</span>
                    <div className="flex items-center gap-1">
                      {added.map((a) => (
                        <span
                          key={`add-${a}`}
                          className="badge badge-success badge-sm gap-0.5"
                        >
                          +
                          {
                            permissionActionMeta[
                              a as keyof typeof permissionActionMeta
                            ]?.label
                          }
                        </span>
                      ))}
                      {removed.map((a) => (
                        <span
                          key={`rem-${a}`}
                          className="badge badge-error badge-sm gap-0.5"
                        >
                          -
                          {
                            permissionActionMeta[
                              a as keyof typeof permissionActionMeta
                            ]?.label
                          }
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            className="btn btn-ghost btn-sm flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            انصراف
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-sm flex-1 gap-2"
            disabled={isLoading || changedModules.length === 0}
          >
            {isLoading && (
              <span className="loading loading-spinner loading-xs"></span>
            )}
            ذخیره تغییرات
          </button>
        </div>
      </form>
    </Modal>
  );
}
