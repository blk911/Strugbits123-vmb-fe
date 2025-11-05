// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   role: "admin", // "admin" | "salonOwner" | "client"
// };

// const roleSlice = createSlice({
//   name: "role",
//   initialState,
//   reducers: {
//     setRole: (state, action) => {
//       state.role = action.payload;
//     },
//     clearRole: (state) => {
//       state.role = null;
//     },
//   },
// });

// export const { setRole, clearRole } = roleSlice.actions;
// export default roleSlice.reducer;
// store/slices/roleSlice.js
import { createSlice } from "@reduxjs/toolkit";

const roleMap = {
  customer: "client",
  saloon_owner: "salonOwner",
};

const initialState = {
  role: null, // null | "admin" | "salonOwner" | "client"
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole(state, { payload }) {
      // payload comes from the API (customer | saloon_owner)
      state.role = roleMap[payload] ?? null;
    },
    clearRole(state) {
      state.role = null;
    },
  },
});

export const { setRole, clearRole } = roleSlice.actions;
export default roleSlice.reducer;