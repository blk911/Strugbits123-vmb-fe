import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (c) => ({ url: "/auth/signin", method: "POST", body: c }),
    }),

    signUpCustomer: builder.mutation({
      query: (formData) => {
        const customerData = {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          address: formData.address,
          zipcode: formData.zipcode,
        };

        return {
          url: "/auth/signup-customer",
          method: "POST",
          body: customerData,
        };
      },
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
    logout: builder.mutation({
      query: () => ({ url: "/logout", method: "POST" }),
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpCustomerMutation,
  useSignUpSaloonOwnerMutation,
  useLogoutMutation,
  useGetPresignedUrlsMutation,
} = authApi;
