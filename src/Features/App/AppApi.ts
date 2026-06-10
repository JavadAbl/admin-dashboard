import { useQuery } from "@tanstack/react-query";
import { MockData } from "../../Utils/Api/MockData/MockData";
import type { KpiData } from "./AppTypes/KpiDataType";
import type { RecentOrder } from "./AppTypes/RecentOrderType";
import type { TopProduct } from "./AppTypes/TopProductType";

export const appQueryKeys = {
  weekDays: () => ["weekDays"] as const,
  persianMonths: () => ["persianMonths"] as const,
  kpiData: () => ["kpiData"] as const,
  recentOrders: () => ["recentOrders"] as const,
  topProducts: () => ["topProducts"] as const,
};

export function useGetWeekDays() {
  return useQuery<string[]>({
    queryKey: [appQueryKeys.weekDays()],
    queryFn: () => Promise.resolve(MockData.weekDays),
  });
}

export function useGetPersianMonths() {
  return useQuery<string[]>({
    queryKey: appQueryKeys.persianMonths(),
    queryFn: () => Promise.resolve(MockData.persianMonths),
  });
}

export function useGetKpiData() {
  return useQuery<KpiData[]>({
    queryKey: appQueryKeys.kpiData(),
    queryFn: () => Promise.resolve(MockData.kpiData),
  });
}

export function useGetRecentOrders() {
  return useQuery<RecentOrder[]>({
    queryKey: appQueryKeys.recentOrders(),
    queryFn: () => Promise.resolve(MockData.recentOrders),
  });
}

export function useGetTopProducts() {
  return useQuery<TopProduct[]>({
    queryKey: appQueryKeys.topProducts(),
    queryFn: () => Promise.resolve(MockData.topProducts),
  });
}
