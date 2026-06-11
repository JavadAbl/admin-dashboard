import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Eye,
  FileText,
  CreditCard,
  XCircle,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Ban,
} from "lucide-react";
import InvoiceViewModal from "./InvoiceViewModal";
import InvoiceMarkPaidModal from "./InvoiceMarkPaidModal";
import InvoiceCancelModal from "./InvoiceCancelModal";
import type {
  InvoiceStatus,
  Invoice,
} from "../../../../Features/Sale/SaleTypes/InvoiceType";
import { formatNumber, formatCurrency } from "../../../../Utils/AppUtils";

const getStatusBadge = (
  status: InvoiceStatus,
): { cls: string; label: string; icon: React.ReactNode } => {
  switch (status) {
    case "paid":
      return {
        cls: "badge-success",
        label: "پرداخت‌شده",
        icon: <CheckCircle2 size={12} />,
      };
    case "unpaid":
      return {
        cls: "badge-warning",
        label: "پرداخت‌نشده",
        icon: <Clock size={12} />,
      };
    case "overdue":
      return {
        cls: "badge-error",
        label: "سررسید گذشته",
        icon: <AlertTriangle size={12} />,
      };
    case "cancelled":
      return {
        cls: "badge-ghost",
        label: "لغو‌شده",
        icon: <Ban size={12} />,
      };
  }
};

interface Props {
  invoices: Invoice[];
}

export default function InvoicesTableView({ invoices }: Props) {
  const navigate = useNavigate();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [openModal, setOpenModal] = useState<"view" | "paid" | "cancel" | null>(
    null,
  );

  const handleCloseModal = () => {
    setOpenModal(null);
    setTimeout(() => {
      setSelectedInvoice(null);
    }, 200);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr className="bg-base-300/75 text-xs">
              <th className="rounded-none">شماره فاکتور</th>
              <th>مشتری</th>
              <th>تاریخ</th>
              <th>سررسید</th>
              <th>مبلغ کل</th>
              <th>اقلام</th>
              <th>وضعیت</th>
              <th className="rounded-none"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => {
              const badge = getStatusBadge(invoice.status);
              const isOverdue =
                invoice.status === "overdue" && invoice.daysOverdue;

              return (
                <tr
                  key={invoice.id}
                  className={
                    invoice.status === "cancelled"
                      ? "opacity-50"
                      : invoice.status === "overdue"
                        ? "bg-error/5"
                        : ""
                  }
                >
                  {/* Invoice Number */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium font-mono text-sm" dir="ltr">
                          {invoice.invoiceNumber}
                        </p>
                        {invoice.note && (
                          <p className="text-[10px] text-base-content/40 max-w-50 truncate">
                            {invoice.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Customer */}
                  <td>
                    <span className="text-sm font-medium">
                      {invoice.customerName}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="text-xs text-base-content/70 whitespace-nowrap">
                    {new Date(invoice.date).toLocaleDateString("fa-IR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>

                  {/* Due Date */}
                  <td>
                    <div className="flex flex-col">
                      <span className="text-xs text-base-content/70 whitespace-nowrap">
                        {new Date(invoice.dueDate).toLocaleDateString("fa-IR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </span>
                      {isOverdue && (
                        <span className="text-[10px] text-error font-medium">
                          {formatNumber(invoice.daysOverdue ?? 0)} روز تأخیر
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="text-sm font-medium text-primary whitespace-nowrap">
                    {formatCurrency(invoice.total)}
                  </td>

                  {/* Items Count */}
                  <td className="text-sm text-base-content/60">
                    {formatNumber(invoice.items.length)} قلم
                  </td>

                  {/* Status */}
                  <td>
                    <span className={`badge badge-sm ${badge.cls} gap-1`}>
                      {badge.icon}
                      {badge.label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <button
                      className="btn btn-ghost btn-xs btn-circle"
                      popoverTarget={`popover-invoice-${invoice.id}`}
                      style={
                        {
                          anchorName: `--anchor-invoice-${invoice.id}`,
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
                      id={`popover-invoice-${invoice.id}`}
                      style={
                        {
                          positionAnchor: `--anchor-invoice-${invoice.id}`,
                        } as React.CSSProperties
                      }
                    >
                      <li>
                        <a
                          onClick={() =>
                            navigate(`/Sales/Invoices/${invoice.id}`)
                          }
                        >
                          <Eye size={18} />
                          مشاهده جزئیات
                        </a>
                      </li>

                      <li>
                        <a
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setOpenModal("view");
                          }}
                        >
                          <FileText size={18} />
                          مشاهده اقلام
                        </a>
                      </li>

                      {(invoice.status === "unpaid" ||
                        invoice.status === "overdue") && (
                        <li>
                          <a
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setOpenModal("paid");
                            }}
                          >
                            <CreditCard size={18} />
                            ثبت پرداخت
                          </a>
                        </li>
                      )}

                      {invoice.status !== "cancelled" &&
                        invoice.status !== "paid" && (
                          <li>
                            <a
                              className="text-error"
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setOpenModal("cancel");
                              }}
                            >
                              <XCircle size={18} />
                              لغو فاکتور
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
      {selectedInvoice && (
        <>
          {openModal === "view" && (
            <InvoiceViewModal
              isOpen={openModal === "view"}
              onClose={handleCloseModal}
              invoice={selectedInvoice}
            />
          )}

          {openModal === "paid" && (
            <InvoiceMarkPaidModal
              isOpen={openModal === "paid"}
              onClose={handleCloseModal}
              invoice={selectedInvoice}
            />
          )}

          {openModal === "cancel" && (
            <InvoiceCancelModal
              isOpen={openModal === "cancel"}
              onClose={handleCloseModal}
              invoice={selectedInvoice}
            />
          )}
        </>
      )}
    </>
  );
}
