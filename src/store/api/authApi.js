import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/common",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (c) => ({ url: "/signin", method: "POST", body: c }),
    }),
    signUpCustomer: builder.mutation({
      query: (d) => ({ url: "/signup/customer", method: "POST", body: d }),
    }),
    signUpSaloonOwner: builder.mutation({
      query: ({ formData, files }) => {
        const body = new FormData();
        Object.entries(formData).forEach(([k, v]) => {
          if (k === "workingDays") body.append(k, JSON.stringify(v));
          else body.append(k, v);
        });
        files.licenseDocument?.[0] &&
          body.append("licenseDocument", files.licenseDocument[0]);
        files.profilePic?.[0] && body.append("profilePic", files.profilePic[0]);
        files.saloonPhotos?.forEach((f) => body.append("saloonPhotos", f));
        return { url: "/signup/saloonowner", method: "POST", body };
      },
    }),
    getPresignedUrls: builder.mutation({
      query: (files) => ({
        url: "/presigned-urls",
        method: "POST",
        body: { files },
      }),
    }),

    // signUpSaloonOwner: builder.mutation({
    //   query: (formData) => ({
    //     url: "/signup/saloonowner",
    //     method: "POST",
    //     body: formData,
    //   }),
    // }),
    getMe: builder.query({ query: () => "/me" }),
    logout: builder.mutation({
      query: () => ({ url: "/logout", method: "POST" }),
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpCustomerMutation,
  useSignUpSaloonOwnerMutation,
  useGetMeQuery,
  useLogoutMutation,
  useGetPresignedUrlsMutation,
} = authApi;
