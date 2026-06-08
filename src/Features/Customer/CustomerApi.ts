import { useQuery } from "@tanstack/react-query";
import { MockData } from "../../Utils/Api/MockData";
import type { Customer } from "./CustomerTypes/CustomerType";

export const customerQueryKeys = {
  customers: () => ["customers"] as const,
};

export function useGetCustomers() {
  return useQuery<Customer[]>({
    queryKey: [customerQueryKeys.customers()],
    queryFn: () => Promise.resolve(MockData.customers),
  });
}
