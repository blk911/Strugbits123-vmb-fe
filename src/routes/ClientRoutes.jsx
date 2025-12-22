import { Route } from "react-router-dom";
import DashboardLayout from "../components/layout/dashboard/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import {
  DashboardHome,
  SalonDetail,
  Salons,
  GiftHistory,
  AppointmentHistory,
  SalonInvites,
  BookingSuccess,
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
      <Route path="/salon/:id" element={<SalonDetail />} />

      <Route path="/salons" element={<Salons />} />
      <Route path="/booking-success" element={<BookingSuccess />} />
      <Route path="/gifts" element={<GiftHistory />} />
      <Route path="/appointments" element={<AppointmentHistory />} />
      <Route path="/saloninvites" element={<SalonInvites />} />
    </Route>
  );
}
