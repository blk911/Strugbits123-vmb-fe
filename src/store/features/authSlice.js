import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    mode: "login",
    type: "customer",
  },
  reducers: {
    setAuthMode(state, { payload }) {
      state.mode = payload;
    },
    setAuthType(state, { payload }) {
      state.type = payload;
    },
  },
});

export const { setAuthMode, setAuthType } = authSlice.actions;
export default authSlice.reducer;
