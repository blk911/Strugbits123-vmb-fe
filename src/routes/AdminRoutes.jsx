import { Route } from "react-router-dom";
import DashboardLayout from "../components/layout/dashboard/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import { Home as AdminHome, Saloons as AdminSaloon, Gifts as AdminGifts } from "../pages/admin";

export default function AdminRoutes() {
  return (
    <Route element={<DashboardLayout />}>
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/saloon"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminSaloon />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/invites_gifts"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminGifts />
          </ProtectedRoute>
        }
      />
    </Route>
  );
}
