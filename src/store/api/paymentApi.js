import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token =
        getState().user?.token || localStorage.getItem("auth_token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (payload) => ({
        url: "payment/create-checkout-session",
        method: "POST",
        body: payload,
      }),
    }),

    createAppointmentAfterPayment: builder.mutation({
      query: (body) => ({
        url: "payment/create-appointment-after-payment",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useCreateAppointmentAfterPaymentMutation,
} = paymentApi;
