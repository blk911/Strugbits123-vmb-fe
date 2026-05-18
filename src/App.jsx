import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import SaloonRoutes from "./routes/SaloonRoutes";
import DeepInsightsPreferredNavigate from "./components/deep-insights/DeepInsightsPreferredNavigate.jsx";
import ClientRoutes from "./routes/ClientRoutes";
import SalonPublicOrDashboardRoute from "./routes/SalonPublicOrDashboardRoute";
import ScrollToTop from "./components/common/site/ScrollToTop";
import { BookingCancel, BookingSuccess } from "./pages/client";

import { logout as logoutAction } from "./store/features/userSlice";
import { useStatusPolling } from "./hooks/useStatusPolling";
import LoadingIndicator from "./components/common/LoadingIndicator/LoadingIndicator";
export default function App() {
  const { data, loading } = useSelector((state) => state.user);
  const role = data?.role;
  const dispatch = useDispatch();

  // useStatusPolling(60000);
  useStatusPolling();

  useEffect(() => {
    const handleStorageChange = (e) => {
      if ((e.key === "auth_token" || e.key === "user_data") && !e.newValue) {
        dispatch(logoutAction());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch]);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIndicator size="xl" />
      </div>
    );
  }
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route
          path="/salon/deep-insights"
          element={<DeepInsightsPreferredNavigate />}
        />
        <Route path="/salon/:id" element={<SalonPublicOrDashboardRoute />} />
        {PublicRoutes()}
        {role === "admin" && AdminRoutes()}
        {role === "salon-owner" && SaloonRoutes()}
        {role === "customer" && ClientRoutes()}
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/booking-cancel" element={<BookingCancel />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
