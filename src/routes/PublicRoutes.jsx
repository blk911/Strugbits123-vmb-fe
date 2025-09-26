import { Route } from "react-router-dom";
import SiteLayout from "../components/layout/site/SiteLayout";
import Home from "../pages/site/Home/Home";
import About from "../pages/site/About/About";
import AuthForm from "../pages/site/Auth/AuthForm";

export default function PublicRoutes() {
  return (
    <>
    <Route element={<SiteLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Route>
    <Route>
      <Route path="/register" element={<AuthForm />} />
    </Route>
    </>
  );
}
