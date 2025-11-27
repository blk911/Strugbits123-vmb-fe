import { useSelector } from "react-redux";

export const useUser = () => {
  const user = useSelector((state) => state.user.data);
  const loading = useSelector((state) => state.user.loading);

  return { user, loading };
};
