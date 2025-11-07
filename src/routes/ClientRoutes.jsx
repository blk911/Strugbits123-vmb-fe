import { Route } from "react-router-dom";
import DashboardLayout from "../components/layout/dashboard/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import { DashboardHome } from "../pages/client";
import SalonDetail from "../pages/client/SalonDetail/SalonDetail";
import Salons from "../pages/client/Salons/Salons";
import GiftHistory from "../pages/client/Gifts/GiftHistory";

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
      <Route path="/salon/:id" element={<SalonDetail />} />

      <Route path="/salons" element={<Salons />} />

      <Route path="/gifts" element={<GiftHistory />} />
    </Route>
  );
}
