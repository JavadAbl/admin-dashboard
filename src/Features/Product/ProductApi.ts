import { useQuery } from "@tanstack/react-query";
import { MockData } from "../../Utils/Api/MockData/MockData";
import type { Product } from "./CustomerTypes/ProductType";
import type { ProductOrderHistoryItem } from "./CustomerTypes/ProductOrderHistoryItemType";

export const productQueryKeys = {
  products: () => ["products"] as const,
  productOrderHistory: (id: number) => ["productOrderHistory", id] as const,
};

export function useGetProducts() {
  return useQuery<Product[]>({
    queryKey: productQueryKeys.products(),
    queryFn: () => Promise.resolve(MockData.products),
  });
}

export function useGetProductOrderHistoryByProductId(id: number) {
  return useQuery<ProductOrderHistoryItem[]>({
    queryKey: productQueryKeys.productOrderHistory(id),
    queryFn: () =>
      Promise.resolve(
        MockData.productOrderHistory.filter((item) => item.productId === id),
      ),
  });
}
