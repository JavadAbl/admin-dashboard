import { Routes, Route, Navigate } from "react-router";
import PublicOnlyRoute from "../Components/Utils/PublicOnlyRoute";
import Login from "./Login/Login";
import ProtectedRoute from "../Components/Utils/ProtectedRoute";
import Layout from "./Layout/Layout";
import NotFound from "../Components/Utils/NotFound";
import Dashboard from "./Dashboard/Dashboard";
import { useLayoutEffect } from "react";
import { useAppDispatch, useAppSelector } from "../Hooks/ReduxHooks";
import { storage } from "../Utils/Storage";
import { appActions } from "../Features/App/AppSlice";
import { useAuth } from "../Hooks/UseAuth";
import LoadingSpinner from "../Components/Utils/LoadingSpinner";
import Customers from "./Customers/Customers";
import Products from "./Products/Products";
import ProductList from "./Products/ProductList/ProductList";
import ProductDetails from "./Products/Components/ProductDetails";
import SalesRoutes from "./Sales/SalesRoutes";
import MessagesRoutes from "./Messages/MessagesRoutes";
import UsersRoutes from "./Users/UserRoutes";
import FinancialRoutes from "./Financial/FinancialRoutes";

export default function AppRoutes() {
  const theme = useAppSelector((s) => s.app.theme);
  const isAuth = useAppSelector((s) => s.auth.isAuth);
  const dis = useAppDispatch();

  useAuth();

  useLayoutEffect(() => {
    const currentTheme = storage.getTheme();
    if (currentTheme) dis(appActions.setTheme({ theme: currentTheme }));
    else dis(appActions.setTheme({ theme: "light" }));
  }, [dis]);

  if (!theme) return null;
  if (isAuth == null) return <LoadingSpinner centerScreen={true} />;
  return (
    <div data-theme={theme}>
      <Routes>
        <Route path="/" element={<Navigate to="/Dashboard" replace />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Products" element={<Products />} />
            <Route path="/Products/List" element={<ProductList />} />
            <Route path="/Products/:id" element={<ProductDetails />} />
            <Route path="/Customers" element={<Customers />} />

            <Route path="/Sales/*" element={<SalesRoutes />} />
            <Route path="/Financial/*" element={<FinancialRoutes />} />
            <Route path="/Messages/*" element={<MessagesRoutes />} />
            <Route path="/Users/*" element={<UsersRoutes />} />
          </Route>
        </Route>

        <Route element={<PublicOnlyRoute />}>
          <Route path="/Login" element={<Login />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
