import { useQuery } from "@tanstack/react-query";
import { MockData } from "../../Utils/Api/MockData/MockData";
import type { Invoice } from "./SaleTypes/InvoiceType";

export const productQueryKeys = {
  invoices: () => ["invoices"] as const,
};

export function useGetInvoices() {
  return useQuery<Invoice[]>({
    queryKey: productQueryKeys.invoices(),
    queryFn: () => Promise.resolve(MockData.invoicesMock),
  });
}
