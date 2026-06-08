import { useState } from "react";
import { useNavigate } from "react-router";
import { MockData } from "../../../Utils/Api/MockData";
import {
  formatCurrency,
  formatNumber,
  toPersianDate,
} from "../../../Utils/AppUtils";
import Stars from "../../../Components/Utils/Stars";

const getStatusBadge = (status: string): { cls: string; label: string } => {
  switch (status) {
    case "vip":
      return { cls: "badge-warning", label: "VIP" };
    case "active":
      return { cls: "badge-success", label: "فعال" };
    case "inactive":
      return { cls: "badge-ghost", label: "غیرفعال" };

    default:
      return { cls: "", label: "" };
  }
};

export default function CustomersList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "vip"
  >("all");
  const [sortField, setSortField] = useState<
    "totalSpent" | "totalPurchases" | "lastPurchase"
  >("totalSpent");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Derived data
  const totalCustomers = 412;

  const filteredCustomers = MockData.customers
    .filter((c) => {
      const matchSearch =
        c.name.includes(searchQuery) ||
        c.email.includes(searchQuery) ||
        c.phone.includes(searchQuery);
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortField === "totalSpent") return b.totalSpent - a.totalSpent;
      if (sortField === "totalPurchases")
        return b.totalPurchases - a.totalPurchases;
      return (
        new Date(b.lastPurchase).getTime() - new Date(a.lastPurchase).getTime()
      );
    });

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-0">
        {/* Toolbar */}
        <div className="p-4 border-b border-base-200">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            {/* Search */}
            <div className="form-control flex-1">
              <div className="relative">
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="جستجو بر اساس نام، ایمیل یا شماره..."
                  className="input input-bordered input-sm w-full pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <div className="join">
                {(
                  [
                    { key: "all", label: "همه" },
                    { key: "vip", label: "VIP" },
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

              <div className="divider divider-vertical m-0 h-6 hidden lg:block" />

              {/* Sort */}
              <select
                className="select select-bordered select-sm"
                value={sortField}
                onChange={(e) =>
                  setSortField(
                    e.target.value as
                      | "totalSpent"
                      | "totalPurchases"
                      | "lastPurchase",
                  )
                }
              >
                <option value="totalSpent">مرتب: مبلغ خرید</option>
                <option value="totalPurchases">مرتب: تعداد سفارش</option>
                <option value="lastPurchase">مرتب: آخرین خرید</option>
              </select>

              {/* View Toggle */}
              <div className="join">
                <button
                  className={`join-item btn btn-sm ${
                    viewMode === "table" ? "btn-primary" : ""
                  }`}
                  onClick={() => setViewMode("table")}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </button>
                <button
                  className={`join-item btn btn-sm ${
                    viewMode === "grid" ? "btn-primary" : ""
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="px-4 py-2 bg-base-200/30 text-xs text-base-content/50">
          نمایش {formatNumber(filteredCustomers.length)} مشتری
        </div>

        {/* Table View */}
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="bg-base-200/50">
                  <th className="rounded-none">مشتری</th>
                  <th>شهر</th>
                  <th>وضعیت</th>
                  <th>تعداد سفارش</th>
                  <th>مجموع خرید</th>
                  <th>آخرین خرید</th>
                  <th>امتیاز</th>
                  <th className="rounded-none"></th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => {
                  const badge = getStatusBadge(customer.status);
                  return (
                    <tr
                      key={customer.id}
                      className="hover cursor-pointer"
                      onClick={() => navigate(`/Customers/${customer.id}`)}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-base-200 flex items-center justify-center text-lg">
                            {customer.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {customer.name}
                            </p>
                            <p className="text-xs text-base-content/50">
                              {customer.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm">{customer.city}</td>
                      <td>
                        <span className={`badge badge-sm ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="text-sm font-medium">
                        {formatNumber(customer.totalPurchases)}
                      </td>
                      <td className="text-sm font-medium text-primary">
                        {formatCurrency(customer.totalSpent)}
                      </td>
                      <td className="text-sm text-base-content/60">
                        {toPersianDate(customer.lastPurchase)}
                      </td>
                      <td>
                        <Stars rating={customer.rating} />
                      </td>
                      <td>
                        <div className="dropdown dropdown-left">
                          <label
                            tabIndex={0}
                            className="btn btn-ghost btn-xs btn-circle"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </label>
                          <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-44 border border-base-200"
                          >
                            <li>
                              <a
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/Customers/${customer.id}`);
                                }}
                              >
                                مشاهده پروفایل
                              </a>
                            </li>
                            <li>
                              <a onClick={(e) => e.stopPropagation()}>
                                ویرایش اطلاعات
                              </a>
                            </li>
                            <li>
                              <a onClick={(e) => e.stopPropagation()}>
                                تاریخچه خرید
                              </a>
                            </li>
                            <li>
                              <a onClick={(e) => e.stopPropagation()}>
                                ارسال پیام
                              </a>
                            </li>
                            <li>
                              <a
                                className="text-error"
                                onClick={(e) => e.stopPropagation()}
                              >
                                حذف مشتری
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
            {filteredCustomers.map((customer) => {
              const badge = getStatusBadge(customer.status);
              return (
                <div
                  key={customer.id}
                  className="card bg-base-50 border border-base-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/Customers/${customer.id}`)}
                >
                  <div className="card-body p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-base-200 flex items-center justify-center text-xl">
                          {customer.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{customer.name}</p>
                          <p className="text-xs text-base-content/50">
                            {customer.city}
                          </p>
                        </div>
                      </div>
                      <span className={`badge badge-sm ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-base-content/50">ایمیل:</span>
                        <span className="font-medium">{customer.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-base-content/50">
                          تعداد سفارش:
                        </span>
                        <span className="font-medium">
                          {formatNumber(customer.totalPurchases)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-base-content/50">
                          مجموع خرید:
                        </span>
                        <span className="font-medium text-primary">
                          {formatCurrency(customer.totalSpent)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-base-content/50">امتیاز:</span>
                        <Stars rating={customer.rating} />
                      </div>
                    </div>

                    <div className="card-actions justify-end mt-2">
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/Customers/${customer.id}`);
                        }}
                      >
                        مشاهده
                      </button>
                      <button
                        className="btn btn-primary btn-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        ارسال پیام
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-base-content/40">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="font-medium">مشتری‌ای یافت نشد</p>
            <p className="text-sm mt-1">فیلتر یا عبارت جستجو را تغییر دهید</p>
          </div>
        )}

        {/* Pagination */}
        {filteredCustomers.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-base-200">
            <p className="text-xs text-base-content/50">
              نمایش ۱ تا {formatNumber(filteredCustomers.length)} از{" "}
              {formatNumber(totalCustomers)} مشتری
            </p>
            <div className="join">
              <button className="join-item btn btn-sm btn-disabled">«</button>
              <button className="join-item btn btn-sm btn-primary">۱</button>
              <button className="join-item btn btn-sm">۲</button>
              <button className="join-item btn btn-sm">۳</button>
              <button className="join-item btn btn-sm">»</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
