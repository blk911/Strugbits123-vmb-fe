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
    acceptInvite: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/accept-invite/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Invite"],
    }),
    getUserInvites: builder.query({
      query: ({
        page = 1,
        limit = 10,
        sort = "newest",
        status = "",
        search = "",
      } = {}) => ({
        url: "/get-user-invites",
        params: { page, limit, sort, status, search },
      }),
      providesTags: ["Invite"],
    }),
    getSalonInvites: builder.query({
      query: ({ page = 1, limit = 10, sort = "newest" } = {}) => ({
        url: "/get-salon-invites",
        params: { page, limit, sort },
      }),
      providesTags: ["Invite"],
    }),
    getAdminInvites: builder.query({
      query: ({ page = 1, limit = 10, sort = "newest" } = {}) => ({
        url: "/get-admin-invites",
        params: { page, limit, sort },
      }),
      providesTags: ["Invite"],
    }),
    getInviteDetails: builder.query({
      query: (id) => ({
        url: `/get-invite-details/${id}`,
      }),
    }),
  }),
});

export const {
  useCreateInviteMutation,
  useGetInviteDetailsQuery,
  useGetUserInvitesQuery,
  useGetSalonInvitesQuery,
  useGetAdminInvitesQuery,
  useAcceptInviteMutation,
} = inviteApi;
