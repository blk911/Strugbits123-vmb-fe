import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const inviteApi = createApi({
  reducerPath: "inviteApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_BACKEND_URL + "invite" || "http://localhost:5000/",
    credentials: "include",
  }),
  tagTypes: ["Invite"],
  endpoints: (builder) => ({
    createInvite: builder.mutation({
      query: (data) => {
        return {
          url: "/create-invite",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Invite"],
    }),
  }),
});

export const { useCreateInviteMutation } = inviteApi;
