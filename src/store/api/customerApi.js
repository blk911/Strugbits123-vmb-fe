import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_BACKEND_URL + "user" || "http://localhost:5000/",
    credentials: "include",
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
      query: (id) => ({
        url: `/get-salon-by-id/${id}`,
      }),
    }),
    getDailyStats: builder.query({
      query: () => ({
        url: `/get-daily-stats/`,
      }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useUpdateSalonProfileMutation,
  useGetAllSalonsQuery,
  useGetSalonByIdQuery,
  useGetDailyStatsQuery,
} = customerApi;
