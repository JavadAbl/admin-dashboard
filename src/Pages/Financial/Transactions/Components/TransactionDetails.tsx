import {
  ArrowDownCircle,
  ArrowUpCircle,
  Banknote,
  CreditCard,
  Wallet,
  Landmark,
  Globe,
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
  ArrowLeft,
  MoreVertical,
  Copy,
  RefreshCw,
  Calendar,
  Hash,
  User,
  FileText,
  TrendingUp,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { formatCurrency, toPersianDate } from "../../../../Utils/AppUtils";
import type { TransactionMethod } from "../../../../Features/Financial/FinancialTypes/TransactionType";
import { useGetTransactions } from "../../../../Features/Financial/FinancialApi";
import { cn } from "../../../../Utils/Cn";

const methodInfo: Record<
  TransactionMethod,
  { label: string; icon: React.ReactNode }
> = {
  cash: { label: "نقدی", icon: <Banknote size={14} /> },
  bank_transfer: { label: "انتقال بانکی", icon: <Landmark size={14} /> },
  card: { label: "کارت بانکی", icon: <CreditCard size={14} /> },
  cheque: { label: "چک", icon: <Wallet size={14} /> },
  online: { label: "آنلاین", icon: <Globe size={14} /> },
};

export default function TransactionDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: transactions } = useGetTransactions();
  const transaction = transactions?.find((item) => item.id === id);

  if (!transactions || !transaction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-base-content/40">
        <Banknote size={48} className="mb-4" />
        <p className="font-medium">تراکنش یافت نشد</p>
        <button
          className="btn btn-ghost btn-sm mt-4"
          onClick={() => navigate("/Financial/Transactions")}
        >
          <ArrowLeft size={16} />
          بازگشت به لیست
        </button>
      </div>
    );
  }

  const isReceipt = transaction.type === "receipt";
  const currentMethod = methodInfo[transaction.method];

  const statusConfig: Record<
    string,
    { label: string; color: string; icon: React.ReactNode }
  > = {
    completed: {
      label: "تکمیل‌شده",
      color: "badge-success",
      icon: <CheckCircle2 size={14} />,
    },
    pending: {
      label: "در انتظار",
      color: "badge-warning",
      icon: <Clock size={14} />,
    },
    failed: {
      label: "ناموفق",
      color: "badge-error",
      icon: <XCircle size={14} />,
    },
    cancelled: {
      label: "لغو‌شده",
      color: "badge-ghost",
      icon: <Ban size={14} />,
    },
  };

  const currentStatus = statusConfig[transaction.status];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-3">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-base-content">
                جزئیات تراکنش
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-sm gap-2">
              <RefreshCw size={16} />
              بروزرسانی
            </button>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm btn-square"
              >
                <MoreVertical size={16} />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg"
              >
                <li>
                  <a
                    className="gap-2"
                    onClick={() =>
                      navigator.clipboard?.writeText(
                        transaction.transactionNumber,
                      )
                    }
                  >
                    <Copy size={16} />
                    کپی شماره تراکنش
                  </a>
                </li>
              </ul>
            </div>

            <button className="btn btn-ghost btn-circle btn-sm">
              <ArrowLeft
                size={20}
                onClick={() => navigate("/Financial/Transactions")}
              />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {/* Right Column */}
          <div className="flex flex-col gap-3 lg:col-span-1 h-full">
            {/* Transaction Info Card */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center",
                      isReceipt ? "bg-success/10" : "bg-error/10",
                    )}
                  >
                    {isReceipt ? (
                      <ArrowDownCircle size={24} className="text-success" />
                    ) : (
                      <ArrowUpCircle size={24} className="text-error" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "badge badge-lg gap-1 font-medium shadow-sm",
                      currentStatus.color,
                    )}
                  >
                    {currentStatus.icon}
                    {currentStatus.label}
                  </span>
                </div>

                <h2
                  className="card-title text-lg leading-relaxed font-mono"
                  dir="ltr"
                >
                  {transaction.transactionNumber}
                </h2>

                <p
                  className={cn(
                    "text-xl font-bold",
                    isReceipt ? "text-success" : "text-error",
                  )}
                >
                  {isReceipt ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                  <span className="text-[10px] font-normal mr-1">تومان</span>
                </p>

                {transaction.description && (
                  <p className="text-xs text-base-content/60 bg-base-200 rounded-lg p-2 mt-1">
                    {transaction.description}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card bg-base-100 shadow-sm flex-1">
              <div className="card-body">
                <h3 className="mb-3 font-semibold text-base-content/80">
                  دسترسی سریع
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="btn btn-outline btn-sm gap-2">
                    <Copy size={15} />
                    کپی لینک
                  </button>
                  <button className="btn btn-outline btn-sm gap-2">
                    <FileText size={15} />
                    فاکتور
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column */}
          <div className="flex flex-col gap-3 lg:col-span-2 h-full">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="stat bg-base-100 rounded-box shadow-sm p-4">
                <div className="mb-1 flex items-center gap-2 text-base-content/60">
                  <Banknote
                    size={16}
                    className={isReceipt ? "text-success" : "text-error"}
                  />
                  <span className="text-xs">مبلغ</span>
                </div>
                <div
                  className={cn(
                    "text-lg font-bold",
                    isReceipt ? "text-success" : "text-error",
                  )}
                >
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
              <div className="stat bg-base-100 rounded-box shadow-sm p-4">
                <div className="mb-1 flex items-center gap-2 text-base-content/60">
                  <CreditCard size={16} className="text-info" />
                  <span className="text-xs">روش</span>
                </div>
                <div className="text-lg font-bold text-info">
                  {currentMethod.label}
                </div>
              </div>
              <div className="stat bg-base-100 rounded-box shadow-sm p-4">
                <div className="mb-1 flex items-center gap-2 text-base-content/60">
                  <User size={16} className="text-warning" />
                  <span className="text-xs">طرف حساب</span>
                </div>
                <div className="text-sm font-bold">
                  {transaction.counterparty}
                </div>
              </div>
              <div className="stat bg-base-100 rounded-box shadow-sm p-4">
                <div className="mb-1 flex items-center gap-2 text-base-content/60">
                  <Calendar size={16} className="text-primary" />
                  <span className="text-xs">تاریخ</span>
                </div>
                <div className="text-sm font-bold text-primary">
                  {toPersianDate(transaction.date)}
                </div>
              </div>
            </div>

            {/* Transaction Info Table */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10">
                    <FileText size={18} className="text-info" />
                  </div>
                  <h3 className="font-semibold">اطلاعات تراکنش</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <tbody>
                      <tr>
                        <td className="w-48">
                          <div className="flex items-center gap-2 text-base-content/60">
                            <Hash size={15} />
                            شماره تراکنش
                          </div>
                        </td>
                        <td className="font-mono font-medium" dir="ltr">
                          {transaction.transactionNumber}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="flex items-center gap-2 text-base-content/60">
                            <TrendingUp size={15} />
                            نوع
                          </div>
                        </td>
                        <td>
                          <span
                            className={cn(
                              "badge gap-1",
                              isReceipt ? "badge-success" : "badge-error",
                            )}
                          >
                            {isReceipt ? (
                              <ArrowDownCircle size={12} />
                            ) : (
                              <ArrowUpCircle size={12} />
                            )}
                            {isReceipt ? "دریافت" : "پرداخت"}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="flex items-center gap-2 text-base-content/60">
                            <CreditCard size={15} />
                            روش پرداخت
                          </div>
                        </td>
                        <td className="flex items-center gap-2">
                          {currentMethod.icon}
                          {currentMethod.label}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="flex items-center gap-2 text-base-content/60">
                            <User size={15} />
                            طرف حساب
                          </div>
                        </td>
                        <td className="font-medium">
                          {transaction.counterparty}
                        </td>
                      </tr>
                      {transaction.reference && (
                        <tr>
                          <td>
                            <div className="flex items-center gap-2 text-base-content/60">
                              <Hash size={15} />
                              شماره مرجع
                            </div>
                          </td>
                          <td className="font-mono" dir="ltr">
                            {transaction.reference}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td>
                          <div className="flex items-center gap-2 text-base-content/60">
                            <Calendar size={15} />
                            تاریخ تراکنش
                          </div>
                        </td>
                        <td>{toPersianDate(transaction.date)}</td>
                      </tr>
                      <tr>
                        <td>
                          <div className="flex items-center gap-2 text-base-content/60">
                            <CheckCircle2 size={15} />
                            وضعیت
                          </div>
                        </td>
                        <td>
                          <span
                            className={cn("badge gap-1", currentStatus.color)}
                          >
                            {currentStatus.icon}
                            {currentStatus.label}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
