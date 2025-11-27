import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: true,
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
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
