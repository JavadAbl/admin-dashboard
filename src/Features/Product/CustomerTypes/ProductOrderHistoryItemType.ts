export interface ProductOrderHistoryItem {
  id: string;
  date: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  customerName: string;
  productName: string;
  orderId: string;
  productId: number;
}
