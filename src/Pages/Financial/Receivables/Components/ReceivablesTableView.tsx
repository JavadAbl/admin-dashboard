import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Eye,
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Ban,
  BadgeDollarSign,
  User,
} from "lucide-react";
import ReceivableViewModal from "./ReceivableViewModal";
import RecordPaymentModal from "./RecordPaymentModal";
import type { Receivable, ReceivableStatus } from "../../AccountingType";
import { formatCurrency, formatNumber } from "../../../../Utils/AppUtils";

const getStatusBadge = (
  status: ReceivableStatus,
): { cls: string; label: string; icon: React.ReactNode } => {
  switch (status) {
    case "pending":
      return { cls: "badge-warning", label: "در انتظار", icon: <Clock size={12} /> };
    case "partial":
      return { cls: "badge-info", label: "پرداخت جزئی", icon: <CreditCard size={12} /> };
    case "paid":
      return { cls: "badge-success", label: "پرداخت‌شده", icon: <CheckCircle2 size={12} /> };
    case "overdue":
      return { cls: "badge-error", label: "سررسید گذشته", icon: <AlertTriangle size={12} /> };
    case "written_off":
      return { cls: "badge-ghost", label: "سوخت‌شده", icon: <Ban size={12} /> };
  }
};

interface Props {
  receivables: Receivable[];
}

export default function ReceivablesTableView({ receivables }: Props) {
  const navigate = useNavigate();
  const [selectedReceivable, setSelectedReceivable] = useState<Receivable | null>(null);
  const [openModal, setOpenModal] = useState<"view" | "pay" | null>(null);

  const handleCloseModal = () => {
    setOpenModal(null);
    setTimeout(() => setSelectedReceivable(null), 200);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr className="bg-base-300/75 text-xs">
              <th className="rounded-none">شماره</th>
              <th>مشتری</th>
              <th>مبلغ کل</th>
              <th>پرداخت‌شده</th>
              <th>مانده</th>
              <th>سررسید</th>
              <th>وضعیت</th>
              <th className="rounded-none"></th>
            </tr>
          </thead>
          <tbody>
            {receivables.map((rec) => {
              const statusBadge = getStatusBadge(rec.status);
              const isOverdue = rec.status === "overdue" && rec.daysOverdue;

              return (
                <tr
                  key={rec.id}
                  className={
                    rec.status === "written_off"
                      ? "opacity-50"
                      : rec.status === "overdue"
                        ? "bg-error/5"
                        : ""
                  }
                >
                  {/* Number */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center">
                        <FileText size={16} className="text-warning" />
                      </div>
                      <div>
                        <p className="font-medium font-mono text-sm" dir="ltr">
                          {rec.receivableNumber}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Customer */}
                  <td>
                    <div className="flex items-center gap-1">
                      <User size={12} className="text-base-content/40" />
                      <span className="text-sm font-medium">{rec.customerName}</span>
                    </div>
                  </td>

                  {/* Total Amount */}
                  <td className="text-sm font-medium text-primary whitespace-nowrap">
                    {formatCurrency(rec.totalAmount)}
                  </td>

                  {/* Paid */}
                  <td className="text-sm font-medium text-success whitespace-nowrap">
                    {formatCurrency(rec.paidAmount)}
                  </td>

                  {/* Remaining */}
                  <td className="text-sm font-bold text-error whitespace-nowrap">
                    {formatCurrency(rec.remainingAmount)}
                  </td>

                  {/* Due Date */}
                  <td>
                    <div className="flex flex-col">
                      <span className="text-xs text-base-content/70 whitespace-nowrap">
                        {new Date(rec.dueDate).toLocaleDateString("fa-IR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </span>
                      {isOverdue && (
                        <span className="text-[10px] text-error font-medium">
                          {formatNumber(rec.daysOverdue ?? 0)} روز تأخیر
                        </span>
                      )}
                    </div>
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
                      popoverTarget={`popover-rec-${rec.id}`}
                      style={{ anchorName: `--anchor-rec-${rec.id}` } as React.CSSProperties}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                    <ul
                      className="dropdown menu dropdown-start p-2 shadow-2xl bg-base-100 rounded-box min-w-40 border border-base-100 text-xs"
                      popover="auto"
                      id={`popover-rec-${rec.id}`}
                      style={{ positionAnchor: `--anchor-rec-${rec.id}` } as React.CSSProperties}
                    >
                      <li>
                        <a onClick={() => navigate(`/Accounting/Receivables/${rec.id}`)}>
                          <Eye size={18} />
                          مشاهده جزئیات
                        </a>
                      </li>
                      <li>
                        <a onClick={() => { setSelectedReceivable(rec); setOpenModal("view"); }}>
                          <FileText size={18} />
                          مشاهده اطلاعات
                        </a>
                      </li>
                      {(rec.status === "pending" || rec.status === "partial" || rec.status === "overdue") && (
                        <li>
                          <a onClick={() => { setSelectedReceivable(rec); setOpenModal("pay"); }}>
                            <CreditCard size={18} />
                            ثبت پرداخت
                          </a>
                        </li>
                      )}
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {selectedReceivable && (
        <>
          {openModal === "view" && (
            <ReceivableViewModal
              isOpen={openModal === "view"}
              onClose={handleCloseModal}
              receivable={selectedReceivable}
            />
          )}
          {openModal === "pay" && (
            <RecordPaymentModal
              isOpen={openModal === "pay"}
              onClose={handleCloseModal}
              receivable={selectedReceivable}
            />
          )}
        </>
      )}
    </>
  );
}
