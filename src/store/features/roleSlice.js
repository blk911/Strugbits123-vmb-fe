import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: null,
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole(state, { payload }) {
      state.role = payload ?? null;
    },

    clearRole(state) {
      state.role = null;
    },
  },
});

export const { setRole, clearRole } = roleSlice.actions;
export default roleSlice.reducer;
