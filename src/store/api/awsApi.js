import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { buildApiBaseUrl } from "./baseUrl";

export const awsApi = createApi({
  reducerPath: "awsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: buildApiBaseUrl("aws"),
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
