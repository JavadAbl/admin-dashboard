import type { Invoice } from "../../../Features/Sale/SaleTypes/InvoiceType";

export const invoicesMock: Invoice[] = Array.from({ length: 18 }, (_, i) => ({
  id: `inv-${i + 1}`,
  invoiceNumber: `INV-1404-${String(i + 1).padStart(4, "0")}`,
  customerName: [
    "شرکت آلفا سیستم",
    "فروشگاه دیجیتال برتر",
    "موسسه حسابداری داده‌پرداز",
    "شرکت بازرگانی نوین",
    "فروشگاه لوازم خانگی پارس",
  ][i % 5],
  customerId: `cust-${(i % 5) + 1}`,
  items: [
    {
      id: `item-${i}-1`,
      productName: "گوشی موبایل سامسونگ Galaxy S24",
      productId: "prod-1",
      quantity: 2,
      unitPrice: 68500000,
      discount: 5,
      total: 130150000,
    },
    {
      id: `item-${i}-2`,
      productName: "هدفون بی‌سیم Sony WH-1000XM5",
      productId: "prod-2",
      quantity: 1,
      unitPrice: 18500000,
      discount: 0,
      total: 18500000,
    },
  ],
  subtotal: 155500000,
  tax: 7800000,
  discount: i % 3 === 0 ? 5000000 : 0,
  total: 158300000,
  status: (["paid", "unpaid", "overdue", "cancelled"] as const)[i % 4],
  date: new Date(2025, 2, i + 1).toISOString(),
  dueDate: new Date(2025, 2, i + 16).toISOString(),
  daysOverdue: i % 4 === 2 ? 12 : undefined,
  paidAt: i % 4 === 0 ? new Date(2025, 2, i + 5).toISOString() : undefined,
  note: i % 5 === 0 ? "فاکتور ویژه تخفیف دوره‌ای" : undefined,
}));
