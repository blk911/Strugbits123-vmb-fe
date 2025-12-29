import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";

import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import SaloonRoutes from "./routes/SaloonRoutes";
import ClientRoutes from "./routes/ClientRoutes";
import ScrollToTop from "./components/common/site/ScrollToTop";
import { BookingCancel, BookingSuccess } from "./pages/client";

export default function App() {
  const role = useSelector((state) => state.role.role);

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


        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </Router>
  );
}
