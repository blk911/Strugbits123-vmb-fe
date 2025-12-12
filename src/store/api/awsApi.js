import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const awsApi = createApi({
  reducerPath: "awsApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_BACKEND_URL + "aws" || "http://localhost:5000/",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getUploadUrl: builder.mutation({
      query: ({ fileName, fileType }) => ({
        url: "/generate-upload-url",
        method: "POST",
        body: { fileName, fileType },
      }),
    }),
    getDownloadUrl: builder.mutation({
      query: ({ fileName }) => ({
        url: "/generate-download-url",
        method: "POST",
        body: { fileName },
      }),
    }),
  }),
});

export const { useGetUploadUrlMutation, useGetDownloadUrlMutation } = awsApi;
