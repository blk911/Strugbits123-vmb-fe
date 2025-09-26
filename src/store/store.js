import { configureStore } from "@reduxjs/toolkit";
import adminSaloonsReducer from "./features/admin/listsSaloonSlice";
import authReducer from './features/authSlice';
import roleReducer from './features/roleSlice'

export const store = configureStore({
    reducer: {
        adminSaloons: adminSaloonsReducer,
        auth: authReducer,
        role: roleReducer
    },
});
