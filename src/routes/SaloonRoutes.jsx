import { Route } from "react-router-dom";
import DashboardLayout from "../components/layout/dashboard/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import {
  AppointmentHistory,
  DashboardHome,
  SalonInvites,
} from "../pages/saloon";

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
      <Route path="/saloninvites" element={<SalonInvites />} />
      <Route path="/appointments" element={<AppointmentHistory />} />
    </Route>
  );
}
