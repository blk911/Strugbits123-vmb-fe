import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getMe: builder.query({ query: () => "/user/get-profile" }),
  }),
});

export const { useGetMeQuery } = customerApi;
