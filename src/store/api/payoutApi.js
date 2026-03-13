import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const payoutApi = createApi({
  reducerPath: "payoutApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_BACKEND_URL + "payout" || "http://localhost:5000/",
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
  tagTypes: ["Payout"],
  endpoints: (builder) => ({
    getAllPayouts: builder.query({
      query: ({
        page = 1,
        limit = 10,
        sort = "newest",
        search = "",
        status = "",
      }) => ({
        url: "/get-all-payouts",
        params: { page, limit, sort, search, status: status || undefined },
      }),
      providesTags: ["Payout"],
    }),
    markAsPaid: builder.mutation({
      query: (salonId) => ({
        url: `/mark-as-paid/${salonId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Payout"],
    }),
  }),
});

export const { useGetAllPayoutsQuery, useMarkAsPaidMutation } = payoutApi;
