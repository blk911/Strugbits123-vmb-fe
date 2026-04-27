import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { buildApiBaseUrl } from "./baseUrl";

export const giftApi = createApi({
  reducerPath: "giftApi",
  baseQuery: fetchBaseQuery({
    baseUrl: buildApiBaseUrl("gift"),
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
  tagTypes: ["Gift"],
  endpoints: (builder) => ({
    createGift: builder.mutation({
      query: (data) => {
        return {
          url: "/create-gift",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Gift"],
    }),
    acceptGift: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/accept-gift/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Gift"],
    }),
    rejectGift: builder.mutation({
      query: (id) => {
        return {
          url: `/reject-gift/${id}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["Gift"],
    }),

    requestedGifts: builder.query({
      query: ({
        page = 1,
        limit = 10,
        sort = "newest",
        search = "",
        sortBy = "createdAt",
        sortOrder = -1,
      } = {}) => ({
        url: "/requested-gifts",
        params: { page, limit, sort, search, sortBy, sortOrder },
      }),

      providesTags: ["Gift"],
    }),

    recievedGifts: builder.query({
      query: ({
        page = 1,
        limit = 10,
        sort = "newest",
        search = "",
        sortBy = "createdAt",
        sortOrder = -1,
      } = {}) => ({
        url: "/recieved-gifts",
        params: { page, limit, sort, search, sortBy, sortOrder },
      }),
      providesTags: ["Gift"],
    }),

    giftDetails: builder.query({
      query: (id) => `/gift-details/${id}`,
      providesTags: ["Gift"],
    }),
    getAllGiftsAdmin: builder.query({
      query: ({
        page = 1,
        limit = 10,
        sort = "newest",
        search = "",
        status,
        sortBy = "createdAt",
        sortOrder = -1,
      } = {}) => ({
        url: "/get-all-gifts",
        params: { page, limit, sort, search, status, sortBy, sortOrder },
      }),
    }),
  }),
});

export const {
  useCreateGiftMutation,
  useAcceptGiftMutation,
  useRejectGiftMutation,
  useRequestedGiftsQuery,
  useRecievedGiftsQuery,
  useGiftDetailsQuery,
  useGetAllGiftsAdminQuery,
} = giftApi;
