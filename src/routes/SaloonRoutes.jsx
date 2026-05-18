import { Navigate, Route } from "react-router-dom";
import DashboardLayout from "../components/layout/dashboard/DashboardLayout";
import DeepInsightsPreferredNavigate from "../components/deep-insights/DeepInsightsPreferredNavigate.jsx";
import ProtectedRoute from "./ProtectedRoute";
import {
  AppointmentHistory,
  DashboardHome,
  DeepInsightsAnalytics,
  DeepInsightsDataCapture,
  DeepInsightsLayout,
  SalonCampaignsPage,
  SalonDetail,
  SalonInvites,
  SalonNetworkLayout,
  SalonNetworkReferralActivity,
  SalonNetworkTrustedClients,
  SalonNetworkVips,
  SalonOpportunitiesPage,
  SalonOwnerSettingsPage,
  SalonFaqPage,
} from "../pages/saloon";
import { ServicePresets } from "../pages/admin";

export default function SalonRoutes() {
  return (
    <Route element={<DashboardLayout />}>
      <Route
        path="/salon-owner"
        element={<Navigate to="/salon-owner/dashboard" replace />}
      />
      <Route
        path="/salon-owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={["salon-owner"]}>
            <DashboardHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/salon-owner/campaigns"
        element={
          <ProtectedRoute allowedRoles={["salon-owner"]}>
            <SalonCampaignsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/salon-owner/opportunities"
        element={
          <ProtectedRoute allowedRoles={["salon-owner"]}>
            <SalonOpportunitiesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/salon-owner/network"
        element={
          <ProtectedRoute allowedRoles={["salon-owner"]}>
            <SalonNetworkLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<Navigate to="/salon-owner/network/trusted-clients" replace />}
        />
        <Route path="trusted-clients" element={<SalonNetworkTrustedClients />} />
        <Route path="referral-activity" element={<SalonNetworkReferralActivity />} />
        <Route path="vips" element={<SalonNetworkVips />} />
      </Route>
      <Route
        path="/salon-owner/settings"
        element={
          <ProtectedRoute allowedRoles={["salon-owner"]}>
            <SalonOwnerSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/salon-owner/faq"
        element={
          <ProtectedRoute allowedRoles={["salon-owner"]}>
            <SalonFaqPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/salon-owner/deep-dig"
        element={<DeepInsightsPreferredNavigate />}
      />
      <Route
        path="/salon-owner/data-mine"
        element={<DeepInsightsPreferredNavigate />}
      />
      <Route
        path="/salon-owner/deep-insights"
        element={
          <ProtectedRoute allowedRoles={["salon-owner"]}>
            <DeepInsightsLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DeepInsightsPreferredNavigate />} />
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
