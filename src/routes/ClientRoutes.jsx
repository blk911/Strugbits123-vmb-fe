import { Route } from "react-router-dom";
import DashboardLayout from "../components/layout/dashboard/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import { DashboardHome } from "../pages/client";

export default function ClientRoutes() {
  return (
    <Route element={<DashboardLayout />}>
      <Route
        path="/client"
        element={
          <ProtectedRoute allowedRoles={["client"]}>
            <DashboardHome />
          </ProtectedRoute>
        }
      />
    </Route>
  );
}
