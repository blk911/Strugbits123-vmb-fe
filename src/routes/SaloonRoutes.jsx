import { Route } from "react-router-dom";
import DashboardLayout from "../components/layout/dashboard/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import { DashboardHome } from "../pages/saloon";

export default function SalonRoutes() {
  return (
    <Route element={<DashboardLayout />}>
      <Route
        path="/salonOwner"
        element={
          <ProtectedRoute allowedRoles={["salonOwner"]}>
            <DashboardHome />
          </ProtectedRoute>
        }
      />
    </Route>
  );
}
