import { useQuery } from "@tanstack/react-query";
import { MockData } from "../../Utils/Api/MockData/MockData";
import type { Transaction } from "./FinancialTypes/TransactionType";
import type { Receivable } from "./FinancialTypes/ReceivablesType";

export const productQueryKeys = {
  transactions: () => ["transactions"] as const,
  receivable: () => ["receivable"] as const,
};

export function useGetTransactions() {
  return useQuery<Transaction[]>({
    queryKey: productQueryKeys.transactions(),
    queryFn: () => Promise.resolve(MockData.transactionsMock),
  });
}

export function useGetReceivables() {
  return useQuery<Receivable[]>({
    queryKey: productQueryKeys.receivable(),
    queryFn: () => Promise.resolve(MockData.receivablesMock),
  });
}
