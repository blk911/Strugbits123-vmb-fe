import { Route } from "react-router-dom";
import DashboardLayout from "../components/layout/dashboard/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import {
  AppointmentHistory,
  DashboardHome,
  SalonDetail,
  SalonInvites,
} from "../pages/saloon";

export default function SalonRoutes() {
  return (
    <Route element={<DashboardLayout />}>
      <Route
        path="/salon-owner"
        element={
          <ProtectedRoute allowedRoles={["salon-owner"]}>
            <DashboardHome />
          </ProtectedRoute>
        }
      />
      <Route path="/saloninvites" element={<SalonInvites />} />
      <Route path="/appointments" element={<AppointmentHistory />} />
      <Route path="/salondetail" element={<SalonDetail />} />
    </Route>
  );
}
