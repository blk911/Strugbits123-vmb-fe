
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    mode: "login", // "login" | "signup"
  },
  reducers: {
    setAuthMode(state, { payload }) {
      state.mode = payload;
    },
  },
});

export const { setAuthMode } = authSlice.actions;
export default authSlice.reducer;