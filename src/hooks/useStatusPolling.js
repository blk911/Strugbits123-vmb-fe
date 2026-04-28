import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetMeQuery } from "../store/api/customerApi";
import { setUser, setLoading } from "../store/features/userSlice";
import { setRole } from "../store/features/roleSlice";
export const useStatusPolling = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const [trigger, { data, isError, isSuccess }] = useLazyGetMeQuery();

  useEffect(() => {
    if (!token) return;
    trigger();
  }, [token, trigger]);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data.data));
      if (data.data.role) {
        dispatch(setRole(data.data.role));
      }
    } else if (isError) {
      dispatch(setLoading(false));
    }
  }, [data, isError, isSuccess, dispatch]);

  return { data, isError };
};
