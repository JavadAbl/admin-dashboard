import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../../Utils/Api/BaseApi";
import type { AxiosError, AxiosResponse } from "axios";
import type { User } from "./AuthTypes/UserType";
import type { Auth } from "./AuthTypes/AuthType";
import { MockData } from "../../Utils/Api/MockData/MockData";

export const authQueryKeys = {
  user: () => ["user"] as const,
  users: () => ["users"] as const,
};

export function useGetUser() {
  return useQuery<User>({
    queryKey: authQueryKeys.user(),
    queryFn: () => Promise.resolve(MockData.user),
    enabled: false,
  });
}

export function useGetUsers() {
  return useQuery<User[]>({
    queryKey: authQueryKeys.users(),
    queryFn: () => Promise.resolve(MockData.usersMock),
  });
}

export function useAuthAction() {
  return useMutation<
    AxiosResponse<Auth>,
    AxiosError,
    { username: string; password: string }
  >({
    mutationFn: (payload) => apiClient.post("login", payload),
  });
}
