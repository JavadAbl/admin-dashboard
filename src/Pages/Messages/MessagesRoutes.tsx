import { Route, Routes } from "react-router";
import Messages from "./Messages";

export default function MessagesRoutes() {
  return (
    <Routes>
      <Route index element={<Messages />} />
      {/* <Route path="Invoices" element={<Invoices />} /> */}
    </Routes>
  );
}
