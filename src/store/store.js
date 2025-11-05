import { configureStore } from "@reduxjs/toolkit";
import adminSaloonsReducer from "./features/admin/listsSaloonSlice";
import roleReducer from './features/roleSlice'
import { authApi } from './api/authApi';
import authReducer from './features/authSlice';
export const store = configureStore({
    reducer: {
        adminSaloons: adminSaloonsReducer,
        auth: authReducer,
    [authApi.reducerPath]: authApi.reducer, 
        role: roleReducer
    },
    
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});
    