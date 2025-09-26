import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { role } = useSelector((state) => state.role)

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
