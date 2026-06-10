import { Route, Routes } from "react-router";
import Sales from "./Sales";

export default function SalesRoutes() {
  return (
    <Routes>
      <Route index element={<Sales />} />
    </Routes>
  );
}
