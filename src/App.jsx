import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RoleProvider } from "./context/RoleContext";

// Routes
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import SaloonRoutes from "./routes/SaloonRoutes";

export default function App() {
  return (
    <Router>
      <RoleProvider>
        <Routes>
          {PublicRoutes()}
          {AdminRoutes()}
          {SaloonRoutes()}
          <Route path="/unauthorized" element={<h1>Unauthorized 🚫</h1>} />
        </Routes>
      </RoleProvider>
    </Router>
  );
}
