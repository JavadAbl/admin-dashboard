import { Route, Routes } from "react-router";
import FinancialReports from "./FinancialReports";
import Transactions from "./Transactions/Transactions";

export default function FinancialRoutes() {
  return (
    <Routes>
      <Route index element={<FinancialReports />} />
      <Route path="Transactions" element={<Transactions />} />
    </Routes>
  );
}
