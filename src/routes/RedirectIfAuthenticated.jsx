import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RedirectIfAuthenticated({ children }) {
  const role = useSelector((state) => state.user.data?.role);

  if (role) {
    const target =
      role === "customer" ? "/client"
      : role === "salon-owner" ? "/salon-owner/dashboard"
      : role === "admin" ? "/admin"
      : null;

    if (target) {
      return <Navigate to={target} replace />;
    }
  }

  return children;
}
