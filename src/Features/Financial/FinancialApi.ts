import { useQuery } from "@tanstack/react-query";
import { MockData } from "../../Utils/Api/MockData/MockData";
import type { Transaction } from "./FinancialTypes/TransactionType";

export const productQueryKeys = {
  transactions: () => ["transactions"] as const,
};

export function useGetTransactions() {
  return useQuery<Transaction[]>({
    queryKey: productQueryKeys.transactions(),
    queryFn: () => Promise.resolve(MockData.transactionsMock),
  });
}
