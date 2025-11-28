import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import SaloonRoutes from "./routes/SaloonRoutes";
import ClientRoutes from "./routes/ClientRoutes";

export default function App() {
  const role = useSelector((state) => state.role.role);
  return (
    <Router>
      <Routes>
        {PublicRoutes()}
        {role === "admin" && AdminRoutes()}
        {role === "salon-owner" && SaloonRoutes()}
        {role === "customer" && ClientRoutes()}
        <Route path="*" element={<h1>Unauthorized 🚫</h1>} />
      </Routes>
    </Router>
  );
}
