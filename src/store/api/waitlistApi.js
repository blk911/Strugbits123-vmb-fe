import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { buildApiBaseUrl } from "./baseUrl";

export const waitlistApi = createApi({
  reducerPath: "waitlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: buildApiBaseUrl("waitlist"),
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
