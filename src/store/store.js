import { configureStore } from "@reduxjs/toolkit";
import adminSaloonsReducer from "./features/admin/listsSaloonSlice";
import roleReducer from "./features/roleSlice";
import { authApi } from "./api/authApi";
import { customerApi } from "./api/customerApi";
import { adminApi } from "./api/adminApi";
import { salonApi } from "./api/salonApi";
import { giftApi } from "./api/giftApi";
import { inviteApi } from "./api/inviteApi";
import { awsApi } from "./api/awsApi";
import { paymentApi } from "./api/paymentApi";
import { appointmentApi } from "./api/appointmentApi";
import { payoutApi } from "./api/payoutApi";
import { waitlistApi } from "./api/waitlistApi";
import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import { templateApi } from "./api/templateApi";
import selectedSalonReducer from "./features/selectedSalonSlice";
export const store = configureStore({
  reducer: {
    adminSaloons: adminSaloonsReducer,
    auth: authReducer,
    user: userReducer,
    selectedSalon: selectedSalonReducer,
    [authApi.reducerPath]: authApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [salonApi.reducerPath]: salonApi.reducer,
    [giftApi.reducerPath]: giftApi.reducer,
    [inviteApi.reducerPath]: inviteApi.reducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer,
    [awsApi.reducerPath]: awsApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [payoutApi.reducerPath]: payoutApi.reducer,
    [waitlistApi.reducerPath]: waitlistApi.reducer,
    [templateApi.reducerPath]: templateApi.reducer,
    role: roleReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(customerApi.middleware)
      .concat(adminApi.middleware)
      .concat(salonApi.middleware)
      .concat(giftApi.middleware)
      .concat(inviteApi.middleware)
      .concat(awsApi.middleware)
      .concat(appointmentApi.middleware)
      .concat(paymentApi.middleware)
      .concat(payoutApi.middleware)
      .concat(waitlistApi.middleware)
      .concat(templateApi.middleware),
});
