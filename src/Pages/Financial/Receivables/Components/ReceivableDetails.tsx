import {
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Ban,
  ArrowLeft,
  MoreVertical,
  Copy,
  RefreshCw,
  Calendar,
  DollarSign,
  Banknote,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useGetReceivables } from "../../../../Features/Financial/FinancialApi";
import {
  formatCurrency,
  toPersianDate,
  formatNumber,
} from "../../../../Utils/AppUtils";
import { cn } from "../../../../Utils/Cn";

export default function ReceivableDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: receivables } = useGetReceivables();
  const receivable = receivables?.find((item) => item.id === id);

  if (!receivables || !receivable) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-base-content/40">
        <FileText size={48} className="mb-4" />
        <p className="font-medium">طلب یافت نشد</p>
        <button
          className="btn btn-ghost btn-sm mt-4"
          onClick={() => navigate("/Financial/Receivables")}
        >
          <ArrowLeft size={16} />
          بازگشت به لیست
        </button>
      </div>
    );
  }

  const isOverdue = receivable.status === "overdue" && receivable.daysOverdue;
  const paidPercent =
    receivable.totalAmount > 0
      ? Math.round((receivable.paidAmount / receivable.totalAmount) * 100)
      : 0;

  const statusConfig: Record<
    string,
    { label: string; color: string; icon: React.ReactNode }
  > = {
    pending: {
      label: "در انتظار",
      color: "badge-warning",
      icon: <Clock size={14} />,
    },
    partial: {
      label: "پرداخت جزئی",
      color: "badge-info",
      icon: <CreditCard size={14} />,
    },
    paid: {
      label: "پرداخت‌شده",
      color: "badge-success",
      icon: <CheckCircle2 size={14} />,
    },
    overdue: {
      label: "سررسید گذشته",
      color: "badge-error",
      icon: <AlertTriangle size={14} />,
    },
    written_off: {
      label: "سوخت‌شده",
      color: "badge-ghost",
      icon: <Ban size={14} />,
    },
  };

  const currentStatus = statusConfig[receivable.status];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-3">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-base-content">جزئیات طلب</h1>
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
                        receivable.receivableNumber,
                      )
                    }
                  >
                    <Copy size={16} />
                    کپی شماره طلب
                  </a>
                </li>
              </ul>
            </div>
            <button className="btn btn-ghost btn-circle btn-sm">
              <ArrowLeft
                size={20}
                onClick={() => navigate("/Financial/Receivables")}
              />
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {/* Right Column */}
          <div className="flex flex-col gap-3 lg:col-span-1 h-full">
            {/* Info Card */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-warning/10 flex items-center justify-center">
                    <FileText size={24} className="text-warning" />
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
                <h2 className="card-title text-lg font-mono" dir="ltr">
                  {receivable.receivableNumber}
                </h2>
                <p className="text-xs text-base-content/60">
                  مشتری: {receivable.customerName}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="card bg-base-100 shadow-sm flex-1">
              <div className="card-body">
                <h3 className="mb-3 font-semibold text-base-content/80">
                  درصد وصول
                </h3>
                <div className="text-center mb-3">
                  <span className="text-4xl font-bold text-primary">
                    {paidPercent}
                  </span>
                  <span className="text-lg text-base-content/40">٪</span>
                </div>
                <div className="h-3 bg-base-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${paidPercent}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-base-content/60">
                  <span>
                    پرداخت‌شده: {formatCurrency(receivable.paidAmount)}
                  </span>
                  <span>
                    مانده: {formatCurrency(receivable.remainingAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column */}
          <div className="flex flex-col gap-3 lg:col-span-2 h-full">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="stat bg-base-100 rounded-box shadow-sm p-4">
                <div className="mb-1 flex items-center gap-2 text-base-content/60">
                  <DollarSign size={16} className="text-primary" />
                  <span className="text-xs">مبلغ کل</span>
                </div>
                <div className="text-lg font-bold text-primary">
                  {formatCurrency(receivable.totalAmount)}
                </div>
              </div>
              <div className="stat bg-base-100 rounded-box shadow-sm p-4">
                <div className="mb-1 flex items-center gap-2 text-base-content/60">
                  <CheckCircle2 size={16} className="text-success" />
                  <span className="text-xs">وصول‌شده</span>
                </div>
                <div className="text-lg font-bold text-success">
                  {formatCurrency(receivable.paidAmount)}
                </div>
              </div>
              <div className="stat bg-base-100 rounded-box shadow-sm p-4">
                <div className="mb-1 flex items-center gap-2 text-base-content/60">
                  <AlertTriangle size={16} className="text-error" />
                  <span className="text-xs">مانده</span>
                </div>
                <div className="text-lg font-bold text-error">
                  {formatCurrency(receivable.remainingAmount)}
                </div>
              </div>
              <div className="stat bg-base-100 rounded-box shadow-sm p-4">
                <div className="mb-1 flex items-center gap-2 text-base-content/60">
                  <Calendar size={16} className="text-warning" />
                  <span className="text-xs">سررسید</span>
                </div>
                <div
                  className={cn(
                    "text-sm font-bold",
                    isOverdue ? "text-error" : "text-warning",
                  )}
                >
                  {toPersianDate(receivable.dueDate)}
                </div>
              </div>
            </div>

            {/* Overdue Warning */}
            {isOverdue && (
              <div className="flex items-center gap-3 rounded-xl border border-error/30 bg-error/5 p-4">
                <AlertTriangle size={20} className="shrink-0 text-error" />
                <div>
                  <p className="font-medium text-error">هشدار سررسید</p>
                  <p className="text-sm text-base-content/70">
                    این طلب{" "}
                    <span className="font-bold text-error">
                      {formatNumber(receivable.daysOverdue ?? 0)} روز
                    </span>{" "}
                    از سررسید گذشته است.
                  </p>
                </div>
              </div>
            )}

            {/* Payment History */}
            <div className="card bg-base-100 shadow-sm flex-1">
              <div className="card-body">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                    <Banknote size={18} className="text-success" />
                  </div>
                  <h3 className="font-semibold">سوابق پرداخت</h3>
                </div>

                {receivable.payments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-base-content/40">
                    <Banknote size={28} className="mb-2 opacity-50" />
                    <p className="text-xs">هنوز پرداختی ثبت نشده است</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table table-sm table-zebra w-full">
                      <thead>
                        <tr className="bg-base-300/75 text-xs">
                          <th className="rounded-none">تاریخ</th>
                          <th>مبلغ</th>
                          <th>روش</th>
                          <th className="rounded-none">شرح</th>
                        </tr>
                      </thead>
                      <tbody>
                        {receivable.payments.map((pay) => (
                          <tr key={pay.id} className="text-xs">
                            <td>{toPersianDate(pay.date)}</td>
                            <td className="text-success font-medium">
                              {formatCurrency(pay.amount)}
                            </td>
                            <td>
                              {pay.method === "cash"
                                ? "نقدی"
                                : pay.method === "bank_transfer"
                                  ? "انتقال بانکی"
                                  : pay.method === "card"
                                    ? "کارت"
                                    : pay.method === "cheque"
                                      ? "چک"
                                      : "آنلاین"}
                            </td>
                            <td className="text-base-content/60">
                              {pay.description || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
