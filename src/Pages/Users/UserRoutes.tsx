import { Route, Routes } from "react-router";
import Users from "./Users";
import UserDetails from "./Components/UserDetails";
import RolePermissions from "./Permissions/RolePermissions";

export default function UsersRoutes() {
  return (
    <Routes>
      <Route index element={<Users />} />
      <Route path="Permissions" element={<RolePermissions />} />
      <Route path=":id" element={<UserDetails />} />
    </Routes>
  );
}
