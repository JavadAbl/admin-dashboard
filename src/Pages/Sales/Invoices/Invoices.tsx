import { useState } from "react";
import { AlignJustify, Grid3X3, Search, Plus } from "lucide-react";
import { formatNumber } from "../../../Utils/AppUtils";
import InvoicesTableView from "./Components/InvoicesTableView";
import InvoiceCreate from "./Components/InvoiceCreate";
import { useGetInvoices } from "../../../Features/Sale/SaleApi";

export default function Invoices() {
  const [modalsKey, setModalsKey] = useState(0);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "paid" | "unpaid" | "overdue" | "cancelled"
  >("all");
  const [sortField, setSortField] = useState<
    "date" | "total" | "dueDate" | "invoiceNumber"
  >("date");

  const { data: invoices } = useGetInvoices();
  if (!invoices) return null;

  // Unique customers (for potential filter)
  const customers = [...new Set(invoices.map((inv) => inv.customerName))];

  // Filtered & sorted
  const filteredInvoices = invoices
    .filter((inv) => {
      const matchSearch =
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customerName.includes(searchQuery);
      const matchStatus = statusFilter === "all" || inv.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortField === "date")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortField === "total") return b.total - a.total;
      if (sortField === "dueDate")
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      return b.invoiceNumber.localeCompare(a.invoiceNumber);
    });

  // Stats
  const totalRevenue = filteredInvoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.total, 0);
  const totalUnpaid = filteredInvoices
    .filter((inv) => inv.status === "unpaid" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.total, 0);
  const overdueCount = filteredInvoices.filter(
    (inv) => inv.status === "overdue",
  ).length;

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
          {/* ── Summary Stats ── */}
          {/*  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
            <div className="stat bg-primary/5 rounded-box shadow-sm p-3">
              <div className="flex items-center gap-2 text-base-content/60">
                <span className="text-xs">کل فاکتورها</span>
              </div>
              <div className="text-lg font-bold text-primary">
                {formatNumber(filteredInvoices.length)}
              </div>
            </div>
            <div className="stat bg-success/5 rounded-box shadow-sm p-3">
              <div className="flex items-center gap-2 text-base-content/60">
                <span className="text-xs">درآمد پرداخت‌شده</span>
              </div>
              <div className="text-lg font-bold text-success">
                {totalRevenue.toLocaleString("fa-IR")} تومان
              </div>
            </div>
            <div className="stat bg-warning/5 rounded-box shadow-sm p-3">
              <div className="flex items-center gap-2 text-base-content/60">
                <span className="text-xs">مبالغ پرداخت‌نشده</span>
              </div>
              <div className="text-lg font-bold text-warning">
                {totalUnpaid.toLocaleString("fa-IR")} تومان
              </div>
            </div>
            <div className="stat bg-error/5 rounded-box shadow-sm p-3">
              <div className="flex items-center gap-2 text-base-content/60">
                <span className="text-xs">سررسید گذشته</span>
              </div>
              <div className="text-lg font-bold text-error">
                {formatNumber(overdueCount)} فاکتور
              </div>
            </div>
          </div> */}

          {/* ── Toolbar ── */}
          <div className="border-b border-base-200 pb-4">
            <div className="flex flex-col gap-4">
              {/* Search & Create */}
              <div className="flex justify-between items-center">
                <div className="flex items-center form-control lg:w-[50%] xl:w-[35%] input input-bordered">
                  <Search className="w-4 h-4 text-base-content/40" />
                  <input
                    type="text"
                    placeholder="جستجو بر اساس شماره فاکتور یا نام مشتری..."
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
                  {" ایجاد فاکتور"}
                </button>
              </div>

              {/* Filters Row */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                {/* Status Filter */}
                <div className="join">
                  {(
                    [
                      { key: "all", label: "همه" },
                      { key: "paid", label: "پرداخت‌شده" },
                      { key: "unpaid", label: "پرداخت‌نشده" },
                      { key: "overdue", label: "سررسید گذشته" },
                      { key: "cancelled", label: "لغو‌شده" },
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

                {/* Divider */}
                <div className="hidden lg:block w-px h-6 bg-base-200" />

                {/* Sort & View Toggle */}
                <div className="flex items-center gap-2">
                  <select
                    className="select select-bordered select-sm"
                    value={sortField}
                    onChange={(e) =>
                      setSortField(
                        e.target.value as
                          | "date"
                          | "total"
                          | "dueDate"
                          | "invoiceNumber",
                      )
                    }
                  >
                    <option value="date">مرتب: جدیدترین</option>
                    <option value="total">مرتب: بیشترین مبلغ</option>
                    <option value="dueDate">مرتب: نزدیک‌ترین سررسید</option>
                    <option value="invoiceNumber">مرتب: شماره فاکتور</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-base-300" />

          <InvoicesTableView invoices={filteredInvoices} />

          {/* Empty State */}
          {filteredInvoices.length === 0 && (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="font-medium">فاکتوری یافت نشد</p>
              <p className="text-sm mt-1">فیلتر یا عبارت جستجو را تغییر دهید</p>
            </div>
          )}

          {/* Pagination */}
          {filteredInvoices.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-base-200">
              <p className="text-xs text-base-content/50">
                نمایش ۱ تا {formatNumber(filteredInvoices.length)} از{" "}
                {formatNumber(invoices.length)} فاکتور
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

      <InvoiceCreate
        key={`modal_${modalsKey}`}
        isOpen={isOpenCreate}
        onClose={handleCloseCreate}
      />
    </>
  );
}
