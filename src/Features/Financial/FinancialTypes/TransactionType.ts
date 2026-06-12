export type TransactionType = "receipt" | "payment";
export type TransactionMethod =
  | "cash"
  | "bank_transfer"
  | "card"
  | "cheque"
  | "online";
export type TransactionStatus =
  | "completed"
  | "pending"
  | "failed"
  | "cancelled";

export interface Transaction {
  id: string;
  transactionNumber: string;
  type: TransactionType;
  method: TransactionMethod;
  amount: number;
  description: string;
  counterparty: string; // person or entity
  counterpartyId?: string;
  date: string;
  status: TransactionStatus;
  reference?: string; // cheque number, tracking code, etc.
  invoiceId?: string; // linked invoice
  createdAt: string;
  updatedAt?: string;
}

export const transactionTypeConfig: Record<
  TransactionType,
  { label: string; color: string }
> = {
  receipt: { label: "دریافت", color: "badge-success" },
  payment: { label: "پرداخت", color: "badge-error" },
};

export const transactionMethodConfig: Record<
  TransactionMethod,
  { label: string }
> = {
  cash: { label: "نقدی" },
  bank_transfer: { label: "انتقال بانکی" },
  card: { label: "کارت بانکی" },
  cheque: { label: "چک" },
  online: { label: "آنلاین" },
};

export const transactionStatusConfig: Record<
  TransactionStatus,
  { label: string; color: string }
> = {
  completed: { label: "تکمیل‌شده", color: "badge-success" },
  pending: { label: "در انتظار", color: "badge-warning" },
  failed: { label: "ناموفق", color: "badge-error" },
  cancelled: { label: "لغو‌شده", color: "badge-ghost" },
};
