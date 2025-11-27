import { configureStore } from "@reduxjs/toolkit";
import adminSaloonsReducer from "./features/admin/listsSaloonSlice";
import roleReducer from "./features/roleSlice";
import { authApi } from "./api/authApi";
import { customerApi } from "./api/customerApi";
import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
export const store = configureStore({
  reducer: {
    adminSaloons: adminSaloonsReducer,
    auth: authReducer,
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    role: roleReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(customerApi.middleware),
});
