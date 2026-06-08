import { useQuery } from "@tanstack/react-query";
import { MockData } from "../../Utils/Api/MockData";
import type { Product } from "./ProductTypes/ProductType";

export const productQueryKeys = {
  products: () => ["products"] as const,
};

export function useGetProducts() {
  return useQuery<Product[]>({
    queryKey: [productQueryKeys.products()],
    queryFn: () => Promise.resolve(MockData.products),
  });
}
