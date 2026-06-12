import {
  UserIcon,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Modal from "../../../Components/Modals/Modal";
import type { User, UserRole } from "../../../Features/Auth/AuthTypes/UserType";
import { toPersianDate } from "../../../Utils/AppUtils";

const roleConfig: Record<UserRole, { label: string; color: string }> = {
  admin: { label: "مدیر سیستم", color: "badge-error" },
  manager: { label: "مدیر", color: "badge-warning" },
  user: { label: "کاربر", color: "badge-info" },
  viewer: { label: "ناظر", color: "badge-ghost" },
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export default function UserViewModal({ isOpen, onClose, user }: Props) {
  const currentRole = roleConfig[user.role as UserRole];

  return (
    <Modal
      title="پروفایل کاربر"
      description={`@${user.username}`}
      isOpen={isOpen}
      onClose={onClose}
      icon={UserIcon}
      className="min-w-fit h-full"
    >
      <div className="p-5 gap-4 flex flex-col h-full">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="bg-primary/10 rounded-lg p-3">
            <p className="text-xs text-base-content/70 mb-1">نام کامل</p>
            <p className="font-bold text-sm text-primary">{user.name}</p>
          </div>
          <div className="bg-success/10 rounded-lg p-3">
            <p className="text-xs text-base-content/70 mb-1">نقش</p>
            <p className="font-bold text-sm text-success">
              {currentRole.label}
            </p>
          </div>
          <div className="bg-info/10 rounded-lg p-3">
            <p className="text-xs text-base-content/70 mb-1">وضعیت</p>
            <div className="flex items-center gap-1">
              {user.isActive === "active" ? (
                <span className="badge badge-success badge-sm gap-1">
                  <CheckCircle2 size={12} />
                  فعال
                </span>
              ) : (
                <span className="badge badge-ghost badge-sm gap-1">
                  <XCircle size={12} />
                  غیرفعال
                </span>
              )}
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-base-200/50 rounded-lg p-3 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserIcon size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-base-content/60 font-mono" dir="ltr">
                @{user.username}
              </p>
            </div>
          </div>
          <span className={`badge ${currentRole.color} gap-1`}>
            {currentRole.label}
          </span>
        </div>

        {/* Contact Details */}
        <div className="flex-1 overflow-auto">
          <table className="table table-sm table-zebra">
            <thead>
              <tr className="bg-base-300/70">
                <th className="rounded-none text-xs">فیلد</th>
                <th className="text-xs">مقدار</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-xs">
                <td>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-info" />
                    ایمیل
                  </div>
                </td>
                <td className="font-mono" dir="ltr">
                  {user.email}
                </td>
              </tr>
              <tr className="text-xs">
                <td>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-success" />
                    موبایل
                  </div>
                </td>
                <td className="font-mono" dir="ltr">
                  {user.mobile}
                </td>
              </tr>
              <tr className="text-xs">
                <td>
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-warning" />
                    نقش
                  </div>
                </td>
                <td>
                  <span className={`badge ${currentRole.color} badge-sm gap-1`}>
                    {currentRole.label}
                  </span>
                </td>
              </tr>
              <tr className="text-xs">
                <td>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-primary" />
                    وضعیت
                  </div>
                </td>
                <td>
                  {user.isActive === "active" ? (
                    <span className="badge badge-success badge-sm gap-1">
                      <CheckCircle2 size={12} />
                      فعال
                    </span>
                  ) : (
                    <span className="badge badge-ghost badge-sm gap-1">
                      <XCircle size={12} />
                      غیرفعال
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="bg-base-200/50 rounded-xl p-3 space-y-1.5 shrink-0 text-xs">
          <div className="flex justify-between">
            <span className="text-base-content/60">شناسه کاربر:</span>
            <span className="font-mono font-medium">#{user.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/60">تاریخ عضویت:</span>
            <span className="font-medium">{toPersianDate(user.createdAt)}</span>
          </div>
          {user.updatedAt && (
            <div className="flex justify-between">
              <span className="text-base-content/60">آخرین بروزرسانی:</span>
              <span className="font-medium">
                {toPersianDate(user.updatedAt)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
