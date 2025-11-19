import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetMeQuery } from "../store/api/authApi";
import { setRole } from "../store/features/roleSlice";
import LoadingIndicator from "../components/common/LoadingIndicator/LoadingIndicator";
import { setUser } from "../store/features/userSlice";

const roleMap = {
  customer: "client",
  saloon_owner: "salonOwner",
};

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { data, isError, isLoading } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  useEffect(() => {
    if (data?.role) {
      const mappedRole = roleMap[data.role];
      if (mappedRole) {
        dispatch(setRole(data.role));
        dispatch(setUser(data));
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
