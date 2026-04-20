import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { buildApiBaseUrl } from "./baseUrl";

export const salonApi = createApi({
  reducerPath: "salonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: buildApiBaseUrl("salon"),
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
  tagTypes: ["Service"],
  endpoints: (builder) => ({
    createService: builder.mutation({
      query: (data) => {
        return {
          url: "/create-service",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Service"],
    }),
    getServices: builder.query({
      query: ({ page = 1, limit = 9 } = {}) => ({
        url: "/get-services",
        params: { page, limit },
      }),
      providesTags: ["Service"],
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems) => {
        return newItems;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    updateService: builder.mutation({
      query: ({ id, data }) => ({
        url: `/update-service/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Service"],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/delete-service/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),
  }),
});

export const {
  useCreateServiceMutation,
  useGetServicesQuery,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = salonApi;
