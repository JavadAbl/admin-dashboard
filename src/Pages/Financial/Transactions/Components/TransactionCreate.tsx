import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Plus,
  Check,
  ArrowDownCircle,
  ArrowUpCircle,
  Banknote,
  CreditCard,
  Wallet,
  Landmark,
  Globe,
} from "lucide-react";
import Modal from "../../../../Components/Modals/Modal";
import { cn } from "../../../../Utils/Cn";
import type {
  TransactionMethod,
  TransactionType,
} from "../../../../Features/Financial/FinancialTypes/TransactionType";
import Input from "../../../../Components/Inputs/Input";

// ============ Types ============
interface CreateTransactionForm {
  type: TransactionType;
  method: TransactionMethod;
  amount: string;
  counterparty: string;
  date: string;
  description: string;
  reference: string;
}

const INITIAL_FORM: CreateTransactionForm = {
  type: "receipt",
  method: "cash",
  amount: "",
  counterparty: "",
  date: new Date().toISOString().split("T")[0],
  description: "",
  reference: "",
};

const methodOptions: {
  value: TransactionMethod;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "cash", label: "نقدی", icon: <Banknote size={14} /> },
  {
    value: "bank_transfer",
    label: "انتقال بانکی",
    icon: <Landmark size={14} />,
  },
  { value: "card", label: "کارت بانکی", icon: <CreditCard size={14} /> },
  { value: "cheque", label: "چک", icon: <Wallet size={14} /> },
  { value: "online", label: "آنلاین", icon: <Globe size={14} /> },
];

// ============ Main Component ============
export default function TransactionCreate({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransactionForm>({
    defaultValues: INITIAL_FORM,
    mode: "onSubmit",
  });

  const [selectedType, setSelectedType] = useState<TransactionType>("receipt");
  const [selectedMethod, setSelectedMethod] =
    useState<TransactionMethod>("cash");

  React.useEffect(() => {
    (() => {
      if (isOpen) {
        reset(INITIAL_FORM);
        setSelectedType("receipt");
        setSelectedMethod("cash");
      }
    })();
  }, [isOpen, reset]);

  const handleClose = useCallback(() => {
    reset(INITIAL_FORM);
    setSelectedType("receipt");
    setSelectedMethod("cash");
    onClose();
  }, [onClose, reset]);

  const onFormSubmit = async (data: CreateTransactionForm) => {
    try {
      console.log({ ...data, type: selectedType, method: selectedMethod });
      toast.success(
        selectedType === "receipt"
          ? "دریافت با موفقیت ثبت شد"
          : "پرداخت با موفقیت ثبت شد",
      );
      handleClose();
    } catch {
      toast.error("خطا در ثبت تراکنش. لطفاً دوباره تلاش کنید");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="ثبت تراکنش جدید"
      description="اطلاعات دریافت یا پرداخت را وارد کنید"
      icon={Plus}
      className="max-w-xl h-full min-h-120"
    >
      <form
        className="flex flex-col h-full overflow-hidden"
        onSubmit={handleSubmit(onFormSubmit)}
        noValidate
      >
        <div className="flex flex-col gap-4 px-6 py-4 overflow-y-auto flex-1 custom-scrollbar">
          {/* Transaction Type */}
          <div>
            <label className="label py-1">
              <span className="label-text text-xs font-bold">
                نوع تراکنش <span className="text-error">*</span>
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={cn(
                  "btn btn-sm gap-2 justify-center",
                  selectedType === "receipt" ? "btn-success" : "btn-outline",
                )}
                onClick={() => setSelectedType("receipt")}
                disabled={isSubmitting}
              >
                <ArrowDownCircle size={16} />
                دریافت
              </button>
              <button
                type="button"
                className={cn(
                  "btn btn-sm gap-2 justify-center",
                  selectedType === "payment" ? "btn-error" : "btn-outline",
                )}
                onClick={() => setSelectedType("payment")}
                disabled={isSubmitting}
              >
                <ArrowUpCircle size={16} />
                پرداخت
              </button>
            </div>
            <input type="hidden" {...register("type")} value={selectedType} />
          </div>

          {/* Amount */}
          <Input
            type="input"
            text="مبلغ"
            error={errors.amount?.message}
            className="input-sm"
            required
          >
            <input
              type="number"
              className={cn("w-full pl-16", errors.amount && "input-error")}
              placeholder="0"
              dir="ltr"
              {...register("amount", {
                required: "مبلغ الزامی است",
                min: { value: 1, message: "مبلغ باید بیشتر از صفر باشد" },
              })}
              disabled={isSubmitting}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-base-content/50">
              تومان
            </span>
          </Input>

          {/* Counterparty */}
          <Input
            type="input"
            text={selectedType === "receipt" ? "پرداخت‌کننده" : "دریافت‌کننده"}
            error={errors.counterparty?.message}
            className="input-sm"
            required
          >
            <input
              type="text"
              className={cn("w-full", errors.counterparty && "input-error")}
              placeholder={
                selectedType === "receipt"
                  ? "نام پرداخت‌کننده"
                  : "نام دریافت‌کننده"
              }
              {...register("counterparty", {
                required: "نام طرف حساب الزامی است",
              })}
              disabled={isSubmitting}
            />
          </Input>

          {/* Payment Method */}
          <div>
            <label className="label py-1">
              <span className="label-text text-xs font-bold">
                روش پرداخت <span className="text-error">*</span>
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {methodOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={cn(
                    "btn btn-xs gap-1",
                    selectedMethod === opt.value
                      ? "btn-primary"
                      : "btn-outline",
                  )}
                  onClick={() => setSelectedMethod(opt.value)}
                  disabled={isSubmitting}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
            <input
              type="hidden"
              {...register("method")}
              value={selectedMethod}
            />
          </div>

          {/* Date */}
          <Input
            type="input"
            text="تاریخ تراکنش"
            error={errors.date?.message}
            className="input-sm"
            required
          >
            <input
              type="date"
              className={cn("w-full", errors.date && "input-error")}
              {...register("date", { required: "تاریخ الزامی است" })}
              disabled={isSubmitting}
            />
          </Input>

          {/* Reference */}
          <Input type="input" text="شماره مرجع" className="input-sm">
            <input
              type="text"
              className="w-full font-mono"
              placeholder="شماره چک، پیگیری بانکی و..."
              dir="ltr"
              {...register("reference")}
              disabled={isSubmitting}
            />
          </Input>

          {/* Description */}
          <Input
            type="textarea"
            text="توضیحات"
            error={errors.description?.message}
            className="textarea-sm"
          >
            <textarea
              className={cn(
                "w-full resize-none",
                errors.description && "textarea-error",
              )}
              {...register("description", {
                maxLength: { value: 500, message: "حداکثر ۵۰۰ کاراکتر" },
              })}
              disabled={isSubmitting}
            />
          </Input>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-base-300 bg-base-200/40 shrink-0">
          <p className="text-[10px] text-base-content/50">
            <span className="text-error">*</span> فیلدهای الزامی
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              انصراف
            </button>
            <button
              type="submit"
              className={cn(
                "btn btn-sm gap-2 min-w-28",
                selectedType === "receipt" ? "btn-success" : "btn-error",
                isSubmitting && "loading",
              )}
              disabled={isSubmitting}
            >
              {!isSubmitting && <Check size={16} />}
              {isSubmitting
                ? "در حال ثبت..."
                : selectedType === "receipt"
                  ? "ثبت دریافت"
                  : "ثبت پرداخت"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
