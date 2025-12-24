import { Route } from "react-router-dom";
import DashboardLayout from "../components/layout/dashboard/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import {
  Home as AdminHome,
  AppointmentHistory,
  GiftHistory,
  Payouts,
  SalonInvites,
  Salons,
} from "../pages/admin";
import { SalonDetail } from "../pages/client";

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
      <Route path="/salons" element={<Salons />} />
      <Route path="/salon/:id" element={<SalonDetail />} />
      <Route path="/gifts" element={<GiftHistory />} />
      <Route path="/appointments" element={<AppointmentHistory />} />
      <Route path="/saloninvites" element={<SalonInvites />} />
      <Route path="/payouts" element={<Payouts />} />
    </Route>
  );
}
