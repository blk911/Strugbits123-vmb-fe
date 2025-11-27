import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setRole } from "../store/features/roleSlice";
import LoadingIndicator from "../components/common/LoadingIndicator/LoadingIndicator";
import { setUser } from "../store/features/userSlice";
import { useGetMeQuery } from "../store/api";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { data, isError, isLoading } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  useEffect(() => {
    if (data?.data?.role) {
      const mappedRole = data?.data?.role;
      if (mappedRole) {
        dispatch(setRole(data?.data?.role));
        dispatch(setUser(data?.data));
      } else {
        dispatch(setRole(null));
      }
    } else if (isError) {
      dispatch(setRole(null));
    }
  }, [data, isError, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  return <>{children}</>;
}
