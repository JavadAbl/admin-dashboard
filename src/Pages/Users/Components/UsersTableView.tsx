import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Eye,
  UserIcon,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  XCircle,
  Shield,
  Activity,
  Mail,
  Phone,
} from "lucide-react";
import UserViewModal from "./UserViewModal";
import UserActivateModal from "./UserActivateModal";
import UserDeactivateModal from "./UserDeactivateModal";
import type {
  User,
  UserRole,
  UserStatus,
} from "../../../Features/Auth/AuthTypes/UserType";

const getRoleBadge = (
  role: UserRole,
): { cls: string; label: string; icon: React.ReactNode } | null => {
  switch (role) {
    case "admin":
      return {
        cls: "badge-error",
        label: "مدیر سیستم",
        icon: <Shield size={12} />,
      };
    case "manager":
      return {
        cls: "badge-warning",
        label: "مدیر",
        icon: <Shield size={12} />,
      };
    case "user":
      return {
        cls: "badge-info",
        label: "کاربر",
        icon: <UserIcon size={12} />,
      };
    case "viewer":
      return {
        cls: "badge-ghost",
        label: "ناظر",
        icon: <Activity size={12} />,
      };

    default:
      return null;
  }
};

const getStatusBadge = (
  status: UserStatus,
): { cls: string; label: string; icon: React.ReactNode } | null => {
  switch (status) {
    case "active":
      return {
        cls: "badge-success",
        label: "فعال",
        icon: <CheckCircle2 size={12} />,
      };
    case "inactive":
      return {
        cls: "badge-ghost",
        label: "غیرفعال",
        icon: <XCircle size={12} />,
      };

    default:
      return null;
  }
};

interface Props {
  users: User[];
}

export default function UsersTableView({ users }: Props) {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openModal, setOpenModal] = useState<
    "view" | "activate" | "deactivate" | null
  >(null);

  const handleCloseModal = () => {
    setOpenModal(null);
    setTimeout(() => {
      setSelectedUser(null);
    }, 200);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr className="bg-base-300/75 text-xs">
              <th className="rounded-none">نام کاربر</th>
              <th>نام کاربری</th>
              <th>ایمیل</th>
              <th>موبایل</th>
              <th>نقش</th>
              <th>وضعیت</th>
              <th className="rounded-none"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const roleBadge = getRoleBadge(user.role);
              const statusBadge = getStatusBadge(user.isActive);

              return (
                <tr
                  key={user.id}
                  className={user.isActive === "inactive" ? "opacity-50" : ""}
                >
                  {/* User Name */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <UserIcon size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p
                          className="text-[10px] text-base-content/40 font-mono"
                          dir="ltr"
                        >
                          #{user.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Username */}
                  <td>
                    <span className="text-sm font-mono font-medium" dir="ltr">
                      @{user.username}
                    </span>
                  </td>

                  {/* Email */}
                  <td className="text-xs text-base-content/70 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Mail size={12} className="text-base-content/40" />
                      <span dir="ltr">{user.email}</span>
                    </div>
                  </td>

                  {/* Mobile */}
                  <td className="text-xs text-base-content/70 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Phone size={12} className="text-base-content/40" />
                      <span className="font-mono" dir="ltr">
                        {user.mobile}
                      </span>
                    </div>
                  </td>

                  {/* Role */}
                  <td>
                    <span className={`badge badge-sm ${roleBadge?.cls} gap-1`}>
                      {roleBadge?.icon}
                      {roleBadge?.label}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`badge badge-sm ${statusBadge?.cls} gap-1`}
                    >
                      {statusBadge?.icon}
                      {statusBadge?.label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <button
                      className="btn btn-ghost btn-xs btn-circle"
                      popoverTarget={`popover-user-${user.id}`}
                      style={
                        {
                          anchorName: `--anchor-user-${user.id}`,
                        } as React.CSSProperties
                      }
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                    <ul
                      className="dropdown menu dropdown-start p-2 shadow-2xl bg-base-100 rounded-box min-w-40 border border-base-100 text-xs"
                      popover="auto"
                      id={`popover-user-${user.id}`}
                      style={
                        {
                          positionAnchor: `--anchor-user-${user.id}`,
                        } as React.CSSProperties
                      }
                    >
                      <li>
                        <a onClick={() => navigate(`/Users/${user.id}`)}>
                          <Eye size={18} />
                          مشاهده جزئیات
                        </a>
                      </li>

                      <li>
                        <a
                          onClick={() => {
                            setSelectedUser(user);
                            setOpenModal("view");
                          }}
                        >
                          <UserIcon size={18} />
                          مشاهده پروفایل
                        </a>
                      </li>

                      {user.isActive === "active" ? (
                        <li>
                          <a
                            className="text-error"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenModal("deactivate");
                            }}
                          >
                            <ToggleLeft size={18} />
                            غیرفعال‌سازی
                          </a>
                        </li>
                      ) : (
                        <li>
                          <a
                            className="text-success"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenModal("activate");
                            }}
                          >
                            <ToggleRight size={18} />
                            فعال‌سازی
                          </a>
                        </li>
                      )}
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {selectedUser && (
        <>
          {openModal === "view" && (
            <UserViewModal
              isOpen={openModal === "view"}
              onClose={handleCloseModal}
              user={selectedUser}
            />
          )}

          {openModal === "activate" && (
            <UserActivateModal
              isOpen={openModal === "activate"}
              onClose={handleCloseModal}
              user={selectedUser}
            />
          )}

          {openModal === "deactivate" && (
            <UserDeactivateModal
              isOpen={openModal === "deactivate"}
              onClose={handleCloseModal}
              user={selectedUser}
            />
          )}
        </>
      )}
    </>
  );
}
