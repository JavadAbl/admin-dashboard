import { Routes, Route } from "react-router";
import PublicOnlyRoute from "../Components/Utils/PublicOnlyRoute";
import Login from "./Login/Login";
import ProtectedRoute from "../Components/Utils/ProtectedRoute";
import Layout from "./Index/Layout";
import NotFound from "../Components/Utils/NotFound";
import Dashboard from "./Dashboard/Dashboard";
import { useLayoutEffect } from "react";
import { useAppDispatch, useAppSelector } from "../Hooks/ReduxHooks";
import { storage } from "../Utils/Storage";
import { appActions } from "../Features/App/AppSlice";
import { useAuth } from "../Hooks/UseAuth";
import LoadingSpinner from "../Components/Utils/LoadingSpinner";

export default function AppRoutes() {
  const theme = useAppSelector((s) => s.app.theme);
  const isAuth = useAppSelector((s) => s.auth.isAuth);
  const dis = useAppDispatch();

  useAuth();

  useLayoutEffect(() => {
    const currentTheme = storage.getTheme();
    if (currentTheme) dis(appActions.setTheme({ theme: currentTheme }));
    else dis(appActions.setTheme({ theme: "light" }));
  }, [dis, theme]);

  if (!theme) return null;
  if (isAuth == null) return <LoadingSpinner centerScreen={true} />;
  return (
    <div data-theme={theme}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Route>

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
