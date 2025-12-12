import { createSlice } from "@reduxjs/toolkit";

const loadFromStorage = () => {
  try {
    const serialized = localStorage.getItem("selectedSalon");
    return serialized ? JSON.parse(serialized) : null;
  } catch {
    return null;
  }
};

const saveToStorage = (salon) => {
  try {
    localStorage.setItem("selectedSalon", JSON.stringify(salon));
  } catch (err) {
    console.error("Could not save to localStorage", err);
  }
};

const initialState = {
  salon: loadFromStorage(),
  loading: false,
};

const selectedSalonSlice = createSlice({
  name: "selectedSalon",
  initialState,
  reducers: {
    setSelectedSalon(state, action) {
      state.salon = action.payload;
      saveToStorage(action.payload);
    },
    clearSelectedSalon(state) {
      state.salon = null;
      localStorage.removeItem("selectedSalon");
    },
  },
});

export const { setSelectedSalon, clearSelectedSalon } =
  selectedSalonSlice.actions;
export default selectedSalonSlice.reducer;
