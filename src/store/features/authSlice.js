import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    mode: "login",
  },
  reducers: {
    setAuthMode(state, { payload }) {
      state.mode = payload;
    },
  },
});

export const { setAuthMode } = authSlice.actions;
export default authSlice.reducer;
