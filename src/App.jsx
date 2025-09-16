import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SiteLayout from "./components/layout/site/SiteLayout";
import DashboardLayout from "./components/layout/dashboard/DashboardLayout";

// Site pages
import Home from "./pages/Site/Home/Home";
import About from "./pages/Site/About/About";

// Dashboard pages
import { DashboardHome } from "./pages/Dashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Site */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* Dashboard */}
        <Route element={<DashboardLayout />}>
          <Route path="/saloon" element={<DashboardHome />} />
        </Route>
      </Routes>
    </Router>
  );
}
