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
import ClientRoutes from "./routes/ClientRoutes";
import ScrollToTop from "./components/common/site/ScrollToTop";
import { BookingCancel, BookingSuccess } from "./pages/client";
import { clearRole } from "./store/features/roleSlice";
import { logout as logoutAction } from "./store/features/userSlice";
import { useStatusPolling } from "./hooks/useStatusPolling";

export default function App() {
  const role = useSelector((state) => state.role.role);
  const dispatch = useDispatch();

  // useStatusPolling(60000);
  useStatusPolling();

  useEffect(() => {
    const handleStorageChange = (e) => {
      if ((e.key === "auth_token" || e.key === "user_role") && !e.newValue) {
        dispatch(clearRole());
        dispatch(logoutAction());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch]);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
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
