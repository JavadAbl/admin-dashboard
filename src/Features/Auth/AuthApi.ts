import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../Utils/Api/BaseApi";
import type { AxiosResponse } from "axios";

export interface User {
  id: string;
  name: string;
  email: string;
}

export const authQueryKeys = {
  user: () => ["user"] as const,
};

export function useGetUser() {
  return useQuery<AxiosResponse<User>>({
    queryKey: authQueryKeys.user(),
    queryFn: () => apiClient.get<User>("User"),
    enabled: false,
  });
}
