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
  Customers,
  ServicePresets,
  Staff,
  Support,
  Contacts,
  SalonIntelligence,
  CredentialAssistQueue,
  NetworkPropagationLab,
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
      <Route path="/service-presets" element={<ServicePresets />} />
      <Route path="/gifts" element={<GiftHistory />} />
      <Route path="/appointments" element={<AppointmentHistory />} />
      <Route path="/salon-invites" element={<SalonInvites />} />
      <Route path="/payouts" element={<Payouts />} />
      <Route path="/customers" element={<Customers />} />
      <Route
        path="/admin/settings/staff"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Staff />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings/support"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Support />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings/contacts"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Contacts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/intelligence-lab"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <SalonIntelligence />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/salon-intelligence"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <SalonIntelligence />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/credential-assist"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CredentialAssistQueue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/lab"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <NetworkPropagationLab />
          </ProtectedRoute>
        }
      />
    </Route>
  );
}
