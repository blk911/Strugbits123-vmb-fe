import { Route } from "react-router-dom";
import SiteLayout from "../components/layout/site/SiteLayout";
import Home from "../pages/Site/Home/Home";
import HomeSalon from "../pages/Site/HomeSalon/Home";
// import HomeClient from "../pages/Site/HomeClient/Home";
import About from "../pages/Site/About/About";
import AuthForm from "../pages/Site/Auth/AuthForm";
import ForgetPassword from "../pages/Site/Auth/ForgetPassword";
import ResetPassword from "../pages/Site/Auth/ResetPassword";
import { SalonDetail } from "../pages/client";

export default function PublicRoutes() {
  return (
    <>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        {/* <Route path="/client" element={<HomeClient />} /> */}
        <Route path="/salon" element={<HomeSalon />} />
        <Route path="/about" element={<About />} />
        <Route path="/salon-detail/:id" element={<SalonDetail />} />
      </Route>
      <Route>
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/register" element={<AuthForm />} />
      </Route>
    </>
  );
}
