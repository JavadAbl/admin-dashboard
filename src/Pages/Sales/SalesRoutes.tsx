import { Route, Routes } from "react-router";
import Sales from "./Sales";
import Invoices from "./Invoices/Invoices";
import InvoiceDetails from "./Invoices/Components/InvoiceDetails";

export default function SalesRoutes() {
  return (
    <Routes>
      <Route index element={<Sales />} />
      <Route path="Invoices" element={<Invoices />} />
      <Route path="Invoices/:id" element={<InvoiceDetails />} />
    </Routes>
  );
}
