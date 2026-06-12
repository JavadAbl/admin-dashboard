import { useState } from "react";
import { Search, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatNumber } from "../../../Utils/AppUtils";
import ReceivablesTableView from "./Components/ReceivablesTableView";
import { useGetReceivables } from "../../../Features/Financial/FinancialApi";
import type { ReceivableStatus } from "../../../Features/Financial/FinancialTypes/ReceivablesType";
import { cn } from "../../../Utils/Cn";

export default function Receivables() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReceivableStatus | "all">(
    "all",
  );
  const [sortField, setSortField] = useState<
    "dueDate" | "remainingAmount" | "issueDate"
  >("dueDate");

  const { data: receivables } = useGetReceivables();
  if (!receivables) return null;

  // Summary stats
  const totalReceivables = receivables.reduce(
    (sum, r) => sum + r.totalAmount,
    0,
  );
  const totalPaid = receivables.reduce((sum, r) => sum + r.paidAmount, 0);
  const totalRemaining = receivables.reduce(
    (sum, r) => sum + r.remainingAmount,
    0,
  );
  const overdueCount = receivables.filter((r) => r.status === "overdue").length;

  // Filtered & sorted
  const filteredReceivables = receivables
    .filter((rec) => {
      const matchSearch =
        rec.receivableNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        rec.customerName.includes(searchQuery);
      const matchStatus = statusFilter === "all" || rec.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortField === "dueDate")
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (sortField === "remainingAmount")
        return b.remainingAmount - a.remainingAmount;
      return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
    });

  return (
    <>
      <div className="card bg-base-100 shadow-sm overflow-hidden h-full">
        <div className="card-body p-4 overflow-y-auto">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="stat bg-primary/5 rounded-box ring-1 ring-primary/20 p-3">
              <div className="flex items-center gap-2 text-primary mb-1">
                <FileText size={16} />
                <span className="text-xs">کل مطالبات</span>
              </div>
              <div className="text-lg font-bold text-primary">
                {totalReceivables.toLocaleString("fa-IR")}
                <span className="text-[10px] font-normal mr-1">تومان</span>
              </div>
            </div>
            <div className="stat bg-success/5 rounded-box ring-1 ring-success/20 p-3">
              <div className="flex items-center gap-2 text-success mb-1">
                <CheckCircle2 size={16} />
                <span className="text-xs">وصول‌شده</span>
              </div>
              <div className="text-lg font-bold text-success">
                {totalPaid.toLocaleString("fa-IR")}
                <span className="text-[10px] font-normal mr-1">تومان</span>
              </div>
            </div>
            <div className="stat bg-error/5 rounded-box ring-1 ring-error/20 p-3">
              <div className="flex items-center gap-2 text-error mb-1">
                <AlertTriangle size={16} />
                <span className="text-xs">مانده</span>
              </div>
              <div className="text-lg font-bold text-error">
                {totalRemaining.toLocaleString("fa-IR")}
                <span className="text-[10px] font-normal mr-1">تومان</span>
              </div>
            </div>
            <div className="stat bg-warning/5 rounded-box ring-1 ring-warning/20 p-3">
              <div className="flex items-center gap-2 text-warning mb-1">
                <AlertTriangle size={16} />
                <span className="text-xs">سررسید گذشته</span>
              </div>
              <div className="text-lg font-bold text-warning">
                {overdueCount.toLocaleString("fa-IR")}
                <span className="text-[10px] font-normal mr-1">طلب</span>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="border-b border-base-200 pb-4">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center form-control lg:w-[50%] xl:w-[35%] input input-bordered">
                  <Search className="w-4 h-4 text-base-content/40" />
                  <input
                    type="text"
                    placeholder="جستجو بر اساس شماره طلب یا نام مشتری..."
                    className="input-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-base-content/50">وضعیت:</span>
                  <div className="join">
                    {(
                      [
                        { key: "all", label: "همه" },
                        { key: "pending", label: "در انتظار" },
                        { key: "partial", label: "پرداخت جزئی" },
                        { key: "paid", label: "پرداخت‌شده" },
                        { key: "overdue", label: "سررسید گذشته" },
                        { key: "written_off", label: "سوخت‌شده" },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.key}
                        className={cn(
                          "join-item btn btn-sm",
                          statusFilter === f.key && "btn-primary",
                        )}
                        onClick={() => setStatusFilter(f.key)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="hidden lg:block w-px h-6 bg-base-200" />

                <div className="flex items-center gap-2">
                  <select
                    className="select select-bordered select-sm"
                    value={sortField}
                    onChange={(e) =>
                      setSortField(
                        e.target.value as
                          | "dueDate"
                          | "remainingAmount"
                          | "issueDate",
                      )
                    }
                  >
                    <option value="dueDate">مرتب: نزدیک‌ترین سررسید</option>
                    <option value="remainingAmount">مرتب: بیشترین مانده</option>
                    <option value="issueDate">مرتب: جدیدترین</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-base-300" />

          <ReceivablesTableView receivables={filteredReceivables} />

          {/* Empty State */}
          {filteredReceivables.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-base-content/40">
              <FileText className="mb-4" size={48} />
              <p className="font-medium">طلبی یافت نشد</p>
              <p className="text-sm mt-1">فیلتر یا عبارت جستجو را تغییر دهید</p>
            </div>
          )}

          {/* Pagination */}
          {filteredReceivables.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-base-200">
              <p className="text-xs text-base-content/50">
                نمایش ۱ تا {formatNumber(filteredReceivables.length)} از{" "}
                {formatNumber(receivables.length)} طلب
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
    </>
  );
}
