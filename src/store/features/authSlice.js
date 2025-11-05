// import { createSlice } from "@reduxjs/toolkit";

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     mode: "login", // login | signup
//     user: null,
//     loading: false,
//     error: null,
//     nextState: false,
//     formValues: {
//       role: "Customer",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       fullName: "",
//       saloonAddress: "",
//       phone: "",
//       startTime: "",
//       endTime: "",
//       workingDays: ""

//     }
//   },
//   reducers: {
//     setAuthMode: (state, action) => {
//       state.mode = action.payload;
//       state.formValues = {};
//     },
//     updateFormField: (state, action) => {
//       const { field, value } = action.payload;
//       state.formValues[field] = value;
//     },
//     resetForm: (state) => {
//       state.formValues = {};
//     },
//     loginStart: (state) => {
//       if (state.email && state.password && state.role) {
//         state.user = { email: state.email, password: state.password, role: state.role }
//         console.log("User submitted");
//       }
//       state.loading = true;
//     },

//     signupStart: (state) => {
//       const { fullName, email, password, confirmPassword, role } = state.formValues;
//       if (fullName && email && password && confirmPassword && role && role !== "Customer") {
//         console.log("Role is currently: ", role);
//         state.nextState = true
//       }
//       state.loading = true;
//     },
//     setNext: ((state) => {
//       state.nextState = false
//     }),
//     loginSuccess: (state, action) => {
//       state.user = action.payload;
//       state.loading = false;
//     },
//     signupSuccess: (state, action) => {
//       state.user = action.payload;
//       state.loading = false;
//     }
//   }
// });

// export const { setAuthMode, updateFormField, resetForm, loginStart, signupStart, loginSuccess, signupSuccess, setNext } =
//   authSlice.actions;

// export default authSlice.reducer;
// store/slices/authSlice.js
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