import React, { useState } from "react";
import { useGetUsers } from "../../../Features/Auth/AuthApi";
import type { User } from "../../../Features/Auth/AuthTypes/UserType";

interface Props {
  open: boolean;
  onClose: () => void;
  onStartChat: (user: User) => void;
  existingUserIds: string[]; // users already in conversations
}

const NewChatDialog: React.FC<Props> = ({
  open,
  onClose,
  onStartChat,
  existingUserIds,
}) => {
  const [search, setSearch] = useState("");

  const { data: users, isLoading } = useGetUsers();

  if (!users) return null;

  if (!open) return null;

  const filtered = (users ?? [])
    .filter((u: User) => u.isActive === "active")
    .filter(
      (u: User) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-base-300">
            <h3 className="font-bold text-lg">گفتگوی جدید</h3>
            <button
              className="btn btn-ghost btn-sm btn-circle"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-base-300">
            <input
              type="text"
              placeholder="جستجوی کاربر..."
              className="input input-bordered w-full text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          {/* User list */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <span className="loading loading-spinner loading-md text-primary"></span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-base-content/40">
                کاربری یافت نشد
              </div>
            ) : (
              filtered.map((user: User) => {
                const alreadyExists = existingUserIds.includes(user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      if (!alreadyExists) {
                        onStartChat(user);
                        onClose();
                      }
                    }}
                    className={`flex items-center gap-3 p-3 mx-2 rounded-box transition-colors ${
                      alreadyExists
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:bg-base-300"
                    }`}
                  >
                    <div className="avatar placeholder">
                      <div className="w-11 rounded-full bg-primary text-primary-content">
                        <span className="text-sm">
                          <img
                            src={"/images/user-avatar.webp"}
                            className="rounded-full"
                          />
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">
                        {user.name}
                      </h4>
                      <p className="text-xs text-base-content/60 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="badge badge-outline badge-xs">
                        {user.role === "admin"
                          ? "مدیر"
                          : user.role === "manager"
                            ? "سرپرست"
                            : user.role === "user"
                              ? "کاربر"
                              : "ناظر"}
                      </span>
                      {alreadyExists && (
                        <span className="text-[10px] text-base-content/40">
                          در گفتگوها
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewChatDialog;
