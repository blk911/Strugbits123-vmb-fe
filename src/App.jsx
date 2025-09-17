import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SiteLayout from "./components/layout/site/SiteLayout";
import DashboardLayout from "./components/layout/dashboard/DashboardLayout";

// Site pages
import Home from "./pages/Site/Home/Home";
import About from "./pages/Site/About/About";

// Saloon pages
import { DashboardHome } from "./pages/saloon";
// admin
import { Home as AdminHome } from "./pages/admin";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Site */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* saloon */}
        <Route element={<DashboardLayout />}>
          <Route path="/saloon" element={<DashboardHome />} />
        </Route>

          {/* admin */}
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminHome />} />
        </Route>

      </Routes>
    </Router>
  );
}
