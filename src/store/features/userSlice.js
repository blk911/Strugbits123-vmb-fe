import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: true,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.data = action.payload;
      state.loading = false;
    },
    clearUser(state) {
      state.data = null;
      state.loading = false;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    clearToken(state) {
      state.token = null;
    },
  },
});

export const { setUser, clearUser, setToken, clearToken } = userSlice.actions;
export default userSlice.reducer;
