import { useCallback, useState } from "react";
import { CreditCard, Banknote, Landmark } from "lucide-react";
import { toast } from "sonner";
import Modal from "../../../../Components/Modals/Modal";
import { formatCurrency } from "../../../../Utils/AppUtils";
import type { Receivable } from "../../../../Features/Financial/FinancialTypes/ReceivablesType";
import { cn } from "../../../../Utils/Cn";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  receivable: Receivable;
}

export default function RecordPaymentModal({
  isOpen,
  onClose,
  receivable,
}: Props) {
  const [paidAmount, setPaidAmount] = useState(receivable.remainingAmount);
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [method, setMethod] = useState<
    "cash" | "bank_transfer" | "card" | "cheque" | "online"
  >("cash");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const remaining = receivable.remainingAmount - paidAmount;

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      setError("");

      if (paidAmount <= 0) {
        setError("مبلغ پرداخت باید بزرگتر از صفر باشد");
        return;
      }
      if (paidAmount > receivable.remainingAmount) {
        setError("مبلغ پرداخت نمی‌تواند بیشتر از مانده طلب باشد");
        return;
      }

      setIsLoading(true);
      try {
        console.log({
          receivableId: receivable.id,
          paidAmount,
          paymentDate,
          method,
          description,
        });
        toast.success("پرداخت با موفقیت ثبت شد");
        onClose();
        setPaidAmount(receivable.remainingAmount);
        setDescription("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطای نامشخص");
      } finally {
        setIsLoading(false);
      }
    },
    [paidAmount, paymentDate, method, description, onClose, receivable],
  );

  return (
    <Modal
      title="ثبت پرداخت"
      description={`طلب ${receivable.receivableNumber}`}
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

        {/* Receivable Info */}
        <div className="bg-base-200/50 rounded-lg p-3 border border-base-300">
          <p className="text-xs text-base-content/60 mb-1">مشتری</p>
          <p className="text-sm font-medium mb-2">{receivable.customerName}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-base-content/60">مانده طلب:</span>
            <span className="font-bold text-error">
              {formatCurrency(receivable.remainingAmount)}
            </span>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="label">
            <span className="label-text font-medium">
              مبلغ پرداخت <span className="text-error">*</span>
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max={receivable.remainingAmount}
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
              className="input input-bordered input-sm w-full pl-16"
              dir="ltr"
              disabled={isLoading}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-base-content/50">
              تومان
            </span>
          </div>
          {remaining > 0 && paidAmount > 0 && (
            <label className="label">
              <span className="label-text-alt text-warning">
                {formatCurrency(remaining)} مانده
              </span>
            </label>
          )}
        </div>

        {/* Method */}
        <div>
          <label className="label">
            <span className="label-text font-medium">روش پرداخت</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              {
                value: "cash" as const,
                label: "نقدی",
                icon: <Banknote size={14} />,
              },
              {
                value: "bank_transfer" as const,
                label: "انتقال بانکی",
                icon: <Landmark size={14} />,
              },
              {
                value: "card" as const,
                label: "کارت بانکی",
                icon: <CreditCard size={14} />,
              },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={cn(
                  "btn btn-xs gap-1",
                  method === opt.value ? "btn-primary" : "btn-outline",
                )}
                onClick={() => setMethod(opt.value)}
                disabled={isLoading}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
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

        {/* Description */}
        <div>
          <label className="label">
            <span className="label-text font-medium">توضیحات</span>
          </label>
          <textarea
            className="textarea textarea-bordered textarea-sm w-full h-16 resize-none"
            placeholder="شرح پرداخت..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
