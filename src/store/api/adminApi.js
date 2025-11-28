import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_BACKEND_URL + "admin" || "http://localhost:5000/",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getPendingSalons: builder.query({
      query: ({ page = 1, limit = 10, sort = "newest" } = {}) => ({
        url: "/get-pending-salons",
        params: { page, limit, sort },
      }),
    }),
  }),
});

export const { useGetPendingSalonsQuery } = adminApi;
