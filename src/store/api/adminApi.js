import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_BACKEND_URL + "admin" || "http://localhost:5000/",
    credentials: "include",
    // prepareHeaders: (headers, { getState }) => {
    //   const token = getState().auth.token;
    //   if (token) {
    //     headers.set("authorization", `Bearer ${token}`);
    //   }
    //   return headers;
    // },
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

    getWeeklyStats: builder.query({
      query: () => ({
        url: "/get-weekly-stats",
      }),
    }),
    getAllAdminSalons: builder.query({
      query: ({
        page = 1,
        limit = 10,
        sort = "newest",
        search = "",
        status,
      } = {}) => ({
        url: "/get-all-salons",
        params: { page, limit, sort, search, status },
      }),
      providesTags: ["Salon"],
    }),
  }),
});

export const {
  useGetPendingSalonsQuery,
  useApproveSalonMutation,
  useRejectSalonMutation,
  useHoldSalonMutation,
  useGetWeeklyStatsQuery,
  useGetAllAdminSalonsQuery,
} = adminApi;
