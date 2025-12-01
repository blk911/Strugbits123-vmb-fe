import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const salonApi = createApi({
  reducerPath: "salonApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_BACKEND_URL + "salon" || "http://localhost:5000/",
    credentials: "include",
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
      query: () => "/get-services",
      providesTags: ["Service"],
    }),
    updateService: builder.mutation({
      query: ({ id, data }) => ({
        url: `/update-service/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Service"],
    }),
  }),
});

export const {
  useCreateServiceMutation,
  useGetServicesQuery,
  useUpdateServiceMutation,
} = salonApi;
