import { useState } from "react";
import { Search, Plus, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { formatNumber } from "../../../Utils/AppUtils";
import TransactionsTableView from "./Components/TransactionsTableView";
import type {
  TransactionStatus,
  TransactionType,
} from "../../../Features/Financial/FinancialTypes/TransactionType";
import TransactionCreate from "./Components/TransactionCreate";
import { useGetTransactions } from "../../../Features/Financial/FinancialApi";

export default function Transactions() {
  const [modalsKey, setModalsKey] = useState(0);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">(
    "all",
  );
  const [sortField, setSortField] = useState<
    "date" | "amount" | "transactionNumber"
  >("date");

  const { data: transactions } = useGetTransactions();
  if (!transactions) return null;

  // Summary stats
  const totalReceipts = transactions
    .filter((t) => t.type === "receipt" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalPayments = transactions
    .filter((t) => t.type === "payment" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);
  const netCashFlow = totalReceipts - totalPayments;

  // Filtered & sorted
  const filteredTransactions = transactions
    .filter((txn) => {
      const matchSearch =
        txn.transactionNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        txn.counterparty.includes(searchQuery) ||
        txn.description?.includes(searchQuery);
      const matchType = typeFilter === "all" || txn.type === typeFilter;
      const matchStatus = statusFilter === "all" || txn.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    })
    .sort((a, b) => {
      if (sortField === "date")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortField === "amount") return b.amount - a.amount;
      return b.transactionNumber.localeCompare(a.transactionNumber);
    });

  const handleOpenCreate = () => setIsOpenCreate(true);
  const handleCloseCreate = () => {
    setIsOpenCreate(false);
    setModalsKey((val) => val + 1);
  };

  return (
    <>
      <div className="card bg-base-100 shadow-sm overflow-hidden h-full">
        <div className="card-body p-4 overflow-y-auto">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="stat bg-success/5 rounded-box ring-1 ring-success/20 p-3">
              <div className="flex items-center gap-2 text-success mb-1">
                <ArrowDownCircle size={16} />
                <span className="text-xs">کل دریافت‌ها</span>
              </div>
              <div className="text-lg font-bold text-success">
                {totalReceipts.toLocaleString("fa-IR")}
                <span className="text-[10px] font-normal mr-1">تومان</span>
              </div>
            </div>
            <div className="stat bg-error/5 rounded-box ring-1 ring-error/20 p-3">
              <div className="flex items-center gap-2 text-error mb-1">
                <ArrowUpCircle size={16} />
                <span className="text-xs">کل پرداخت‌ها</span>
              </div>
              <div className="text-lg font-bold text-error">
                {totalPayments.toLocaleString("fa-IR")}
                <span className="text-[10px] font-normal mr-1">تومان</span>
              </div>
            </div>
            <div
              className={`stat rounded-box ring-1 p-3 ${netCashFlow >= 0 ? "bg-primary/5 ring-primary/20" : "bg-error/5 ring-error/20"}`}
            >
              <div
                className={`flex items-center gap-2 mb-1 ${netCashFlow >= 0 ? "text-primary" : "text-error"}`}
              >
                <ArrowDownCircle size={16} />
                <span className="text-xs">موجودی خالص</span>
              </div>
              <div
                className={`text-lg font-bold ${netCashFlow >= 0 ? "text-primary" : "text-error"}`}
              >
                {netCashFlow.toLocaleString("fa-IR")}
                <span className="text-[10px] font-normal mr-1">تومان</span>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="border-b border-base-200 pb-4">
            <div className="flex flex-col gap-4">
              {/* Search & Create */}
              <div className="flex justify-between items-center">
                <div className="flex items-center form-control lg:w-[50%] xl:w-[35%] input input-bordered">
                  <Search className="w-4 h-4 text-base-content/40" />
                  <input
                    type="text"
                    placeholder="جستجو بر اساس شماره تراکنش، طرف حساب یا شرح..."
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
                  {" ثبت تراکنش"}
                </button>
              </div>

              {/* Filters Row */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                {/* Type Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-base-content/50">نوع:</span>
                  <div className="join">
                    {(
                      [
                        { key: "all", label: "همه" },
                        { key: "receipt", label: "دریافت" },
                        { key: "payment", label: "پرداخت" },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.key}
                        className={`join-item btn btn-sm ${typeFilter === f.key ? "btn-primary" : ""}`}
                        onClick={() => setTypeFilter(f.key)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="hidden lg:block w-px h-6 bg-base-200" />

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-base-content/50">وضعیت:</span>
                  <div className="join">
                    {(
                      [
                        { key: "all", label: "همه" },
                        { key: "completed", label: "تکمیل‌شده" },
                        { key: "pending", label: "در انتظار" },
                        { key: "failed", label: "ناموفق" },
                        { key: "cancelled", label: "لغو‌شده" },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.key}
                        className={`join-item btn btn-sm ${statusFilter === f.key ? "btn-primary" : ""}`}
                        onClick={() => setStatusFilter(f.key)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="hidden lg:block w-px h-6 bg-base-200" />

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <select
                    className="select select-bordered select-sm"
                    value={sortField}
                    onChange={(e) =>
                      setSortField(
                        e.target.value as
                          | "date"
                          | "amount"
                          | "transactionNumber",
                      )
                    }
                  >
                    <option value="date">مرتب: جدیدترین</option>
                    <option value="amount">مرتب: بیشترین مبلغ</option>
                    <option value="transactionNumber">
                      مرتب: شماره تراکنش
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-base-300" />

          <TransactionsTableView transactions={filteredTransactions} />

          {/* Empty State */}
          {filteredTransactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-base-content/40">
              <ArrowDownCircle className="mb-4" size={48} />
              <p className="font-medium">تراکنشی یافت نشد</p>
              <p className="text-sm mt-1">فیلتر یا عبارت جستجو را تغییر دهید</p>
            </div>
          )}

          {/* Pagination */}
          {filteredTransactions.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-base-200">
              <p className="text-xs text-base-content/50">
                نمایش ۱ تا {formatNumber(filteredTransactions.length)} از{" "}
                {formatNumber(transactions.length)} تراکنش
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

      <TransactionCreate
        key={`modal_${modalsKey}`}
        isOpen={isOpenCreate}
        onClose={handleCloseCreate}
      />
    </>
  );
}
