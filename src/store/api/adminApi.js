import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { buildApiBaseUrl } from "./baseUrl";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: buildApiBaseUrl("admin"),
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
  tagTypes: ["Salon", "Customer"],
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
        sortBy = "createdAt",
        sortOrder = -1,
      } = {}) => ({
        url: "/get-all-salons",
        params: { page, limit, sort, search, status, sortBy, sortOrder },
      }),
      providesTags: ["Salon"],
    }),
    getAllCustomers: builder.query({
      query: ({
        page = 1,
        limit = 10,
        sort = "newest",
        search = "",
        sortBy = "createdAt",
        sortOrder = -1,
      } = {}) => ({
        url: "/get-all-customers",
        params: { page, limit, sort, search, sortBy, sortOrder },
      }),
      providesTags: ["Customer"],
    }),
    suspendUser: builder.mutation({
      query: ({ userId, reason }) => ({
        url: `/suspend-user/${userId}`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Customer"],
    }),
    unsuspendUser: builder.mutation({
      query: (userId) => ({
        url: `/unsuspend-user/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Customer"],
    }),
    contactUser: builder.mutation({
      query: ({ userId, message }) => ({
        url: `/contact-user/${userId}`,
        method: "POST",
        body: { message },
      }),
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
  useGetAllCustomersQuery,
  useSuspendUserMutation,
  useUnsuspendUserMutation,
  useContactUserMutation,
} = adminApi;
