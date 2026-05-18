import { Route } from "react-router-dom";
import DashboardLayout from "../components/layout/dashboard/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import {
  DashboardHome,
  Salons,
  GiftHistory,
  AppointmentHistory,
  SalonInvites,
} from "../pages/client";

export default function ClientRoutes() {
  return (
    <Route element={<DashboardLayout />}>
      <Route
        path="/client"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <DashboardHome />
          </ProtectedRoute>
        }
      />

      <Route path="/salons" element={<Salons />} />

      <Route path="/gifts" element={<GiftHistory />} />
      <Route path="/appointments" element={<AppointmentHistory />} />
      <Route path="/salon-invites" element={<SalonInvites />} />
    </Route>
  );
}
