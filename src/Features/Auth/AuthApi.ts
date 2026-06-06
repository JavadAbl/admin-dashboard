import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../../Utils/Api/BaseApi";
import type { AxiosError, AxiosResponse } from "axios";
import type { User } from "./AuthTypes/User";
import type { Auth } from "./AuthTypes/Auth";

export const authQueryKeys = {
  user: () => ["user"] as const,
};

export function useGetUser() {
  return useQuery<AxiosResponse<User>>({
    queryKey: authQueryKeys.user(),
    queryFn: () => apiClient.get("User"),
    enabled: false,
  });
}

export function useAuthAction() {
  return useMutation<
    AxiosResponse<Auth>,
    AxiosError,
    { username: string; password: string }
  >({
    mutationFn: (payload) => apiClient.post("Login", payload),
  });
}
