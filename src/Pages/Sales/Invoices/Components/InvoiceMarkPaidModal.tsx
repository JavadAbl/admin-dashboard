import { useCallback, useState } from "react";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import Modal from "../../../../Components/Modals/Modal";
import type { Invoice } from "../../../../Features/Sale/SaleTypes/InvoiceType";
import { formatCurrency } from "../../../../Utils/AppUtils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
}

export default function InvoiceMarkPaidModal({
  isOpen,
  onClose,
  invoice,
}: Props) {
  const [paidAmount, setPaidAmount] = useState(invoice.total);
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const remaining = invoice.total - paidAmount;

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      setError("");

      if (paidAmount <= 0) {
        setError("مبلغ پرداخت باید بزرگتر از صفر باشد");
        return;
      }

      if (paidAmount > invoice.total) {
        setError("مبلغ پرداخت نمی‌تواند بیشتر از مبلغ فاکتور باشد");
        return;
      }

      setIsLoading(true);
      try {
        console.log({
          invoiceId: invoice.id,
          paidAmount,
          paymentDate,
        });
        toast.success("پرداخت با موفقیت ثبت شد");
        onClose();
        setPaidAmount(invoice.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطای نامشخص");
      } finally {
        setIsLoading(false);
      }
    },
    [paidAmount, paymentDate, onClose, invoice],
  );

  return (
    <Modal
      title="ثبت پرداخت"
      description={`فاکتور ${invoice.invoiceNumber}`}
      isOpen={isOpen}
      onClose={onClose}
      icon={CreditCard}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="alert alert-error">
            <svg
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m2-2l2 2m-2-2l-2-2"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Invoice Amount Info */}
        <div className="bg-base-200/50 rounded-lg p-3 border border-base-300">
          <p className="text-xs text-base-content/60 mb-1">مشتری</p>
          <p className="text-sm font-medium mb-2">{invoice.customerName}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-base-content/60">مبلغ فاکتور:</span>
            <span className="font-bold text-primary">
              {formatCurrency(invoice.total)}
            </span>
          </div>
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">
              مبلغ پرداخت <span className="text-error">*</span>
            </span>
          </label>
          <input
            type="number"
            min="0"
            value={paidAmount}
            onChange={(e) => setPaidAmount(Number(e.target.value))}
            className="input input-bordered input-sm w-full"
            disabled={isLoading}
          />
          {remaining > 0 && paidAmount > 0 && (
            <label className="label">
              <span className="label-text-alt text-warning flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {formatCurrency(remaining)} مانده پرداخت
              </span>
            </label>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">تاریخ پرداخت</span>
          </label>
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="input input-bordered input-sm w-full"
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="button"
            className="btn btn-ghost btn-sm flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            انصراف
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-sm flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : null}
            ثبت پرداخت
          </button>
        </div>
      </form>
    </Modal>
  );
}
