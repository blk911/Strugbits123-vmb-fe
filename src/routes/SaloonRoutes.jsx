import { Navigate, Route } from "react-router-dom";
import DashboardLayout from "../components/layout/dashboard/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import {
  AppointmentHistory,
  DashboardHome,
  DeepInsightsAnalytics,
  DeepInsightsDataCapture,
  DeepInsightsLayout,
  SalonDetail,
  SalonInvites,
} from "../pages/saloon";
import { ServicePresets } from "../pages/admin";
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
      <Route
        path="/salon-owner/deep-dig"
        element={
          <Navigate to="/salon-owner/deep-insights/data-capture" replace />
        }
      />
      <Route
        path="/salon-owner/data-mine"
        element={
          <Navigate to="/salon-owner/deep-insights/data-capture" replace />
        }
      />
      <Route
        path="/salon-owner/deep-insights"
        element={
          <ProtectedRoute allowedRoles={["salon-owner"]}>
            <DeepInsightsLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Navigate to="/salon-owner/deep-insights/data-capture" replace />
          }
        />
        <Route
          path="data-capture"
          element={<DeepInsightsDataCapture />}
        />
        <Route path="analytics" element={<DeepInsightsAnalytics />} />
      </Route>
      <Route path="/salon-invites" element={<SalonInvites />} />
      <Route path="/appointments" element={<AppointmentHistory />} />
      <Route path="/salon-detail" element={<SalonDetail />} />
      <Route path="/service-presets" element={<ServicePresets />} />
    </Route>
  );
}
