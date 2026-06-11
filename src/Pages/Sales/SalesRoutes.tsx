import { Route, Routes } from "react-router";
import Sales from "./Sales";
import Invoices from "./Invoices/Invoices";

export default function SalesRoutes() {
  return (
    <Routes>
      <Route index element={<Sales />} />
      <Route path="Invoices" element={<Invoices />} />
    </Routes>
  );
}
