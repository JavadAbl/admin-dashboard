import type { TransactionMethod } from "./TransactionType";

export type ReceivableStatus =
  | "pending"
  | "partial"
  | "paid"
  | "overdue"
  | "written_off";

export interface ReceivablePayment {
  id: string;
  amount: number;
  date: string;
  method: TransactionMethod;
  reference?: string;
  description?: string;
}

export interface Receivable {
  id: string;
  receivableNumber: string;
  customerName: string;
  customerId: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: ReceivableStatus;
  issueDate: string;
  dueDate: string;
  daysOverdue?: number;
  payments: ReceivablePayment[];
  description?: string;
  invoiceId?: string;
  createdAt: string;
  updatedAt?: string;
}

export const receivableStatusConfig: Record<
  ReceivableStatus,
  { label: string; color: string }
> = {
  pending: { label: "در انتظار", color: "badge-warning" },
  partial: { label: "پرداخت جزئی", color: "badge-info" },
  paid: { label: "پرداخت‌شده", color: "badge-success" },
  overdue: { label: "سررسید گذشته", color: "badge-error" },
  written_off: { label: "سو Bad‌شده", color: "badge-ghost" },
};
