import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const waitlistApi = createApi({
  reducerPath: "waitlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_BACKEND_URL + "waitlist" ||
      "http://localhost:5000/",
  }),
  endpoints: (builder) => ({
    joinWaitlist: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useJoinWaitlistMutation } = waitlistApi;
