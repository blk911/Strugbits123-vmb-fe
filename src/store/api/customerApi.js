import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { buildApiBaseUrl } from "./baseUrl";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: buildApiBaseUrl("user"),
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
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/get-profile",
      providesTags: ["User"],
    }),
    updateMe: builder.mutation({
      query: (data) => ({
        url: "/update-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateSalonProfile: builder.mutation({
      query: (data) => ({
        url: "/update-salon-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getAllSalons: builder.query({
      query: ({
        page = 1,
        limit = 10,
        sort = "nearest",
        search = "",
        distance,
        userLng,
        userLat,
      } = {}) => ({
        url: "/get-all-salons",
        params: { page, limit, sort, search, distance, userLng, userLat },
      }),
    }),
    getSalonById: builder.query({
      query: (params) => {
        const { id, userLat, userLng } = params;
        const queryParams = new URLSearchParams();
        if (userLat !== undefined) queryParams.append("userLat", userLat);
        if (userLng !== undefined) queryParams.append("userLng", userLng);
        const queryString = queryParams.toString();
        return {
          url: `/get-salon-by-id/${id}${queryString ? `?${queryString}` : ""}`,
        };
      },
    }),
    getDailyStats: builder.query({
      query: () => ({
        url: `/get-daily-stats/`,
      }),
    }),

    subscribeNewsletter: builder.mutation({
      query: (email) => ({
        url: "/subscribe-newletter",
        method: "POST",
        body: { email },
      }),
    }),

    updateSalonApplicationStatus: builder.mutation({
      query: (id) => ({
        url: `/update-salon-application-status/${id}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useLazyGetMeQuery,
  useUpdateMeMutation,
  useUpdateSalonProfileMutation,
  useGetAllSalonsQuery,
  useGetSalonByIdQuery,
  useGetDailyStatsQuery,
  useSubscribeNewsletterMutation,
  useUpdateSalonApplicationStatusMutation,
} = customerApi;
