import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: "admin", // "admin" | "salonOwner" | "client"
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
    clearRole: (state) => {
      state.role = null;
    },
  },
});

export const { setRole, clearRole } = roleSlice.actions;
export default roleSlice.reducer;
