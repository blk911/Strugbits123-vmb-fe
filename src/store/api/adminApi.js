import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_BACKEND_URL + "admin" || "http://localhost:5000/",
    credentials: "include",
  }),
  tagTypes: ["Salon"],
  endpoints: (builder) => ({
    getPendingSalons: builder.query({
      query: ({ page = 1, limit = 10, sort = "newest" } = {}) => ({
        url: "/get-pending-salons",
        params: { page, limit, sort },
      }),
      providesTags: ["Salon"],
    }),
    approveSalon: builder.mutation({
      query: (id) => ({
        url: `/approve-salon/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Salon"],
    }),
    rejectSalon: builder.mutation({
      query: (id) => ({
        url: `/reject-salon/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Salon"],
    }),
    holdSalon: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/hold-salon/${id}`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Salon"],
    }),
  }),
});

export const {
  useGetPendingSalonsQuery,
  useApproveSalonMutation,
  useRejectSalonMutation,
  useHoldSalonMutation,
} = adminApi;
