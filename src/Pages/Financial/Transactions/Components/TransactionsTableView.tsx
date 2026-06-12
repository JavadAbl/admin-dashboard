import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Eye,
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
import TransactionViewModal from "./TransactionViewModal";
import { formatCurrency } from "../../../../Utils/AppUtils";
import type {
  Transaction,
  TransactionMethod,
  TransactionStatus,
} from "../../../../Features/Financial/FinancialTypes/TransactionType";

const methodIcons: Record<TransactionMethod, React.ReactNode> = {
  cash: <Banknote size={12} />,
  bank_transfer: <Landmark size={12} />,
  card: <CreditCard size={12} />,
  cheque: <Wallet size={12} />,
  online: <Globe size={12} />,
};

const methodLabels: Record<TransactionMethod, string> = {
  cash: "نقدی",
  bank_transfer: "انتقال بانکی",
  card: "کارت بانکی",
  cheque: "چک",
  online: "آنلاین",
};

const getStatusBadge = (
  status: TransactionStatus,
): { cls: string; label: string; icon: React.ReactNode } => {
  switch (status) {
    case "completed":
      return {
        cls: "badge-success",
        label: "تکمیل‌شده",
        icon: <CheckCircle2 size={12} />,
      };
    case "pending":
      return {
        cls: "badge-warning",
        label: "در انتظار",
        icon: <Clock size={12} />,
      };
    case "failed":
      return {
        cls: "badge-error",
        label: "ناموفق",
        icon: <XCircle size={12} />,
      };
    case "cancelled":
      return { cls: "badge-ghost", label: "لغو‌شده", icon: <Ban size={12} /> };
  }
};

interface Props {
  transactions: Transaction[];
}

export default function TransactionsTableView({ transactions }: Props) {
  const navigate = useNavigate();
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);

  const handleCloseModal = () => {
    setOpenViewModal(false);
    setTimeout(() => setSelectedTransaction(null), 200);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr className="bg-base-300/75 text-xs">
              <th className="rounded-none">شماره تراکنش</th>
              <th>نوع</th>
              <th>طرف حساب</th>
              <th>مبلغ</th>
              <th>روش</th>
              <th>تاریخ</th>
              <th>وضعیت</th>
              <th className="rounded-none"></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => {
              const statusBadge = getStatusBadge(txn.status);
              const isReceipt = txn.type === "receipt";

              return (
                <tr
                  key={txn.id}
                  className={
                    txn.status === "cancelled"
                      ? "opacity-50"
                      : txn.status === "failed"
                        ? "bg-error/5"
                        : ""
                  }
                >
                  {/* Transaction Number */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          isReceipt ? "bg-success/10" : "bg-error/10"
                        }`}
                      >
                        {isReceipt ? (
                          <ArrowDownCircle size={16} className="text-success" />
                        ) : (
                          <ArrowUpCircle size={16} className="text-error" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium font-mono text-sm" dir="ltr">
                          {txn.transactionNumber}
                        </p>
                        {txn.description && (
                          <p className="text-[10px] text-base-content/40 max-w-50 truncate">
                            {txn.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td>
                    <span
                      className={`badge badge-sm ${isReceipt ? "badge-success" : "badge-error"} gap-1`}
                    >
                      {isReceipt ? (
                        <ArrowDownCircle size={10} />
                      ) : (
                        <ArrowUpCircle size={10} />
                      )}
                      {isReceipt ? "دریافت" : "پرداخت"}
                    </span>
                  </td>

                  {/* Counterparty */}
                  <td>
                    <span className="text-sm font-medium">
                      {txn.counterparty}
                    </span>
                  </td>

                  {/* Amount */}
                  <td
                    className={`text-sm font-medium whitespace-nowrap ${
                      isReceipt ? "text-success" : "text-error"
                    }`}
                  >
                    {isReceipt ? "+" : "-"}
                    {formatCurrency(txn.amount)}
                  </td>

                  {/* Method */}
                  <td>
                    <div className="flex items-center gap-1 text-xs text-base-content/70">
                      {methodIcons[txn.method]}
                      {methodLabels[txn.method]}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="text-xs text-base-content/70 whitespace-nowrap">
                    {new Date(txn.date).toLocaleDateString("fa-IR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>

                  {/* Status */}
                  <td>
                    <span className={`badge badge-sm ${statusBadge.cls} gap-1`}>
                      {statusBadge.icon}
                      {statusBadge.label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <button
                      className="btn btn-ghost btn-xs btn-circle"
                      popoverTarget={`popover-txn-${txn.id}`}
                      style={
                        {
                          anchorName: `--anchor-txn-${txn.id}`,
                        } as React.CSSProperties
                      }
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                    <ul
                      className="dropdown menu dropdown-start p-2 shadow-2xl bg-base-100 rounded-box min-w-40 border border-base-100 text-xs"
                      popover="auto"
                      id={`popover-txn-${txn.id}`}
                      style={
                        {
                          positionAnchor: `--anchor-txn-${txn.id}`,
                        } as React.CSSProperties
                      }
                    >
                      <li>
                        <a
                          onClick={() =>
                            navigate(`/Accounting/Transactions/${txn.id}`)
                          }
                        >
                          <Eye size={18} />
                          مشاهده جزئیات
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={() => {
                            setSelectedTransaction(txn);
                            setOpenViewModal(true);
                          }}
                        >
                          <Banknote size={18} />
                          مشاهده تراکنش
                        </a>
                      </li>
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedTransaction && openViewModal && (
        <TransactionViewModal
          isOpen={openViewModal}
          onClose={handleCloseModal}
          transaction={selectedTransaction}
        />
      )}
    </>
  );
}
