import { useState } from "react";
import { Search, Plus, User } from "lucide-react";
import UsersTableView from "./Components/UsersTableView";
import UserCreate from "./Components/UserCreate";
import { useGetUsers } from "../../Features/Auth/AuthApi";
import type {
  UserRole,
  UserStatus,
} from "../../Features/Auth/AuthTypes/UserType";
import { formatNumber } from "../../Utils/AppUtils";

export default function Users() {
  const [modalsKey, setModalsKey] = useState(0);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [sortField, setSortField] = useState<"name" | "username" | "createdAt">(
    "createdAt",
  );

  const { data: users } = useGetUsers();
  if (!users) return null;

  // Filtered & sorted
  const filteredUsers = users
    .filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.mobile.includes(searchQuery);
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchStatus = statusFilter === "all" || u.isActive === statusFilter;
      return matchSearch && matchRole && matchStatus;
    })
    .sort((a, b) => {
      if (sortField === "name") return a.name.localeCompare(b.name, "fa");
      if (sortField === "username") return a.username.localeCompare(b.username);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleOpenCreate = () => {
    setIsOpenCreate(true);
  };
  const handleCloseCreate = () => {
    setIsOpenCreate(false);
    setModalsKey((val) => val + 1);
  };

  return (
    <>
      <div className="card bg-base-100 shadow-sm overflow-hidden h-full">
        <div className="card-body p-4 overflow-y-auto">
          {/* ── Toolbar ── */}
          <div className="border-b border-base-200 pb-4">
            <div className="flex flex-col gap-4">
              {/* Search & Create */}
              <div className="flex justify-between items-center">
                <div className="flex items-center form-control lg:w-[50%] xl:w-[35%] input input-bordered">
                  <Search className="w-4 h-4 text-base-content/40" />
                  <input
                    type="text"
                    placeholder="جستجو بر اساس نام، نام کاربری، ایمیل یا موبایل..."
                    className="input-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleOpenCreate}
                >
                  <Plus className="w-4 h-4" />
                  {" ایجاد کاربر"}
                </button>
              </div>

              {/* Filters Row */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                {/* Role Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-base-content/50">نقش:</span>
                  <div className="join">
                    {(
                      [
                        { key: "all", label: "همه" },
                        { key: "admin", label: "مدیر سیستم" },
                        { key: "manager", label: "مدیر" },
                        { key: "user", label: "کاربر" },
                        { key: "viewer", label: "ناظر" },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.key}
                        className={`join-item btn btn-sm ${
                          roleFilter === f.key ? "btn-primary" : ""
                        }`}
                        onClick={() => setRoleFilter(f.key)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px h-6 bg-base-200" />

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-base-content/50">وضعیت:</span>
                  <div className="join">
                    {(
                      [
                        { key: "all", label: "همه" },
                        { key: "active", label: "فعال" },
                        { key: "inactive", label: "غیرفعال" },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.key}
                        className={`join-item btn btn-sm ${
                          statusFilter === f.key ? "btn-primary" : ""
                        }`}
                        onClick={() => setStatusFilter(f.key)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px h-6 bg-base-200" />

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <select
                    className="select select-bordered select-sm"
                    value={sortField}
                    onChange={(e) =>
                      setSortField(
                        e.target.value as "name" | "username" | "createdAt",
                      )
                    }
                  >
                    <option value="createdAt">مرتب: جدیدترین</option>
                    <option value="name">مرتب: نام</option>
                    <option value="username">مرتب: نام کاربری</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-base-300" />

          <UsersTableView users={filteredUsers} />

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-base-content/40">
              <User className="w-16 h-16 mb-4" size={64} />
              <p className="font-medium">کاربری یافت نشد</p>
              <p className="text-sm mt-1">فیلتر یا عبارت جستجو را تغییر دهید</p>
            </div>
          )}

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-base-200">
              <p className="text-xs text-base-content/50">
                نمایش ۱ تا {formatNumber(filteredUsers.length)} از{" "}
                {formatNumber(users.length)} کاربر
              </p>
              <div className="join">
                <button className="join-item btn btn-sm btn-disabled">«</button>
                <button className="join-item btn btn-sm btn-primary">۱</button>
                <button className="join-item btn btn-sm">۲</button>
                <button className="join-item btn btn-sm">»</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <UserCreate
        key={`modal_${modalsKey}`}
        isOpen={isOpenCreate}
        onClose={handleCloseCreate}
      />
    </>
  );
}
