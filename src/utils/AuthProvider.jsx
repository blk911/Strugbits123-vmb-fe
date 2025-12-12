import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setRole } from "../store/features/roleSlice";
import { clearUser, setUser } from "../store/features/userSlice";
import { useGetMeQuery } from "../store/api";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingIndicator from "../components/common/LoadingIndicator/LoadingIndicator";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { data, isError, isLoading, isFetching } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data?.data?.role) {
      dispatch(setRole(data.data.role));
      dispatch(setUser(data.data));
    } else if (isError) {
      dispatch(setRole(null));
      dispatch(clearUser());

      const protectedClientPaths = [
        "/client",
        "/salons",
        "/gifts",
        "/appointments",
        "/saloninvites",
        "/salon/",
      ];

      const currentPath = location.pathname;

      const isTryingToAccessProtectedClientPath = protectedClientPaths.some(
        (path) =>
          currentPath.startsWith(path) ||
          (path.endsWith("/") && currentPath.startsWith(path.slice(0, -1)))
      );

      if (isTryingToAccessProtectedClientPath) {
        navigate("/register", {
          replace: true,
          state: { from: location.pathname },
        });
      }
    }
  }, [data, isError, dispatch, navigate, location]);

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  return <>{children}</>;
}
