import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./ReduxHooks";
import { authActions } from "../Features/Auth/AuthSlice";
import { useGetUser } from "../Features/Auth/AuthApi";

export function useAuth() {
  const dis = useAppDispatch();
  const isAuth = useAppSelector((s) => s.auth.isAuth);
  const [isAuthDone, setIsAuthDone] = useState(false);
  const { refetch: fetchUser } = useGetUser();

  useEffect(() => {
    const handleAuth = () => {
      if (isAuth) {
        setIsAuthDone(true);
        return;
      }

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        dis(authActions.logout());
        setIsAuthDone(true);
        return;
      }

      fetchUser()
        .then((res) => {
          if (!res.isError && res.data) {
            dis(authActions.login({ user: res.data }));
          }
        })
        .catch(() => {
          dis(authActions.logout());
        })
        .finally(() => setIsAuthDone(true));
    };

    handleAuth();
  }, [dis, fetchUser, isAuth]);

  return { isAuthDone };
}
