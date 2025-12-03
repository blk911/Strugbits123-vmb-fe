import { useSelector } from "react-redux";

export const useSelectedSalon = () => {
  const salon = useSelector((state) => state.selectedSalon.salon);
  const loading = useSelector((state) => state.selectedSalon.loading);

  return { salon, loading };
};
