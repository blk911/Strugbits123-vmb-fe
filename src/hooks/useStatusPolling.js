import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetMeQuery } from "../store/api/customerApi";
import { setUser, setLoading } from "../store/features/userSlice";

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
    } else if (isError) {
      dispatch(setLoading(false));
    }
  }, [data, isError, isSuccess, dispatch]);

  return { data, isError };
};
