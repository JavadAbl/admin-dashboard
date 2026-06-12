import { FileText, User } from "lucide-react";
import Modal from "../../../../Components/Modals/Modal";
import { formatCurrency, toPersianDate } from "../../../../Utils/AppUtils";
import type { Receivable } from "../../../../Features/Financial/FinancialTypes/ReceivablesType";
import { cn } from "../../../../Utils/Cn";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  receivable: Receivable;
}

export default function ReceivableViewModal({
  isOpen,
  onClose,
  receivable,
}: Props) {
  const paidPercent =
    receivable.totalAmount > 0
      ? Math.round((receivable.paidAmount / receivable.totalAmount) * 100)
      : 0;

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: "در انتظار", color: "badge-warning" },
    partial: { label: "پرداخت جزئی", color: "badge-info" },
    paid: { label: "پرداخت‌شده", color: "badge-success" },
    overdue: { label: "سررسید گذشته", color: "badge-error" },
    written_off: { label: "سوخت‌شده", color: "badge-ghost" },
  };

  const currentStatus = statusConfig[receivable.status];

  return (
    <Modal
      title="جزئیات طلب"
      description={receivable.receivableNumber}
      isOpen={isOpen}
      onClose={onClose}
      icon={FileText}
      className="min-w-fit h-full"
    >
      <div className="p-5 gap-4 flex flex-col h-full">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="bg-primary/10 rounded-lg p-3">
            <p className="text-xs text-base-content/70 mb-1">مبلغ کل</p>
            <p className="font-bold text-sm text-primary">
              {formatCurrency(receivable.totalAmount)}
            </p>
          </div>
          <div className="bg-success/10 rounded-lg p-3">
            <p className="text-xs text-base-content/70 mb-1">پرداخت‌شده</p>
            <p className="font-bold text-sm text-success">
              {formatCurrency(receivable.paidAmount)}
            </p>
          </div>
          <div className="bg-error/10 rounded-lg p-3">
            <p className="text-xs text-base-content/70 mb-1">مانده</p>
            <p className="font-bold text-sm text-error">
              {formatCurrency(receivable.remainingAmount)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-base-200/50 rounded-lg p-3 shrink-0">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-base-content/60">درصد وصول</span>
            <span className="text-sm font-bold text-primary">
              {paidPercent}٪
            </span>
          </div>
          <div className="h-2 bg-base-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${paidPercent}%` }}
            />
          </div>
        </div>

        {/* Customer & Status */}
        <div className="bg-base-200/50 rounded-lg p-3 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={16} className="text-base-content/40" />
            <div>
              <p className="text-xs text-base-content/60">مشتری</p>
              <p className="text-sm font-medium">{receivable.customerName}</p>
            </div>
          </div>
          <span className={cn("badge gap-1", currentStatus.color)}>
            {currentStatus.label}
          </span>
        </div>

        {/* Payments History */}
        {receivable.payments.length > 0 && (
          <div className="flex-1 overflow-auto">
            <p className="text-xs font-bold text-base-content/60 mb-2">
              سوابق پرداخت
            </p>
            <table className="table table-sm table-zebra">
              <thead>
                <tr className="bg-base-300/70">
                  <th className="rounded-none text-xs">تاریخ</th>
                  <th className="text-xs">مبلغ</th>
                  <th className="rounded-none text-xs">روش</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="bg-base-200/50 rounded-xl p-3 space-y-1.5 shrink-0 text-xs">
          <div className="flex justify-between">
            <span className="text-base-content/60">تاریخ صدور:</span>
            <span className="font-medium">
              {toPersianDate(receivable.issueDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/60">سررسید:</span>
            <span
              className={cn(
                "font-medium",
                receivable.status === "overdue" && "text-error",
              )}
            >
              {toPersianDate(receivable.dueDate)}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
