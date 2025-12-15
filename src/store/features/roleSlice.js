import { createSlice } from "@reduxjs/toolkit";

const ROLE_STORAGE_KEY = "user_role";

const initialState = {
  role:
    typeof window !== "undefined"
      ? localStorage.getItem(ROLE_STORAGE_KEY) || null
      : null,
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole(state, { payload }) {
      state.role = payload ?? null;
      if (payload) {
        localStorage.setItem(ROLE_STORAGE_KEY, payload);
      } else {
        localStorage.removeItem(ROLE_STORAGE_KEY);
      }
    },

    clearRole(state) {
      state.role = null;
      localStorage.removeItem(ROLE_STORAGE_KEY);
    },
  },
});

export const { setRole, clearRole } = roleSlice.actions;
export default roleSlice.reducer;
