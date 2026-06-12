import { Route, Routes } from "react-router";
import FinancialReports from "./FinancialReports";
import Transactions from "./Transactions/Transactions";
import TransactionDetails from "./Transactions/Components/TransactionDetails";
import Receivables from "./Receivables/Receivables";
import ReceivableDetails from "./Receivables/Components/ReceivableDetails";

export default function FinancialRoutes() {
  return (
    <Routes>
      <Route index element={<FinancialReports />} />
      <Route path="Receivables" element={<Receivables />} />
      <Route path="Receivables/:id" element={<ReceivableDetails />} />
      <Route path="Transactions" element={<Transactions />} />
      <Route path="Transactions/:id" element={<TransactionDetails />} />
    </Routes>
  );
}
