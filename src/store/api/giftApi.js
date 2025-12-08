import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const giftApi = createApi({
  reducerPath: "giftApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_BACKEND_URL + "gift" || "http://localhost:5000/",
    credentials: "include",
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
      query: ({ page = 1, limit = 10, sort = "newest", search = "" } = {}) => ({
        url: "/requested-gifts",
        params: { page, limit, sort, search },
      }),

      providesTags: ["Gift"],
    }),

    recievedGifts: builder.query({
      query: ({ page = 1, limit = 10, sort = "newest", search = "" } = {}) => ({
        url: "/recieved-gifts",
        params: { page, limit, sort, search },
      }),
      providesTags: ["Gift"],
    }),

    giftDetails: builder.query({
      query: (id) => `/gift-details/${id}`,
      providesTags: ["Gift"],
    }),
    getAllGiftsAdmin: builder.query({
      query: ({ page = 1, limit = 10, sort = "newest" } = {}) => ({
        url: "/get-all-gifts",
        params: { page, limit, sort },
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
