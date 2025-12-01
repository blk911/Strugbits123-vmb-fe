import { configureStore } from "@reduxjs/toolkit";
import adminSaloonsReducer from "./features/admin/listsSaloonSlice";
import roleReducer from "./features/roleSlice";
import { authApi } from "./api/authApi";
import { customerApi } from "./api/customerApi";
import { adminApi } from "./api/adminApi";
import { salonApi } from "./api/salonApi";
import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
export const store = configureStore({
  reducer: {
    adminSaloons: adminSaloonsReducer,
    auth: authReducer,
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [salonApi.reducerPath]: salonApi.reducer,
    role: roleReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(customerApi.middleware)
      .concat(adminApi.middleware)
      .concat(salonApi.middleware),
});
