export interface InvoiceItem {
  id: string;
  productName: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number; // percentage 0-100
  total: number;
}

export type InvoiceStatus = "paid" | "unpaid" | "overdue" | "cancelled";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerId: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: InvoiceStatus;
  date: string;       // ISO date string e.g. "1404/03/15"
  dueDate: string;    // ISO date string
  daysOverdue?: number;
  paidAt?: string;
  note?: string;
}

export interface InvoiceState {
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
}