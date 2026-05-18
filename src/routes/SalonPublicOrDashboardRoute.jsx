import { Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardLayout from "../components/layout/dashboard/DashboardLayout";
import { SalonDetail } from "../pages/client";
import SalonClientLandingPage from "../pages/Site/SalonClientLanding/SalonClientLandingPage";

/** MongoDB ObjectId shape — same URL segment is used for dashboard salon vs public slug landing */
const MONGO_OBJECT_ID = /^[0-9a-f]{24}$/i;

/**
 * /salon/:id — dashboard (admin/customer) for DB ids; otherwise public client invite landing.
 * Guests with a DB id are sent to the marketing SiteLayout salon detail.
 */
export default function SalonPublicOrDashboardRoute() {
  const { id } = useParams();
  const role = useSelector((state) => state.user.data?.role);
  const isDbSalonId = MONGO_OBJECT_ID.test(id ?? "");

  if (isDbSalonId) {
    if (role === "admin" || role === "customer") {
      return (
        <DashboardLayout>
          <SalonDetail />
        </DashboardLayout>
      );
    }
    return <Navigate to={`/salon-detail/${id}`} replace />;
  }

  return <SalonClientLandingPage />;
}
