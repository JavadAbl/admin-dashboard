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
} from "lucide-react";
import Modal from "../../../../Components/Modals/Modal";
import { formatCurrency, toPersianDate } from "../../../../Utils/AppUtils";
import type {
  Transaction,
  TransactionMethod,
} from "../../../../Features/Financial/FinancialTypes/TransactionType";

const methodLabels: Record<
  TransactionMethod,
  { label: string; icon: React.ReactNode }
> = {
  cash: { label: "نقدی", icon: <Banknote size={14} /> },
  bank_transfer: { label: "انتقال بانکی", icon: <Landmark size={14} /> },
  card: { label: "کارت بانکی", icon: <CreditCard size={14} /> },
  cheque: { label: "چک", icon: <Wallet size={14} /> },
  online: { label: "آنلاین", icon: <Globe size={14} /> },
};

const statusIcons: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 size={12} />,
  pending: <Clock size={12} />,
  failed: <XCircle size={12} />,
  cancelled: <Ban size={12} />,
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
}

export default function TransactionViewModal({
  isOpen,
  onClose,
  transaction,
}: Props) {
  const methodInfo = methodLabels[transaction.method];
  const isReceipt = transaction.type === "receipt";

  return (
    <Modal
      title={isReceipt ? "جزئیات دریافت" : "جزئیات پرداخت"}
      description={transaction.transactionNumber}
      isOpen={isOpen}
      onClose={onClose}
      icon={isReceipt ? ArrowDownCircle : ArrowUpCircle}
      className="min-w-fit h-full"
    >
      <div className="p-5 gap-4 flex flex-col h-full">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div
            className={
              isReceipt
                ? "bg-success/10 rounded-lg p-3"
                : "bg-error/10 rounded-lg p-3"
            }
          >
            <p className="text-xs text-base-content/70 mb-1">مبلغ</p>
            <p
              className={`font-bold text-sm ${isReceipt ? "text-success" : "text-error"}`}
            >
              {formatCurrency(transaction.amount)}
            </p>
          </div>
          <div className="bg-info/10 rounded-lg p-3">
            <p className="text-xs text-base-content/70 mb-1">روش پرداخت</p>
            <div className="flex items-center gap-1">
              {methodInfo.icon}
              <p className="font-bold text-sm text-info">{methodInfo.label}</p>
            </div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3">
            <p className="text-xs text-base-content/70 mb-1">تاریخ</p>
            <p className="font-bold text-sm text-primary">
              {toPersianDate(transaction.date)}
            </p>
          </div>
        </div>

        {/* Counterparty Info */}
        <div className="bg-base-200/50 rounded-lg p-3 shrink-0 flex items-center justify-between">
          <div>
            <p className="text-xs text-base-content/60">
              {isReceipt ? "پرداخت‌کننده" : "دریافت‌کننده"}
            </p>
            <p className="text-sm font-medium">{transaction.counterparty}</p>
          </div>
          <div className="text-left">
            <p className="text-xs text-base-content/60">وضعیت</p>
            <span
              className={`badge ${
                transaction.status === "completed"
                  ? "badge-success"
                  : transaction.status === "pending"
                    ? "badge-warning"
                    : transaction.status === "failed"
                      ? "badge-error"
                      : "badge-ghost"
              } badge-sm gap-1`}
            >
              {statusIcons[transaction.status]}
              {transaction.status === "completed"
                ? "تکمیل‌شده"
                : transaction.status === "pending"
                  ? "در انتظار"
                  : transaction.status === "failed"
                    ? "ناموفق"
                    : "لغو‌شده"}
            </span>
          </div>
        </div>

        {/* Details Table */}
        <div className="flex-1 overflow-auto">
          <table className="table table-sm table-zebra">
            <thead>
              <tr className="bg-base-300/70">
                <th className="rounded-none text-xs">فیلد</th>
                <th className="rounded-none text-xs">مقدار</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-xs">
                <td className="text-base-content/60">شماره تراکنش</td>
                <td className="font-mono font-medium" dir="ltr">
                  {transaction.transactionNumber}
                </td>
              </tr>
              <tr className="text-xs">
                <td className="text-base-content/60">نوع</td>
                <td>
                  <span
                    className={`badge ${isReceipt ? "badge-success" : "badge-error"} badge-sm gap-1`}
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
              <tr className="text-xs">
                <td className="text-base-content/60">روش</td>
                <td className="flex items-center gap-1">
                  {methodInfo.icon}
                  {methodInfo.label}
                </td>
              </tr>
              {transaction.reference && (
                <tr className="text-xs">
                  <td className="text-base-content/60">شماره مرجع</td>
                  <td className="font-mono" dir="ltr">
                    {transaction.reference}
                  </td>
                </tr>
              )}
              {transaction.description && (
                <tr className="text-xs">
                  <td className="text-base-content/60">توضیحات</td>
                  <td>{transaction.description}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-base-200/50 rounded-xl p-3 space-y-1.5 shrink-0 text-xs">
          <div className="flex justify-between">
            <span className="text-base-content/60">شناسه:</span>
            <span className="font-mono">#{transaction.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/60">تاریخ ثبت:</span>
            <span className="font-medium">
              {toPersianDate(transaction.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
