import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../../Hooks/ReduxHooks";

export default function PublicOnlyRoute() {
  const isAuth = useAppSelector((s) => s.auth.isAuth);
  if (isAuth) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
