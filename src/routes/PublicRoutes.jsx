import { Route } from "react-router-dom";
import SiteLayout from "../components/layout/site/SiteLayout";
import Home from "../pages/Site/Home/Home";
import About from "../pages/Site/About/About";

export default function PublicRoutes() {
  return (
    <Route element={<SiteLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Route>
  );
}
