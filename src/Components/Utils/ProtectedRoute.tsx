import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../../Hooks/ReduxHooks";

export default function ProtectedRoute() {
  const isAuth = useAppSelector((s) => s.auth.isAuth);
  if (!isAuth) {
    return <Navigate to="/Login" replace />;
  }
  return <Outlet />;
}
