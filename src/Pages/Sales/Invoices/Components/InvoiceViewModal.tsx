import { FileText } from "lucide-react";
import type { Invoice } from "../../../../Features/Sale/SaleTypes/InvoiceType";
import Modal from "../../../../Components/Modals/Modal";
import { formatCurrency, formatNumber } from "../../../../Utils/AppUtils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
}

export default function InvoiceViewModal({ isOpen, onClose, invoice }: Props) {
  const totalItems = invoice.items.reduce((s, it) => s + it.quantity, 0);
  const totalDiscount = invoice.items.reduce(
    (s, it) => s + (it.quantity * it.unitPrice * it.discount) / 100,
    0,
  );

  return (
    <Modal
      title="اقلام فاکتور"
      description={invoice.invoiceNumber}
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
              {formatCurrency(invoice.total)}
            </p>
          </div>
          <div className="bg-success/10 rounded-lg p-3">
            <p className="text-xs text-base-content/70 mb-1">تعداد اقلام</p>
            <p className="font-bold text-sm text-success">
              {formatNumber(totalItems)} عدد
            </p>
          </div>
          <div className="bg-info/10 rounded-lg p-3">
            <p className="text-xs text-base-content/70 mb-1">تخفیف کل</p>
            <p className="font-bold text-sm text-info">
              {formatCurrency(totalDiscount)}
            </p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-base-200/50 rounded-lg p-3 shrink-0 flex items-center justify-between">
          <div>
            <p className="text-xs text-base-content/60">مشتری</p>
            <p className="text-sm font-medium">{invoice.customerName}</p>
          </div>
          <div className="text-left">
            <p className="text-xs text-base-content/60">تاریخ صدور</p>
            <p className="text-sm font-medium">
              {new Date(invoice.date).toLocaleDateString("fa-IR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="flex-1 overflow-auto">
          <table className="table table-sm table-zebra">
            <thead>
              <tr className="bg-base-300/70">
                <th className="rounded-none text-xs">محصول</th>
                <th className="text-xs">تعداد</th>
                <th className="text-xs">قیمت واحد</th>
                <th className="text-xs">تخفیف</th>
                <th className="rounded-none text-xs">جمع</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="text-xs">
                  <td>
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p
                        className="text-[10px] text-base-content/40 font-mono"
                        dir="ltr"
                      >
                        {item.productId}
                      </p>
                    </div>
                  </td>
                  <td className="font-medium">{formatNumber(item.quantity)}</td>
                  <td className="text-primary font-medium">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td>
                    {item.discount > 0 ? (
                      <span className="badge badge-success badge-sm">
                        {item.discount}٪
                      </span>
                    ) : (
                      <span className="text-base-content/40">-</span>
                    )}
                  </td>
                  <td className="font-bold">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="bg-base-200/50 rounded-xl p-3 space-y-1.5 shrink-0 text-xs">
          <div className="flex justify-between">
            <span className="text-base-content/60">جمع اقلام:</span>
            <span className="font-medium">
              {formatCurrency(invoice.subtotal)}
            </span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between">
              <span className="text-base-content/60">تخفیف:</span>
              <span className="font-medium text-success">
                -{formatCurrency(totalDiscount)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-base-content/60">مالیات:</span>
            <span className="font-medium">{formatCurrency(invoice.tax)}</span>
          </div>
          <div className="h-px bg-base-300" />
          <div className="flex justify-between font-bold text-sm">
            <span>مبلغ نهایی:</span>
            <span className="text-primary">
              {formatCurrency(invoice.total)}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
